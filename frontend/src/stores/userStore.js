import { defineStore } from "pinia";

function loadSessionUser() {
  try {
    return JSON.parse(sessionStorage.getItem("careerbridgeUser")) || null;
  } catch {
    return null;
  }
}

const savedUser = loadSessionUser();

export const useUserStore = defineStore("user", {
  state: () => ({
    loggedIn: !!savedUser,

    name: savedUser?.name || "",
    email: savedUser?.email || "",
    role: savedUser?.role || "",
    city: savedUser?.city || "",
    professionalRole: savedUser?.professionalRole || "",
    university: savedUser?.university || "",
    bio: savedUser?.bio || "",
    github: savedUser?.github || "",

    skills: [],
    projects: [],
    certificates: [],
  }),

  getters: {
    isAdmin: (state) => state.role === "admin",
    isUser: (state) => state.role === "user",
  },

  actions: {
    setUser(user) {
      this.loggedIn = true;
      this.name = user.name || "";
      this.email = user.email || "";
      this.role = user.role || "";
      this.city = user.city || "";
      this.professionalRole = user.professionalRole || "";
      this.university = user.university || "";
      this.bio = user.bio || "";
      this.github = user.github || "";

      sessionStorage.setItem("careerbridgeUser", JSON.stringify(user));
    },

    logout() {
      this.loggedIn = false;
      this.name = "";
      this.email = "";
      this.role = "";
      this.city = "";
      this.professionalRole = "";
      this.university = "";
      this.bio = "";
      this.github = "";
      this.skills = [];
      this.projects = [];
      this.certificates = [];

      sessionStorage.removeItem("careerbridgeUser");
      localStorage.removeItem("careerbridgeUser");
    },
  },
});
