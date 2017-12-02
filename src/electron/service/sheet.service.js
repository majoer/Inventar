const google = require('googleapis');
const environmentService = require('./environment.service.js');
const sheets = google.sheets('v4');
const Promise = require('bluebird');

class SheetService {
  read(readOptions, oauth2Client) {
    const getRequest = {
      auth: oauth2Client,
      spreadsheetId: environmentService.SPREADSHEET_ID,
      range: readOptions.range,
    };

    return Promise.promisify(sheets.spreadsheets.values.get)(getRequest).then((data) => {
      return data.values.map((itemRow) => {
        return {
          id: itemRow[0],
          type: itemRow[1],
          status: itemRow[2]
        };
      });
    });
  }

  write(writeOptions, oauth2Client) {
    const updateRequest = {
      auth: oauth2Client,
      spreadsheetId: environmentService.SPREADSHEET_ID,
      range: writeOptions.range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: writeOptions.value
      }
    };

    return Promise.promisify(sheets.spreadsheets.values.update)(updateRequest);
  }
}

module.exports = new SheetService();
