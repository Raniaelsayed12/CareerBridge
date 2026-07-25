<template>
  <main v-if="isAdmin" class="admin-info-page">
    <section class="admin-info-card">
      <p class="eyebrow">ADMIN ACCOUNT</p>
      <h1>Skills are managed from the Admin Panel</h1>
      <p>
        The admin account is used to manage all users. To view the skills of
        Hania, Rania or Aly, open the Admin Panel and select a user.
      </p>
      <RouterLink to="/admin" class="admin-info-btn">
        Open Admin Panel
      </RouterLink>
    </section>
  </main>

  <main v-else class="skills-page">
    <section class="skills-hero">
      <div>
        <p class="eyebrow">SKILLS</p>
        <h1>Manage your skills</h1>
        <p>Add, edit and organize your technical and professional skills.</p>
      </div>

      <div class="hero-actions">
        <RouterLink to="/" class="btn light">Home</RouterLink>
        <RouterLink to="/dashboard" class="btn light">Dashboard</RouterLink>
      </div>
    </section>

    <section class="form-panel">
      <h2>{{ editingId ? "Edit Skill" : "Add Skill" }}</h2>

      <form @submit.prevent="saveSkill" class="skill-form">
        <input v-model="form.name" placeholder="Skill name" required />
        <input v-model="form.category" placeholder="Category" required />

        <button type="submit" class="btn primary">
          {{ editingId ? "Update" : "Add Skill" }}
        </button>

        <button
          v-if="editingId"
          type="button"
          class="btn danger"
          @click="cancelEdit"
        >
          Cancel
        </button>
      </form>
    </section>

    <section class="search-panel">
      <input v-model="searchQuery" placeholder="Search skills..." />
    </section>

    <section class="skills-grid">
      <article v-if="filteredSkills.length === 0" class="empty-card">
        No skills added yet. Start by adding your first skill.
      </article>

      <article
        v-for="skill in filteredSkills"
        :key="getSkillId(skill)"
        class="skill-card"
      >
        <div class="skill-initials">
          {{ getInitials(skill.name || skill.title) }}
        </div>

        <span class="skill-category">
          {{ skill.category || "Skill" }}
        </span>

        <h3>{{ skill.name || skill.title }}</h3>
        <p>{{ skill.category || "General" }}</p>

        <div class="card-actions">
          <button class="edit-btn" @click="editSkill(skill)">Edit</button>
          <button class="delete-btn" @click="deleteSkill(skill)">Delete</button>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { useUserStore } from "../stores/userStore";
import api from "../services/api";

const userStore = useUserStore();

const skills = ref([]);
const searchQuery = ref("");
const editingId = ref("");

const form = ref({
  name: "",
  category: "",
});

const isAdmin = computed(() => userStore.user?.role === "admin");

const currentUserId = computed(() => {
  return userStore.user?._id || userStore.user?.id || userStore.user?.email;
});

const filteredSkills = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();

  if (!query) return skills.value;

  return skills.value.filter((skill) => {
    const name = (skill.name || skill.title || "").toLowerCase();
    const category = (skill.category || "").toLowerCase();
    return name.includes(query) || category.includes(query);
  });
});

function normalizeList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.skills)) return data.skills;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function getSkillId(skill) {
  return skill._id || skill.id;
}

