import Vue from 'vue';
import Router from 'vue-router';
import Srv from '@/components/server/Server.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Server',
      component: Srv
    }
  ]
});
