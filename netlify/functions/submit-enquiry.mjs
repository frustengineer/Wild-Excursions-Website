import { clean, isValidEmail, validDate } from './_shared/enquiry-core.mjs';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const DEFAULT_CRM_WEBHOOK = 'https://crm.wildexcursions.in/landingpageenquiry.mytrav';
const DEFAULT_LEADS_ENDPOINT = 'https://dashboard.wildexcursions.in/api/v1/leads';
// Paste the website key from CRM -> Settings -> Lead intake here, or set WE_LEADS_API_KEY
// in the Netlify environment (preferred: then it never ships in the repo). While this is
// still the placeholder, the leads API is skipped and nothing else about submissions changes.
const LEADS_API_KEY = process.env.WE_LEADS_API_KEY || 'PASTE_YOUR_WEBSITE_KEY';
const MAX_BODY_BYTES = 64 * 1024;
const EMAIL_LOGO_URL = 'https://drive.google.com/thumbnail?id=1jPnl3yjGiqak2LclypgxDZkyiWnGWlqu&sz=w240';
const WHATSAPP_ICON_URL = 'https://drive.google.com/thumbnail?id=14iNfLj45OQeCL40UtBOHCeAphMAwNDLP&sz=w64';
// The CRM at dashboard.wildexcursions.in now owns the acknowledgement sent to the person
// who filled the form, so the website no longer sends its own (every enquiry reaches the CRM
// through the leads API below). Flip to true to send it from here again; customerEmailV2 is
// kept as the reference template. The team notification further down is unaffected.
const SEND_CUSTOMER_ACKNOWLEDGEMENT = false;

