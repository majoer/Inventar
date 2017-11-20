const path = require('path');
const credentials = require(path.resolve('credentials/client_id.json'));

const ENVIRONMENT = process.env.NODE_ENV || 'development';
const isProduction = ENVIRONMENT === 'production';

module.exports = {
  ENVIRONMENT: ENVIRONMENT,
  APP_URI: isProduction ? 'file://dist/index.html' : 'http://localhost:8080',
  CLIENT_SECRET: credentials.installed.client_secret,
  CLIENT_ID: credentials.installed.client_id
}
