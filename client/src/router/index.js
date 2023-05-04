import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '@/views/Login.vue';
import App from '@/views/App.vue';
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'App',
    component: App,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

// get nicht 

// const user = JSON.parse(localStorage.getItem('user'));

// router.beforeEach((to, from, next) => {
//   if (user) {
//     if (to.path == '/') {
//       return next();
//     }
//   } else if (to.path != '/login') return next();
// });

// function isAuthenticated() {
//   if (Vue.$cookies.get('sid')) return true;
//   else return false;
// }

export default router;
