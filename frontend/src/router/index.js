import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Importa a store

// Importação das Views
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
    meta: { requiresAuth: false }, // Não requer autenticação
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }, // Não requer autenticação
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }, // Requer autenticação
  },
  {
    path: '/clientes',
    name: 'Clientes',
    component: ClientesList,
    meta: { requiresAuth: true }, // Requer autenticação
  },
  {
    path: '/clientes/:id', // Rota dinâmica para detalhes do cliente
    name: 'ClienteDetalhes',
    component: ClienteDetalhes,
    props: true, // Passa o :id como prop para o componente
    meta: { requiresAuth: true }, // Requer autenticação
  },
  {
    path: '/profile', // <-- ADICIONE ESTE BLOCO
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  // Redireciona para o login se a rota não for encontrada
  { 
    path: '/:pathMatch(.*)*', 
    redirect: '/login' 
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// --- Navigation Guard (Guarda de Rota) ---
// Isso é executado ANTES de carregar qualquer rota
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && !isAuthenticated) {
    // Se a rota requer login E o usuário NÃO está logado,
    // redireciona para /login
    next('/login');
  } else if (!requiresAuth && isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    // Se a rota NÃO requer login (ex: /login) E o usuário JÁ está logado,
    // redireciona para o Dashboard
    next('/');
  } else {
    // Em todos os outros casos, permite o acesso
    next();
  }
});

export default router;