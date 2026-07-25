<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();
const router = useRouter();

const currentUserId = ref("");
const projects = ref([]);
const search = ref("");
const message = ref("");
const error = ref("");
const editingId = ref("");

const form = ref({
  title: "",
  description: "",
  github: "",
  status: "Planned",
});

const filteredProjects = computed(() => {
  const value = search.value.toLowerCase().trim();

  if (!value) return projects.value;

  return projects.value.filter((project) => {
    return (
      project.title?.toLowerCase().includes(value) ||
      project.description?.toLowerCase().includes(value) ||
      project.status?.toLowerCase().includes(value)
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
    title: "",
    description: "",
    github: "",
    status: "Planned",
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

async function loadProjects() {
  try {
    if (!currentUserId.value) {
      await resolveCurrentUser();
    }

    const response = await api.get(`/projects?userId=${currentUserId.value}`);
    projects.value = response.data || [];
  } catch (err) {
    error.value = "Projects could not be loaded.";
  }
}

async function saveProject() {
  if (!form.value.title) {
    error.value = "Project title is required.";
    message.value = "";
    return;
  }

  try {
    const payload = {
      userId: currentUserId.value,
      title: form.value.title,
      description: form.value.description,
      github: form.value.github,
      status: form.value.status,
    };

    if (editingId.value) {
      await api.put(`/projects/${editingId.value}`, payload);
      message.value = "Project updated successfully.";
    } else {
      await api.post("/projects", payload);
      message.value = "Project added successfully.";
    }

    error.value = "";
    clearForm();
    await loadProjects();
  } catch (err) {
    error.value = err.response?.data?.message || "Project could not be saved.";
    message.value = "";
  }
}

function editProject(project) {
  editingId.value = project._id;

  form.value = {
    title: project.title || "",
    description: project.description || "",
    github: project.github || "",
    status: project.status || "Planned",
  };
}

async function deleteProject(project) {
  if (!confirm(`Delete project: ${project.title}?`)) return;

  try {
    await api.delete(`/projects/${project._id}`);
    message.value = "Project deleted successfully.";
    error.value = "";
    await loadProjects();
  } catch (err) {
    error.value = "Project could not be deleted.";
    message.value = "";
  }
}

onMounted(loadProjects);
</script>

<template>
  <main class="page">
    <section class="hero">
      <div>
        <p class="tag">PROJECT PORTFOLIO</p>
        <h1>Projects</h1>
        <p>
          Manage your personal and university projects with descriptions,
          GitHub links and status.
        </p>

        <div class="hero-actions">
          <button type="button" @click="goHome">Home</button>
          <button type="button" @click="goDashboard">Dashboard</button>
        </div>
      </div>

      <div class="counter">
        <strong>{{ projects.length }}</strong>
        <span>projects</span>
      </div>
    </section>

    <p v-if="message" class="success">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>

    <section class="form-card">
      <div>
        <p class="tag blue">NEW PROJECT</p>
        <h2>{{ editingId ? "Edit project" : "Add a project" }}</h2>
      </div>

      <form @submit.prevent="saveProject">
        <input v-model="form.title" placeholder="Project title" />
        <input v-model="form.description" placeholder="Description" />
        <input v-model="form.github" placeholder="GitHub link" />

        <select v-model="form.status">
          <option value="Planned">Planned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <div class="buttons">
          <button type="submit">
            {{ editingId ? "Save changes" : "Add project" }}
          </button>

          <button v-if="editingId" type="button" class="secondary" @click="clearForm">
            Cancel
          </button>
        </div>
      </form>
    </section>

    <section class="list-header">
      <div>
        <p class="tag blue">PROJECT COLLECTION</p>
        <h2>Your projects</h2>
      </div>

      <input v-model="search" placeholder="Search projects..." />
    </section>

    <section class="cards">
      <article v-for="project in filteredProjects" :key="project._id" class="card">
        <div class="card-top">
          <span class="icon">
            {{ project.title?.slice(0, 2).toUpperCase() }}
          </span>

          <span class="badge">{{ project.status }}</span>
        </div>

        <h3>{{ project.title }}</h3>
        <p>{{ project.description }}</p>

        <a v-if="project.github" :href="project.github" target="_blank">
          Open GitHub
        </a>

        <div class="card-actions">
          <button class="edit" @click="editProject(project)">Edit</button>
          <button class="delete" @click="deleteProject(project)">Delete</button>
        </div>
      </article>

      <p v-if="filteredProjects.length === 0" class="empty">
        No projects for this account.
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
  background: linear-gradient(135deg, #172554, #2563eb);
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

.blue {
  color: #2563eb;
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

input,
select {
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
  background: #2563eb;
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
  background: #dbeafe;
  color: #1d4ed8;
  border-radius: 14px;
  padding: 14px;
  font-weight: 900;
}

.badge {
  border: 1px solid #93c5fd;
  color: #1d4ed8;
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
