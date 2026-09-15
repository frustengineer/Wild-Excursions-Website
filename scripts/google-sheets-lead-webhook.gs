const SPREADSHEET_ID = '1gt_xPYW5w0cSJ4tm8V9oTydrBYGENHNvuKBCt7jKa-s';
const SHEET_NAME = 'Sheet1';

// Columns that always exist, in this order. Anything in `details` (the
// per-form extra fields — jeep safaris, budget, nationality, travel month,
// etc.) gets its own column too, appended automatically the first time that
// field label is seen, so every field lands in its own cell instead of one
// combined remarks blob. New dynamic columns are only ever appended to the
// right, so `Submission ID` below stays at a fixed index for the duplicate
// check.
const FIXED_HEADERS = [
  'Submitted At',
  'Name',
  'Email',
  'Phone',
  'Destination',
  'Check-in',
  'Check-out',
  'Total Travellers',
  'Form Name',
  'Message',
  'Tour / Package',
  'Page URL',
  'UTM Source',
  'UTM Medium',
  'UTM Campaign',
  'UTM Term',
  'UTM Content',
  'Submission ID',
];

function jsonResponse(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

function styleHeaderRange(range) {
  range.setFontWeight('bold').setBackground('#eeeeee').setWrap(true);
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(FIXED_HEADERS);
    sheet.setFrozenRows(1);
    styleHeaderRange(sheet.getRange(1, 1, 1, FIXED_HEADERS.length));
  }
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
}

// Returns the 1-based column for `label`, creating it at the end of the
// header row the first time it's seen.
function columnForLabel(sheet, headers, label) {
  const existingIndex = headers.indexOf(label);
  if (existingIndex !== -1) return existingIndex + 1;
  const column = headers.length + 1;
  styleHeaderRange(sheet.getRange(1, column).setValue(label));
  headers.push(label);
  return column;
}

function doPost(event) {
  const lock = LockService.getScriptLock();
  try {
    const input = JSON.parse(event.postData.contents || '{}');
    const expectedSecret = PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET');
    if (!expectedSecret || input.secret !== expectedSecret) {
      return jsonResponse({ ok: false, message: 'Unauthorized' });
    }

    lock.waitLock(10000);
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) return jsonResponse({ ok: false, message: 'Sheet not found' });

    const headers = ensureHeaders(sheet);
    const submissionIdColumn = headers.indexOf('Submission ID') + 1;

    const submissionId = String(input.submissionId || '');
    if (!submissionId) return jsonResponse({ ok: false, message: 'Missing submission ID' });

    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const existingIds = sheet.getRange(2, submissionIdColumn, lastRow - 1, 1).getDisplayValues().flat();
      if (existingIds.includes(submissionId)) return jsonResponse({ ok: true, duplicate: true });
    }

    const campaign = input.campaign || {};
    const fixedValues = {
      'Submitted At': String(input.submittedAt || ''),
      'Name': String(input.name || ''),
      'Email': String(input.email || ''),
      'Phone': String(input.phone || ''),
      'Destination': String(input.destination || ''),
      'Check-in': String(input.checkin || ''),
      'Check-out': String(input.checkout || ''),
      'Total Travellers': Number(input.totalpax || 0),
      'Form Name': String(input.formName || ''),
      'Message': String(input.message || ''),
      'Tour / Package': String(input.tour || ''),
      'Page URL': String(input.pageUrl || ''),
      'UTM Source': String(campaign.utm_source || ''),
      'UTM Medium': String(campaign.utm_medium || ''),
      'UTM Campaign': String(campaign.utm_campaign || ''),
      'UTM Term': String(campaign.utm_term || ''),
      'UTM Content': String(campaign.utm_content || ''),
      'Submission ID': submissionId,
    };

    const row = [];
    Object.keys(fixedValues).forEach((label) => {
      row[columnForLabel(sheet, headers, label) - 1] = fixedValues[label];
    });

    const details = Array.isArray(input.details) ? input.details : [];
    details.forEach((item) => {
      const label = String((item && item.label) || '').trim();
      const value = String((item && item.value) || '').trim();
      if (!label || !value) return;
      row[columnForLabel(sheet, headers, label) - 1] = value;
    });

    for (let i = 0; i < headers.length; i += 1) {
      if (row[i] === undefined) row[i] = '';
    }

    sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length).setValues([row]);
    SpreadsheetApp.flush();
    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, message: String(error) });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}
