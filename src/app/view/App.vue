<template>
  <div class="dashboard">

    <div class="dashboard__item">
      <button class="dashboard__button" v-on:click="login">Scan inn</button>

    </div>

    <div class="dashboard__item">
      <button class="dashboard__button" v-on:click="read">Scan ut</button>
    </div>

    <div class="dashboard__item">
      <button class="dashboard__button" v-on:click="write">Rapport</button>
    </div>

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

<style scoped lang="scss">
@import '../styles/main';

.dashboard {
  background: black;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  width: 100%;

  @include desktop {
    flex-direction: row;
  };
}

.dashboard__item {
  height: 33%;
  flex-basis: 33%;
  flex-grow: 1;

  @include desktop {
    height: 100%;
  }
}

.dashboard__button {
  background: ghostwhite;
  border: 1px solid black;
  border-radius: 3px;
  font-size: 20px;
  height: 100%;
  width: 100%;

  &:hover {
    background: lighten(ghostwhite, 20%);
  }
}

</style>
