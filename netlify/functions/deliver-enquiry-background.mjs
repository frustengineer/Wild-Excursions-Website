import { clean, isValidEmail } from './_shared/enquiry-core.mjs';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const EMAIL_LOGO_URL = 'https://drive.google.com/thumbnail?id=1jPnl3yjGiqak2LclypgxDZkyiWnGWlqu&sz=w240';
const WHATSAPP_ICON_URL = 'https://drive.google.com/thumbnail?id=14iNfLj45OQeCL40UtBOHCeAphMAwNDLP&sz=w64';

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

function detailRows(customer) {
  const rows = [
    ['Tour / package', customer.tour],
    ['Destination', customer.destination],
    ['Travel date', formatDate(customer.travelStart)],
    ['Return date', formatDate(customer.travelEnd)],
    ['Travellers', customer.travellers],
    ...customer.details.map((item) => [item.label, item.value]),
  ];
  return rows.filter(([, value]) => clean(value, 500));
}

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

async function postToSpreadsheet({ submissionId, crm, customer }) {
  const endpoint = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;
  if (!endpoint || !secret) return false;

  // Apps Script Web Apps always answer with a 302 to a one-time
  // script.googleusercontent.com URL that carries the actual response body —
  // the POST itself already ran doPost() to completion, this redirect just
  // delivers the result, and it must be fetched as a plain GET, not resent
  // as a POST (which Google's edge rejects with 411 Length Required).
  let response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret,
      submissionId,
      submittedAt: new Date().toISOString(),
      name: crm.name,
      email: crm.email,
      phone: crm.phone,
      destination: crm.destination,
      checkin: crm.checkin,
      checkout: crm.checkout,
      totalpax: crm.totalpax,
      formName: crm.formName,
      message: customer.message,
      tour: customer.tour,
      details: customer.details,
      pageUrl: customer.pageUrl,
      campaign: customer.campaign,
    }),
    redirect: 'manual',
    signal: AbortSignal.timeout(15_000),
  });
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get('location');
    if (!location) throw new Error('Google Sheets webhook redirect missing Location header');
    response = await fetch(location, { signal: AbortSignal.timeout(15_000) });
  }

  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.ok) {
    throw new Error(`Google Sheets webhook returned ${response.status}`);
  }
  return true;
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
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    const details = clean(await response.text(), 500);
    throw new Error(`Resend returned ${response.status}: ${details}`);
  }
}

export const config = { background: true };

export default async (request) => {
  const secret = process.env.INTERNAL_ENQUIRY_SECRET;
  if (!secret || request.headers.get('x-internal-secret') !== secret) {
    return; // Not a real endpoint for the public — silently ignore.
  }

  let input;
  try {
    input = JSON.parse(await request.text());
  } catch {
    return;
  }

  const { submissionId, crm, customer } = input || {};
  if (!crm || !customer) return;

  const replyTo = process.env.EMAIL_REPLY_TO || process.env.ENQUIRY_NOTIFICATION_EMAIL;
  const notificationAddress = process.env.ENQUIRY_NOTIFICATION_EMAIL;
  const deliveryJobs = [];
  const jobNames = [];

  if (process.env.GOOGLE_SHEETS_WEBHOOK_URL && process.env.GOOGLE_SHEETS_WEBHOOK_SECRET) {
    jobNames.push('spreadsheet');
    deliveryJobs.push(postToSpreadsheet({ submissionId, crm, customer }));
  }

  if (customer.email) {
    const content = customerEmailV2(customer);
    jobNames.push('customer');
    deliveryJobs.push(sendEmail({
      to: [customer.email],
      reply_to: replyTo ? [replyTo] : undefined,
      subject: 'We’ve received your Wild Excursions enquiry 🐯',
      ...content,
    }, `${submissionId}-customer`));
  }

  if (notificationAddress && isValidEmail(notificationAddress)) {
    const content = notificationEmailV2(customer);
    jobNames.push('notification');
    deliveryJobs.push(sendEmail({
      to: [notificationAddress],
      reply_to: customer.email ? [customer.email] : (replyTo ? [replyTo] : undefined),
      subject: cleanHeader(`🐯 New Website Enquiry – ${customer.destination} – ${customer.name}`),
      ...content,
    }, `${submissionId}-notification`));
  }

  const results = await Promise.allSettled(deliveryJobs);
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`Enquiry ${jobNames[index]} delivery failed:`, result.reason instanceof Error ? result.reason.message : 'Unknown error');
    }
  });
};
