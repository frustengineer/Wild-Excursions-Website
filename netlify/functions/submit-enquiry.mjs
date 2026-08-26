const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const DEFAULT_CRM_WEBHOOK = 'https://crm.wildexcursions.in/landingpageenquiry.mytrav';
const MAX_BODY_BYTES = 64 * 1024;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(status, body) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

function clean(value, maxLength = 300) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);
}

function cleanHeader(value, maxLength = 160) {
  return clean(value, maxLength).replace(/[\r\n]+/g, ' ');
}

function escapeHtml(value) {
  return clean(value, 5000)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function sanitizeCrmRemarks(value) {
  return escapeHtml(value)
    .replaceAll('&lt;br&gt;', '<br>')
    .replaceAll('&lt;br/&gt;', '<br>')
    .replaceAll('&lt;br /&gt;', '<br>')
    .replaceAll('&lt;b&gt;', '<b>')
    .replaceAll('&lt;/b&gt;', '</b>');
}

function isValidEmail(value) {
  return EMAIL_PATTERN.test(clean(value, 254));
}

function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(clean(value, 10));
}

function formatDate(value) {
  if (!validDate(value)) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

function allowedOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  try {
    const hostname = new URL(origin).hostname;
    const configuredSite = process.env.URL ? new URL(process.env.URL).origin : '';
    return (
      origin === configuredSite ||
      hostname === 'wildexcursions.in' ||
      hostname === 'www.wildexcursions.in' ||
      hostname === 'localhost' ||
      hostname === '127.0.0.1'
    );
  } catch {
    return false;
  }
}

function normalizeSubmission(input) {
  const incomingCrm = input?.crm && typeof input.crm === 'object' ? input.crm : {};
  const incomingCustomer = input?.customer && typeof input.customer === 'object' ? input.customer : {};
  const today = new Date().toISOString().slice(0, 10);
  const email = clean(incomingCustomer.email || incomingCrm.email, 254);
  const name = clean(incomingCustomer.name || incomingCrm.name, 120) || 'Website visitor';
  const destination = clean(incomingCustomer.destination || incomingCrm.destination, 180) || 'General enquiry';
  const checkin = validDate(incomingCrm.checkin) ? clean(incomingCrm.checkin, 10) : today;
  const checkout = validDate(incomingCrm.checkout) ? clean(incomingCrm.checkout, 10) : checkin;
  const totalpax = String(Math.min(99, Math.max(1, Number.parseInt(incomingCrm.totalpax, 10) || 1)));
  const details = Array.isArray(incomingCustomer.details)
    ? incomingCustomer.details
      .slice(0, 40)
      .map((item) => ({
        label: clean(item?.label, 80),
        value: clean(item?.value, 500),
      }))
      .filter((item) => item.label && item.value)
    : [];
  const incomingCampaign = incomingCustomer.campaign && typeof incomingCustomer.campaign === 'object'
    ? incomingCustomer.campaign
    : {};
  const campaign = Object.fromEntries(
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
      .map((key) => [key, clean(incomingCampaign[key], 200)])
      .filter(([, value]) => value)
  );

  const crm = {
    name,
    email: isValidEmail(email) ? email : 'not-provided@wildexcursions.in',
    phone: clean(incomingCrm.phone, 50) || 'Not provided',
    destination,
    checkin,
    checkout,
    totalpax,
    formName: clean(incomingCrm.formName, 160) || 'Website Enquiry',
    remarks: sanitizeCrmRemarks(incomingCrm.remarks),
  };

  const customer = {
    name,
    email: isValidEmail(email) ? email : '',
    phone: clean(incomingCustomer.phone || crm.phone, 50),
    destination,
    travelStart: validDate(incomingCustomer.travelStart) ? clean(incomingCustomer.travelStart, 10) : '',
    travelEnd: validDate(incomingCustomer.travelEnd) ? clean(incomingCustomer.travelEnd, 10) : '',
    travellers: clean(incomingCustomer.travellers || totalpax, 20),
    tour: clean(incomingCustomer.tour, 180),
    formName: crm.formName,
    pageUrl: clean(incomingCustomer.pageUrl, 500),
    message: clean(incomingCustomer.message, 1200),
    details,
    campaign,
  };

  return { crm, customer };
}

