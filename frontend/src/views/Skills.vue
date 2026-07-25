<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();
const router = useRouter();

const currentUserId = ref("");
const skills = ref([]);
const search = ref("");
const message = ref("");
const error = ref("");
const editingId = ref("");

const form = ref({
  name: "",
  category: "",
});

const filteredSkills = computed(() => {
  const value = search.value.toLowerCase().trim();

  if (!value) return skills.value;

  return skills.value.filter((skill) => {
    return (
      skill.name?.toLowerCase().includes(value) ||
      skill.category?.toLowerCase().includes(value)
    );
  });
});



function goHome() {
  router.push("/");
}

function goDashboard() {
  router.push("/dashboard");
}

function clearForm() {
  form.value = {
    name: "",
    category: "",
  };

  editingId.value = "";
}

async function resolveCurrentUser() {
  const response = await api.get("/users");

  const currentEmail = (userStore.email || "").toLowerCase().trim();

  const currentUser = response.data.find(
    (user) => user.email.toLowerCase().trim() === currentEmail
  );

  currentUserId.value = currentUser?._id || "";
}

async function loadSkills() {
  try {
    if (!currentUserId.value) {
      await resolveCurrentUser();
    }

    const response = await api.get(`/skills?userId=${currentUserId.value}`);
    skills.value = response.data || [];
  } catch (err) {
    error.value = "Skills could not be loaded.";
  }
}

async function saveSkill() {
  if (!form.value.name) {
    error.value = "Skill name is required.";
    message.value = "";
    return;
  }

  try {
    const payload = {
      userId: currentUserId.value,
      name: form.value.name,
      category: form.value.category,
    };

    if (editingId.value) {
      await api.put(`/skills/${editingId.value}`, payload);
      message.value = "Skill updated successfully.";
    } else {
      await api.post("/skills", payload);
      message.value = "Skill added successfully.";
    }

    error.value = "";
    clearForm();
    await loadSkills();
  } catch (err) {
    error.value = err.response?.data?.message || "Skill could not be saved.";
    message.value = "";
  }
}

function editSkill(skill) {
  editingId.value = skill._id;

  form.value = {
    name: skill.name || "",
    category: skill.category || "",
  };
}

async function deleteSkill(skill) {
  if (!confirm(`Delete skill: ${skill.name}?`)) return;

  try {
    await api.delete(`/skills/${skill._id}`);
    message.value = "Skill deleted successfully.";
    error.value = "";
    await loadSkills();
  } catch (err) {
    error.value = "Skill could not be deleted.";
    message.value = "";
  }
}

onMounted(loadSkills);
</script>

<template>
  <main class="page">
    <section class="hero">
      <div>
        <p class="tag">SKILL MANAGEMENT</p>
        <h1>Skills</h1>
        <p>Organize your technical and professional skills by category.</p>
        <div class="hero-actions">
          <button type="button" @click="goHome">Home</button>
          <button type="button" @click="goDashboard">Dashboard</button>
        </div>
      </div>

      <div class="counter">
        <strong>{{ skills.length }}</strong>
        <span>skills</span>
      </div>
    </section>

    <p v-if="message" class="success">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>

    <section class="form-card">
      <div>
        <p class="tag green">NEW SKILL</p>
        <h2>{{ editingId ? "Edit skill" : "Add a skill" }}</h2>
      </div>

      <form @submit.prevent="saveSkill">
        <input v-model="form.name" placeholder="Skill name" />
        <input v-model="form.category" placeholder="Category" />

        <div class="buttons">
          <button type="submit">
            {{ editingId ? "Save changes" : "Add skill" }}
          </button>

          <button v-if="editingId" type="button" class="secondary" @click="clearForm">
            Cancel
          </button>
        </div>
      </form>
    </section>

    <section class="list-header">
      <div>
        <p class="tag green">SKILL COLLECTION</p>
        <h2>Your skills</h2>
      </div>

      <input v-model="search" placeholder="Search skills..." />
    </section>

    <section class="cards">
      <article v-for="skill in filteredSkills" :key="skill._id" class="card">
        <div class="card-top">
          <span class="icon">
            {{ skill.name?.slice(0, 2).toUpperCase() }}
          </span>

          <span class="badge">{{ skill.category || "General" }}</span>
        </div>

        <h3>{{ skill.name }}</h3>
        <p>{{ skill.category || "General" }}</p>

        <div class="card-actions">
          <button class="edit" @click="editSkill(skill)">Edit</button>
          <button class="delete" @click="deleteSkill(skill)">Delete</button>
        </div>
      </article>

      <p v-if="filteredSkills.length === 0" class="empty">
        No skills for this account.
      </p>
    </section>
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 40px 7%;
  background: #f8fafc;
  color: #0f172a;
}

.hero {
  background: linear-gradient(135deg, #064e3b, #10b981);
  color: white;
  border-radius: 24px;
  padding: 45px;
  display: flex;
  justify-content: space-between;
  gap: 25px;
  align-items: center;
  margin-bottom: 28px;
}

.hero h1 {
  font-size: 52px;
  margin: 8px 0;
}

.tag {
  letter-spacing: 3px;
  font-size: 13px;
  font-weight: 800;
}

.green {
  color: #047857;
}

.counter {
  background: rgba(255, 255, 255, 0.22);
  border-radius: 18px;
  padding: 22px 38px;
  display: grid;
  gap: 4px;
  text-align: center;
}

.counter strong {
  font-size: 34px;
}

.hero-actions {
  display: flex;
  gap: 10px;
  margin-top: 22px;
}

.hero-actions button {
  background: white;
  color: #1d4ed8;
  border: none;
  border-radius: 12px;
  padding: 12px 18px;
  font-weight: 800;
  cursor: pointer;
}

.form-card,
.card,
.empty {
  background: white;
  border-radius: 18px;
  padding: 28px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-top: 18px;
}

input {
  width: 100%;
  box-sizing: border-box;
  padding: 14px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
}

.buttons {
  grid-column: 1 / -1;
  display: flex;
  gap: 10px;
}

button {
  border: none;
  border-radius: 12px;
  padding: 13px 18px;
  font-weight: 800;
  cursor: pointer;
}

form button {
  background: #059669;
  color: white;
}

.secondary {
  background: #e5e7eb;
  color: #374151;
}

.success,
.error {
  background: white;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 18px;
  font-weight: 800;
}

.success {
  color: #15803d;
}

.error {
  color: #b91c1c;
}

.list-header {
  margin: 32px 0 18px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: end;
}

.list-header input {
  max-width: 330px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.icon {
  background: #d1fae5;
  color: #047857;
  border-radius: 14px;
  padding: 14px;
  font-weight: 900;
}

.badge {
  border: 1px solid #6ee7b7;
  color: #047857;
  border-radius: 999px;
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 800;
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

.edit {
  background: #dbeafe;
  color: #1d4ed8;
}

.delete {
  background: #fee2e2;
  color: #b91c1c;
}

.empty {
  grid-column: 1 / -1;
  color: #64748b;
}

@media (max-width: 900px) {
  .hero,
  .list-header {
    flex-direction: column;
    align-items: flex-start;
  }

  form,
  .cards {
    grid-template-columns: 1fr;
  }
}
</style>
