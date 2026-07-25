<script setup>
import { computed, onMounted, ref } from "vue";
import Navbar from "../components/Navbar.vue/Navbar.vue";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();

const isEditing = ref(false);
const isSaving = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const form = ref({
  name: "",
  email: "",
  city: "",
  role: "",
  university: "",
  github: "",
  bio: "",
});

const initials = computed(() => {
  if (!userStore.name) {
    return "U";
  }

  return userStore.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
});

const profileName = computed(() => {
  return userStore.name || "CareerBridge User";
});

const profileRole = computed(() => {
  return userStore.role || "Add your professional role";
});

const hasGithub = computed(() => {
  return Boolean(userStore.github);
});

const githubUrl = computed(() => {
  if (!userStore.github) {
    return "";
  }

  if (
      userStore.github.startsWith("http://") ||
      userStore.github.startsWith("https://")
  ) {
    return userStore.github;
  }

  return `https://${userStore.github}`;
});

function populateForm() {
  form.value = {
    name: userStore.name || "",
    email: userStore.email || "",
    city: userStore.city || "",
    role: userStore.role || "",
    university: userStore.university || "",
    github: userStore.github || "",
    bio: userStore.bio || "",
  };
}

function startEdit() {
  successMessage.value = "";
  errorMessage.value = "";

  populateForm();

  isEditing.value = true;
}

function cancelEdit() {
  if (isSaving.value) {
    return;
  }

  errorMessage.value = "";
  populateForm();
  isEditing.value = false;
}

function validateGithubUrl(github) {
  if (!github) {
    return true;
  }

  return (
      github.startsWith("https://github.com/") ||
      github.startsWith("http://github.com/")
  );
}

async function saveProfile() {
  successMessage.value = "";
  errorMessage.value = "";

  const profileData = {
    name: form.value.name.trim(),
    email: form.value.email.trim().toLowerCase(),
    city: form.value.city.trim(),
    role: form.value.role.trim(),
    university: form.value.university.trim(),
    github: form.value.github.trim(),
    bio: form.value.bio.trim(),
  };

  if (!profileData.name || !profileData.email) {
    errorMessage.value = "Name and email are required.";
    return;
  }

  if (profileData.name.length < 2) {
    errorMessage.value =
        "Name must contain at least two characters.";
    return;
  }

  if (
      !profileData.email.includes("@") ||
      !profileData.email.includes(".")
  ) {
    errorMessage.value =
        "Please enter a valid email address.";
    return;
  }

  if (!validateGithubUrl(profileData.github)) {
    errorMessage.value =
        "Please enter a complete GitHub URL, for example: https://github.com/username";
    return;
  }

  try {
    isSaving.value = true;

    const result =
        await userStore.updateProfile(profileData);

    isEditing.value = false;

    successMessage.value =
        result?.message ||
        "Your profile has been updated successfully.";
  } catch (error) {
    console.error("Profile update error:", error);

    if (error.response?.data?.message) {
      errorMessage.value =
          error.response.data.message;
    } else if (error.message) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value =
          "Profile could not be saved. Please try again.";
    }
  } finally {
    isSaving.value = false;
  }
}

function dismissSuccessMessage() {
  successMessage.value = "";
}

onMounted(async () => {
  populateForm();

  try {
    await userStore.loadStatistics();
  } catch (error) {
    console.error(
        "Could not load profile statistics:",
        error
    );
  }
});
</script>

