import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    name: "Sara Ahmed",
    email: "sara@gmail.com",
    city: "Cairo, Egypt",
    role: "Frontend Developer",

    loggedIn: true,

    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "Vue.js",
      "Git",
      "Node.js",
      "Express.js",
      "MongoDB",
    ],

    projects: [
      {
        title: "Portfolio Website",
        description: "Personal portfolio built with Vue.js",
      },
    ],

    certificates: [
      {
        name: "Frontend Development",
        provider: "Coursera",
      },
    ],
  }),

  getters: {
    skillsCount: (state) => state.skills.length,

    projectsCount: (state) => state.projects.length,

    certificatesCount: (state) => state.certificates.length,

    progress: (state) => {
      let progress =
        state.skills.length * 3 +
        state.projects.length * 8 +
        state.certificates.length * 4;

      return Math.min(progress, 100);
    },
  },

  actions: {
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

    addSkill(skill) {
      this.skills.push(skill);
    },

    deleteSkill(index) {
      this.skills.splice(index, 1);
    },

    addProject(project) {
      this.projects.push(project);
    },

    deleteProject(index) {
      this.projects.splice(index, 1);
    },

    addCertificate(certificate) {
      this.certificates.push(certificate);
    },

    deleteCertificate(index) {
      this.certificates.splice(index, 1);
    },
  },
});