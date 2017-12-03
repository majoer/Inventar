<template>
  <div>
    {{ items }}
    <div>
      <button v-on:click="$router.push('/')">
        <i class="fa fa-4x fa-home"/>
        <div>Hjem</div>
      </button>
    </div>
  </div>
</template>

<script>
import sheetService from '../service/sheet.service';

export default {
  created() {
    sheetService.read((items) => {
      this.items = items;
    });
  },

  data: () => {
    return {
      items: []
    };
  }
};
</script>

<style lang="scss"

</style>
