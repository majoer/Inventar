<template>
<div>
  <div class="approve">
    Godkjenning
    {{ newStorageCodes }}
  </div>
  <div>
    {{ items }}
  </div>
  <div>
    {{ newItems }}
  </div>
</div>
</template>

<script>
import sheetService from '../service/sheet.service';

export default {
  created() {
    this.newStorageCodes = this.$route.query.storageCodes;
    sheetService.read((data) => {
      this.items = data.values;
      this.newItems = this.items.map((itemRow) => {
        return {
          id: itemRow[0],
          name: itemRow[1],
          status: itemRow[2]
        }
      }).filter((item) => !this.newStorageCodes.includes(item.id))
    });
  },
  data() {
    return {
      newStorageCodes: [],
      items: [],
      newItems: []
    };
  },
  methods: {
    read() {
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
