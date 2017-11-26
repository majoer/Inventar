<template>
  <div class="dashboard">

    <div class="dashboard__item">
      <button class="dashboard__button"  v-on:click="navigate('ut')">
        <div class="dashboard__button__icon">
          <i class="fa fa-4x fa-suitcase"/>
        </div>
        <div class="dashboard__button__text">Ut på tur</div>
      </button>

    </div>

    <div class="dashboard__item">
      <button class="dashboard__button" v-on:click="navigate('inn')">
        <div class="dashboard__button__icon">
          <i class="fa fa-4x fa-archive"/>
        </div>
        <div class="dashboard__button__text">Inn på lager</div>
      </button>
    </div>

    <div class="dashboard__item">
      <button class="dashboard__button"  v-on:click="navigate('rapport')">
          <div class="dashboard__button__icon">
            <i class="fa fa-4x fa-book"/>
          </div>
          <div class="dashboard__button__text">Rapport</div>
      </button>
    </div>

  </div>
</template>

<script>
import oauthService from '../service/oauth.service';
import oauthService from '../service/oauth.service';
import router from './router/router';

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

    navigate: (path) => {
      router.push(path);
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

  &__icon {
    color: navy;
  }

  &__text {
    color: black;
  }

  &:hover {
    background: lighten(ghostwhite, 20%);
  }
}

</style>
