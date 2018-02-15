<template>
<div class="register-view">
  <div class="register-view__dropzone"></div>
  <h1>Opprett nye varer</h1>
  <div class="item-list">
    <div class="item-list__entry" v-for="genericItem in genericItems" v-bind:id="genericItem.id">
      <span v-if="isBox(genericItem)"><i class="fa fa-archive"></i></span>
      <div class="item">
        <div class="item__id">{{ genericItem.id }}</div>
        <div class="item__name">
          <select v-bind:value="genericItem.type.name"
                  v-on:change="onRegularItemTypeChanged($event, genericItem)">
            <option v-bind:value="Type.TYPE_UNKNOWN" disabled selected>Velg en varetype</option>
            <option v-bind:value="Type.TYPE_BOX">Eske</option>
            <option v-for="itemType in $store.state.inStore.storedItemTypes"
                    v-bind:value="itemType.name">{{itemType.name}}</option>
          </select>
        </div>
        <div class="item__status">
          <span class="item__status__current">{{ genericItem.status.name }}</span>
          <span class="item__status__arrow"><i class="fa fa-arrow-right"/></span>
          <span class="item__status__new">{{ Status.STATUS_IN }}</span>
        </div>
      </div>
      <div class="box-content" v-if="isBox(genericItem)">
        <div class="box-content__dropzone">
          <h3 class="box-content__text">Innhold</h3>
          <div class="box-content__entry" v-for="boxItem in genericItem.items" v-bind:id="boxItem.id">
            <span>{{ boxItem.id }}</span>
            <span>
              <select v-model="boxItem.type.name">
                <option v-bind:value="Type.TYPE_UNKNOWN" disabled>Velg en varetype</option>
                <option v-for="itemType in $store.state.inStore.storedItemTypes"
                        v-bind:value="itemType.name">{{itemType.name}}</option>
              </select>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <button v-on:click="$router.push('/')">
      <i class="fa fa-4x fa-times-circle"/>
      <div>Avbryt</div>
    </button>
    <button v-on:click="navigateToApproval()">
      <i class="fa fa-4x fa-arrow-circle-right"/>
      <div>Neste</div>
    </button>
  </div>
</div>
</template>

<script>
import Type from '../../domain/Type';
import Status from '../../domain/Status';
import interact from 'interactjs';
import Vue from 'vue';
import Box from '../../domain/Box';
import Item from '../../domain/Item';

const draggableConfig = {
  onmove: (event) => {
    const target = event.target;
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.webkitTransform = 'translate(' + x + 'px, ' + y + 'px)';
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  },

  onend: (event) => {
    const target = event.target;

    target.style.webkitTransform =
    target.style.transform = '';

    target.removeAttribute('data-x');
    target.removeAttribute('data-y');
    Vue.$log.debug('Released draggable item', target);
  }
};

