const google = require('googleapis');
const environmentService = require('./environment.service.js');
const sheets = google.sheets('v4');
const Promise = require('bluebird');
const winston = require('winston');

const SHEET_NAME_BOXES = 'esker';
const SHEET_NAME_ITEMS = 'inventar';
const SHEET_NAME_TYPES = 'typer';
const PAGE_SIZE = 20;

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

  readAllRows(sheetName, columnIdStart, columnIdEnd, initialRowIndexStart, oauth2Client) {
    return new Promise((resolve, reject) => {
      let allItems = [];

      const readPage = (currentPage) => {
        const rowIndexStart = initialRowIndexStart + currentPage * PAGE_SIZE;
        const rowIndexEnd = rowIndexStart + PAGE_SIZE - 1;
        const cellStart = columnIdStart + rowIndexStart;
        const cellEnd = columnIdEnd + rowIndexEnd;
        const range = `${sheetName}!${cellStart}:${cellEnd}`;

        this.read(range, oauth2Client).then((values) => {
          winston.debug(`Read ${values.length} item(s) @page ${currentPage} (${range})`);
          allItems = allItems.concat(values);

          if (values.length === PAGE_SIZE) {
            readPage(++currentPage);
          } else {
            winston.debug(`Read all items in ${currentPage + 1} pages a ${PAGE_SIZE}`);
            resolve(allItems);
          }
        }).catch((err) => reject(err));
      };

      readPage(0);
    });
  }

  readAllBoxes(oauth2Client) {
    return this.readAllRows(SHEET_NAME_BOXES, 'A', 'C', 2, oauth2Client);
  }

  readAllItems(oauth2Client) {
    return this.readAllRows(SHEET_NAME_ITEMS, 'A', 'E', 2, oauth2Client);
  }

  readAllItemTypes(oauth2Client) {
    return this.readAllRows(SHEET_NAME_TYPES, 'A', 'A', 2, oauth2Client).then((rows) => {
      return rows.map((row) => row[0]);
    });
  }
}

module.exports = new SheetService();
