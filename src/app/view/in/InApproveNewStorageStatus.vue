<template>
<div class="approval-view">
  <h1>Oppdatert lagerstatus</h1>

  <div class="item-list">
    <div class="item-list__entry" v-for="item in items">
      <span v-if="item.type === 'Eske'"><i class="fa fa-archive"></i></span>
      <div class="item">
        <div class="item__id">{{ item.id }}</div>
        <div class="item__name">{{ item.type }}</div>
        <div class="item__status">
          <span class="item__status__current">{{ item.status }}</span>
          <span class="item__status__arrow"><i class="fa fa-arrow-right"/></span>
          <span class="item__status__new">{{ newStatus }}</span>
        </div>
      </div>
      <div class="box-content" v-if="item.type === 'Eske'">
        <div class="box-content__dropzone">
          <h3 class="box-content__text">Innhold</h3>
          <div class="box-content__entry" v-for="boxItem in item.boxContent" v-bind:id="boxItem.id">
            <span>{{ boxItem.id }}</span>
            <span>
              <select v-model="boxItem.type">
                <option disabled value="">Velg en varetype</option>
                <option v-for="itemType in availableItemTypes">{{itemType}}</option>
              </select>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div>
    <button v-on:click="$router.push('/')">
      <i class="fa fa-4x fa-home"/>
      <div>Hjem</div>
    </button>
    <button v-on:click="$router.push('/rapport')">
      <i class="fa fa-4x fa-book"/>
      <div>Til rapport</div>
    </button>
  </div>
</div>
</template>

<script>
import sheetService from '../../service/sheet.service';

export default {
  created() {
    this.items = JSON.parse(this.$route.query.items);
  },
  data() {
    return {
      items: [],
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
</style>