function getInitials(text = "SK") {
  return text
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

async function loadSkills() {
  if (!currentUserId.value || isAdmin.value) return;

  try {
    const response = await api.get(`/skills?userId=${currentUserId.value}`);
    skills.value = normalizeList(response.data);
  } catch (error) {
    console.error("Skills could not be loaded:", error);
  }
}

async function saveSkill() {
  if (!currentUserId.value) return;

  const payload = {
    name: form.value.name,
    category: form.value.category,
    userId: currentUserId.value,
  };

  try {
    if (editingId.value) {
      await api.put(`/skills/${editingId.value}`, payload);
    } else {
      await api.post("/skills", payload);
    }

    form.value = { name: "", category: "" };
    editingId.value = "";
    await loadSkills();
  } catch (error) {
    console.error("Skill could not be saved:", error);
  }
}

function editSkill(skill) {
  editingId.value = getSkillId(skill);
  form.value = {
    name: skill.name || skill.title || "",
    category: skill.category || "",
  };
}

function cancelEdit() {
  editingId.value = "";
  form.value = { name: "", category: "" };
}

async function deleteSkill(skill) {
  const id = getSkillId(skill);
  if (!id) return;

  try {
    await api.delete(`/skills/${id}`);
    await loadSkills();
  } catch (error) {
    console.error("Skill could not be deleted:", error);
  }
}

onMounted(loadSkills);
</script>

<style scoped>
.skills-page,
.admin-info-page {
  min-height: 100vh;
  padding: 3rem 7%;
  background: #f4f7fb;
  color: #0f172a;
}

.skills-hero {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  align-items: center;
  padding: 3rem;
  border-radius: 28px;
  color: white;
  background: linear-gradient(135deg, #14264f, #3447f5);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
}

.skills-hero h1 {
  margin: 0.5rem 0 1rem;
  font-size: clamp(2.2rem, 5vw, 4rem);
}

.eyebrow {
  margin: 0;
  color: #2563eb;
  letter-spacing: 0.3em;
  font-weight: 900;
}

.skills-hero .eyebrow {
  color: #dbeafe;
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
  background: white;
  color: #1d4ed8;
}

.btn.primary {
  background: #2563eb;
  color: white;
}

.btn.danger {
  background: #fee2e2;
  color: #991b1b;
}

.form-panel,
.search-panel,
.admin-info-card {
  margin: 2rem 0;
  padding: 2rem;
  border-radius: 24px;
  background: white;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.skill-form {
  display: grid;
  grid-template-columns: 1fr 1fr auto auto;
  gap: 0.8rem;
}

input {
  width: 100%;
  padding: 1rem;
  border-radius: 14px;
  border: 1px solid #dbe3ef;
  font: inherit;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(220px, 1fr));
  gap: 1.5rem;
}

.skill-card,
.empty-card {
  padding: 2rem;
  border-radius: 24px;
  background: white;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.skill-card {
  text-align: center;
  position: relative;
}

.skill-initials {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: #bbf7d0;
  color: #047857;
  font-weight: 900;
}

.skill-category {
  position: absolute;
  top: 2rem;
  right: 2rem;
  padding: 0.45rem 0.8rem;
  border: 1px solid #34d399;
  border-radius: 999px;
  color: #047857;
  font-weight: 800;
  font-size: 0.85rem;
}

.skill-card h3 {
  margin: 1.5rem 0 0.6rem;
  font-size: 1.4rem;
}

.skill-card p {
  color: #64748b;
}

.card-actions {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  margin-top: 1.5rem;
}

.edit-btn,
.delete-btn {
  border: none;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  font-weight: 900;
  cursor: pointer;
}

.edit-btn {
  background: #dbeafe;
  color: #1d4ed8;
}

.delete-btn {
  background: #fee2e2;
  color: #b91c1c;
}

.admin-info-page {
  display: grid;
  place-items: center;
}

.admin-info-card {
  width: min(850px, 100%);
  margin: 0;
}

.admin-info-card h1 {
  font-size: clamp(2rem, 5vw, 4rem);
  margin: 1rem 0;
}

.admin-info-card p {
  color: #64748b;
  line-height: 1.7;
}

.admin-info-btn {
  display: inline-flex;
  margin-top: 1.5rem;
  padding: 1rem 1.3rem;
  border-radius: 14px;
  background: #2563eb;
  color: white;
  font-weight: 900;
  text-decoration: none;
}

@media (max-width: 950px) {
  .skills-hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .skill-form,
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>