function json(status, body) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
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
  return clean(value, 5000);
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

  const remarks = sanitizeCrmRemarks(incomingCrm.remarks);
  const crm = {
    name,
    email: isValidEmail(email) ? email : 'not-provided@wildexcursions.in',
    phone: clean(incomingCrm.phone, 50) || 'Not provided',
    destination,
    checkin,
    checkout,
    totalpax,
    formName: clean(incomingCrm.formName, 160) || 'Website Enquiry',
    remarks: remarks || `Enquiry Source: ${clean(incomingCrm.formName, 160) || 'Website Enquiry'}`,
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

// Internal / noise rows the customer doesn't need in their confirmation (the team email keeps them):
// which button they used, and counts or flexibility that were left at zero.
const CUSTOMER_HIDDEN_LABELS = new Set(['entry point']);
const CUSTOMER_HIDE_WHEN_ZERO = new Set(['children ages 6-12', 'children under 6', 'date flexibility (days)']);

function customerRows(customer) {
  return detailRows(customer).filter(([label, value]) => {
    const key = clean(label, 120).toLowerCase();
    if (CUSTOMER_HIDDEN_LABELS.has(key)) return false;
    if (CUSTOMER_HIDE_WHEN_ZERO.has(key) && /^0+$/.test(clean(value, 20))) return false;
    return true;
  });
}

function customerEmailV2(customer) {
  const firstName = clean(customer.name, 120).split(/\s+/)[0] || 'there';
  const rows = customerRows(customer);
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

const TRACKING_KEYS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'gclid', 'fbclid', 'referrer', 'landing_page',
];

// The CRM rejects invalid phone numbers, so hold it to the same 7-15 digit rule the
// browser checks. Keeps a leading "+" and the dial code, drops spaces and brackets.
export function normalizePhone(value) {
  const raw = clean(value, 50);
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return '';
  return `${raw.trimStart().startsWith('+') ? '+' : ''}${digits}`;
}

function countField(value) {
  const parsed = Number.parseInt(clean(value, 4), 10);
  if (!Number.isFinite(parsed) || parsed < 0) return '';
  return String(Math.min(99, parsed));
}

/**
 * Maps a submission onto the lead schema of dashboard.wildexcursions.in. The client sends
 * a `lead` object with these names already resolved (the forms themselves use ~25 different
 * field names); everything here is a safety net so a lead still lands if that is missing.
 *
 * The CRM has no nationality column yet, so nationality is sent AND prepended to remarks.
 */
function normalizeLead(input, { crm, customer }) {
  const incoming = input?.lead && typeof input.lead === 'object' ? input.lead : {};
  const email = clean(incoming.email || customer.email, 254);
  const nationality = clean(incoming.nationality, 80);
  const remarks = clean(incoming.remarks, 4000);
  // The browser normally prepends this already; only add it when it is genuinely missing,
  // so a lead never arrives with "Nationality: Indian" written out twice.
  const needsNationality = nationality && !/^Nationality:/i.test(remarks);
  const remarkParts = [
    needsNationality ? `Nationality: ${nationality}` : '',
    remarks,
  ].filter(Boolean);

  const lead = {
    name: clean(incoming.name || crm.name, 120),
    email: isValidEmail(email) ? email : '',
    phone: normalizePhone(incoming.phone || crm.phone),
    city: clean(incoming.city, 120),
    destination: clean(incoming.destination || crm.destination, 180),
    checkin: validDate(incoming.checkin) ? clean(incoming.checkin, 10) : clean(crm.checkin, 10),
    checkout: validDate(incoming.checkout) ? clean(incoming.checkout, 10) : '',
    adults: countField(incoming.adults) || crm.totalpax,
    children: countField(incoming.children),
    budget: clean(incoming.budget, 120),
    jeep_safaris: clean(incoming.jeep_safaris, 60),
    resort_category: clean(incoming.resort_category, 120),
    heard_about: clean(incoming.heard_about, 160),
    nationality,
    remarks: remarkParts.join('\n\n'),
    form_name: clean(incoming.form_name || crm.formName, 160),
    page_url: clean(incoming.page_url || customer.pageUrl, 500),
  };

  TRACKING_KEYS.forEach((key) => {
    const value = clean(incoming[key], 500);
    if (value) lead[key] = value;
  });

  // Drop empty optional fields rather than posting blank strings the CRM would store as data.
  return Object.fromEntries(Object.entries(lead).filter(([, value]) => value !== ''));
}

async function postToLeadsApi(lead) {
  if (LEADS_API_KEY === 'PASTE_YOUR_WEBSITE_KEY') return false;
  if (!lead.name || !lead.phone) throw new Error('Lead needs a name and a valid phone number');

  const response = await fetch(process.env.WE_LEADS_ENDPOINT || DEFAULT_LEADS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-Key': LEADS_API_KEY },
    body: JSON.stringify(lead),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Leads API returned ${response.status}: ${clean(await response.text().catch(() => ''), 300)}`);
  }
  return true;
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

// Emails and the Google Sheets sync are the slow part (Apps Script alone
// commonly takes several seconds) and the visitor doesn't need to wait for
// either — only the CRM write does. This runs after the response has
// already gone out, via context.waitUntil, instead of a second network hop
// to a separate background function (which added ~2s of Lambda-to-Lambda
// invocation overhead on its own).
async function deliverEmailsAndSpreadsheet({ submissionId, crm, customer }) {
  const replyTo = process.env.EMAIL_REPLY_TO || process.env.ENQUIRY_NOTIFICATION_EMAIL;
  const notificationAddress = process.env.ENQUIRY_NOTIFICATION_EMAIL;
  const deliveryJobs = [];
  const jobNames = [];

  if (process.env.GOOGLE_SHEETS_WEBHOOK_URL && process.env.GOOGLE_SHEETS_WEBHOOK_SECRET) {
    jobNames.push('spreadsheet');
    deliveryJobs.push(postToSpreadsheet({ submissionId, crm, customer }));
  }

  if (SEND_CUSTOMER_ACKNOWLEDGEMENT && customer.email) {
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
}

export default async (request, context) => {
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
    return json(200, { ok: true });
  }

  const submissionId = /^[a-zA-Z0-9-]{16,80}$/.test(input?.submissionId || '')
    ? input.submissionId
    : crypto.randomUUID();
  const { crm, customer } = normalizeSubmission(input);

  // Both CRMs are written in parallel and the visitor only sees an error if NEITHER took
  // the lead, so adding the new leads API cannot become a new single point of failure.
  const lead = normalizeLead(input, { crm, customer });
  const [mytrav, leadsApi] = await Promise.allSettled([postToCrm(crm), postToLeadsApi(lead)]);
  if (mytrav.status === 'rejected') {
    console.error('Enquiry CRM delivery failed:', mytrav.reason instanceof Error ? mytrav.reason.message : 'Unknown error');
  }
  if (leadsApi.status === 'rejected') {
    console.error('Enquiry leads API delivery failed:', leadsApi.reason instanceof Error ? leadsApi.reason.message : 'Unknown error');
  }
  if (mytrav.status !== 'fulfilled' && leadsApi.value !== true) {
    return json(502, { ok: false, message: 'We could not submit your enquiry. Please try again.' });
  }

  const deliver = deliverEmailsAndSpreadsheet({ submissionId, crm, customer });
  if (context?.waitUntil) {
    context.waitUntil(deliver);
  } else {
    // Local dev proxy has no waitUntil — just let it run without blocking the response.
    deliver.catch(() => {});
  }

  return json(200, { ok: true });
};
