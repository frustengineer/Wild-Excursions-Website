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
    const content = customerEmail(customer);
    jobNames.push('customer');
    emailJobs.push(sendEmail({
      to: [customer.email],
      reply_to: replyTo ? [replyTo] : undefined,
      subject: 'We’ve received your Wild Excursions enquiry 🐯',
      ...content,
    }, `${submissionId}-customer`));
  }

  if (notificationAddress && isValidEmail(notificationAddress)) {
    const content = notificationEmail(customer);
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
