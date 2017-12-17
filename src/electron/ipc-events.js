const sessionService = require('./service/session.service.js');
const sheetService = require('./service/sheet.service.js');
const { ipcMain } = require('electron');

class IpcEvents {

  constructor() {
    this.reading = false;
  }

  setup(window) {
    ipcMain.on('sheet:read:items', (event) => {
      if (this.reading) {
        return;
      }

      this.reading = true;

      sessionService.getOAuthClient(window).then((oauthClient) => {
        sheetService.readAllItems(oauthClient).then((sheetData) => {
          event.sender.send('sheet:read:items:complete', sheetData);
        })
          .then(() => this.reading = false)
          .catch(() => this.reading = false);
      });
    });

    ipcMain.on('sheet:read:types', (event) => {
      if (this.reading) {
        return;
      }

      this.reading = true;

      sessionService.getOAuthClient(window).then((oauthClient) => {
        sheetService.readAllItemTypes(oauthClient).then((sheetData) => {
          event.sender.send('sheet:read:types:complete', sheetData);
        })
          .then(() => this.reading = false)
          .catch(() => this.reading = false);
      });
    });

    ipcMain.on('sheet:write', (event, writeOptions) => {
      sessionService.getOAuthClient(window).then((oauthClient) => {
        sheetService.write(writeOptions, oauthClient).then(() => {
          event.sender.send('sheet:write:complete');
        });
      });
    });
  }
}

module.exports = new IpcEvents();
