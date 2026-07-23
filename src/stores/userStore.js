import { defineStore } from "pinia";
import api from "../services/api";

const demoSkills = [
  { _id: "skill-1", name: "Vue.js", level: "Intermediate" },
  { _id: "skill-2", name: "JavaScript", level: "Intermediate" },
  { _id: "skill-3", name: "Git & GitHub", level: "Basic" },
  { _id: "skill-4", name: "HTML/CSS", level: "Intermediate" },
  { _id: "skill-5", name: "MongoDB", level: "Basic" },
];

const demoProjects = [
  {
    _id: "project-1",
    name: "CareerBridge",
    github: "https://github.com/Raniaelsayed12/CareerBridge",
    description:
      "A platform for students to organize skills, projects and certificates.",
  },
  {
    _id: "project-2",
    name: "Portfolio Website",
    github: "https://github.com/haniaalo",
    description: "A personal portfolio to present projects and skills.",
  },
];

const demoCertificates = [
  { _id: "cert-1", name: "GitHub Introduction", provider: "GitHub Skills" },
  { _id: "cert-2", name: "Vue Basics", provider: "University Project" },
];

const demoTeamMembers = [
  {
    name: "Rania Abdelaal",
    role: "Frontend Developer",
    contribution:
      "Started the CareerBridge project and implemented the first UI pages.",
  },
  {
    name: "Hania Alilat",
    role: "Master Informatik Student",
    contribution:
      "Improved the user store, added demo data and dashboard statistics.",
  },
  {
    name: "Aly Elatrby",
    role: "Team Member",
    contribution: "Supported project planning and development.",
  },
];

export const useUserStore = defineStore("user", {
  state: () => ({
    name: "Hania Alilat",
    email: "hania.alilat@studmail.w-hs.de",
    city: "Bochum / Gelsenkirchen, Germany",
    role: "Master Informatik Student",
    university: "Westfälische Hochschule",
    bio: "Master student working on CareerBridge with Vue, Vite, Pinia and GitHub.",
    github: "https://github.com/haniaalo",

    loggedIn: true,

    skills: demoSkills,
    projects: demoProjects,
    certificates: demoCertificates,
    teamMembers: demoTeamMembers,
  }),

  getters: {
    skillsCount: (state) => state.skills.length,
    projectsCount: (state) => state.projects.length,
    certificatesCount: (state) => state.certificates.length,

    progress: (state) => {
      const profileFields = [
        state.name,
        state.email,
        state.city,
        state.role,
        state.university,
        state.bio,
        state.github,
      ];

      const completedFields = profileFields.filter(Boolean).length;
      const profileProgress = Math.round(
        (completedFields / profileFields.length) * 40
      );

      const activityProgress =
        state.skills.length * 5 +
        state.projects.length * 10 +
        state.certificates.length * 8;

      return Math.min(profileProgress + activityProgress, 100);
    },
  },

  actions: {
    async loadStatistics() {
      try {
        const skills = await api.get("/skills");
        const projects = await api.get("/projects");
        const certificates = await api.get("/certificates");

        this.skills =
          Array.isArray(skills.data) && skills.data.length > 0
            ? skills.data
            : demoSkills;

        this.projects =
          Array.isArray(projects.data) && projects.data.length > 0
            ? projects.data
            : demoProjects;

        this.certificates =
          Array.isArray(certificates.data) && certificates.data.length > 0
            ? certificates.data
            : demoCertificates;
      } catch (error) {
        console.error("Error loading statistics, using demo data:", error);

        this.skills = demoSkills;
        this.projects = demoProjects;
        this.certificates = demoCertificates;
      }
    },

    login() {
      this.loggedIn = false;
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