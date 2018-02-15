import Status from '../domain/Status';
import Box from '../domain/Box';
import Item from '../domain/Item';
import Type from '../domain/Type';

export default {
  state: {
    storedBoxes: [],
    storedItems: [],
    storedItemTypes: [],
    scannedQRCodes: ['0001', '0004', '0005', '0006'],
    newBoxes: [],
    newItems: []
  },

  getters: {
    newQRCodes(state) {
      return state.scannedQRCodes
        .filter((qrCode) => !state.storedBoxes.map((box) => box.id).includes(qrCode))
        .filter((qrCode) => !state.storedItems.map((item) => item.id).includes(qrCode));
    }
  },

  mutations: {
    setScannedQRCodes(state, scannedQRCodes) {
      state.scannedQRCodes = scannedQRCodes;
    },

    setStoredBoxes(state, itemTypes) {
      state.storedItems = itemTypes;
    },

    setStoredItems(state, itemTypes) {
      state.storedBoxes = itemTypes;
    },

    setStoredItemTypes(state, itemTypes) {
      state.storedItemTypes = itemTypes;
    },

    convertBoxToItem(state, box) {

    },

    convertItemToBox(state, item) {

    }
  },

  actions: {
    initialize({ commit }) {
      commit('setStoredBoxes', [new Box('0001', Status.STATUS_IN, 'Min bruseske')]);
      commit('setStoredItems', [new Item('0002', new Type('Brus'), Status.STATUS_IN, '0001', 'Mats sin brusboks'), new Item('0003', new Type('Brus'), Status.STATUS_OUT, undefined, 'Stian sin brusboks')]);
      commit('setStoredItemTypes', [new Type('Brus'), new Type('Kjeks')]);
    },

    scanItems({ commit }, scannedQRCodes) {
      commit('setScannedQRCodes', scannedQRCodes);
    }
  }
};
