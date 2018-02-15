import Vue from 'vue';
import Vuex from 'vuex';
import inStore from './in.store';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    inStore
  }
});
