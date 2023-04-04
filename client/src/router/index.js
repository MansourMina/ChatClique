import Vue from 'vue';
import VueRouter from 'vue-router';
import ChatView from '../views/ChatView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: ChatView,
    params: true,
  },
  // {
  //   path: '/user/:username',
  //   name: 'User',
  //   component: ChatView,
  // },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
