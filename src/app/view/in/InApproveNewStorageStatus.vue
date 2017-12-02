<template>
<div class="approval-view">
  <h1>Navngi nye varer</h1>
  <div class="item-list">
    <div class="item-list__entry" v-for="item in items">
      <div class="item">
        <div class="item__id">{{ item.id }}</div>
        <div class="item__name">{{ item.name }}</div>
        <div class="item__status">
          <span class="item__status__current">{{ item.status }}</span>
          <span class="item__status__arrow"><i class="fa fa-arrow-right"/></span>
          <span class="item__status__new">{{ newStatus }}</span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import sheetService from '../../service/sheet.service';

export default {
  created() {
    this.newStorageCodes = this.$route.query.storageCodes;
    sheetService.read((allStoredItems) => {
      this.allStoredItems = allStoredItems;
      this.newItems = allStoredItems.filter((item) => !this.newStorageCodes.includes(item.id));
      this.updateItems = allStoredItems.filter((item) => this.newStorageCodes.includes(item.id));
    });
  },
  data() {
    return {
      newStorageCodes: [],
      allStoredItems: [],
      newItems: [],
      newStatus: 'Inne'
    };
  },
  methods: {
    read() {
    },

    write() {
      sheetService.write();
    }
  }
};
</script>

<style lang="scss">
.approval-view {
  width: 100%;
}


.item-list {
  display: flex;
  flex-wrap: wrap;
}

.item-list__entry {
  border: 1px solid red;
  border-radius: 3px;
  margin: 10px;
  padding: 10px;
}

.item__status {
  white-space: nowrap;
}
</style>
