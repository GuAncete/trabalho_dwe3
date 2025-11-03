import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; 

import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Dashboard from '@/views/Dashboard.vue';
import ClientesList from '@/views/ClientesList.vue';
import ClienteDetalhes from '@/views/ClienteDetalhes.vue';
import Profile from '@/views/Profile.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }, 
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }, 
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }, 
  },
  {
    path: '/clientes',
    name: 'Clientes',
    component: ClientesList,
    meta: { requiresAuth: true }, 
  },
  {
    path: '/clientes/:id', 
    name: 'ClienteDetalhes',
    component: ClienteDetalhes,
    props: true, 
    meta: { requiresAuth: true }, 
  },
  {
    path: '/profile', 
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  
  { 
    path: '/:pathMatch(.*)*', 
    redirect: '/login' 
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});


router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && !isAuthenticated) {
    
    next('/login');
  } else if (!requiresAuth && isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    
    next('/');
  } else {

    next();
  }
});

export default router;