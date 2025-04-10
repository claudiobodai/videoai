import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import ImagesView from "../views/ImagesView.vue";
import VideosView from "../views/VideosView.vue";
import ApiStatus from "../views/ApiStatus.vue";
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/images",
    name: "Images",
    component: ImagesView,
    meta: { requiresAuth: true }
  },
  {
    path: "/videos",
    name: "Videos",
    component: VideosView,
    meta: { requiresAuth: true }
  },
  {
    path: "/api-status",
    name: "ApiStatus",
    component: ApiStatus,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard: controlla lo stato di autenticazione tramite Pinia
router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/"];
  const authRequired = !publicPages.includes(to.path);

  // Accedi allo store per verificare se l'utente è autenticato
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  if (authRequired && !isAuthenticated) {
    return next("/login");
  }
  next();
});

export default router;