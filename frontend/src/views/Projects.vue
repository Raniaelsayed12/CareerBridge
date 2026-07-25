<template>
  <main class="projects-page">
    <section class="projects-hero">
      <div>
        <p class="eyebrow">PROJECT PORTFOLIO</p>
        <h1>Projects</h1>
        <p>
          Manage your personal and university projects with descriptions,
          GitHub links and status.
        </p>

        <div class="hero-actions">
          <RouterLink to="/" class="btn light">Home</RouterLink>
          <RouterLink to="/dashboard" class="btn light">Dashboard</RouterLink>
        </div>
      </div>

      <div class="hero-count">
        <strong>{{ projects.length }}</strong>
        <span>projects</span>
      </div>
    </section>

    <section class="form-panel">
      <p class="eyebrow">NEW PROJECT</p>
      <h2>{{ editingId ? "Edit project" : "Add a project" }}</h2>

      <form class="project-form" @submit.prevent="saveProject">
        <input v-model="form.title" placeholder="Project title" required />
        <input v-model="form.description" placeholder="Description" required />
        <input v-model="form.github" placeholder="GitHub link" />

        <select v-model="form.status">
          <option>Planned</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <button class="btn primary" type="submit">
          {{ editingId ? "Update project" : "Add project" }}
        </button>

        <button v-if="editingId" class="btn danger" type="button" @click="cancelEdit">
          Cancel
        </button>
      </form>
    </section>

    <section class="search-panel">
      <input v-model="searchQuery" placeholder="Search projects..." />
    </section>

    <section class="projects-grid">
      <article v-if="filteredProjects.length === 0" class="empty-card">
        No projects added yet. Add your first project to show your work and experience.
      </article>

      <article
        v-for="project in filteredProjects"
        :key="getProjectId(project)"
        class="project-card"
      >
        <span class="status">{{ project.status || "Project" }}</span>
        <h3>{{ project.title || project.name }}</h3>
        <p>{{ project.description }}</p>

        <a v-if="project.github || project.link" :href="project.github || project.link" target="_blank">
          GitHub / Link
        </a>

        <div class="card-actions">
          <button class="edit-btn" @click="editProject(project)">Edit</button>
          <button class="delete-btn" @click="deleteProject(project)">Delete</button>
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

const projects = ref([]);
const searchQuery = ref("");
const editingId = ref("");

const form = ref({
  title: "",
  description: "",
  github: "",
  status: "Planned",
});

const currentUserId = computed(() => {
  return userStore.user?._id || userStore.user?.id || userStore.user?.email;
});

function belongsToCurrentUser(item) {
  const keys = [
    currentUserId.value,
    userStore.user?._id,
    userStore.user?.id,
    userStore.user?.email,
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


const filteredProjects = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();

  if (!query) return projects.value;

  return projects.value.filter((project) => {
    const title = (project.title || project.name || "").toLowerCase();
    const description = (project.description || "").toLowerCase();
    const status = (project.status || "").toLowerCase();
    return title.includes(query) || description.includes(query) || status.includes(query);
  });
});

function normalizeList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.projects)) return data.projects;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function getProjectId(project) {
  return project._id || project.id;
}

async function loadProjects() {
  if (!currentUserId.value) return;

  try {
    const response = await api.get(`/projects?userId=${currentUserId.value}`);
    projects.value = normalizeList(response.data).filter(belongsToCurrentUser);
  } catch (error) {
    console.error("Projects could not be loaded:", error);
  }
}

async function saveProject() {
  if (!currentUserId.value) return;

  const payload = {
    title: form.value.title,
    description: form.value.description,
    github: form.value.github,
    status: form.value.status,
    userId: currentUserId.value,
  };

  try {
    if (editingId.value) {
      await api.put(`/projects/${editingId.value}`, payload);
    } else {
      await api.post("/projects", payload);
    }

    form.value = {
      title: "",
      description: "",
      github: "",
      status: "Planned",
    };

    editingId.value = "";
    await loadProjects();
  } catch (error) {
    console.error("Project could not be saved:", error);
  }
}

function editProject(project) {
  editingId.value = getProjectId(project);
  form.value = {
    title: project.title || project.name || "",
    description: project.description || "",
    github: project.github || project.link || "",
    status: project.status || "Planned",
  };
}

function cancelEdit() {
  editingId.value = "";
  form.value = {
    title: "",
    description: "",
    github: "",
    status: "Planned",
  };
}

async function deleteProject(project) {
  const id = getProjectId(project);
  if (!id) return;

  try {
    await api.delete(`/projects/${id}`);
    await loadProjects();
  } catch (error) {
    console.error("Project could not be deleted:", error);
  }
}

onMounted(loadProjects);
</script>

<style scoped>
.projects-page,
.admin-info-page {
  min-height: 100vh;
  padding: 3rem 7%;
  background: #f4f7fb;
  color: #0f172a;
}

.projects-hero {
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

.projects-hero h1 {
  margin: 0.5rem 0 1rem;
  font-size: clamp(2.2rem, 5vw, 4rem);
}

.eyebrow {
  margin: 0;
  color: #2563eb;
  letter-spacing: 0.3em;
  font-weight: 900;
}

.projects-hero .eyebrow {
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

.project-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.9rem;
}

input,
select {
  width: 100%;
  padding: 1rem;
  border-radius: 14px;
  border: 1px solid #dbe3ef;
  font: inherit;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(220px, 1fr));
  gap: 1.5rem;
}

.project-card,
.empty-card {
  padding: 2rem;
  border-radius: 24px;
  background: white;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.project-card h3 {
  font-size: 1.5rem;
  margin: 1rem 0;
}

.project-card p {
  color: #64748b;
  line-height: 1.6;
}

.status {
  display: inline-flex;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  background: #e0e7ff;
  color: #1d4ed8;
  font-weight: 900;
}

.card-actions {
  display: flex;
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
  .projects-hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .project-form,
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
