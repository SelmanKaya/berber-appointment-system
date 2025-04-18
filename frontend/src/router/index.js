import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue"; // Göreli yol, doğru klasörü kontrol et
import Register from "../components/Register.vue"; // Göreli yol, doğru klasörü kontrol et
import HairStyles from "../views/HairStyles.vue";

const routes = [
  {
    path: "/",
    redirect: "/hair",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: "/hair",
    name: "HairStyles",
    component: HairStyles,
    meta: { requiresAuth: true }
  },
  {
    path: "/beard",
    name: "BeardStyles",
    component: () => import("../views/BeardStyles.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/skincare",
    name: "SkinCare",
    component: () => import("../views/SkinCare.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/massage",
    name: "Massage",
    component: () => import("../views/Massage.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/summary",
    name: "Summary",
    component: () => import("../views/Summary.vue"),
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login if trying to access protected route while not authenticated
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    // Redirect to hair page if already logged in and trying to access login
    next('/hair');
  } else {
    next();
  }
});

export default router;