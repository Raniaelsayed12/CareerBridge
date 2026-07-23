<script setup>
import { ref } from "vue";
import Navbar from "../components/Navbar.vue/Navbar.vue";
import { useUserStore } from "../stores/userStore";

const user = useUserStore();

const isEditing = ref(false);

const form = ref({
  name: user.name,
  email: user.email,
  city: user.city,
  role: user.role,
});

function startEdit() {
  form.value = {
    name: user.name,
    email: user.email,
    city: user.city,
    role: user.role,
  };
  isEditing.value = true;
}

function cancelEdit() {
  isEditing.value = false;
}

function saveProfile() {
  user.updateProfile(
    form.value.name,
    form.value.email,
    form.value.city,
    form.value.role
  );
  isEditing.value = false;
}
</script>

<template>
  <Navbar />

  <main class="profile-page">
    <section class="profile-card">
      <div class="avatar">
        {{ user.name.charAt(0) }}
      </div>

      <div v-if="!isEditing" class="profile-info">
        <h1>{{ user.name }}</h1>
        <p class="role">{{ user.role }}</p>

        <div class="details">
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>City:</strong> {{ user.city }}</p>
          <p><strong>University:</strong> {{ user.university }}</p>
          <p><strong>GitHub:</strong> <a :href="user.github" target="_blank">{{ user.github }}</a></p>
        </div>

        <p class="bio">{{ user.bio }}</p>

        <button class="primary-btn" @click="startEdit">
          Edit Profile
        </button>
      </div>

      <form v-else class="edit-form" @submit.prevent="saveProfile">
        <h1>Edit Profile</h1>

        <label>Name</label>
        <input v-model="form.name" type="text" />

        <label>Email</label>
        <input v-model="form.email" type="email" />

        <label>City</label>
        <input v-model="form.city" type="text" />

        <label>Role</label>
        <input v-model="form.role" type="text" />

        <div class="buttons">
          <button class="primary-btn" type="submit">Save Changes</button>
          <button class="secondary-btn" type="button" @click="cancelEdit">
            Cancel
          </button>
        </div>
      </form>
    </section>

    <section class="summary-grid">
      <div class="summary-card">
        <h2>{{ user.skillsCount }}</h2>
        <p>Skills</p>
      </div>

      <div class="summary-card">
        <h2>{{ user.projectsCount }}</h2>
        <p>Projects</p>
      </div>

      <div class="summary-card">
        <h2>{{ user.certificatesCount }}</h2>
        <p>Certificates</p>
      </div>

      <div class="summary-card">
        <h2>{{ user.progress }}%</h2>
        <p>Profile Progress</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.profile-page {
  padding: 60px 8%;
  background: #f4f7fb;
  min-height: 100vh;
  color: #1f2937;
}

.profile-card {
  background: white;
  border-radius: 22px;
  padding: 40px;
  display: flex;
  gap: 35px;
  align-items: flex-start;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);
  margin-bottom: 35px;
}

.avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  font-size: 48px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profile-info h1,
.edit-form h1 {
  font-size: 36px;
  margin-bottom: 8px;
}

.role {
  color: #2563eb;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 25px;
}

.details p {
  margin: 8px 0;
  font-size: 16px;
}

.details a {
  color: #2563eb;
  text-decoration: none;
}

.bio {
  margin: 25px 0;
  line-height: 1.6;
  color: #4b5563;
}

.edit-form {
  width: 100%;
}

.edit-form label {
  display: block;
  margin-top: 14px;
  margin-bottom: 6px;
  font-weight: bold;
}

.edit-form input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 15px;
}

.buttons {
  margin-top: 25px;
  display: flex;
  gap: 12px;
}

.primary-btn,
.secondary-btn {
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
}

.primary-btn {
  background: #2563eb;
  color: white;
}

.secondary-btn {
  background: #e5e7eb;
  color: #1f2937;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
}

.summary-card {
  background: white;
  border-radius: 18px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
}

.summary-card h2 {
  color: #2563eb;
  font-size: 34px;
  margin-bottom: 8px;
}

.summary-card p {
  color: #4b5563;
  font-weight: bold;
}

@media (max-width: 900px) {
  .profile-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
