import { clean, isValidEmail, validDate } from './_shared/enquiry-core.mjs';

const DEFAULT_CRM_WEBHOOK = 'https://crm.wildexcursions.in/landingpageenquiry.mytrav';
const MAX_BODY_BYTES = 64 * 1024;

function json(status, body) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

function sanitizeCrmRemarks(value) {
  return clean(value, 5000);
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

// Emails and the Google Sheets sync are the slow part (Apps Script alone
// commonly takes several seconds) and the visitor doesn't need to wait for
// either — only the CRM write has to succeed before we report success. So
// we hand the rest to a background function and return as soon as the CRM
// confirms; the background function keeps running after this response goes
// out (up to 15 minutes) rather than blocking the browser on it. This POST
// still has to be awaited (just not its outcome) — Netlify freezes the
// function the instant it returns, which would kill an un-awaited fetch
// before it ever left the box.
async function triggerBackgroundDelivery(request, payload) {
  const origin = new URL(request.url).origin;
  const secret = process.env.INTERNAL_ENQUIRY_SECRET;
  if (!secret) {
    console.error('INTERNAL_ENQUIRY_SECRET is not configured — skipping email/spreadsheet delivery.');
    return;
  }
  try {
    await fetch(`${origin}/.netlify/functions/deliver-enquiry-background`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Internal-Secret': secret },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5_000),
    });
  } catch (error) {
    console.error('Failed to trigger background delivery:', error instanceof Error ? error.message : 'Unknown error');
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
    return json(200, { ok: true });
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

  await triggerBackgroundDelivery(request, { submissionId, crm, customer });

  return json(200, { ok: true });
};
