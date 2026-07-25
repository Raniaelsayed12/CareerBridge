<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Navbar from "../components/Navbar.vue/Navbar.vue";
import { useUserStore } from "../stores/userStore";
import api from "../services/api";

const router = useRouter();
const userStore = useUserStore();

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isLoading = ref(false);

async function handleLogin() {
  errorMessage.value = "";

  if (!email.value.trim() || !password.value) {
    errorMessage.value = "Please enter your email and password.";
    return;
  }

  try {
    isLoading.value = true;

    const response = await api.post("/login", {
      email: email.value.trim(),
      password: password.value,
    });

    userStore.login(response.data.user);

    await userStore.loadStatistics();

    const redirectPath =
        router.currentRoute.value.query.redirect || "/dashboard";

    router.push(redirectPath);
  } catch (error) {
    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value =
          "Cannot connect to the server. Please try again.";
    }

    console.error("Login error:", error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <Navbar />

  <main class="login-page">
    <section class="login-wrapper">
      <div class="login-introduction">
        <div class="brand-badge">CB</div>

        <h1>Build your career profile</h1>

        <p>
          Manage your skills, projects and certificates in one professional
          workspace.
        </p>

        <ul>
          <li>Organize your professional skills</li>
          <li>Present your personal projects</li>
          <li>Manage certificates and achievements</li>
        </ul>
      </div>

      <form class="login-card" @submit.prevent="handleLogin">
        <div class="login-header">
          <span class="eyebrow">Welcome back</span>
          <h2>Sign in to CareerBridge</h2>
          <p>Enter your account details to continue.</p>
        </div>

        <div
            v-if="errorMessage"
            class="error-message"
            role="alert"
        >
          {{ errorMessage }}
        </div>

        <div class="form-group">
          <label for="email">Email address</label>

          <input
              id="email"
              v-model="email"
              type="email"
              placeholder="name@example.com"
              autocomplete="email"
          />
        </div>

        <div class="form-group">
          <div class="password-label">
            <label for="password">Password</label>
          </div>

          <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter your password"
              autocomplete="current-password"
          />
        </div>

        <button
            class="login-button"
            type="submit"
            :disabled="isLoading"
        >
          <span v-if="isLoading" class="spinner"></span>

          {{ isLoading ? "Signing in..." : "Sign in" }}
        </button>

        <p class="register-text">
          Don't have an account?

          <RouterLink to="/register">
            Create an account
          </RouterLink>
        </p>
      </form>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 24px;
  background:
      radial-gradient(
          circle at 10% 10%,
          rgba(59, 130, 246, 0.18),
          transparent 32%
      ),
      radial-gradient(
          circle at 90% 90%,
          rgba(99, 102, 241, 0.16),
          transparent 30%
      ),
      #f8fafc;
  font-family:
      Inter,
      Arial,
      sans-serif;
}

.login-wrapper {
  width: 100%;
  max-width: 1080px;
  display: grid;
  grid-template-columns: 1fr 460px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 28px;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.14);
}

.login-introduction {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 64px;
  color: #ffffff;
  background:
      linear-gradient(
          145deg,
          rgba(15, 23, 42, 0.96),
          rgba(30, 64, 175, 0.92)
      );
}

.login-introduction::after {
  position: absolute;
  right: -70px;
  bottom: -90px;
  width: 260px;
  height: 260px;
  content: "";
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
}

.brand-badge {
  width: 54px;
  height: 54px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 16px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 1px;
}

.login-introduction h1 {
  max-width: 480px;
  margin: 0 0 18px;
  font-size: clamp(36px, 4vw, 54px);
  line-height: 1.08;
  letter-spacing: -1.5px;
}

.login-introduction > p {
  max-width: 510px;
  margin: 0;
  color: #dbeafe;
  font-size: 17px;
  line-height: 1.7;
}

.login-introduction ul {
  margin: 34px 0 0;
  padding: 0;
  list-style: none;
}

.login-introduction li {
  position: relative;
  margin: 14px 0;
  padding-left: 30px;
  color: #e0e7ff;
  font-size: 15px;
}

.login-introduction li::before {
  position: absolute;
  left: 0;
  top: 1px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  content: "✓";
  color: #0f172a;
  background: #bfdbfe;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 800;
}

.login-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 58px 50px;
  background: #ffffff;
}

.login-header {
  margin-bottom: 32px;
}

.eyebrow {
  display: inline-block;
  margin-bottom: 10px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
}

.login-header h2 {
  margin: 0 0 10px;
  color: #0f172a;
  font-size: 30px;
  line-height: 1.2;
  letter-spacing: -0.6px;
}

.login-header p {
  margin: 0;
  color: #64748b;
  font-size: 15px;
  line-height: 1.6;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #334155;
  font-size: 14px;
  font-weight: 700;
}

.form-group input {
  width: 100%;
  box-sizing: border-box;
  padding: 14px 16px;
  color: #0f172a;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  outline: none;
  font-size: 15px;
  transition:
      background 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;
}

.form-group input::placeholder {
  color: #94a3b8;
}

.form-group input:hover {
  border-color: #94a3b8;
}

.form-group input:focus {
  background: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

.password-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.login-button {
  width: 100%;
  min-height: 50px;
  margin-top: 6px;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  border: 0;
  border-radius: 12px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 800;
  transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      opacity 0.2s ease;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(37, 99, 235, 0.25);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.45);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.error-message {
  margin-bottom: 20px;
  padding: 12px 14px;
  color: #b91c1c;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.5;
}

.register-text {
  margin: 24px 0 0;
  color: #64748b;
  font-size: 14px;
  text-align: center;
}

.register-text a {
  color: #2563eb;
  font-weight: 800;
  text-decoration: none;
}

.register-text a:hover {
  text-decoration: underline;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .login-wrapper {
    max-width: 520px;
    grid-template-columns: 1fr;
  }

  .login-introduction {
    padding: 42px;
  }

  .login-introduction h1 {
    font-size: 38px;
  }

  .login-introduction ul {
    display: none;
  }

  .login-card {
    padding: 44px 42px;
  }
}

@media (max-width: 560px) {
  .login-page {
    align-items: flex-start;
    padding: 24px 14px;
  }

  .login-wrapper {
    border-radius: 20px;
  }

  .login-introduction {
    padding: 32px 24px;
  }

  .login-introduction h1 {
    font-size: 31px;
  }

  .login-introduction > p {
    font-size: 15px;
  }

  .brand-badge {
    margin-bottom: 22px;
  }

  .login-card {
    padding: 36px 24px;
  }

  .login-header h2 {
    font-size: 26px;
  }
}
</style>