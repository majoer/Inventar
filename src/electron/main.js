const { app, BrowserWindow, ipcMain } = require('electron');
const { URL } = require('url');
const path = require('path');
const oauthService = require('./service/oauth.service.js');
const environmentService = require('./service/environment.service.js');


let window;

function createWindow() {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    title: `Inventar ${environmentService.ENVIRONMENT}`,
    x: -800,
    y: 0
  });

  window.loadURL(new URL(environmentService.APP_URI).toString());

  window.on('closed', () => {
    window = null;
  });

  window.webContents.openDevTools()
}

app.on('ready', createWindow);

app.on('activate', () => {
  if (window === null) {
    createWindow();
  }
});

ipcMain.on('oauth.authorize', (event) => {
  oauthService.authorize((redirectUri, oauth2Client) => {
    window.webContents.on('did-navigate', (event, navigationUri) => {
      event.preventDefault();
      const uri = new URL(navigationUri);
      const authCode = uri.searchParams.get('code');

      if (authCode) {
        oauthService.token(authCode, oauth2Client, (oauth2Client) => {
          console.log(oauth2Client);
        });
      }
    });
    window.loadURL(new URL(redirectUri).toString());
  });
})
