<script setup>
import {
  computed,
  ref,
} from "vue";

import {
  useRouter,
} from "vue-router";

import Navbar from "../components/Navbar.vue/Navbar.vue";
import api from "../services/api";
import { useUserStore } from "../stores/userStore";

const router = useRouter();
const userStore = useUserStore();

const form = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const isSubmitting = ref(false);
const errorMessage = ref("");

const passwordStrength = computed(() => {
  const password =
      form.value.password;

  let score = 0;

  if (password.length >= 6) {
    score += 1;
  }

  if (password.length >= 10) {
    score += 1;
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  }

  if (
      /[^A-Za-z0-9]/.test(password)
  ) {
    score += 1;
  }

  return score;
});

const passwordStrengthText =
    computed(() => {
      if (!form.value.password) {
        return "";
      }

      if (
          passwordStrength.value <= 1
      ) {
        return "Weak";
      }

      if (
          passwordStrength.value <= 3
      ) {
        return "Medium";
      }

      return "Strong";
    });

const passwordStrengthClass =
    computed(() => {
      if (
          passwordStrength.value <= 1
      ) {
        return "weak";
      }

      if (
          passwordStrength.value <= 3
      ) {
        return "medium";
      }

      return "strong";
    });

const passwordStrengthWidth =
    computed(() => {
      const percentage =
          Math.min(
              passwordStrength.value * 20,
              100
          );

      return `${percentage}%`;
    });

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
  );
}

function validateForm() {
  const name =
      form.value.name.trim();

  const email =
      form.value.email
          .trim()
          .toLowerCase();

  const password =
      form.value.password;

  const confirmPassword =
      form.value.confirmPassword;

  if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
  ) {
    return "Please complete all fields.";
  }

  if (name.length < 2) {
    return "Name must contain at least two characters.";
  }

  if (!isValidEmail(email)) {
    return "Please enter a valid email address.";
  }

  if (password.length < 6) {
    return "Password must contain at least six characters.";
  }

  if (
      password !==
      confirmPassword
  ) {
    return "Passwords do not match.";
  }

  return "";
}

async function handleRegister() {
  errorMessage.value = "";

  const validationError =
      validateForm();

  if (validationError) {
    errorMessage.value =
        validationError;

    return;
  }

  try {
    isSubmitting.value = true;

    const response =
        await api.post(
            "/register",
            {
              name:
                  form.value.name.trim(),

              email:
                  form.value.email
                      .trim()
                      .toLowerCase(),

              password:
              form.value.password,
            }
        );

    const newUser =
        response.data.user;

    if (!newUser) {
      throw new Error(
          "The server did not return the registered user."
      );
    }

    userStore.login(newUser);

    await userStore.loadStatistics();

    await router.push(
        "/dashboard"
    );
  } catch (error) {
    console.error(
        "Registration error:",
        error
    );

    errorMessage.value =
        error.response?.data?.message ||
        error.message ||
        "The account could not be created.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <Navbar />

  <main class="register-page">
    <section class="register-wrapper">
      <div class="register-introduction">
        <div class="brand-badge">
          CB
        </div>

        <span class="introduction-label">
          Start your career profile
        </span>

        <h1>
          Create your professional workspace
        </h1>

        <p>
          Organize your skills,
          projects, certificates and
          professional information in
          one modern platform.
        </p>

        <div class="benefits-list">
          <div class="benefit-item">
            <span>✓</span>

            <div>
              <strong>
                Professional profile
              </strong>

              <small>
                Keep your career information
                organized.
              </small>
            </div>
          </div>

          <div class="benefit-item">
            <span>✓</span>

            <div>
              <strong>
                Project portfolio
              </strong>

              <small>
                Present your practical
                experience.
              </small>
            </div>
          </div>

          <div class="benefit-item">
            <span>✓</span>

            <div>
              <strong>
                Resume generation
              </strong>

              <small>
                Create a structured PDF resume.
              </small>
            </div>
          </div>
        </div>
      </div>

      <form
          class="register-card"
          @submit.prevent="
          handleRegister
        "
      >
        <div class="register-header">
          <span class="header-label">
            Create account
          </span>

          <h2>
            Join CareerBridge
          </h2>

          <p>
            Enter your information to
            create a new account.
          </p>
        </div>

        <div
            v-if="errorMessage"
            class="error-message"
            role="alert"
        >
          <span>!</span>

          {{ errorMessage }}
        </div>

        <div class="form-group">
          <label for="register-name">
            Full name
          </label>

          <input
              id="register-name"
              v-model="form.name"
              type="text"
              placeholder="Enter your full name"
              autocomplete="name"
              maxlength="100"
              :disabled="isSubmitting"
          />
        </div>

        <div class="form-group">
          <label for="register-email">
            Email address
          </label>

          <input
              id="register-email"
              v-model="form.email"
              type="email"
              placeholder="name@example.com"
              autocomplete="email"
              maxlength="150"
              :disabled="isSubmitting"
          />
        </div>

        <div class="form-group">
          <label for="register-password">
            Password
          </label>

          <div class="password-field">
            <input
                id="register-password"
                v-model="form.password"
                :type="
                showPassword
                  ? 'text'
                  : 'password'
              "
                placeholder="Create a password"
                autocomplete="new-password"
                :disabled="isSubmitting"
            />

            <button
                class="visibility-button"
                type="button"
                :disabled="isSubmitting"
                @click="
                showPassword =
                  !showPassword
              "
            >
              {{
              showPassword
              ? "Hide"
              : "Show"
              }}
            </button>
          </div>

          <div
              v-if="form.password"
              class="password-strength"
          >
            <div class="strength-heading">
              <span>
                Password strength
              </span>

              <strong
                  :class="
                  passwordStrengthClass
                "
              >
                {{
                passwordStrengthText
                }}
              </strong>
            </div>

            <div class="strength-track">
              <div
                  :class="[
                  'strength-value',
                  passwordStrengthClass,
                ]"
                  :style="{
                  width:
                    passwordStrengthWidth,
                }"
              ></div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="confirm-password">
            Confirm password
          </label>

          <div class="password-field">
            <input
                id="confirm-password"
                v-model="
                form.confirmPassword
              "
                :type="
                showConfirmPassword
                  ? 'text'
                  : 'password'
              "
                placeholder="Repeat your password"
                autocomplete="new-password"
                :disabled="isSubmitting"
            />

            <button
                class="visibility-button"
                type="button"
                :disabled="isSubmitting"
                @click="
                showConfirmPassword =
                  !showConfirmPassword
              "
            >
              {{
              showConfirmPassword
              ? "Hide"
              : "Show"
              }}
            </button>
          </div>

          <small
              v-if="
              form.confirmPassword &&
              form.password !==
                form.confirmPassword
            "
              class="field-error"
          >
            Passwords do not match.
          </small>

          <small
              v-else-if="
              form.confirmPassword &&
              form.password ===
                form.confirmPassword
            "
              class="field-success"
          >
            Passwords match.
          </small>
        </div>

        <button
            class="register-button"
            type="submit"
            :disabled="isSubmitting"
        >
          <span
              v-if="isSubmitting"
              class="spinner"
          ></span>

          {{
          isSubmitting
          ? "Creating account..."
          : "Create account"
          }}
        </button>

        <p class="login-text">
          Already have an account?

          <RouterLink to="/login">
            Sign in
          </RouterLink>
        </p>
      </form>
    </section>
  </main>
