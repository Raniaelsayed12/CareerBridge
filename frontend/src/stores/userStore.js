import { defineStore } from "pinia";

function loadSavedUser() {
  try {
    const saved = sessionStorage.getItem("careerbridgeUser");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export const useUserStore = defineStore("user", {
  state: () => ({
    user: loadSavedUser(),
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === "admin",
  },

  actions: {
    setUser(user) {
      this.user = user;
      sessionStorage.setItem("careerbridgeUser", JSON.stringify(user));
      localStorage.removeItem("careerbridgeUser");
    },

    logout() {
      this.user = null;
      sessionStorage.removeItem("careerbridgeUser");
      localStorage.removeItem("careerbridgeUser");
    },
  },
});
