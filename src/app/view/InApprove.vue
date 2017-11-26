<template>
  <div class="approve">
    Godkjenning
    {{ storageCodes }}
  </div>
</template>

<script>
import sheetService from '../service/sheet.service';

export default {
  created() {
    this.storageCodes = this.$route.query.storageCodes;
  },
  data() {
    return {
      storageCodes: []
    };
  },
  methods: {
    read() {
      sheetService.read();
    },

    write() {
      sheetService.write();
    }
  }
}
</script>

<style lang="scss">
.approve {
  text-align: center;
}
</style>
