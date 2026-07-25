import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/userStore";

import Home from "../views/Home.vue";
import Dashboard from "../views/Dashboard.vue";
import Skills from "../views/Skills.vue";
import Projects from "../views/Projects.vue";
import Certificates from "../views/Certificates.vue";
import Resume from "../views/Resume.vue";
import Profile from "../views/Profile.vue";
import About from "../views/About.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Admin from "../views/Admin.vue";
import Docs from "../views/Docs.vue";

const routes = [
  { path: "/", name: "Home", component: Home, meta: { public: true } },
  { path: "/about", name: "About", component: About, meta: { public: true } },
  { path: "/login", name: "Login", component: Login, meta: { public: true } },
  { path: "/register", name: "Register", component: Register, meta: { public: true } },

  { path: "/dashboard", name: "Dashboard", component: Dashboard, meta: { requiresAuth: true } },
  { path: "/skills", name: "Skills", component: Skills, meta: { requiresAuth: true } },
  { path: "/projects", name: "Projects", component: Projects, meta: { requiresAuth: true } },
  { path: "/certificates", name: "Certificates", component: Certificates, meta: { requiresAuth: true } },
  { path: "/resume", name: "Resume", component: Resume, meta: { requiresAuth: true } },
  { path: "/profile", name: "Profile", component: Profile, meta: { requiresAuth: true } },
  { path: "/docs", name: "Docs", component: Docs, meta: { requiresAuth: true } },

  { path: "/admin", name: "Admin", component: Admin, meta: { requiresAuth: true, requiresAdmin: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.loggedIn) {
    return "/login";
  }

  if (to.meta.requiresAdmin && userStore.role !== "admin") {
    return "/dashboard";
  }

  if ((to.path === "/login" || to.path === "/register") && userStore.loggedIn) {
    return "/";
  }

  return true;
});

export default router;