function detailRows(customer, includeContact = false) {
  const rows = [
    ['Tour / package', customer.tour],
    ['Destination', customer.destination],
    ['Travel date', formatDate(customer.travelStart)],
    ['Return date', formatDate(customer.travelEnd)],
    ['Travellers', customer.travellers],
    ...customer.details.map((item) => [item.label, item.value]),
  ];

  if (includeContact) {
    rows.unshift(
      ['Name', customer.name],
      ['Email', customer.email || 'Not provided'],
      ['Phone', customer.phone || 'Not provided'],
    );
    rows.push(
      ['Form', customer.formName],
      ['Page', customer.pageUrl],
      ['Message', customer.message],
      ...Object.entries(customer.campaign).map(([key, value]) => [
        key.replace('utm_', 'UTM ').replaceAll('_', ' ').toUpperCase(),
        value,
      ]),
    );
  }

  return rows.filter(([, value]) => clean(value, 500));
}

function renderRows(rows) {
  return rows.map(([label, value]) => `
    <tr>
      <td style="padding:9px 12px;color:#777;font-size:14px;border-bottom:1px solid #eee;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:9px 12px;color:#111;font-size:14px;font-weight:700;border-bottom:1px solid #eee;vertical-align:top;overflow-wrap:anywhere;">${escapeHtml(value)}</td>
    </tr>`).join('');
}

const EMAIL_LOGO_URL = 'https://drive.google.com/thumbnail?id=1jPnl3yjGiqak2LclypgxDZkyiWnGWlqu&sz=w240';
const WHATSAPP_ICON_URL = 'https://drive.google.com/thumbnail?id=14iNfLj45OQeCL40UtBOHCeAphMAwNDLP&sz=w64';

function renderDarkRows(rows, linkLabels = new Set()) {
  return rows.map(([label, value]) => {
    const safeLabel = escapeHtml(label);
    const safeValue = escapeHtml(value);
    let renderedValue = `<b>${safeValue}</b>`;
    if (linkLabels.has(label) && value) {
      const href = label === 'Email'
        ? `mailto:${encodeURIComponent(value)}`
        : `tel:${clean(value, 50).replace(/[^+\d]/g, '')}`;
      renderedValue = `<b><a href='${escapeHtml(href)}' style='color:#FDCB08;text-decoration:none;font-weight:bold;'>${safeValue}</a></b>`;
    }
    return `<tr>
      <td width='38%' style='padding:12px 14px;background-color:#24231C;border-bottom:1px solid #33302A;border-right:1px solid #33302A;font-size:13px;color:#A8A290;font-family:Arial,Helvetica,sans-serif;vertical-align:top;'>${safeLabel}</td>
      <td style='padding:12px 14px;background-color:#141310;border-bottom:1px solid #33302A;font-size:14px;color:#F4EFE1;font-family:Arial,Helvetica,sans-serif;vertical-align:top;overflow-wrap:anywhere;'>${renderedValue}</td>
    </tr>`;
  }).join('');
}

function customerEmail(customer) {
  const firstName = clean(customer.name, 120).split(/\s+/)[0] || 'there';
  const rows = detailRows(customer);
  const details = rows.length ? `
    <p style="margin:24px 0 10px;color:#111;font-size:16px;font-weight:700;">Your enquiry details</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #eee;border-radius:10px;border-collapse:separate;overflow:hidden;">${renderRows(rows)}</table>` : '';

  const html = `<!doctype html>
  <html><body style="margin:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;color:#222;">
    <div style="display:none;max-height:0;overflow:hidden;">Your Wild Excursions enquiry has been received.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f4;padding:24px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,.08);">
          <tr><td style="background:#111;padding:24px 28px;border-bottom:5px solid #ffca05;">
            <p style="margin:0;color:#ffca05;font-size:13px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;">Wild Excursions</p>
            <h1 style="margin:8px 0 0;color:#fff;font-size:26px;line-height:1.25;">We’ve received your enquiry 🐯</h1>
          </td></tr>
          <tr><td style="padding:28px;">
            <p style="margin:0 0 14px;font-size:16px;line-height:1.6;">Hi ${escapeHtml(firstName)},</p>
            <p style="margin:0 0 14px;font-size:16px;line-height:1.6;">Thank you for contacting Wild Excursions. We’ve received your enquiry, and one of our safari experts will connect with you shortly.</p>
            ${details}
            <p style="margin:24px 0 0;font-size:15px;line-height:1.6;color:#555;">If you need immediate assistance, simply reply to this email.</p>
            <p style="margin:22px 0 0;font-size:15px;line-height:1.6;"><strong>Wild Excursions</strong><br><a href="https://wildexcursions.in" style="color:#a77900;">wildexcursions.in</a></p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;

  const textRows = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
  const text = `Hi ${firstName},\n\nThank you for contacting Wild Excursions. We’ve received your enquiry, and one of our safari experts will connect with you shortly.${textRows ? `\n\nYour enquiry details:\n${textRows}` : ''}\n\nIf you need immediate assistance, simply reply to this email.\n\nWild Excursions\nhttps://wildexcursions.in`;

  return { html, text };
}

