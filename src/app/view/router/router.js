import Vue from 'vue';
import VueRouter from 'vue-router';
import Tasks from '../Tasks.vue';
import In from '../In.vue';
import Out from '../Out.vue';
import Report from '../Report.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Tasks},
  { path: '/inn', component: In},
  { path: '/ut', component: Out},
  { path: '/rapport', component: Report}
];

const router = new VueRouter({
  routes
});

export default router;
