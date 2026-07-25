<template>
  <main class="login-page">
    <section class="login-card">
      <div class="login-info">
        <p class="eyebrow">WELCOME BACK</p>
        <h1>Sign in to CareerBridge</h1>
        <p>
          Access your dashboard, manage your skills, projects, certificates and
          career profile.
        </p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          Email
          <input v-model="email" type="email" placeholder="email@example.com" required />
        </label>

        <label>
          Password
          <div class="password-row">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              required
            />
            <button type="button" @click="showPassword = !showPassword">
              {{ showPassword ? "Hide" : "Show" }}
            </button>
          </div>
        </label>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

        <button class="submit-btn" type="submit" :disabled="loading">
          {{ loading ? "Signing in..." : "Sign in" }}
        </button>

        <div class="demo-box">
          <p>Demo accounts</p>
          <button type="button" @click="fillDemo('admin')">Admin</button>
          <button type="button" @click="fillDemo('hania')">Hania</button>
          <button type="button" @click="fillDemo('rania')">Rania</button>
          <button type="button" @click="fillDemo('aly')">Aly</button>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import api from "../services/api";

const router = useRouter();
const userStore = useUserStore();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref("");

const demoAccounts = {
  admin: { email: "admin@test.de", password: "Admin2026!Test" },
  hania: { email: "hania@test.com", password: "Hania2026!Test" },
  rania: { email: "rania@test.com", password: "Rania2026!Test" },
  aly: { email: "aly@test.com", password: "Aly2026!Test" },
};

function fillDemo(account) {
  email.value = demoAccounts[account].email;
  password.value = demoAccounts[account].password;
}

async function handleLogin() {
  userStore.logout();
  sessionStorage.clear();
  localStorage.clear();

  userStore.logout();
  sessionStorage.clear();
  localStorage.clear();

  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await api.post("/login", {
      email: email.value,
      password: password.value,
    });

    const loginData = response.data;
    const user = loginData.user || loginData.account || loginData;

    if (!user || !user.email) {
      throw new Error("No valid user returned by backend.");
    }

    if (user.email?.toLowerCase() !== email.value.toLowerCase()) {
      throw new Error("Wrong user returned by backend.");
    }

    userStore.setUser(user);

    sessionStorage.setItem("careerbridgeUser", JSON.stringify(user));

    window.location.href = "/dashboard";
  } catch (error) {
    console.error("Login failed:", error);
    errorMessage.value = "Login failed. Please check email and password.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 3rem 7%;
  background: #f4f7fb;
}

.login-card {
  width: min(1050px, 100%);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2.5rem;
  border-radius: 30px;
  background: white;
  box-shadow: 0 25px 70px rgba(15, 23, 42, 0.12);
}

.login-info {
  padding: 2.5rem;
  border-radius: 24px;
  color: white;
  background: linear-gradient(135deg, #14264f, #3447f5);
}

.eyebrow {
  margin: 0;
  font-size: 0.85rem;
  letter-spacing: 0.35em;
  font-weight: 800;
}

.login-info h1 {
  font-size: clamp(2.2rem, 5vw, 4rem);
  margin: 1rem 0;
}

.login-info p {
  line-height: 1.7;
}

.login-form {
  display: grid;
  gap: 1rem;
  align-content: center;
}

label {
  display: grid;
  gap: 0.45rem;
  font-weight: 800;
  color: #0f172a;
}

input {
  width: 100%;
  padding: 0.95rem 1rem;
  border-radius: 14px;
  border: 1px solid #dbe3ef;
  font: inherit;
}

.password-row {
  display: flex;
  gap: 0.5rem;
}

.password-row button,
.demo-box button {
  border: none;
  border-radius: 12px;
  padding: 0.8rem 1rem;
  font-weight: 800;
  cursor: pointer;
}

.submit-btn {
  margin-top: 0.5rem;
  border: none;
  border-radius: 14px;
  padding: 1rem 1.2rem;
  background: #2563eb;
  color: white;
  font-weight: 900;
  cursor: pointer;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error {
  color: #b91c1c;
  font-weight: 800;
}

.demo-box {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 18px;
  background: #f8fafc;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: center;
}

.demo-box p {
  width: 100%;
  margin: 0 0 0.3rem;
  font-weight: 800;
}

.demo-box button {
  background: #e0e7ff;
  color: #1e3a8a;
}

@media (max-width: 850px) {
  .login-card {
    grid-template-columns: 1fr;
  }
}
</style>
