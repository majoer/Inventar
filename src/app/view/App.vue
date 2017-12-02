<template>
<router-view></router-view>
</template>

<script>
import VueRouter from 'vue-router';
import Tasks from './Tasks.vue';
import InStorageModeQR from './in/InStorageModeQR.vue';
import inReadQRCodes from './in/inReadQRCodes.vue';
import InRegisterNewItems from './in/InRegisterNewItems.vue';
import InApproveNewStorageStatus from './in/InApproveNewStorageStatus.vue';
import Out from './Out.vue';
import Report from './Report.vue';

const routes = [
  { path: '/', component: Tasks},
  { path: '/inn/lagringsmodus', component: InStorageModeQR},
  { path: '/inn/les-inn', component: inReadQRCodes},
  { path: '/inn/registrer', component: InRegisterNewItems},
  { path: '/inn/godkjenn', component: InApproveNewStorageStatus},
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
