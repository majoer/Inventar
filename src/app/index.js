import oauthService from './service/oauth.service';

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

console.log(window.location.href);
