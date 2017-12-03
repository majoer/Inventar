const google = require('googleapis');
const environmentService = require('./environment.service.js');
const sheets = google.sheets('v4');
const Promise = require('bluebird');
const winston = require('winston');

const SHEET_NAME_ITEMS = 'inventar';
const PAGE_SIZE = 1;

class SheetService {
  read(range, oauth2Client) {
    const getRequest = {
      auth: oauth2Client,
      spreadsheetId: environmentService.SPREADSHEET_ID,
      range: range,
    };

    return Promise.promisify(sheets.spreadsheets.values.get)(getRequest).then((data) => {
      if (!data.values) {
        winston.error('No values in read!');
        return [];
      }

      return data.values.filter((row) => row.some((cell) => !!cell));
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

  readAllItems(oauth2Client) {
    return new Promise((resolve, reject) => {
      let allItems = [];

      const readPage = (currentPage) => {
        const columnIndexStart = 2 + currentPage * PAGE_SIZE;
        const columnIndexEnd = columnIndexStart + PAGE_SIZE - 1;
        const cellStart = `A${columnIndexStart}`;
        const cellEnd = `D${columnIndexEnd}`;
        const range = `${SHEET_NAME_ITEMS}!${cellStart}:${cellEnd}`;

        this.read(range, oauth2Client).then((values) => {
          winston.debug(`Read ${values.length} item(s) @page ${currentPage} (${range})`);
          allItems = allItems.concat(values);

          if (values.length === PAGE_SIZE) {
            readPage(++currentPage);
          } else {
            winston.debug(`Read all items in ${currentPage} pages a ${PAGE_SIZE}`);
            resolve(allItems);
          }
        }).catch((err) => reject(err));
      }

      readPage(0);
    });

  }

  readAllItemTypes(oauth2Client) {

  }
}

module.exports = new SheetService();
