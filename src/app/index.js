import '../../node_modules/font-awesome/scss/font-awesome.scss';
import Vue from 'vue';
import App from './view/App.vue';

const app = new Vue({
  el: '#app',
  render (h) {
    return h(App);
  }
});
