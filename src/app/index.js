import oauthService from './service/oauth.service';
import sheetService from './service/sheet.service';

let buffer = '';

document.addEventListener('keyup', (event) => {
  buffer += event.key;

  const regex = /[0-9]{4}$/;

  let storageCode = regex.exec(buffer)[0];

  if (storageCode) {
    buffer = '';
    console.log(storageCode);

  }
});

document.querySelector('#login').addEventListener('click', () => {
  oauthService.authorize((redirectUri) => {
    window.location.href = redirectUri;
  });
})

document.querySelector('#read').addEventListener('click', () => {
  sheetService.read();
})

document.querySelector('#write').addEventListener('click', () => {
  sheetService.write();
})

console.log(window.location.href);
