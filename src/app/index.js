import '../../node_modules/font-awesome/scss/font-awesome.scss';
import './styles/main.scss';
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueLogger from 'vuejs-logger';
import App from './view/App.vue';
import Store from './store/store';

const loggerOptions = {
  logLevel: 'debug',
  stringifyArguments: false,
  showLogLevel: false,
  showMethodName: true,
  separator: '|',
  showConsoleColors: true
};

Vue.use(VueLogger, loggerOptions);
Vue.use(VueRouter);


new Vue({
  el: '#app',
  store: Store,
  render (h) {
    return h(App);
  }
});