<template>
  <Navbar/>

  <main class="profile-page">
    <div class="profile-container">
      <div
          v-if="successMessage"
          class="message success-message"
          role="status"
      >
        <div class="message-content">
          <span class="message-icon">✓</span>

          <span>{{ successMessage }}</span>
        </div>

        <button
            class="message-close"
            type="button"
            aria-label="Close success message"
            @click="dismissSuccessMessage"
        >
          ×
        </button>
      </div>

      <section class="profile-card">
        <div class="profile-cover">
          <div class="cover-pattern"></div>
        </div>

        <div class="profile-content">
          <div class="avatar-wrapper">
            <div class="avatar">
              {{ initials }}
            </div>
          </div>

          <div
              v-if="!isEditing"
              class="profile-view"
          >
            <div class="profile-heading">
              <div>
                <span class="profile-label">
                  Professional profile
                </span>

                <h1>{{ profileName }}</h1>

                <p class="profile-role">
                  {{ profileRole }}
                </p>
              </div>

              <button
                  class="primary-button"
                  type="button"
                  @click="startEdit"
              >
                <span>Edit profile</span>
              </button>
            </div>

            <div class="profile-information">
              <article class="information-item">
                <span class="information-icon">
                  @
                </span>

                <div>
                  <small>Email address</small>

                  <strong>
                    {{
                    userStore.email ||
                    "Not provided"
                    }}
                  </strong>
                </div>
              </article>

              <article class="information-item">
                <span class="information-icon">
                  ⌖
                </span>

                <div>
                  <small>City</small>

                  <strong>
                    {{
                    userStore.city ||
                    "Not provided"
                    }}
                  </strong>
                </div>
              </article>

              <article class="information-item">
                <span class="information-icon">
                  U
                </span>

                <div>
                  <small>University</small>

                  <strong>
                    {{
                    userStore.university ||
                    "Not provided"
                    }}
                  </strong>
                </div>
              </article>

              <article class="information-item">
                <span class="information-icon">
                  G
                </span>

                <div>
                  <small>GitHub profile</small>

                  <a
                      v-if="hasGithub"
                      :href="githubUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                  >
                    {{ userStore.github }}
                  </a>

                  <strong v-else>
                    Not provided
                  </strong>
                </div>
              </article>
            </div>

            <div class="profile-bio">
              <span class="profile-label">
                About me
              </span>

              <p>
                {{
                userStore.bio ||
                "Add a short professional description about yourself."
                }}
              </p>
            </div>
          </div>

          <form
              v-else
              class="profile-form"
              @submit.prevent="saveProfile"
          >
            <div class="form-heading">
              <div>
                <span class="profile-label">
                  Profile settings
                </span>

                <h1>Edit your profile</h1>

                <p>
                  Update your personal and
                  professional information.
                </p>
              </div>
            </div>

            <div
                v-if="errorMessage"
                class="message error-message"
                role="alert"
            >
              <span class="message-icon">!</span>

              <span>{{ errorMessage }}</span>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label for="profile-name">
                  Full name
                  <span>*</span>
                </label>

                <input
                    id="profile-name"
                    v-model="form.name"
                    type="text"
                    placeholder="Enter your full name"
                    autocomplete="name"
                    :disabled="isSaving"
                />
              </div>

              <div class="form-group">
                <label for="profile-email">
                  Email address
                  <span>*</span>
                </label>

                <input
                    id="profile-email"
                    v-model="form.email"
                    type="email"
                    placeholder="name@example.com"
                    autocomplete="email"
                    :disabled="isSaving"
                />
              </div>

              <div class="form-group">
                <label for="profile-city">
                  City
                </label>

                <input
                    id="profile-city"
                    v-model="form.city"
                    type="text"
                    placeholder="Example: Hamburg, Germany"
                    autocomplete="address-level2"
                    :disabled="isSaving"
                />
              </div>

              <div class="form-group">
                <label for="profile-role">
                  Professional role
                </label>

                <input
                    id="profile-role"
                    v-model="form.role"
                    type="text"
                    placeholder="Example: Frontend Developer"
                    :disabled="isSaving"
                />
              </div>

              <div class="form-group">
                <label for="profile-university">
                  University
                </label>

                <input
                    id="profile-university"
                    v-model="form.university"
                    type="text"
                    placeholder="Enter your university"
                    :disabled="isSaving"
                />
              </div>

              <div class="form-group">
                <label for="profile-github">
                  GitHub profile
                </label>

                <input
                    id="profile-github"
                    v-model="form.github"
                    type="url"
                    placeholder="https://github.com/username"
                    :disabled="isSaving"
                />

                <small class="field-help">
                  Enter the complete URL of your
                  GitHub profile.
                </small>
              </div>

              <div class="form-group full-width">
                <label for="profile-bio">
                  Professional bio
                </label>

                <textarea
                    id="profile-bio"
                    v-model="form.bio"
                    rows="5"
                    maxlength="500"
                    placeholder="Write a short professional description..."
                    :disabled="isSaving"
                ></textarea>

                <small class="character-counter">
                  {{ form.bio.length }}/500
                </small>
              </div>
            </div>

            <div class="form-actions">
              <button
                  class="primary-button"
                  type="submit"
                  :disabled="isSaving"
              >
                <span
                    v-if="isSaving"
                    class="spinner"
                ></span>

                {{
                isSaving
                ? "Saving..."
                : "Save changes"
                }}
              </button>

              <button
                  class="secondary-button"
                  type="button"
                  :disabled="isSaving"
                  @click="cancelEdit"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </section>

      <section class="summary-grid">
        <RouterLink
            to="/skills"
            class="summary-card"
        >
          <span class="summary-icon skills-icon">
            S
          </span>

          <div>
            <strong>
              {{ userStore.skillsCount }}
            </strong>

            <span>Skills</span>
          </div>

          <span class="summary-arrow">→</span>
        </RouterLink>

        <RouterLink
            to="/projects"
            class="summary-card"
        >
          <span class="summary-icon projects-icon">
            P
          </span>

          <div>
            <strong>
              {{ userStore.projectsCount }}
            </strong>

            <span>Projects</span>
          </div>

          <span class="summary-arrow">→</span>
        </RouterLink>

        <RouterLink
            to="/certificates"
            class="summary-card"
        >
          <span
              class="summary-icon certificates-icon"
          >
            C
          </span>

          <div>
            <strong>
              {{ userStore.certificatesCount }}
            </strong>

            <span>Certificates</span>
          </div>

          <span class="summary-arrow">→</span>
        </RouterLink>

        <article class="summary-card">
          <span class="summary-icon progress-icon">
            %
          </span>

          <div>
            <strong>
              {{ userStore.progress }}%
            </strong>

            <span>Profile progress</span>
          </div>
        </article>
      </section>
    </div>
  </main>
