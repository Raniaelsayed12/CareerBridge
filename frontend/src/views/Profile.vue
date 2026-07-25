<template>
  <main class="profile-page">
    <section class="profile-hero">
      <div class="avatar">
        {{ initials }}
      </div>

      <div>
        <p class="eyebrow">PROFILE SETTINGS</p>
        <h1>Edit your profile</h1>
        <p>Update your personal and professional information.</p>
        <p class="role-text">System role: {{ currentUser?.role || "user" }}</p>
      </div>

      <div class="hero-actions">
        <RouterLink to="/" class="btn light">Home</RouterLink>
        <RouterLink to="/dashboard" class="btn light">Dashboard</RouterLink>
      </div>
    </section>

    <section v-if="successMessage" class="message success">
      {{ successMessage }}
    </section>

    <section v-if="errorMessage" class="message error">
      {{ errorMessage }}
    </section>

    <section class="form-panel">
      <form class="profile-form" @submit.prevent="saveProfile">
        <label>
          Full name *
          <input v-model="form.name" placeholder="Full name" required />
        </label>

        <label>
          Email address *
          <input v-model="form.email" type="email" placeholder="Email" required />
        </label>

        <label>
          City
          <input v-model="form.city" placeholder="Example: Gelsenkirchen, Germany" />
        </label>

        <label>
          Professional title
          <input v-model="form.professionalRole" placeholder="Example: Master Informatik Student" />
        </label>

        <label>
          University
          <input v-model="form.university" placeholder="Enter your university" />
        </label>

        <label>
          GitHub profile
          <input v-model="form.github" placeholder="https://github.com/username" />
        </label>

        <label class="full">
          Professional bio
          <textarea v-model="form.bio" placeholder="Write a short professional description..."></textarea>
        </label>

        <label>
          Password
          <input v-model="form.password" placeholder="Password" />
        </label>

        <div class="full actions">
          <button class="btn primary" type="submit" :disabled="saving">
            {{ saving ? "Saving..." : "Save profile" }}
          </button>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup>
import { computed, ref, watchEffect } from "vue";
import { RouterLink } from "vue-router";
import { useUserStore } from "../stores/userStore";
import api from "../services/api";

const userStore = useUserStore();

const saving = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const currentUser = computed(() => userStore.user);

const form = ref({
  name: "",
  email: "",
  city: "",
  professionalRole: "",
  university: "",
  github: "",
  bio: "",
  password: "",
});

const currentUserId = computed(() => {
  return currentUser.value?._id || currentUser.value?.id || currentUser.value?.email;
});

const initials = computed(() => {
  const name = form.value.name || form.value.email || "User";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
});

watchEffect(() => {
  if (!currentUser.value) return;

  form.value = {
    name: currentUser.value.name || currentUser.value.fullName || "",
    email: currentUser.value.email || "",
    city: currentUser.value.city || "",
    professionalRole:
      currentUser.value.professionalRole ||
      currentUser.value.professionalTitle ||
      currentUser.value.title ||
      "",
    university: currentUser.value.university || "",
    github: currentUser.value.github || "",
    bio: currentUser.value.bio || "",
    password: currentUser.value.password || "",
  };
});

async function saveProfile() {
  if (!currentUserId.value) {
    errorMessage.value = "No logged-in user found.";
    return;
  }

  saving.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  const updatedUser = {
    ...currentUser.value,
    name: form.value.name,
    email: form.value.email,
    city: form.value.city,
    professionalRole: form.value.professionalRole,
    university: form.value.university,
    github: form.value.github,
    bio: form.value.bio,
    password: form.value.password,
    role: currentUser.value?.role || "user",
  };

  try {
    const response = await api.put(`/users/${currentUserId.value}`, updatedUser);
    const savedUser = response.data?.user || response.data?.account || response.data || updatedUser;

    userStore.setUser(savedUser);
    successMessage.value = "Profile updated successfully.";
  } catch (error) {
    console.error("Profile could not be saved:", error);

    userStore.setUser(updatedUser);
    successMessage.value = "Profile updated locally.";
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 3rem 7%;
  background: #f4f7fb;
  color: #0f172a;
}

.profile-hero {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.5rem;
  align-items: center;
  padding: 3rem;
  border-radius: 28px;
  background: white;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.avatar {
  width: 95px;
  height: 95px;
  border-radius: 24px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: white;
  font-size: 2rem;
  font-weight: 900;
}

.eyebrow {
  margin: 0;
  color: #2563eb;
  letter-spacing: 0.3em;
  font-weight: 900;
}

.profile-hero h1 {
  margin: 0.6rem 0;
  font-size: clamp(2rem, 5vw, 3.4rem);
}

.role-text {
  color: #64748b;
  font-weight: 800;
}

.hero-actions {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.btn {
  border: none;
  padding: 0.9rem 1.2rem;
  border-radius: 14px;
  font-weight: 900;
  cursor: pointer;
  text-decoration: none;
}

.btn.light {
  background: #dbeafe;
  color: #1d4ed8;
}

.btn.primary {
  background: #2563eb;
  color: white;
}

.form-panel,
.message {
  margin-top: 1.5rem;
  padding: 2rem;
  border-radius: 24px;
  background: white;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.message.success {
  color: #047857;
  font-weight: 900;
}

.message.error {
  color: #b91c1c;
  font-weight: 900;
}

.profile-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.2rem;
}

label {
  display: grid;
  gap: 0.5rem;
  font-weight: 900;
  color: #334155;
}

input,
textarea {
  width: 100%;
  padding: 1rem;
  border-radius: 14px;
  border: 1px solid #dbe3ef;
  font: inherit;
}

textarea {
  min-height: 140px;
  resize: vertical;
}

.full {
  grid-column: 1 / -1;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 900px) {
  .profile-hero,
  .profile-form {
    grid-template-columns: 1fr;
  }
}
</style>
