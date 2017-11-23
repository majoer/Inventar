import Vue from 'vue';
import App from './view/App.vue';

const app = new Vue({
  el: '#app',
  render (h) {
    return h(App);
  }
});