</template>

<style scoped>
.profile-page {
  min-height: calc(100vh - 72px);
  padding: 44px 24px 70px;
  color: #0f172a;
  background: radial-gradient(
      circle at 5% 5%,
      rgba(59, 130, 246, 0.1),
      transparent 28%
  ),
  #f8fafc;
  font-family: Inter,
  Arial,
  sans-serif;
}

.profile-container {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
}

.profile-card {
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 25px;
  box-shadow: 0 22px 55px rgba(15, 23, 42, 0.1);
}

.profile-cover {
  position: relative;
  height: 145px;
  overflow: hidden;
  background: radial-gradient(
      circle at 85% 20%,
      rgba(255, 255, 255, 0.18),
      transparent 25%
  ),
  linear-gradient(
      135deg,
      #172554,
      #1d4ed8 60%,
      #4f46e5
  );
}

.cover-pattern {
  position: absolute;
  right: -70px;
  bottom: -130px;
  width: 320px;
  height: 320px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
}

.profile-content {
  position: relative;
  padding: 0 42px 42px;
}

.avatar-wrapper {
  height: 58px;
}

.avatar {
  position: absolute;
  top: -62px;
  left: 42px;
  width: 118px;
  height: 118px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: linear-gradient(
      135deg,
      #2563eb,
      #4f46e5
  );
  border: 7px solid #ffffff;
  border-radius: 32px;
  box-shadow: 0 14px 35px rgba(37, 99, 235, 0.24);
  font-size: 34px;
  font-weight: 900;
  letter-spacing: -1px;
}

.profile-view,
.profile-form {
  padding-top: 8px;
}

.profile-heading {
  margin-bottom: 34px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 30px;
}

.profile-label {
  display: inline-block;
  margin-bottom: 8px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
}

.profile-heading h1,
.form-heading h1 {
  margin: 0 0 8px;
  color: #0f172a;
  font-size: 34px;
  line-height: 1.15;
  letter-spacing: -0.8px;
}

.profile-role {
  margin: 0;
  color: #64748b;
  font-size: 16px;
}

.profile-information {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.information-item {
  min-height: 86px;
  padding: 17px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 15px;
}

.information-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1d4ed8;
  background: #dbeafe;
  border-radius: 11px;
  font-size: 14px;
  font-weight: 900;
}