export default {
  created() {
    this.$store.dispatch('initialize');
    this.genericItems = this.$store.getters.newQRCodes.map((qrCode) => Item.fromQRCode(qrCode))
  },

  updated() {
    console.log(this.genericItems);
    if (this.genericItems.length > 0) {
      interact('.item-list__entry', {
        context: this.$el.querySelector('.item-list')
      }).draggable(draggableConfig);

      interact('.box-content__entry', {
        context: this.$el.querySelector('.box-content')
      }).draggable(draggableConfig);

      interact('.box-content__dropzone', {
        context: this.$el.querySelector('.item-list')
      }).dropzone({
        accept: [ '.item-list__entry', '.box-content__entry' ],
        ondrop: (event) => {
          const elDropzone = event.target;
          const elDropped = event.relatedTarget;
          const itemIdForDropzone = elDropzone.closest('.item-list__entry').getAttribute('id');
          const itemIdForDropped = elDropped.getAttribute('id');
          const itemForDropzone = this.genericItems.find((item) => item.id === itemIdForDropzone);
          const isItemDropzoneBox = this.isBox(itemForDropzone);
          const isDroppedRegularItem = elDropped.classList.contains('item-list__entry');
          const isDroppedBoxItem = elDropped.classList.contains('box-content__entry');

          if (isDroppedRegularItem) {
            const itemDropped = this.genericItems.find((item) => item.id === itemIdForDropped);
            const isItemDroppedBox = itemDropped.type === Type.TYPE_BOX;
            const canDrop = itemDropped && isItemDropzoneBox && !isItemDroppedBox && itemForDropzone !== itemDropped;

            this.$log.debug(`Dropped regular item ${itemIdForDropzone} onto ${itemIdForDropped}. Approved: ${canDrop}`);

            if (canDrop) {
              this.genericItems = this.genericItems.filter((item) => item.id !== itemIdForDropped);
              itemForDropzone.items.push(itemDropped);
            }
          } else if (isDroppedBoxItem) {
            const itemDropzoneOld = this.genericItems.find((item) => item.items.some((boxItem) => boxItem.id === itemIdForDropped));
            const itemDropped = itemDropzoneOld.items.find((boxItem) => boxItem.id === itemIdForDropped);
            const isItemDroppedBox = this.isBox(itemDropped);
            const canDrop = itemDropzoneOld && itemDropped && isItemDropzoneBox && !isItemDroppedBox && itemForDropzone !== itemDropped;

            this.$log.debug(`Dropped Box item ${itemIdForDropzone} onto ${itemIdForDropped}. Approved: ${canDrop}`);

            if (canDrop) {
              itemDropzoneOld.items = itemDropzoneOld.items.filter((boxItem) => boxItem.id !== itemIdForDropped);
              itemForDropzone.items.push(itemDropped);
            }
          } else {
            this.$log.debug('Unknown item was dropped', elDropped);
          }
        }
      });

      interact(this.$el.querySelector('.register-view__dropzone')).dropzone({
        accept: '.box-content__entry',
        ondrop: (event) => {
          const itemIdForDropped = event.relatedTarget.getAttribute('id');
          const itemDropzoneOld = this.genericItems.find((item) => item.items.some((boxItem) => boxItem.id === itemIdForDropped));
          const itemDropped = itemDropzoneOld.items.find((boxItem) => boxItem.id === itemIdForDropped);

          this.$log.debug(`Dropped box item outside. Approved: ${true}`, event.target);

          itemDropzoneOld.items = itemDropzoneOld.items.filter((boxItem) => boxItem.id !== itemIdForDropped);
          this.genericItems = this.genericItems.concat(itemDropped);
        }
      });
    }
  },

  data() {
    return {
      availableItemTypes: [],
      selectedItemType: '',
      genericItems: [],
      readStorageCodes: [],
      allStoredItems: [],
      Type,
      Status
    };
  },

  methods: {
    onRegularItemTypeChanged(event, genericItem) {
      const index = this.genericItems.indexOf(genericItem);

      if (event.target.value === Type.TYPE_BOX) {
        this.genericItems.splice(index, 1, Box.fromItem(this.genericItems[index]));
      } else {
        if (this.isBox(this.genericItem)) {
          this.genericItems.splice(index, 1, Item.fromBox(this.genericItems[index]));
        }

        this.genericItems.type = event.target.value;
      }
    },

    navigateToApproval() {
      this.$router.push({ path: '/inn/godkjenn', query: { items: JSON.stringify(this.genericItems.concat(this.allStoredItems))}});
    },

    isBox(genericItem) {
      return !(genericItem instanceof Item);
    }
  }
};
</script>

<style lang="scss">
.register-view {
  width: 100%;
  z-index: 1;
}

.register-view__dropzone {
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: -1;
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

.item {
  flex-grow: 0;
}

.item__status {
  white-space: nowrap;
}

.box-content {
}

.box-content__dropzone {
  border: 1px solid black;
  min-height: 30px;
}
</style>