</template>

<style scoped>
.register-page {
  min-height:
      calc(100vh - 72px);
  padding: 50px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
      radial-gradient(
          circle at 10% 10%,
          rgba(59, 130, 246, 0.17),
          transparent 31%
      ),
      radial-gradient(
          circle at 90% 90%,
          rgba(99, 102, 241, 0.15),
          transparent 30%
      ),
      #f8fafc;
  font-family:
      Inter,
      Arial,
      sans-serif;
}

.register-wrapper {
  width: 100%;
  max-width: 1080px;
  overflow: hidden;
  display: grid;
  grid-template-columns:
    minmax(0, 1fr)
    470px;
  background: #ffffff;
  border:
      1px solid #e2e8f0;
  border-radius: 28px;
  box-shadow:
      0 30px 80px
      rgba(15, 23, 42, 0.14);
}

.register-introduction {
  position: relative;
  padding: 62px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #ffffff;
  background:
      radial-gradient(
          circle at 90% 15%,
          rgba(255, 255, 255, 0.13),
          transparent 26%
      ),
      linear-gradient(
          145deg,
          #0f172a,
          #1e3a8a 58%,
          #4f46e5
      );
}

.register-introduction::after {
  position: absolute;
  right: -100px;
  bottom: -130px;
  width: 310px;
  height: 310px;
  content: "";
  background:
      rgba(255, 255, 255, 0.07);
  border-radius: 50%;
}

.brand-badge {
  position: relative;
  z-index: 1;
  width: 54px;
  height: 54px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background:
      rgba(255, 255, 255, 0.14);
  border:
      1px solid
      rgba(255, 255, 255, 0.22);
  border-radius: 16px;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 1px;
}

.introduction-label,
.header-label {
  display: inline-block;
  margin-bottom: 11px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
}

.introduction-label {
  position: relative;
  z-index: 1;
  color: #93c5fd;
}

.register-introduction h1 {
  position: relative;
  z-index: 1;
  max-width: 500px;
  margin: 0 0 20px;
  font-size:
      clamp(
          38px,
          4vw,
          53px
      );
  line-height: 1.07;
  letter-spacing: -1.5px;
}

.register-introduction > p {
  position: relative;
  z-index: 1;
  max-width: 510px;
  margin: 0;
  color: #dbeafe;
  font-size: 16px;
  line-height: 1.75;
}

