<template>
  <div></div>
</template>

<script>
import sheetService from '../service/sheet.service';

export default {
  methods: {
    read: () => {
      sheetService.read();
    },

    write: () => {
      sheetService.write();
    }
  }
};
</script>

<style lang="scss"

</style>
