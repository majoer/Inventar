const oauthService = require('./oauth.service.js');
const Promise = require('bluebird');
const { URL } = require('url');

class SessionService {

  constructor() {
    this.oauth2Client = undefined;
  }

  isValid() {
    return this.oauth2Client && this.oauth2Client.credentials;
  }

  invalidate() {
    this.oauth2Client = null;
  }

  getOAuthClient(window) {
    if (this.isValid()) {
      return Promise.resolve(this.oauth2Client);
    }

    const { oauth2Client, authURI } = oauthService.authorize();
    const previousURI = window.webContents.getURL();

    const promise = new Promise((resolve, reject) => {
      window.webContents.on('did-navigate', (event, navigationUri) => {
        event.preventDefault();
        const authorizeCallbackUri = new URL(navigationUri);
        const authCode = authorizeCallbackUri.searchParams.get('code');

        if (!authCode) {
          return;
        }

        oauthService.token(authCode, oauth2Client).then((authorizedOauth2Client) => {
          this.oauth2Client = authorizedOauth2Client;
          window.loadURL(new URL(previousURI).toString());
          resolve(this.oauth2Client);
        }).catch((err) => {
          reject(err);
        });
      });
    });

    window.loadURL(new URL(authURI).toString());

    return promise;
  }
}

module.exports = new SessionService();