function notificationEmail(customer) {
  const rows = detailRows(customer, true);
  const html = `<!doctype html>
  <html><body style="margin:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;color:#222;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f4;padding:20px 10px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#fff;border-radius:14px;overflow:hidden;">
          <tr><td style="background:#111;padding:22px 26px;border-bottom:5px solid #ffca05;">
            <p style="margin:0;color:#ffca05;font-size:13px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;">New website enquiry</p>
            <h1 style="margin:7px 0 0;color:#fff;font-size:24px;line-height:1.25;">${escapeHtml(customer.destination)}</h1>
          </td></tr>
          <tr><td style="padding:24px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #eee;border-radius:10px;border-collapse:separate;overflow:hidden;">${renderRows(rows)}</table>
            ${customer.email ? '<p style="margin:20px 0 0;color:#555;font-size:14px;">Click Reply to respond directly to this customer.</p>' : '<p style="margin:20px 0 0;color:#a04b00;font-size:14px;font-weight:700;">This visitor did not provide a valid email address. Contact them by phone.</p>'}
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;

  const text = `New Wild Excursions website enquiry\n\n${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}`;
  return { html, text };
}

function customerEmailV2(customer) {
  const firstName = clean(customer.name, 120).split(/\s+/)[0] || 'there';
  const rows = detailRows(customer);
  const destination = clean(customer.destination, 180) || 'Wildlife';
  const changeMessage = encodeURIComponent(`Hi Wild Excursions, this is ${customer.name}. I'd like to update a few details in my ${destination} safari enquiry.`);
  const details = rows.length ? `
    <tr><td style='padding:0 24px;'>
      <table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0' style='border:1px solid #33302A;border-collapse:collapse;'>${renderDarkRows(rows)}</table>
    </td></tr>` : '';

  const html = `<!doctype html>
  <html><head><meta name='color-scheme' content='dark light'><meta name='supported-color-schemes' content='dark light'></head>
  <body style='margin:0;background-color:#0B0B0B;'>
    <div style='display:none;max-height:0;overflow:hidden;'>Your Wild Excursions enquiry has been received.</div>
    <div style='background-color:#0B0B0B;padding:18px 12px;'>
      <table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0' style='max-width:600px;margin:0 auto;background-color:#151513;border-collapse:collapse;'>
        <tr><td align='center' style='background-color:#000000;padding:26px 20px 18px;'>
          <a href='https://wildexcursions.in' style='text-decoration:none;'><img src='${EMAIL_LOGO_URL}' width='120' alt='Wild Excursions' style='display:block;width:120px;max-width:120px;height:auto;border:0;margin:0 auto;'></a>
          <div style='color:#E7E2D4;font-size:11px;letter-spacing:2px;padding-top:12px;font-family:Arial,Helvetica,sans-serif;'>${escapeHtml(destination.toUpperCase())} SAFARI ENQUIRY</div>
        </td></tr>
        <tr><td style='background-color:#FDCB08;height:4px;line-height:4px;font-size:0;'>&nbsp;</td></tr>
        <tr><td style='padding:26px 24px 4px;color:#E7E2D4;font-size:15px;line-height:1.65;font-family:Arial,Helvetica,sans-serif;'>
          <p style='margin:0 0 14px;'>Dear <b style='color:#FFFFFF;'>${escapeHtml(firstName)}</b>,</p>
          <p style='margin:0 0 22px;'>Thank you for your enquiry. We&rsquo;ve received your details and our Safari Expert will connect with you shortly with availability, pricing and a personalized ${escapeHtml(destination)} itinerary.</p>
          <p style='margin:0 0 12px;font-size:15px;color:#FFFFFF;'><b>Here&rsquo;s a summary of what you shared:</b></p>
        </td></tr>
        ${details}
        <tr><td align='center' style='padding:26px 24px 4px;'>
          <table role='presentation' cellpadding='0' cellspacing='0' border='0' style='margin:0 auto;'><tr><td align='center' style='background-color:#FDCB08;padding:14px 28px;'>
            <a href='https://wa.me/917755958493?text=${changeMessage}' style='color:#202020;font-size:14px;text-decoration:none;font-family:Arial,Helvetica,sans-serif;'><b>Need to Make Changes?</b>&nbsp;<img src='${WHATSAPP_ICON_URL}' width='14' height='14' alt='' style='vertical-align:middle;border:0;display:inline-block;'></a>
          </td></tr></table>
          <div style='color:#8F8A7C;font-size:12px;padding-top:14px;font-family:Arial,Helvetica,sans-serif;'>or simply reply to this email</div>
        </td></tr>
        <tr><td style='padding:22px 24px 26px;'>
          <div style='border-top:1px solid #33302A;padding-top:18px;color:#E7E2D4;font-size:14px;line-height:1.7;font-family:Arial,Helvetica,sans-serif;'>
            Warm regards,<br><b style='color:#FFFFFF;'>Team Wild Excursions</b><br>
            <a href='https://wildexcursions.in' style='color:#FDCB08;text-decoration:none;'><b>wildexcursions.in</b></a><br>
            <a href='tel:+917755958493' style='color:#FDCB08;text-decoration:none;'><b>+91 7755958493</b></a>
          </div>
        </td></tr>
      </table>
    </div>
  </body></html>`;

  const textRows = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
  const text = `Dear ${firstName},\n\nThank you for your enquiry. We've received your details and our Safari Expert will connect with you shortly with availability, pricing and a personalized ${destination} itinerary.${textRows ? `\n\nHere's a summary of what you shared:\n${textRows}` : ''}\n\nWarm regards,\nTeam Wild Excursions\nhttps://wildexcursions.in\n+91 7755958493`;
  return { html, text };
}

