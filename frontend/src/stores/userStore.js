import { defineStore } from "pinia";
import api from "../services/api";

const STORAGE_KEY = "careerbridge-user";

const demoSkills = [
  {
    _id: "skill-1",
    name: "Vue.js",
    level: "Intermediate",
  },
  {
    _id: "skill-2",
    name: "JavaScript",
    level: "Intermediate",
  },
  {
    _id: "skill-3",
    name: "Git & GitHub",
    level: "Basic",
  },
];

const demoProjects = [
  {
    _id: "project-1",
    title: "CareerBridge",
    github:
        "https://github.com/Raniaelsayed12/CareerBridge",
    description:
        "A platform for students to organize skills, projects and certificates.",
  },
];

const demoCertificates = [
  {
    _id: "certificate-1",
    name: "Vue Basics",
    provider: "University Project",
  },
];

function readStoredUser() {
  try {
    const storedUser =
        localStorage.getItem(STORAGE_KEY);

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error(
        "Could not read the stored user:",
        error
    );

    localStorage.removeItem(STORAGE_KEY);

    return null;
  }
}

export const useUserStore = defineStore("user", {
  state: () => {
    const storedUser = readStoredUser();

    return {
      _id: storedUser?._id || "",
      name: storedUser?.name || "",
      email: storedUser?.email || "",
      city: storedUser?.city || "",
      role: storedUser?.role || "",
      university: storedUser?.university || "",
      bio: storedUser?.bio || "",
      github: storedUser?.github || "",

      loggedIn: Boolean(storedUser),

      skills: [],
      projects: [],
      certificates: [],
    };
  },

  getters: {
    isAuthenticated: (state) => {
      return state.loggedIn;
    },

    displayName: (state) => {
      return state.name || "User";
    },

    initials: (state) => {
      if (!state.name) {
        return "U";
      }

      return state.name
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((word) =>
              word.charAt(0).toUpperCase()
          )
          .join("");
    },

    skillsCount: (state) => {
      return state.skills.length;
    },

    projectsCount: (state) => {
      return state.projects.length;
    },

    certificatesCount: (state) => {
      return state.certificates.length;
    },

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

      const completedFields =
          profileFields.filter(Boolean).length;

      const profileProgress = Math.round(
          (completedFields /
              profileFields.length) *
          40
      );

      const activityProgress =
          state.skills.length * 5 +
          state.projects.length * 10 +
          state.certificates.length * 8;

      return Math.min(
          profileProgress + activityProgress,
          100
      );
    },
  },

  actions: {
    applyUserData(userData) {
      this._id = userData?._id || "";
      this.name = userData?.name || "";
      this.email = userData?.email || "";
      this.city = userData?.city || "";
      this.role = userData?.role || "";
      this.university =
          userData?.university || "";
      this.bio = userData?.bio || "";
      this.github = userData?.github || "";
    },

    saveSession() {
      const userData = {
        _id: this._id,
        name: this.name,
        email: this.email,
        city: this.city,
        role: this.role,
        university: this.university,
        bio: this.bio,
        github: this.github,
      };

      localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(userData)
      );
    },

    login(userData) {
      this.applyUserData(userData);
      this.loggedIn = true;
      this.saveSession();
    },

    logout() {
      this._id = "";
      this.name = "";
      this.email = "";
      this.city = "";
      this.role = "";
      this.university = "";
      this.bio = "";
      this.github = "";

      this.loggedIn = false;

      this.skills = [];
      this.projects = [];
      this.certificates = [];

      localStorage.removeItem(STORAGE_KEY);
    },

    async updateProfile(profileData) {
      if (!this._id) {
        throw new Error(
            "User ID is missing. Please sign in again."
        );
      }

      const response = await api.put(
          `/users/${this._id}`,
          {
            name: profileData.name,
            email: profileData.email,
            city: profileData.city,
            role: profileData.role,
            university:
            profileData.university,
            github: profileData.github,
            bio: profileData.bio,
          }
      );

      this.applyUserData(response.data.user);
      this.loggedIn = true;
      this.saveSession();

      return response.data;
    },

    async loadStatistics() {
      try {
        const [
          skillsResponse,
          projectsResponse,
          certificatesResponse,
        ] = await Promise.all([
          api.get("/skills"),
          api.get("/projects"),
          api.get("/certificates"),
        ]);

        this.skills = Array.isArray(
            skillsResponse.data
        )
            ? skillsResponse.data
            : demoSkills;

        this.projects = Array.isArray(
            projectsResponse.data
        )
            ? projectsResponse.data
            : demoProjects;

        this.certificates = Array.isArray(
            certificatesResponse.data
        )
            ? certificatesResponse.data
            : demoCertificates;
      } catch (error) {
        console.error(
            "Could not load dashboard statistics:",
            error
        );

        this.skills = demoSkills;
        this.projects = demoProjects;
        this.certificates =
            demoCertificates;
      }
    },
  },
});