const sessionService = require('./service/session.service.js');
const sheetService = require('./service/sheet.service.js');
const { ipcMain } = require('electron');

class IpcEvents {
  setup(window) {
    ipcMain.on('sheet.read', (event, readOptions) => {
      sessionService.getOAuthClient(window).then((oauthClient) => {
        sheetService.read(readOptions, oauthClient).then((sheetData) => {
          event.sender.send('sheet.read.complete', sheetData);
        });
      });
    });

    ipcMain.on('sheet.write', (event, writeOptions) => {
      sessionService.getOAuthClient(window).then((oauthClient) => {
        sheetService.write(writeOptions, oauthClient).then(() => {
          event.sender.send('sheet.write.complete');
        });
      });
    });
  }
}

module.exports = new IpcEvents();