function notificationEmailV2(customer) {
  const destination = clean(customer.destination, 180) || 'Wildlife';
  const phoneDigits = clean(customer.phone, 50).replace(/\D/g, '');
  const contactRows = [
    ['Name', customer.name],
    ['WhatsApp', customer.phone || 'Not provided'],
    ['Email', customer.email || 'Not provided'],
  ];
  const enquiryRows = [
    ...detailRows(customer),
    ['Message', customer.message],
    ['Form', customer.formName],
    ['Page', customer.pageUrl],
    ...Object.entries(customer.campaign).map(([key, value]) => [key.replace('utm_', 'UTM ').replaceAll('_', ' ').toUpperCase(), value]),
  ].filter(([, value]) => clean(value, 500));
  const leadMessage = encodeURIComponent(`Hi ${customer.name}, this is Wild Excursions. Thank you for your ${destination} safari enquiry - is now a good time for a quick call?`);
  const whatsappButton = phoneDigits ? `
    <tr><td align='center' style='padding:18px 24px 4px;'>
      <table role='presentation' cellpadding='0' cellspacing='0' border='0' style='margin:0 auto;'><tr><td align='center' style='background-color:#FDCB08;padding:14px 28px;'>
        <a href='https://wa.me/${phoneDigits}?text=${leadMessage}' style='color:#202020;font-size:14px;text-decoration:none;font-family:Arial,Helvetica,sans-serif;'><b>Message this lead on WhatsApp</b>&nbsp;<img src='${WHATSAPP_ICON_URL}' width='14' height='14' alt='' style='vertical-align:middle;border:0;display:inline-block;'></a>
      </td></tr></table>
    </td></tr>` : '';

  const html = `<!doctype html>
  <html><head><meta name='color-scheme' content='dark light'><meta name='supported-color-schemes' content='dark light'></head>
  <body style='margin:0;background-color:#0B0B0B;'>
    <div style='background-color:#0B0B0B;padding:18px 12px;'>
      <table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0' style='max-width:600px;margin:0 auto;background-color:#151513;border-collapse:collapse;'>
        <tr><td align='center' style='background-color:#000000;padding:26px 20px 18px;'>
          <a href='https://wildexcursions.in' style='text-decoration:none;'><img src='${EMAIL_LOGO_URL}' width='120' alt='Wild Excursions' style='display:block;width:120px;max-width:120px;height:auto;border:0;margin:0 auto;'></a>
          <div style='color:#E7E2D4;font-size:11px;letter-spacing:2px;padding-top:12px;font-family:Arial,Helvetica,sans-serif;'>NEW ${escapeHtml(destination.toUpperCase())} LEAD</div>
        </td></tr>
        <tr><td style='background-color:#FDCB08;height:4px;line-height:4px;font-size:0;'>&nbsp;</td></tr>
        <tr><td align='center' style='background-color:#FDCB08;padding:12px 20px;color:#202020;font-size:15px;letter-spacing:1px;font-family:Arial,Helvetica,sans-serif;'><b>CONTACT WITHIN 10 MINUTES</b></td></tr>
        <tr><td style='padding:24px 24px 4px;'><p style='margin:0 0 12px;font-size:12px;color:#FDCB08;letter-spacing:2px;font-family:Arial,Helvetica,sans-serif;'><b>CONTACT</b></p>
          <table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0' style='border:1px solid #33302A;border-collapse:collapse;'>${renderDarkRows(contactRows, new Set(['WhatsApp', 'Email']))}</table>
        </td></tr>
        ${whatsappButton}
        <tr><td style='padding:22px 24px 4px;'><p style='margin:0 0 12px;font-size:12px;color:#FDCB08;letter-spacing:2px;font-family:Arial,Helvetica,sans-serif;'><b>ENQUIRY</b></p>
          <table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0' style='border:1px solid #33302A;border-collapse:collapse;'>${renderDarkRows(enquiryRows)}</table>
        </td></tr>
        <tr><td style='padding:22px 24px 26px;'>
          <div style='border-top:1px solid #33302A;padding-top:18px;color:#9A9585;font-size:13px;line-height:1.65;font-family:Arial,Helvetica,sans-serif;'>
            Reply to this email to respond directly to the customer.<br><br>
            Regards,<br><b style='color:#FFFFFF;'>Wild Excursions &mdash; Enquiry</b>
          </div>
        </td></tr>
      </table>
    </div>
  </body></html>`;

  const text = `New Wild Excursions website enquiry\n\nCONTACT\n${contactRows.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\nENQUIRY\n${enquiryRows.map(([label, value]) => `${label}: ${value}`).join('\n')}`;
  return { html, text };
}

