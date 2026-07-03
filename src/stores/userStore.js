import { defineStore } from "pinia";
import api from "../services/api";

export const useUserStore = defineStore("user", {
  state: () => ({
    name: "Rania Abdelaal",
    email: "raniaqwertyuio@gmail.com",
    city: "Cairo, Egypt",
    role: "Frontend Developer",

    loggedIn: true,

    skills: [],
    projects: [],
    certificates: [],
  }),

  getters: {
    skillsCount: (state) => state.skills.length,

    projectsCount: (state) => state.projects.length,

    certificatesCount: (state) => state.certificates.length,

    progress: (state) => {
      const progress =
        state.skills.length * 3 +
        state.projects.length * 8 +
        state.certificates.length * 4;

      return Math.min(progress, 100);
    },
  },

  actions: {
    async loadStatistics() {
      try {
        const skills = await api.get("/skills");
        const projects = await api.get("/projects");
        const certificates = await api.get("/certificates");

        this.skills = skills.data;
        this.projects = projects.data;
        this.certificates = certificates.data;
      } catch (error) {
        console.error("Error loading statistics:", error);
      }
    },

    login() {
      this.loggedIn = true;
    },

    logout() {
      this.loggedIn = false;
    },

    updateProfile(name, email, city, role) {
      this.name = name;
      this.email = email;
      this.city = city;
      this.role = role;
    },
  },
});