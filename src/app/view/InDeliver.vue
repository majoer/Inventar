<template>
  <div class="in" v-on:keyup.enter="onKeyup">
    <div>
      <p>Så scanner du denne koden for å levere inn varene.</p>
    </div>

    <div><i class="fa fa-5x fa-barcode"/></div>

    <div>
      <button v-on:click="$router.push('/')">
        <i class="fa fa-4x fa-times-circle"/>
        <div>Avbryt</div>
      </button>
    </div>
  </div>
</template>

<script>
import sheetService from '../service/sheet.service';

let buffer = '';
let storageCodes = [];
let onKeyupFunctionReference;

export default {
  created() {
    const router = this.$router;

    onKeyupFunctionReference = (event) => {
      buffer += event.key;

      const regex = /[0-9]{4}$/;
      const result = regex.exec(buffer);

      if (result) {
        let storageCode = result[0];

        if (storageCode) {
          let timeout;
          buffer = '';
          storageCodes.push(storageCode);
          clearTimeout(timeout);

          timeout = setTimeout(() => {
            router.push({
              path: '/inn/godkjenn',
              query: {
                storageCodes: storageCodes.join(',')
              }
            });
          }, 3000);
        }
      }
    }

    document.addEventListener('keyup', onKeyupFunctionReference);
  },

  destroyed() {
    document.removeEventListener('keyup', onKeyupFunctionReference);
  },

  methods: {
    read() {
      sheetService.read();
    },

    write() {
      sheetService.write();
    },

    onKeyup(event) {
      console.log(event.key);
    }
  }
}
</script>

<style lang="scss">
.in {
  text-align: center;
}
</style>
