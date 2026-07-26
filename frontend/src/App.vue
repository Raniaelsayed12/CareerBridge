<template>
  <div class="app-shell">
    <header class="navbar">
      <RouterLink to="/" class="brand">CareerBridge</RouterLink>

      <nav class="nav-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>

        <template v-if="userStore.isLoggedIn">
          <RouterLink to="/dashboard">Dashboard</RouterLink>
          <RouterLink to="/skills">Skills</RouterLink>
          <RouterLink to="/projects">Projects</RouterLink>
          <RouterLink to="/certificates">Certificates</RouterLink>
          <RouterLink to="/resume">Resume</RouterLink>
          <RouterLink to="/docs">Docs</RouterLink>
          <RouterLink to="/profile">Profile</RouterLink>
          <RouterLink v-if="userStore.isAdmin" to="/admin">Admin</RouterLink>

          <div class="user-badge">
            <strong>{{ userStore.user?.name || "User" }}</strong>
            <span>{{ userStore.user?.email }}</span>
          </div>

          <button class="logout-btn" type="button" @click="logout">Logout</button>
        </template>

        <template v-else>
          <RouterLink to="/login">Sign in</RouterLink>
          <RouterLink to="/register" class="create-link">Create account</RouterLink>
        </template>
      </nav>
    </header>

    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from "vue-router";
import { useUserStore } from "./stores/userStore";

const router = useRouter();
const userStore = useUserStore();

function logout() {
  userStore.logout();
  router.push("/login");
}
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #f5f7fb;
}

.navbar {
  width: 100%;
  min-height: 76px;
  padding: 0.75rem 5%;
  background: #ffffff;
  border-bottom: 1px solid #dbe3ef;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand {
  color: #2563eb;
  font-size: 1.85rem;
  font-weight: 950;
  text-decoration: none;
  white-space: nowrap;
}

.nav-links {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.42rem;
  flex-wrap: nowrap;
}

.nav-links a {
  min-height: 40px;
  padding: 0.55rem 0.72rem;
  border-radius: 13px;
  color: #0f172a;
  font-size: 0.92rem;
  font-weight: 800;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

.nav-links a.router-link-active {
  background: #dbeafe;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.create-link {
  background: #2563eb;
  color: #ffffff !important;
}

.user-badge {
  max-width: 155px;
  min-height: 48px;
  padding: 0.55rem 0.8rem;
  border-radius: 16px;
  background: #f8fbff;
  border: 1px solid #dbe3ef;
  overflow: hidden;
  flex-shrink: 0;
}

.user-badge strong {
  display: block;
  font-size: 0.9rem;
  line-height: 1.1;
}

.user-badge span {
  display: block;
  margin-top: 3px;
  font-size: 0.72rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  min-height: 46px;
  padding: 0.65rem 0.95rem;
  border-radius: 15px;
  background: #fee2e2;
  color: #991b1b;
  border: none;
  font-weight: 900;
  cursor: pointer;
  white-space: nowrap;
}

@media (max-width: 1100px) {
  .navbar {
    flex-wrap: wrap;
    padding: 0.75rem 3%;
  }

  .nav-links {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
</style>
