const GoogleAuth = require('google-auth-library');
const environmentService = require('./environment.service.js');
const Promise = require('bluebird');

const auth = new GoogleAuth();

class OAuthService {
  authorize() {
    const oauth2Client = new auth.OAuth2(environmentService.CLIENT_ID, environmentService.CLIENT_SECRET, environmentService.APP_URI);
    const authURI = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/spreadsheets'
      ]
    });

    return {
      authURI: authURI,
      oauth2Client: oauth2Client
    };
  }

  token(authCode, oauth2Client) {
    return Promise.promisify(oauth2Client.getToken, { context: oauth2Client })(authCode)
      .then((token) => {
        oauth2Client.credentials = token;
        return oauth2Client;
      });
  }
}

module.exports = new OAuthService();
