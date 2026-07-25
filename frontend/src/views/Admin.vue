<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../services/api";

const users = ref([]);
const skills = ref([]);
const projects = ref([]);
const certificates = ref([]);

const loading = ref(false);
const message = ref("");
const error = ref("");

const userForm = ref({
  name: "",
  email: "",
  password: "",
  role: "user",
});

const skillForm = ref({
  name: "",
  category: "",
});

const projectForm = ref({
  title: "",
  description: "",
  github: "",
  status: "Planned",
});

const certificateForm = ref({
  name: "",
  provider: "",
  date: "",
  link: "",
});

const stats = computed(() => [
  { label: "Users", value: users.value.length },
  { label: "Skills", value: skills.value.length },
  { label: "Projects", value: projects.value.length },
  { label: "Certificates", value: certificates.value.length },
]);

function showMessage(text) {
  message.value = text;
  error.value = "";
}

function showError(text) {
  error.value = text;
  message.value = "";
}

async function loadData() {
  loading.value = true;

  try {
    const [usersRes, skillsRes, projectsRes, certificatesRes] =
      await Promise.all([
        api.get("/users"),
        api.get("/skills"),
        api.get("/projects"),
        api.get("/certificates"),
      ]);

    users.value = usersRes.data || [];
    skills.value = skillsRes.data || [];
    projects.value = projectsRes.data || [];
    certificates.value = certificatesRes.data || [];
  } catch (err) {
    showError("Backend data could not be loaded.");
  } finally {
    loading.value = false;
  }
}

async function addUser() {
  try {
    await api.post("/users", userForm.value);
    userForm.value = { name: "", email: "", password: "", role: "user" };
    showMessage("User added successfully.");
    await loadData();
  } catch (err) {
    showError(err.response?.data?.message || "Could not add user.");
  }
}

async function addSkill() {
  try {
    await api.post("/skills", skillForm.value);
    skillForm.value = { name: "", category: "" };
    showMessage("Skill added successfully.");
    await loadData();
  } catch (err) {
    showError(err.response?.data?.message || "Could not add skill.");
  }
}

async function addProject() {
  try {
    await api.post("/projects", projectForm.value);
    projectForm.value = {
      title: "",
      description: "",
      github: "",
      status: "Planned",
    };
    showMessage("Project added successfully.");
    await loadData();
  } catch (err) {
    showError(err.response?.data?.message || "Could not add project.");
  }
}

async function addCertificate() {
  try {
    await api.post("/certificates", certificateForm.value);
    certificateForm.value = {
      name: "",
      provider: "",
      date: "",
      link: "",
    };
    showMessage("Certificate added successfully.");
    await loadData();
  } catch (err) {
    showError(err.response?.data?.message || "Could not add certificate.");
  }
}

async function deleteItem(type, id) {
  if (!id) {
    showError("Item ID is missing.");
    return;
  }

  if (!confirm("Are you sure you want to delete this item?")) return;

  try {
    await api.delete(`/${type}/${id}`);
    showMessage("Item deleted successfully.");
    await loadData();
  } catch (err) {
    showError(err.response?.data?.message || "Could not delete item.");
  }
}

onMounted(loadData);
</script>

