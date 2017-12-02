<template>
<div class="approval-view">
  <div class="approval-view__dropzone"></div>
  <h1>Opprett nye varer</h1>
  <div class="item-list">
    <div class="item-list__entry" v-for="item in newItems" v-bind:id="item.id">
      <div class="item">
        <div class="item__id">{{ item.id }}</div>
        <div class="item__name">
          <select v-model="item.type">
            <option disabled value="">Velg en varetype</option>
            <option>Eske</option>
            <option v-for="itemType in availableItemTypes">{{itemType}}</option>
          </select>
        </div>
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
</div>
</template>

<script>
import sheetService from '../../service/sheet.service';
import interact from 'interactjs';
import Vue from 'vue';

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
    this.readStorageCodes = this.$route.query.storageCodes.split(',');
    sheetService.read((allStoredItems) => {
      this.allStoredItems = allStoredItems;
      this.newItems = this.readStorageCodes.filter((code) => !this.allStoredItems.map((item) => item.id).includes(code))
        .map((code) => {
          return {
            id: code,
            type: '',
            status: 'Ny',
            boxContent: []
          };
        });
    });
  },

  updated() {
    if (this.newItems.length > 0) {
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
          const itemForDropzone = this.newItems.find((item) => item.id === itemIdForDropzone);
          const isItemDropzoneBox = itemForDropzone.type === 'Eske';
          const isDroppedRegularItem = elDropped.classList.contains('item-list__entry');
          const isDroppedBoxItem = elDropped.classList.contains('box-content__entry');


          if (isDroppedRegularItem) {
            const itemDropped = this.newItems.find((item) => item.id === itemIdForDropped);
            const isItemDroppedBox = itemDropped.type === 'Eske';
            const canDrop = itemDropped && isItemDropzoneBox && !isItemDroppedBox && itemForDropzone !== itemDropped;

            this.$log.debug(`Dropped regular item ${itemIdForDropzone} onto ${itemIdForDropped}. Approved: ${canDrop}`);

            if (canDrop) {
              this.newItems = this.newItems.filter((item) => item.id !== itemIdForDropped);
              itemForDropzone.boxContent.push(itemDropped);
            }
          } else if (isDroppedBoxItem) {
            const itemDropzoneOld = this.newItems.find((item) => item.boxContent.some((boxItem) => boxItem.id === itemIdForDropped));
            const itemDropped = itemDropzoneOld.boxContent.find((boxItem) => boxItem.id === itemIdForDropped);
            const isItemDroppedBox = itemDropped.type === 'Eske';
            const canDrop = itemDropzoneOld && itemDropped && isItemDropzoneBox && !isItemDroppedBox && itemForDropzone !== itemDropped;

            this.$log.debug(`Dropped Box item ${itemIdForDropzone} onto ${itemIdForDropped}. Approved: ${canDrop}`);

            if (canDrop) {
              itemDropzoneOld.boxContent = itemDropzoneOld.boxContent.filter((boxItem) => boxItem.id !== itemIdForDropped);
              itemForDropzone.boxContent.push(itemDropped);
            }
          } else {
            this.$log.debug('Unknown item was dropped', elDropped);
          }
        }
      });

      interact(this.$el.querySelector('.approval-view__dropzone')).dropzone({
        accept: '.box-content__entry',
        ondrop: (event) => {
          const itemIdForDropped = event.relatedTarget.getAttribute('id');
          const itemDropzoneOld = this.newItems.find((item) => item.boxContent.some((boxItem) => boxItem.id === itemIdForDropped));
          const itemDropped = itemDropzoneOld.boxContent.find((boxItem) => boxItem.id === itemIdForDropped);

          this.$log.debug(`Dropped box item outside. Approved: ${true}`, event.target);

          itemDropzoneOld.boxContent = itemDropzoneOld.boxContent.filter((boxItem) => boxItem.id !== itemIdForDropped);
          this.newItems = this.newItems.concat(itemDropped);
        }
      });
    }
  },

  data() {
    return {
      availableItemTypes: [ 'Ostehøvel', 'Sko', 'Hamburger' ],
      selectedItemType: '',
      readStorageCodes: [],
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
  z-index: 1;
}

.approval-view__dropzone {
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
