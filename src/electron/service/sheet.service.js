const google = require('googleapis');
const environmentService = require('./environment.service.js');
const sheets = google.sheets('v4');



module.exports = {
  read: (range, oauth2Client, onReadComplete) => {
    const getRequest = {
      auth: oauth2Client,
      spreadsheetId: environmentService.SPREADSHEET_ID,
      range: range,
    };

    sheets.spreadsheets.values.get(getRequest, onReadComplete);
  },

  write: (range, values, oauth2Client, onWriteComplete) => {
    const updateRequest = {
      auth: oauth2Client,
      spreadsheetId: environmentService.SPREADSHEET_ID,
      range: range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values
      }
    };

    sheets.spreadsheets.values.update(updateRequest, onWriteComplete);
  }
}