async function postToCrm(crm) {
  const endpoint = process.env.CRM_WEBHOOK_URL || DEFAULT_CRM_WEBHOOK;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: new URLSearchParams(crm),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`CRM returned ${response.status}`);
  }
}

async function sendEmail(message, idempotencyKey) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) throw new Error('Email service is not configured');

  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({ from, ...message }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const details = clean(await response.text(), 500);
    throw new Error(`Resend returned ${response.status}: ${details}`);
  }
}

export default async (request) => {
  if (request.method !== 'POST') {
    return json(405, { ok: false, message: 'Method not allowed' });
  }
  if (!allowedOrigin(request)) {
    return json(403, { ok: false, message: 'Origin not allowed' });
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return json(413, { ok: false, message: 'Submission is too large' });
  }

  let input;
  try {
    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_BYTES) return json(413, { ok: false, message: 'Submission is too large' });
    input = JSON.parse(rawBody);
  } catch {
    return json(400, { ok: false, message: 'Invalid submission' });
  }

  if (clean(input?.honeypot, 200)) {
    return json(200, { ok: true, emailSent: false, notificationSent: false });
  }

  const submissionId = /^[a-zA-Z0-9-]{16,80}$/.test(input?.submissionId || '')
    ? input.submissionId
    : crypto.randomUUID();
  const { crm, customer } = normalizeSubmission(input);

  try {
    await postToCrm(crm);
  } catch (error) {
    console.error('Enquiry CRM delivery failed:', error instanceof Error ? error.message : 'Unknown error');
    return json(502, { ok: false, message: 'We could not submit your enquiry. Please try again.' });
  }

  const replyTo = process.env.EMAIL_REPLY_TO || process.env.ENQUIRY_NOTIFICATION_EMAIL;
  const notificationAddress = process.env.ENQUIRY_NOTIFICATION_EMAIL;
  const emailJobs = [];
  const jobNames = [];

  if (customer.email) {
    const content = customerEmailV2(customer);
    jobNames.push('customer');
    emailJobs.push(sendEmail({
      to: [customer.email],
      reply_to: replyTo ? [replyTo] : undefined,
      subject: 'We’ve received your Wild Excursions enquiry 🐯',
      ...content,
    }, `${submissionId}-customer`));
  }

  if (notificationAddress && isValidEmail(notificationAddress)) {
    const content = notificationEmailV2(customer);
    jobNames.push('notification');
    emailJobs.push(sendEmail({
      to: [notificationAddress],
      reply_to: customer.email ? [customer.email] : (replyTo ? [replyTo] : undefined),
      subject: cleanHeader(`🐯 New Website Enquiry – ${customer.destination} – ${customer.name}`),
      ...content,
    }, `${submissionId}-notification`));
  }

  const results = await Promise.allSettled(emailJobs);
  const statuses = Object.fromEntries(jobNames.map((name, index) => [name, results[index]?.status === 'fulfilled']));
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`Enquiry ${jobNames[index]} email failed:`, result.reason instanceof Error ? result.reason.message : 'Unknown error');
    }
  });

  return json(200, {
    ok: true,
    emailSent: statuses.customer ?? false,
    notificationSent: statuses.notification ?? false,
  });
};
