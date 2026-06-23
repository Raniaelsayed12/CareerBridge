<script setup>
import Navbar from "../components/Navbar.vue/Navbar.vue";
import { useUserStore } from "../stores/userStore";

const user = useUserStore();

function handleLogin() {
  user.login();

  alert("Login Successful!");
}
</script>

<template>
  <Navbar />

  <div class="login-container">
    <div class="login-card">
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
      />

      <input
        type="password"
        placeholder="Password"
      />

      <button @click="handleLogin">
        Login
      </button>
    </div>
  </div>
</template>

<style>
.login-container {
  display: flex;
  justify-content: center;
  margin-top: 80px;
}

.login-card {
  width: 400px;
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 0 20px #ddd;
}

.login-card h1 {
  text-align: center;
  margin-bottom: 25px;
}

.login-card input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.login-card button {
  width: 100%;
  padding: 12px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
}
</style>