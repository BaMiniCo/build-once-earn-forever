/**
 * Sign-up collector for the Build Once, Earn Forever hackathon page.
 * Paste this into Extensions > Apps Script inside your Google Sheet,
 * then Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 *
 * Each sign-up becomes one row. Signing up again with the same email
 * updates that person's row instead of adding a duplicate.
 */
var SHEET_NAME = "Sign-ups";
var HEADERS = ["Submitted at (IST)", "Name", "Email", "Joining", "Attending", "Team", "Idea"];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var data = JSON.parse(e.postData.contents);
    var name = clean_(data.name, 80);
    var email = clean_(data.email, 120).toLowerCase();
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return json_({ ok: false, error: "name and a valid email are required" });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    }

    var row = [
      Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss"),
      name,
      email,
      clean_(data.joining, 60),
      clean_(data.mode, 40),
      clean_(data.team, 300),
      clean_(data.idea, 500)
    ];

    // Same email signing up again: update their existing row.
    var last = sheet.getLastRow();
    var targetRow = 0;
    if (last > 1) {
      var emails = sheet.getRange(2, 3, last - 1, 1).getValues();
      for (var i = 0; i < emails.length; i++) {
        if (String(emails[i][0]).toLowerCase() === email) { targetRow = i + 2; break; }
      }
    }
    if (targetRow) {
      sheet.getRange(targetRow, 1, 1, row.length).setValues([row]);
    } else {
      sheet.appendRow(row);
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Opening the web app URL in a browser shows this, which is a quick way to check the deployment works.
function doGet() {
  return json_({ ok: true, message: "Sign-up endpoint is running." });
}

function clean_(value, max) {
  var s = String(value == null ? "" : value).replace(/^\s+|\s+$/g, "");
  // A leading = + - @ can turn a cell into a formula in Sheets; neutralise it.
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s.slice(0, max);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
