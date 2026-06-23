<script setup>
import { useUserStore } from "../../stores/userStore";

const user = useUserStore();
</script>

<template>
  <nav class="navbar">
    <h2>CareerBridge</h2>

    <div class="links">
      <router-link to="/">Home</router-link>

      <router-link to="/dashboard">
        Dashboard
      </router-link>

      <router-link to="/skills">
        Skills
      </router-link>

      <router-link to="/projects">
        Projects
      </router-link>

      <router-link to="/certificates">
        Certificates
      </router-link>

      <router-link to="/profile">
        Profile
      </router-link>

      <router-link to="/about">
        About
      </router-link>

      <router-link
        v-if="!user.loggedIn"
        to="/login"
      >
        Login
      </router-link>

      <router-link
        v-if="!user.loggedIn"
        to="/register"
      >
        Register
      </router-link>

      <div
        v-if="user.loggedIn"
        class="user-section"
      >
        <span class="username">
          👤 {{ user.name }}
        </span>

        <button
          class="logout-btn"
          @click="user.logout()"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<style>
.navbar {
  background: #1e293b;
  padding: 20px 30px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar h2 {
  color: white;
  margin: 0;
}

.links {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.links a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.links a:hover {
  color: #38bdf8;
}

.username {
  color: #38bdf8;
  font-weight: bold;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logout-btn {
  background: #448eef;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.logout-btn:hover {
  background: #2684dc;
}
</style>