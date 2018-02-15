const sessionService = require('./service/session.service.js');
const sheetService = require('./service/sheet.service.js');
const { ipcMain } = require('electron');

class IpcEvents {

  constructor() {
  }

  setup(window) {
    ipcMain.on('sheet:read:boxes', (event) => {
      sessionService.getOAuthClient(window).then((oauthClient) => {
        sheetService.readAllBoxes(oauthClient).then((sheetData) => {
          event.sender.send('sheet:read:boxes:complete', sheetData);
        });
      });
    });

    ipcMain.on('sheet:read:items', (event) => {
      sessionService.getOAuthClient(window).then((oauthClient) => {
        sheetService.readAllItems(oauthClient).then((sheetData) => {
          event.sender.send('sheet:read:items:complete', sheetData);
        });
      });
    });

    ipcMain.on('sheet:read:types', (event) => {
      sessionService.getOAuthClient(window).then((oauthClient) => {
        sheetService.readAllItemTypes(oauthClient).then((sheetData) => {
          event.sender.send('sheet:read:types:complete', sheetData);
        });
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
