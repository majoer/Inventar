<template>
  <div>
    <button v-on:click="login">Login</button>
    <button v-on:click="read">read</button>
    <button v-on:click="write">write</button>
  </div>
</template>

<script>
import oauthService from '../service/oauth.service';
import sheetService from '../service/sheet.service';

let buffer = '';

export default {
  created: () => {
    document.addEventListener('keyup', (event) => {
      buffer += event.key;

      const regex = /[0-9]{4}$/;

      let storageCode = regex.exec(buffer)[0];

      if (storageCode) {
        buffer = '';
        console.log(storageCode);
      }
    });
  },

  methods: {
    login: () => {
        oauthService.authorize((redirectUri) => {
          window.location.href = redirectUri;
        });
    },

    read: () => {
        sheetService.read();
    },

    write: () => {
      sheetService.write();
    }
  }
}
</script>

<style scoped>

</style>
