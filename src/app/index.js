import '../../node_modules/font-awesome/scss/font-awesome.scss';
import './styles/main.scss';
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './view/App.vue';
import VueLogger from 'vuejs-logger';

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
  render (h) {
    return h(App);
  }
});
