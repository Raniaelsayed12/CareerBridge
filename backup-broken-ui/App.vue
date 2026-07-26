<template>
  <div class="app-shell">
    <header class="navbar">
      <RouterLink to="/" class="brand">
        CareerBridge
      </RouterLink>

      <nav class="nav-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>

        <template v-if="isLoggedIn">
          <RouterLink to="/dashboard">Dashboard</RouterLink>
          <RouterLink to="/skills">Skills</RouterLink>
          <RouterLink to="/projects">Projects</RouterLink>
          <RouterLink to="/certificates">Certificates</RouterLink>
          <RouterLink to="/resume">Resume</RouterLink>
          <RouterLink to="/docs">Docs</RouterLink>
          <RouterLink to="/profile">Profile</RouterLink>
          <RouterLink v-if="isAdmin" to="/admin">Admin</RouterLink>

          <div class="user-badge">
            <strong>{{ currentUserName }}</strong>
            <span>{{ currentUserEmail }}</span>
          </div>

          <button class="logout-btn" @click="logout">
            Logout
          </button>
        </template>

        <template v-else>
          <RouterLink to="/login" class="login-link">Sign in</RouterLink>
          <RouterLink to="/register" class="register-link">Create account</RouterLink>
        </template>
      </nav>
    </header>

    <RouterView />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { useUserStore } from "./stores/userStore";

const userStore = useUserStore();

const isLoggedIn = computed(() => !!userStore.user);
const isAdmin = computed(() => userStore.user?.role === "admin");

const currentUserName = computed(() => {
  return (
    userStore.user?.name ||
    userStore.user?.fullName ||
    userStore.user?.email ||
    "User"
  );
});

const currentUserEmail = computed(() => {
  return userStore.user?.email || "";
});

function logout() {
  userStore.logout();
  window.location.href = "/login";
}
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #f4f7fb;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  min-height: 92px;
  padding: 0.75rem 5.5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.2rem;
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
  backdrop-filter: blur(14px);
}

.brand {
  font-size: 1.85rem;
  font-weight: 950;
  color: #2563eb;
  text-decoration: none;
  letter-spacing: -0.03em;
  white-space: nowrap;
}

.nav-links {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.35rem;
  flex-wrap: nowrap;
}

.nav-links a {
  color: #0f172a;
  text-decoration: none;
  font-weight: 850;
  font-size: 1.05rem;
  padding: 0.7rem 0.85rem;
  border-radius: 14px;
  transition: 0.2s ease;
  white-space: nowrap;
}

.nav-links a:hover {
  background: #eff6ff;
  color: #1d4ed8;
}

.nav-links a.router-link-active {
  background: #dbe4ff;
  color: #1d4ed8;
  box-shadow: inset 0 0 0 1px #c7d2fe;
}

.login-link {
  background: #eff6ff;
  color: #1d4ed8 !important;
}

.register-link {
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: white !important;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.22);
}

.user-badge {
  max-width: 185px;
  padding: 0.5rem 0.75rem;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #dbe3ef;
  line-height: 1.15;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
}

.user-badge strong {
  display: block;
  color: #0f172a;
  font-size: 0.95rem;
  font-weight: 950;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-badge span {
  display: block;
  color: #64748b;
  font-size: 0.8rem;
  margin-top: 0.15rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  border: none;
  border-radius: 14px;
  padding: 0.8rem 1.1rem;
  background: #fee2e2;
  color: #991b1b;
  font-weight: 950;
  cursor: pointer;
  white-space: nowrap;
  transition: 0.2s ease;
}

.logout-btn:hover {
  background: #fecaca;
}

@media (max-width: 1150px) {
  .navbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .nav-links {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
</style>
