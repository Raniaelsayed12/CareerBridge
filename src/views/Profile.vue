<script setup>
import Navbar from "../components/Navbar.vue/Navbar.vue";
import { useUserStore } from "../stores/userStore";

const user = useUserStore();
</script>

<template>
  <Navbar />

  <div class="profile">
    <img
      src="https://i.pravatar.cc/200"
      alt="profile"
    />

    <h1>{{ user.name }}</h1>

    <h3>{{ user.role }}</h3>

    <div class="info">
      <p>📧 {{ user.email }}</p>
      <p>📍 {{ user.city }}</p>
      <p>🎓 Faculty of Computers & AI</p>
    </div>
  </div>
</template>

<style>
.profile {
  max-width: 600px;
  margin: 60px auto;
  text-align: center;
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 0 20px #ddd;
}

.profile img {
  width: 180px;
  height: 180px;
  border-radius: 50%;
}

.profile h1 {
  margin-top: 20px;
}

.profile h3 {
  color: #2563eb;
}

.info {
  margin-top: 20px;
  font-size: 18px;
}
</style>