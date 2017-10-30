import Vue from 'vue';
import Router from 'vue-router';
import Srv from '@/components/server/Server.vue';
import Cli from '@/components/client/Client.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/server',
      name: 'Server',
      component: Srv
    },
    {
      path: '/',
      name: 'Client',
      component: Cli
    }
  ]
});
