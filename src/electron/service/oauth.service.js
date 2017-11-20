const path = require('path');
const google = require('googleapis');
const GoogleAuth = require('google-auth-library');
const environmentService = require('./environment.service.js');

const auth = new GoogleAuth();

module.exports = {
  authorize: (onAuthorizeComplete) => {
    const oauth2Client = new auth.OAuth2(environmentService.CLIENT_ID, environmentService.CLIENT_SECRET, environmentService.APP_URI);
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/spreadsheets'
      ]
    });

    onAuthorizeComplete(authUrl, oauth2Client);
  },

  token: (authCode, oauth2Client, onTokenComplete) => {
    oauth2Client.getToken(authCode, (err, token) => {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }

      console.log(token);
      oauth2Client.credentials = token;
      onTokenComplete(oauth2Client);
    });
  }
}
