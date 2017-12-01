<template>
<router-view></router-view>
</template>

<script>
import VueRouter from 'vue-router';
import Tasks from './Tasks.vue';
import InScan from './InScan.vue';
import InDeliver from './InDeliver.vue';
import InApprove from './InApprove.vue';
import Out from './Out.vue';
import Report from './Report.vue';

const routes = [
  { path: '/', component: Tasks},
  { path: '/inn/scan', component: InScan},
  { path: '/inn/lever', component: InDeliver},
  { path: '/inn/godkjenn', component: InApprove},
  { path: '/ut', component: Out},
  { path: '/rapport', component: Report}
];

const router = new VueRouter({
  routes
});

export default {
  router
};
</script>

<style scoped lang="scss">

</style>
