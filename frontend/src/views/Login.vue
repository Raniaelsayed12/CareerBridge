<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const error = ref("");
const loading = ref(false);

const demoAccounts = [
  {
    label: "Admin",
    email: "admin@test.de",
    password: "Admin2026!Test",
  },
  {
    label: "Hania",
    email: "hania@test.com",
    password: "Hania2026!Test",
  },
  {
    label: "Rania",
    email: "rania@test.com",
    password: "Rania2026!Test",
  },
  {
    label: "Aly",
    email: "aly@test.com",
    password: "Aly2026!Test",
  },
];

function fillAccount(account) {
  email.value = account.email;
  password.value = account.password;
  error.value = "";
}

async function login() {
  if (!email.value || !password.value) {
    error.value = "Email and password are required.";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const response = await api.post("/login", {
      email: email.value.trim(),
      password: password.value,
    });

    const user = response.data.user;

    userStore.setUser(user);

    router.push("/");
  } catch (err) {
    error.value = err.response?.data?.message || "Cannot connect to the server.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-card">
      <div class="info">
        <span class="logo">CB</span>

        <h1>Build your career profile</h1>

        <p>
          Manage your skills, projects and certificates in one professional workspace.
        </p>

        <ul>
          <li>Organize your professional skills</li>
          <li>Present your personal projects</li>
          <li>Manage certificates and achievements</li>
        </ul>
      </div>

      <form class="form" @submit.prevent="login">
        <p class="tag">WELCOME BACK</p>
        <h2>Sign in to CareerBridge</h2>
        <p>Enter your account details to continue.</p>

        <p v-if="error" class="error">{{ error }}</p>

        <label>Email address</label>
        <input
          v-model="email"
          type="email"
          placeholder="example@test.com"
          autocomplete="off"
        />

        <label>Password</label>

        <div class="password-row">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            autocomplete="off"
          />

          <button
            type="button"
            class="show-button"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? "Hide" : "Show" }}
          </button>
        </div>

        <button class="login-button" type="submit" :disabled="loading">
          {{ loading ? "Signing in..." : "Sign in" }}
        </button>

        <div class="demo-box">
          <p>Demo accounts</p>

          <div class="demo-grid">
            <button
              v-for="account in demoAccounts"
              :key="account.email"
              type="button"
              @click="fillAccount(account)"
            >
              {{ account.label }}
              <small>{{ account.email }}</small>
            </button>
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  padding: 70px 7%;
  background: #f8fafc;
}

.login-card {
  max-width: 1150px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.12);
}

.info {
  background: linear-gradient(135deg, #172554, #3547c8);
  color: white;
  padding: 70px;
}

.logo {
  display: inline-flex;
  width: 58px;
  height: 58px;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  font-weight: 900;
  margin-bottom: 35px;
}

.info h1 {
  font-size: 50px;
  line-height: 1.1;
}

.info p,
.info li {
  font-size: 17px;
  color: #dbeafe;
}

.info ul {
  margin-top: 35px;
  padding-left: 20px;
}

.form {
  padding: 70px;
  display: grid;
  gap: 14px;
}

.tag {
  color: #2563eb;
  font-weight: 900;
  letter-spacing: 3px;
}

.form h2 {
  font-size: 34px;
  margin: 0;
}

label {
  font-weight: 800;
  color: #334155;
}

input {
  width: 100%;
  box-sizing: border-box;
  padding: 15px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 15px;
}

.password-row {
  display: grid;
  grid-template-columns: 1fr 90px;
  gap: 10px;
}

.show-button {
  border: none;
  border-radius: 12px;
  background: #dbeafe;
  color: #1d4ed8;
  font-weight: 900;
  cursor: pointer;
}

.login-button {
  margin-top: 12px;
  padding: 15px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: white;
  font-weight: 900;
  cursor: pointer;
}

.error {
  background: #fef2f2;
  color: #b91c1c;
  padding: 14px;
  border-radius: 12px;
  font-weight: 800;
}

.demo-box {
  margin-top: 14px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
}

.demo-box p {
  margin: 0 0 12px;
  font-weight: 900;
  color: #334155;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.demo-grid button {
  text-align: left;
  border: 1px solid #dbeafe;
  background: white;
  color: #0f172a;
  border-radius: 12px;
  padding: 12px;
  font-weight: 900;
  cursor: pointer;
}

.demo-grid small {
  display: block;
  margin-top: 4px;
  color: #64748b;
  font-weight: 600;
}

@media (max-width: 900px) {
  .login-card {
    grid-template-columns: 1fr;
  }

  .info,
  .form {
    padding: 35px;
  }

  .demo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
