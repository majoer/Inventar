const google = require('googleapis');
const GoogleAuth = require('google-auth-library');
const sheets = google.sheets('v4');
const readline = require('readline');

authorize((err, auth) => {
  if (err) {
    console.error(err);
    return;
  }

  sheets.spreadsheets.values.update({
    auth: auth,
    spreadsheetId: '1B3v9pSbgCimY2i6IvpWXYZPvXsfICPOjbmlCIriFyiw',
    range: 'A1',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [
        [ 'Roger' ]
      ]
    }
  }, (err, response) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(JSON.stringify(response, null, 4));
  })
})

function authorize(onAuthorized) {
  const auth = new GoogleAuth();
  const credentials = require('../credentials/client_id.json');
  const clientSecret = credentials.installed.client_secret;
  const clientId = credentials.installed.client_id;
  const redirectUrl = credentials.installed.redirect_uris[0];
  const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  console.log(clientSecret);
  console.log(clientId);
  console.log(redirectUrl);

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/spreadsheets'
    ]
  });

  console.log(authUrl);

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      console.log(token);
      oauth2Client.credentials = token;
      onAuthorized(null, oauth2Client);
    });
  });
}
