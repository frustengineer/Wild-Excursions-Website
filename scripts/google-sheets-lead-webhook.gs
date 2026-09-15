const SPREADSHEET_ID = '1gt_xPYW5w0cSJ4tm8V9oTydrBYGENHNvuKBCt7jKa-s';
const SHEET_NAME = 'Sheet1';
const HEADERS = [
  'Submitted At',
  'Name',
  'Email',
  'Phone',
  'Destination',
  'Check-in',
  'Check-out',
  'Total Travellers',
  'Form Name',
  'Remarks / Other Information',
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

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length)
        .setFontWeight('bold')
        .setBackground('#eeeeee')
        .setWrap(true);
    }

    const submissionId = String(input.submissionId || '');
    if (!submissionId) return jsonResponse({ ok: false, message: 'Missing submission ID' });

    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const existingIds = sheet.getRange(2, 17, lastRow - 1, 1).getDisplayValues().flat();
      if (existingIds.includes(submissionId)) return jsonResponse({ ok: true, duplicate: true });
    }

    const campaign = input.campaign || {};
    sheet.appendRow([
      String(input.submittedAt || ''),
      String(input.name || ''),
      String(input.email || ''),
      String(input.phone || ''),
      String(input.destination || ''),
      String(input.checkin || ''),
      String(input.checkout || ''),
      Number(input.totalpax || 0),
      String(input.formName || ''),
      String(input.remarks || ''),
      String(input.pageUrl || ''),
      String(campaign.utm_source || ''),
      String(campaign.utm_medium || ''),
      String(campaign.utm_campaign || ''),
      String(campaign.utm_term || ''),
      String(campaign.utm_content || ''),
      submissionId,
    ]);
    sheet.getRange(sheet.getLastRow(), 10).setWrap(true).setVerticalAlignment('top');
    SpreadsheetApp.flush();
    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, message: String(error) });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}
