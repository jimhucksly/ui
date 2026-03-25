import { createRouter, createWebHistory } from 'vue-router';
import Demo from '@/pages/demo.vue';
import Home from '@/pages/home.vue';

const routes = [
  {
    path: '/',
    name: 'default',
    component: Home,
  },
  {
    path: '/demo',
    name: 'demo',
    component: Demo,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
