<template>
  <main class="skills-page">
    <section class="skills-hero">
      <div>
        <p class="eyebrow">SKILLS</p>
        <h1>Manage your skills</h1>
        <p>Add, edit and organize your technical and professional skills.</p>

        <div class="hero-actions">
          <RouterLink to="/" class="btn light">Home</RouterLink>
          <RouterLink to="/dashboard" class="btn light">Dashboard</RouterLink>
        </div>
      </div>

      <div class="hero-count">
        <strong>{{ skills.length }}</strong>
        <span>skills</span>
      </div>
    </section>

    <section class="form-panel">
      <p class="eyebrow blue">NEW SKILL</p>
      <h2>{{ editingId ? "Edit skill" : "Add a skill" }}</h2>

      <form @submit.prevent="saveSkill" class="skill-form">
        <input v-model="form.name" placeholder="Skill name" required />
        <input v-model="form.category" placeholder="Category" required />

        <button type="submit" class="btn primary">
          {{ editingId ? "Update skill" : "Add skill" }}
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
        No skills added yet. Add your first skill to start building your career profile.
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
import { confirmAction } from "../utils/confirmDialog";
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

const currentUser = computed(() => userStore.user);

const currentUserId = computed(() => {
  return currentUser.value?._id || currentUser.value?.id || currentUser.value?.email;
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

function belongsToCurrentUser(item) {
  const keys = [
    currentUserId.value,
    currentUser.value?._id,
    currentUser.value?.id,
    currentUser.value?.email,
  ].filter(Boolean);

  const owners = [
    item?.userId,
    item?.ownerId,
    item?.accountId,
    item?.userEmail,
    item?.email,
    item?.createdBy,
  ].filter(Boolean);

  return owners.some((owner) => keys.includes(owner));
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
  if (!currentUserId.value) return;

  try {
    const response = await api.get(`/skills?userId=${currentUserId.value}`);
    skills.value = normalizeList(response.data).filter(belongsToCurrentUser);
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
  if (!(await confirmAction("Are you sure you want to delete this skill?"))) return;

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
.skills-page {
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
  background: linear-gradient(135deg, #064e3b, #10b981);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
}

.skills-hero h1 {
  margin: 0.5rem 0 1rem;
  font-size: clamp(2.2rem, 5vw, 4rem);
}

.skills-hero p {
  max-width: 750px;
}

.eyebrow {
  margin: 0;
  letter-spacing: 0.3em;
  font-weight: 900;
}

.blue {
  color: #059669;
}

.skills-hero .eyebrow {
  color: #dbeafe;
}

.hero-actions {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}

.hero-count {
  min-width: 140px;
  padding: 1.5rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  text-align: center;
}

.hero-count strong {
  display: block;
  font-size: 2.8rem;
  color: white;
}

.hero-count span {
  color: white;
  font-weight: 800;
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
  color: #047857;
}

.btn.primary {
  background: #10b981;
  color: white;
}

.btn.danger {
  background: #fee2e2;
  color: #991b1b;
}

.form-panel,
.search-panel {
  margin: 2rem 0;
  padding: 2rem;
  border-radius: 24px;
  background: white;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.form-panel h2 {
  margin: 0.8rem 0 1.2rem;
  font-size: 2rem;
}

.skill-form {
  display: grid;
  grid-template-columns: 1fr 1fr auto auto;
  gap: 0.9rem;
  align-items: center;
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
  color: #047857;
}

.delete-btn {
  background: #fee2e2;
  color: #b91c1c;
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
