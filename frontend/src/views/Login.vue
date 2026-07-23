<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Navbar from "../components/Navbar.vue/Navbar.vue";
import { useUserStore } from "../stores/userStore";
import api from "../services/api";

const router = useRouter();
const user = useUserStore();

const email = ref("");
const password = ref("");

async function handleLogin() {
   console.log("Login button clicked");
  if (!email.value || !password.value) {
    alert("Please fill all fields");
    return;
  }

  try {
    const response = await api.post("/login", {
      email: email.value,
      password: password.value,
    });

    user.login();

    if (response.data.user) {
      user.name = response.data.user.name;
      user.email = response.data.user.email;
    }

    alert(response.data.message);

    router.push("/dashboard");

  } catch (err) {
    if (err.response) {
      alert(err.response.data.message);
    } else {
      alert("Cannot connect to server");
      console.log(err);
    }
  }
}
</script>

<template>
  <Navbar />

  <div class="login-container">
    <div class="login-card">
      <h1>Login</h1>

      <input
        v-model="email"
        type="email"
        placeholder="Email"
      />

      <input
        v-model="password"
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
  box-sizing: border-box;
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

.login-card button:hover {
  background: #1d4ed8;
}
</style>