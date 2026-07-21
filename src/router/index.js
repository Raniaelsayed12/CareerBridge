import { createRouter, createWebHistory } from "vue-router";
import Resume from "../views/Resume.vue";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Dashboard from "../views/Dashboard.vue";
import Profile from "../views/Profile.vue";
import Skills from "../views/Skills.vue";
import Projects from "../views/Projects.vue";
import Certificates from "../views/Certificates.vue";
import About from "../views/About.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/dashboard", component: Dashboard },
  { path: "/profile", component: Profile },
  { path: "/skills", component: Skills },
  { path: "/projects", component: Projects },
  { path: "/certificates", component: Certificates },
  { path: "/about", component: About },
  {
  path: "/resume",
  component: Resume,
},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;