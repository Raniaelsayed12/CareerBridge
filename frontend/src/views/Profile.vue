<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { useUserStore } from "../stores/userStore";

const router = useRouter();
const userStore = useUserStore();

const currentUserId = ref("");
const systemRole = ref("");
const message = ref("");
const error = ref("");

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

async function loadProfile() {
  try {
    const response = await api.get("/users");
    const email = (userStore.email || "").toLowerCase().trim();

    const user = response.data.find(
      (item) => item.email.toLowerCase().trim() === email
    );

    if (!user) {
      error.value = "Profile could not be loaded.";
      return;
    }

    currentUserId.value = user._id;
    systemRole.value = user.role || "user";

    form.value = {
      name: user.name || "",
      email: user.email || "",
      city: user.city || "",
      professionalRole: user.professionalRole || "Student",
      university: user.university || "",
      github: user.github || "",
      bio: user.bio || "",
      password: "",
    };
  } catch (err) {
    error.value = "Profile could not be loaded.";
  }
}

async function saveProfile() {
  if (!form.value.name || !form.value.email) {
    error.value = "Name and email are required.";
    message.value = "";
    return;
  }

  try {
    const payload = {
      name: form.value.name,
      email: form.value.email,
      city: form.value.city,
      professionalRole: form.value.professionalRole,
      university: form.value.university,
      github: form.value.github,
      bio: form.value.bio,
    };

    if (form.value.password) {
      payload.password = form.value.password;
    }

    const response = await api.put(`/users/${currentUserId.value}`, payload);
    const user = response.data;

    userStore.name = user.name;
    userStore.email = user.email;
    userStore.city = user.city || "";
    userStore.professionalRole = user.professionalRole || "";
    userStore.university = user.university || "";
    userStore.github = user.github || "";
    userStore.bio = user.bio || "";

    message.value = "Profile updated successfully.";
    error.value = "";
    form.value.password = "";
  } catch (err) {
    error.value = err.response?.data?.message || "Profile could not be updated.";
    message.value = "";
  }
}

function goHome() {
  router.push("/");
}

function goDashboard() {
  router.push("/dashboard");
}

onMounted(loadProfile);
</script>

<template>
  <main class="profile-page">
    <section class="header-card">
      <div class="avatar">
        {{ form.name ? form.name.slice(0, 2).toUpperCase() : "U" }}
      </div>

      <div>
        <p class="tag">PROFILE SETTINGS</p>
        <h1>Edit your profile</h1>
        <p>Update your personal and professional information.</p>
        <p class="role-note">
          System role: <strong>{{ systemRole }}</strong>
        </p>
      </div>

      <div class="actions">
        <button type="button" @click="goHome">Home</button>
        <button type="button" @click="goDashboard">Dashboard</button>
      </div>
    </section>

    <p v-if="message" class="success">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>

    <form class="profile-form" @submit.prevent="saveProfile">
      <div>
        <label>Full name *</label>
        <input v-model="form.name" placeholder="Full name" />
      </div>

      <div>
        <label>Email address *</label>
        <input v-model="form.email" placeholder="Email address" />
      </div>

      <div>
        <label>City</label>
        <input v-model="form.city" placeholder="Example: Gelsenkirchen, Germany" />
      </div>

      <div>
        <label>Professional title</label>
        <input v-model="form.professionalRole" placeholder="Example: Master Informatik Student" />
      </div>

      <div>
        <label>University</label>
        <input v-model="form.university" placeholder="Enter your university" />
      </div>

      <div>
        <label>GitHub profile</label>
        <input v-model="form.github" placeholder="https://github.com/username" />
      </div>

      <div class="full">
        <label>Professional bio</label>
        <textarea v-model="form.bio" placeholder="Write a short professional description..."></textarea>
      </div>

      <div class="full">
        <label>New password optional</label>
        <input v-model="form.password" type="password" placeholder="Leave empty to keep current password" />
      </div>

      <button class="save" type="submit">Save profile</button>
    </form>
  </main>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 40px 7%;
  background: #f8fafc;
  color: #0f172a;
}

.header-card,
.profile-form,
.success,
.error {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.header-card {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 22px;
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 22px;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: white;
  display: grid;
  place-items: center;
  font-size: 36px;
  font-weight: 900;
}

.tag {
  color: #2563eb;
  font-weight: 900;
  letter-spacing: 3px;
}

.header-card h1 {
  font-size: 38px;
  margin: 6px 0;
}

.role-note {
  color: #64748b;
}

.actions {
  margin-left: auto;
  display: flex;
  gap: 10px;
}

.actions button,
.save {
  border: none;
  border-radius: 12px;
  padding: 13px 18px;
  font-weight: 900;
  cursor: pointer;
}

.actions button {
  background: #dbeafe;
  color: #1d4ed8;
}

.profile-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 800;
  color: #334155;
}

input,
textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 14px;
  font-size: 15px;
}

textarea {
  min-height: 130px;
}

.full {
  grid-column: 1 / -1;
}

.save {
  grid-column: 1 / -1;
  background: #2563eb;
  color: white;
}

.success,
.error {
  margin-bottom: 18px;
  font-weight: 900;
}

.success {
  color: #15803d;
}

.error {
  color: #b91c1c;
}

@media (max-width: 900px) {
  .header-card,
  .profile-form {
    grid-template-columns: 1fr;
  }

  .header-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .actions {
    margin-left: 0;
  }
}
</style>