.benefits-list {
  position: relative;
  z-index: 1;
  margin-top: 35px;
  display: flex;
  flex-direction: column;
  gap: 17px;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.benefit-item > span {
  width: 23px;
  height: 23px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #172554;
  background: #bfdbfe;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 900;
}

.benefit-item div {
  display: flex;
  flex-direction: column;
}

.benefit-item strong {
  color: #ffffff;
  font-size: 14px;
}

.benefit-item small {
  margin-top: 4px;
  color: #bfdbfe;
  font-size: 12px;
}

.register-card {
  padding: 48px 46px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #ffffff;
}

.register-header {
  margin-bottom: 27px;
}

.header-label {
  color: #2563eb;
}

.register-header h2 {
  margin: 0 0 10px;
  color: #0f172a;
  font-size: 30px;
  line-height: 1.2;
  letter-spacing: -0.7px;
}

.register-header p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

.error-message {
  margin-bottom: 19px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 9px;
  color: #b91c1c;
  background: #fef2f2;
  border:
      1px solid #fecaca;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #334155;
  font-size: 13px;
  font-weight: 800;
}

.form-group input {
  width: 100%;
  min-height: 48px;
  box-sizing: border-box;
  padding: 13px 15px;
  color: #0f172a;
  background: #f8fafc;
  border:
      1px solid #cbd5e1;
  border-radius: 11px;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  transition:
      background 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;
}

.form-group input:focus {
  background: #ffffff;
  border-color: #2563eb;
  box-shadow:
      0 0 0 4px
      rgba(37, 99, 235, 0.11);
}

.form-group input:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.password-field {
  position: relative;
}

.password-field input {
  padding-right: 70px;
}

.visibility-button {
  position: absolute;
  top: 50%;
  right: 9px;
  padding: 7px 9px;
  color: #2563eb;
  background: #eff6ff;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
  font-weight: 800;
  transform:
      translateY(-50%);
}

.visibility-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.password-strength {
  margin-top: 10px;
}

.strength-heading {
  margin-bottom: 7px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #64748b;
  font-size: 10px;
  font-weight: 700;
}

.strength-heading strong {
  font-size: 10px;
  text-transform: uppercase;
}

.strength-heading strong.weak {
  color: #dc2626;
}

.strength-heading strong.medium {
  color: #d97706;
}

.strength-heading strong.strong {
  color: #059669;
}

.strength-track {
  width: 100%;
  height: 6px;
  overflow: hidden;
  background: #e2e8f0;
  border-radius: 999px;
}

.strength-value {
  height: 100%;
  border-radius: 999px;
  transition:
      width 0.25s ease,
      background 0.25s ease;
}

.strength-value.weak {
  background: #ef4444;
}

.strength-value.medium {
  background: #f59e0b;
}

.strength-value.strong {
  background: #10b981;
}

.field-error,
.field-success {
  display: block;
  margin-top: 7px;
  font-size: 11px;
  font-weight: 700;
}

.field-error {
  color: #dc2626;
}

.field-success {
  color: #059669;
}

.register-button {
  width: 100%;
  min-height: 50px;
  margin-top: 4px;
  padding: 14px 20px;
  color: #ffffff;
  background:
      linear-gradient(
          135deg,
          #2563eb,
          #4f46e5
      );
  border: 0;
  border-radius: 12px;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      opacity 0.2s ease;
}

.register-button:hover:not(:disabled) {
  transform:
      translateY(-1px);
  box-shadow:
      0 14px 28px
      rgba(37, 99, 235, 0.25);
}

.register-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.spinner {
  width: 15px;
  height: 15px;
  margin-right: 8px;
  display: inline-block;
  vertical-align: -2px;
  border:
      2px solid
      rgba(255, 255, 255, 0.45);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation:
      spin 0.7s linear infinite;
}

.login-text {
  margin: 22px 0 0;
  color: #64748b;
  font-size: 13px;
  text-align: center;
}

.login-text a {
  color: #2563eb;
  font-weight: 800;
  text-decoration: none;
}

.login-text a:hover {
  text-decoration: underline;
}

@keyframes spin {
  to {
    transform:
        rotate(360deg);
  }
}

@media (max-width: 900px) {
  .register-wrapper {
    max-width: 540px;
    grid-template-columns: 1fr;
  }

  .register-introduction {
    padding: 40px;
  }

  .register-introduction h1 {
    font-size: 38px;
  }

  .benefits-list {
    display: none;
  }

  .register-card {
    padding: 42px 40px;
  }
}

@media (max-width: 560px) {
  .register-page {
    align-items: flex-start;
    padding: 24px 14px;
  }

  .register-wrapper {
    border-radius: 20px;
  }

  .register-introduction {
    padding: 31px 24px;
  }

  .register-introduction h1 {
    font-size: 31px;
  }

  .register-introduction > p {
    font-size: 14px;
  }

  .brand-badge {
    margin-bottom: 21px;
  }

  .register-card {
    padding: 34px 23px;
  }

  .register-header h2 {
    font-size: 26px;
  }
}
</style>