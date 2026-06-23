<script setup>
import Navbar from "../components/Navbar.vue/Navbar.vue";
</script>

<template>
  <Navbar />

  <div class="register-container">
    <div class="register-card">
      <h1>Create Account</h1>

      <input
        type="text"
        placeholder="Full Name"
      />

      <input
        type="email"
        placeholder="Email"
      />

      <input
        type="password"
        placeholder="Password"
      />

      <button>Register</button>
    </div>
  </div>
</template>

<style>
.register-container {
  display: flex;
  justify-content: center;
  margin-top: 80px;
}

.register-card {
  width: 400px;
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 0 20px #ddd;
}

.register-card h1 {
  text-align: center;
  margin-bottom: 25px;
}

.register-card input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.register-card button {
  width: 100%;
  padding: 12px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
}

.register-card button:hover {
  background: #1d4ed8;
}
</style>