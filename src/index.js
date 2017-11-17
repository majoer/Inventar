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
