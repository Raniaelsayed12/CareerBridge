import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Dashboard from "../views/Dashboard.vue";
import Profile from "../views/Profile.vue";
import Skills from "../views/Skills.vue";
import Projects from "../views/Projects.vue";
import Certificates from "../views/Certificates.vue";
import About from "../views/About.vue";
import Resume from "../views/Resume.vue";
import Admin from "../views/Admin.vue";

const routes = [
  { path: "/admin", name: "Admin", component: Admin },
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { guestOnly: true },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: { guestOnly: true },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/skills",
    name: "skills",
    component: Skills,
    meta: { requiresAuth: true },
  },
  {
    path: "/projects",
    name: "projects",
    component: Projects,
    meta: { requiresAuth: true },
  },
  {
    path: "/certificates",
    name: "certificates",
    component: Certificates,
    meta: { requiresAuth: true },
  },
  {
    path: "/resume",
    name: "resume",
    component: Resume,
    meta: { requiresAuth: true },
  },
  {
    path: "/about",
    name: "about",
    component: About,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,

  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  const savedUser = localStorage.getItem("careerbridge-user");
  const isAuthenticated = Boolean(savedUser);

  if (to.meta.requiresAuth && !isAuthenticated) {
    return {
      name: "login",
      query: {
        redirect: to.fullPath,
      },
    };
  }

  if (to.meta.guestOnly && isAuthenticated) {
    return {
      name: "dashboard",
    };
  }

  return true;
});

export default router;
