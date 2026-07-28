import { defineStore } from "pinia";

const USER_STORAGE_KEY = "careerbridgeUser";
const EMAIL_STORAGE_KEY = "activeUserEmail";

function loadSavedUser() {
  try {
    const savedUser = sessionStorage.getItem(USER_STORAGE_KEY);

    if (!savedUser) {
      return null;
    }

    return JSON.parse(savedUser);
  } catch (error) {
    console.error(
      "Erreur lors du chargement de l'utilisateur :",
      error
    );

    sessionStorage.removeItem(USER_STORAGE_KEY);
    sessionStorage.removeItem(EMAIL_STORAGE_KEY);

    return null;
  }
}

export const useUserStore = defineStore("user", {
  state: () => ({
    user: loadSavedUser(),
  }),

  getters: {
    isLoggedIn: (state) => Boolean(state.user),

    isAdmin: (state) => state.user?.role === "admin",
  },

  actions: {
    setUser(user) {
      if (!user || typeof user !== "object") {
        console.error("Données utilisateur invalides :", user);
        return false;
      }

      if (!user.email) {
        console.error(
          "L'adresse e-mail de l'utilisateur est manquante :",
          user
        );
        return false;
      }

      this.user = user;

      sessionStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(user)
      );

      sessionStorage.setItem(
        EMAIL_STORAGE_KEY,
        user.email
      );

      // Suppression d'une éventuelle ancienne sauvegarde
      localStorage.removeItem(USER_STORAGE_KEY);

      return true;
    },

    /*
     * Cette action corrige l'erreur :
     * userStore.login is not a function
     *
     * Elle utilise simplement setUser().
     */
    login(user) {
      return this.setUser(user);
    },

    async loadStatistics() {
      // Statistics are loaded directly in the dashboard/admin pages.
      // This function exists so Login/Register can call it safely.
      return null;
    },

    logout() {
      this.user = null;

      sessionStorage.removeItem(USER_STORAGE_KEY);
      sessionStorage.removeItem(EMAIL_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    },
  },
});