<template>
  <main class="admin-page">
    <section class="admin-header">
      <div>
        <p class="tag">ADMIN AREA</p>
        <h1>CareerBridge Admin Panel</h1>
        <p>
          Manage all platform data: users, skills, projects and certificates.
        </p>
      </div>

      <button @click="loadData">Refresh</button>
    </section>

    <p v-if="message" class="success">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="loading" class="loading">Loading data...</p>

    <section class="stats-grid">
      <div v-for="item in stats" :key="item.label" class="stat-card">
        <h2>{{ item.value }}</h2>
        <p>{{ item.label }}</p>
      </div>
    </section>

    <section class="admin-grid">
      <div class="admin-card">
        <h2>Add User</h2>
        <form @submit.prevent="addUser">
          <input v-model="userForm.name" placeholder="Name" />
          <input v-model="userForm.email" placeholder="Email" />
          <input v-model="userForm.password" placeholder="Password" />
          <select v-model="userForm.role">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button>Add User</button>
        </form>

        <h3>Users</h3>
        <ul>
          <li v-for="user in users" :key="user._id">
            <span>{{ user.name }} — {{ user.email }} — {{ user.role }}</span>
            <button class="danger" @click="deleteItem('users', user._id)">
              Delete
            </button>
          </li>
        </ul>
      </div>

      <div class="admin-card">
        <h2>Add Skill</h2>
        <form @submit.prevent="addSkill">
          <input v-model="skillForm.name" placeholder="Skill name" />
          <input v-model="skillForm.category" placeholder="Category" />
          <button>Add Skill</button>
        </form>

        <h3>Skills</h3>
        <ul>
          <li v-for="skill in skills" :key="skill._id">
            <span>{{ skill.name }} — {{ skill.category }}</span>
            <button class="danger" @click="deleteItem('skills', skill._id)">
              Delete
            </button>
          </li>
        </ul>
      </div>

      <div class="admin-card">
        <h2>Add Project</h2>
        <form @submit.prevent="addProject">
          <input v-model="projectForm.title" placeholder="Project title" />
          <input v-model="projectForm.description" placeholder="Description" />
          <input v-model="projectForm.github" placeholder="GitHub link" />
          <select v-model="projectForm.status">
            <option value="Planned">Planned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button>Add Project</button>
        </form>

        <h3>Projects</h3>
        <ul>
          <li v-for="project in projects" :key="project._id">
            <span>{{ project.title }} — {{ project.status }}</span>
            <button class="danger" @click="deleteItem('projects', project._id)">
              Delete
            </button>
          </li>
        </ul>
      </div>

      <div class="admin-card">
        <h2>Add Certificate</h2>
        <form @submit.prevent="addCertificate">
          <input v-model="certificateForm.name" placeholder="Certificate name" />
          <input v-model="certificateForm.provider" placeholder="Provider" />
          <input v-model="certificateForm.date" type="date" />
          <input v-model="certificateForm.link" placeholder="Link" />
          <button>Add Certificate</button>
        </form>

        <h3>Certificates</h3>
        <ul>
          <li v-for="certificate in certificates" :key="certificate._id">
            <span>{{ certificate.name }} — {{ certificate.provider }}</span>
            <button
              class="danger"
              @click="deleteItem('certificates', certificate._id)"
            >
              Delete
            </button>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<style scoped>
.admin-page {
  min-height: 100vh;
  padding: 40px 7%;
  background: #f4f7fb;
  color: #111827;
}

.admin-header {
  background: linear-gradient(135deg, #10213f, #3345d9);
  color: white;
  border-radius: 24px;
  padding: 35px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  margin-bottom: 30px;
}

.tag {
  letter-spacing: 3px;
  font-size: 13px;
  font-weight: bold;
  color: #bfdbfe;
}

.admin-header h1 {
  font-size: 38px;
  margin: 8px 0;
}

.admin-header button,
form button {
  background: white;
  color: #1d4ed8;
  border: none;
  padding: 12px 18px;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 30px;
}

.stat-card,
.admin-card {
  background: white;
  border-radius: 18px;
  padding: 25px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
}

.stat-card {
  text-align: center;
}

.stat-card h2 {
  color: #2563eb;
  font-size: 34px;
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.admin-card h2,
.admin-card h3 {
  margin-bottom: 15px;
}

form {
  display: grid;
  gap: 10px;
  margin-bottom: 25px;
}

input,
select {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
}

form button {
  background: #2563eb;
  color: white;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

.danger {
  background: #fee2e2;
  color: #b91c1c;
  border: none;
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
}

.success,
.error,
.loading {
  background: white;
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 18px;
  font-weight: bold;
}

.success {
  color: #15803d;
}

.error {
  color: #b91c1c;
}

@media (max-width: 900px) {
  .stats-grid,
  .admin-grid {
    grid-template-columns: 1fr;
  }

  .admin-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