.information-item div {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.information-item small {
  margin-bottom: 5px;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.information-item strong,
.information-item a {
  overflow: hidden;
  color: #334155;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.information-item a {
  color: #2563eb;
}

.information-item a:hover {
  text-decoration: underline;
}

.profile-bio {
  margin-top: 24px;
  padding: 22px;
  background: #f8fafc;
  border-left: 4px solid #2563eb;
  border-radius: 4px 15px 15px 4px;
}

.profile-bio p {
  max-width: 900px;
  margin: 0;
  color: #475569;
  font-size: 14px;
  line-height: 1.8;
  white-space: pre-line;
}

.form-heading {
  margin-bottom: 28px;
}

.form-heading p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.form-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 21px;
}

.form-group {
  position: relative;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #334155;
  font-size: 13px;
  font-weight: 800;
}

.form-group label span {
  color: #dc2626;
}

.form-group input,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 14px 15px;
  color: #0f172a;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 11px;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  transition: background 0.2s ease,
  border-color 0.2s ease,
  box-shadow 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  background: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.11);
}

.form-group input:disabled,
.form-group textarea:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.field-help,
.character-counter {
  display: block;
  margin-top: 7px;
  color: #94a3b8;
  font-size: 11px;
}

.character-counter {
  text-align: right;
}

.form-actions {
  margin-top: 28px;
  display: flex;
  gap: 12px;
}

.primary-button,
.secondary-button {
  min-height: 44px;
  padding: 12px 18px;
  border-radius: 11px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 800;
  transition: transform 0.2s ease,
  box-shadow 0.2s ease,
  opacity 0.2s ease;
}

.primary-button {
  color: #ffffff;
  background: linear-gradient(
      135deg,
      #2563eb,
      #4f46e5
  );
  border: 0;
}

.primary-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.22);
}

.secondary-button {
  color: #475569;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
}

.secondary-button:hover:not(:disabled) {
  background: #e2e8f0;
}

.primary-button:disabled,
.secondary-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
  box-shadow: none;
}

.spinner {
  width: 15px;
  height: 15px;
  margin-right: 8px;
  display: inline-block;
  vertical-align: -2px;
  border: 2px solid rgba(255, 255, 255, 0.45);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.message {
  margin-bottom: 20px;
  padding: 13px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  border-radius: 11px;
  font-size: 13px;
  font-weight: 700;
}

.message-content,
.error-message {
  display: flex;
  align-items: center;
  gap: 9px;
}

.message-icon {
  flex-shrink: 0;
}

.message-close {
  padding: 2px 7px;
  color: inherit;
  background: transparent;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 20px;
}

.message-close:hover {
  background: rgba(0, 0, 0, 0.05);
}

.success-message {
  color: #047857;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
}

.error-message {
  justify-content: flex-start;
  color: #b91c1c;
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.summary-grid {
  margin-top: 22px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.summary-card {
  min-height: 125px;
  padding: 22px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 15px;
  color: #0f172a;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 17px;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);
  text-decoration: none;
  transition: transform 0.2s ease,
  box-shadow 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.1);
}

.summary-icon {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  font-weight: 900;
}

.skills-icon {
  color: #1d4ed8;
  background: #dbeafe;
}

.projects-icon {
  color: #6d28d9;
  background: #ede9fe;
}

.certificates-icon {
  color: #b45309;
  background: #fef3c7;
}

.progress-icon {
  color: #047857;
  background: #d1fae5;
}

.summary-card div {
  display: flex;
  flex-direction: column;
}

.summary-card strong {
  color: #0f172a;
  font-size: 25px;
}

.summary-card div span {
  margin-top: 3px;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.summary-arrow {
  margin-left: auto;
  color: #2563eb;
  font-weight: 900;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .profile-information,
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: auto;
  }

  .summary-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .profile-page {
    padding: 24px 14px 50px;
  }

  .profile-cover {
    height: 120px;
  }

  .profile-content {
    padding: 0 22px 30px;
  }

  .avatar {
    left: 22px;
    top: -52px;
    width: 96px;
    height: 96px;
    border-radius: 26px;
    font-size: 28px;
  }

  .profile-heading {
    flex-direction: column;
  }

  .profile-heading h1,
  .form-heading h1 {
    font-size: 28px;
  }

  .primary-button {
    width: 100%;
    text-align: center;
  }

  .form-actions {
    flex-direction: column;
  }

  .secondary-button {
    width: 100%;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>