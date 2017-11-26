import '../../node_modules/font-awesome/scss/font-awesome.scss';
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './view/App.vue';

Vue.use(VueRouter);

const app = new Vue({
  el: '#app',
  render (h) {
    return h(App);
  }
});
