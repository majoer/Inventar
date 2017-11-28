const { app, BrowserWindow, ipcMain } = require('electron');
const { URL } = require('url');
const path = require('path');
const oauthService = require('./service/oauth.service.js');
const sheetService = require('./service/sheet.service.js');
const environmentService = require('./service/environment.service.js');

let _window;
let _oauth2Client;

function create_window() {
  _window = new BrowserWindow({
    width: 800,
    height: 600,
    title: `Inventar ${environmentService.ENVIRONMENT}`,
    x: -800,
    y: 0
  });

  _window.loadURL(new URL(environmentService.APP_URI).toString());

  _window.on('closed', () => {
    _window = null;
  });

  _window.webContents.openDevTools();
}

app.on('ready', create_window);

app.on('activate', () => {
  if (_window === null) {
    create_window();
  }
});

ipcMain.on('sheet.read', (event, readOptions) => {
  if (!_oauth2Client) {
    authenticate(() => read(event, readOptions));
    return;
  }

  read(event, readOptions);
});

function read(event, readOptions) {
  sheetService.read(readOptions.range, _oauth2Client, (err, response) => {
    if (err) {
      console.log(err);
    }

    event.sender.send('sheet.read.complete', response);
  })
}

ipcMain.on('sheet.write', (event, writeOptions) => {
  sheetService.write(writeOptions.range, writeOptions.values, _oauth2Client, (err, response) => {
    if (err) {
      console.log(err);
    }

    event.sender.send('sheet.write.complete');
  });
});

ipcMain.on('oauth.authorize', () => {
  authenticate();
});

function authenticate(onAuthenticateComplete) {
  const previousURI = _window.webContents.getURL();

  oauthService.authorize((redirectUri, oauth2Client) => {
    _window.webContents.on('did-navigate', (event, navigationUri) => {
      event.preventDefault();
      const uri = new URL(navigationUri);
      const authCode = uri.searchParams.get('code');

      if (authCode) {
        oauthService.token(authCode, oauth2Client, (oauth2Client) => {
          _oauth2Client = oauth2Client;
          _window.loadURL(new URL(previousURI).toString());
          onAuthenticateComplete();
        });
      }
    });
    console.log(`Returning to: ${redirectUri}`);
    _window.loadURL(new URL(redirectUri).toString());
  });
}
