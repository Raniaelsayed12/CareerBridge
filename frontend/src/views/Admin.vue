<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { useUserStore } from "../stores/userStore";

const router = useRouter();
const userStore = useUserStore();

const adminEmail = "haniaalilat24@gmail.com";

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

const editing = ref({
  type: "",
  id: "",
});

const editForm = ref({
  name: "",
  email: "",
  password: "",
  role: "user",
  category: "",
  title: "",
  description: "",
  github: "",
  status: "Planned",
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

function isCurrentUserAdmin() {
  return (userStore.email || "").toLowerCase().trim() === adminEmail;
}

function goHome() {
  router.push("/");
}

function goDashboard() {
  router.push("/dashboard");
}

function logout() {
  userStore.logout();
  router.push("/login");
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
    showError("Backend data could not be loaded. Please check the server.");
  } finally {
    loading.value = false;
  }
}

async function addUser() {
  if (!userForm.value.name || !userForm.value.email || !userForm.value.password) {
    showError("Name, email and password are required.");
    return;
  }

  try {
    await api.post("/users", userForm.value);

    userForm.value = {
      name: "",
      email: "",
      password: "",
      role: "user",
    };

    showMessage("User added successfully.");
    await loadData();
  } catch (err) {
    showError(err.response?.data?.message || "Could not add user.");
  }
}

async function addSkill() {
  if (!skillForm.value.name) {
    showError("Skill name is required.");
    return;
  }

  try {
    await api.post("/skills", skillForm.value);

    skillForm.value = {
      name: "",
      category: "",
    };

    showMessage("Skill added successfully.");
    await loadData();
  } catch (err) {
    showError(err.response?.data?.message || "Could not add skill.");
  }
}

async function addProject() {
  if (!projectForm.value.title) {
    showError("Project title is required.");
    return;
  }

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
  if (!certificateForm.value.name) {
    showError("Certificate name is required.");
    return;
  }

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

function startEdit(type, item) {
  editing.value = {
    type,
    id: item._id || item.id,
  };

  editForm.value = {
    name: item.name || "",
    email: item.email || "",
    password: "",
    role: item.role || "user",
    category: item.category || "",
    title: item.title || item.name || "",
    description: item.description || "",
    github: item.github || "",
    status: item.status || "Planned",
    provider: item.provider || "",
    date: item.date || "",
    link: item.link || "",
  };
}

function cancelEdit() {
  editing.value = {
    type: "",
    id: "",
  };
}

async function saveEdit() {
  if (!editing.value.type || !editing.value.id) {
    showError("No item selected for editing.");
    return;
  }

  try {
    let payload = {};

    if (editing.value.type === "users") {
      payload = {
        name: editForm.value.name,
        email: editForm.value.email,
        role: editForm.value.role,
      };

      if (editForm.value.password) {
        payload.password = editForm.value.password;
      }
    }

    if (editing.value.type === "skills") {
      payload = {
        name: editForm.value.name,
        category: editForm.value.category,
      };
    }

    if (editing.value.type === "projects") {
      payload = {
        title: editForm.value.title,
        description: editForm.value.description,
        github: editForm.value.github,
        status: editForm.value.status,
      };
    }

    if (editing.value.type === "certificates") {
      payload = {
        name: editForm.value.name,
        provider: editForm.value.provider,
        date: editForm.value.date,
        link: editForm.value.link,
      };
    }

    await api.put(`/${editing.value.type}/${editing.value.id}`, payload);

    showMessage("Item updated successfully.");
    cancelEdit();
    await loadData();
  } catch (err) {
    showError(err.response?.data?.message || "Could not update item.");
  }
}

async function deleteItem(type, id, label) {
  if (!id) {
    showError("Item ID is missing.");
    return;
  }

  const confirmed = confirm(`Are you sure you want to delete: ${label}?`);

  if (!confirmed) return;

  try {
    await api.delete(`/${type}/${id}`);
    showMessage("Item deleted successfully.");
    await loadData();
  } catch (err) {
    showError(err.response?.data?.message || "Could not delete item.");
  }
}

onMounted(() => {
  if (!isCurrentUserAdmin()) {
    router.push("/dashboard");
    return;
  }

  loadData();
});
</script>

<template>
  <main class="admin-page">
    <section class="admin-header">
      <div>
        <p class="tag">ADMIN AREA</p>
        <h1>CareerBridge Admin Panel</h1>
        <p>
          Manage all platform data: accounts, skills, projects and certificates.
        </p>
      </div>

      <div class="admin-actions">
        <button @click="goHome">Home</button>
        <button @click="goDashboard">Dashboard</button>
        <button @click="loadData">Refresh</button>
        <button class="logout-admin" @click="logout">Logout</button>
      </div>
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

    <section v-if="editing.type" class="edit-panel">
      <h2>Edit {{ editing.type }}</h2>

      <form @submit.prevent="saveEdit">
        <template v-if="editing.type === 'users'">
          <input v-model="editForm.name" placeholder="Full name" />
          <input v-model="editForm.email" placeholder="Email" />
          <input
            v-model="editForm.password"
            placeholder="New password optional"
            type="password"
          />

          <select v-model="editForm.role">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </template>

        <template v-if="editing.type === 'skills'">
          <input v-model="editForm.name" placeholder="Skill name" />
          <input v-model="editForm.category" placeholder="Category" />
        </template>

        <template v-if="editing.type === 'projects'">
          <input v-model="editForm.title" placeholder="Project title" />
          <input v-model="editForm.description" placeholder="Description" />
          <input v-model="editForm.github" placeholder="GitHub link" />

          <select v-model="editForm.status">
            <option value="Planned">Planned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </template>

        <template v-if="editing.type === 'certificates'">
          <input v-model="editForm.name" placeholder="Certificate name" />
          <input v-model="editForm.provider" placeholder="Provider" />
          <input v-model="editForm.date" type="date" />
          <input v-model="editForm.link" placeholder="Certificate link" />
        </template>

        <div class="edit-actions">
          <button type="submit">Save Changes</button>
          <button type="button" class="cancel" @click="cancelEdit">
            Cancel
          </button>
        </div>
      </form>
    </section>

    <section class="admin-grid">
      <div class="admin-card">
        <h2>Add User</h2>

        <form @submit.prevent="addUser">
          <input v-model="userForm.name" placeholder="Full name" />
          <input v-model="userForm.email" placeholder="Email" />
          <input v-model="userForm.password" placeholder="Password" type="password" />

          <select v-model="userForm.role">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button>Add User</button>
        </form>

        <h3>All Accounts</h3>

        <p v-if="users.length === 0" class="empty">No users found.</p>

        <ul>
          <li v-for="user in users" :key="user._id || user.id">
            <div>
              <strong>{{ user.name }}</strong>
              <span>{{ user.email }}</span>
              <small>Role: {{ user.role || "user" }}</small>
            </div>

            <div class="row-actions">
              <button class="edit" @click="startEdit('users', user)">
                Edit
              </button>

              <button
                class="danger"
                @click="deleteItem('users', user._id || user.id, user.email)"
              >
                Delete
              </button>
            </div>
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

        <p v-if="skills.length === 0" class="empty">No skills found.</p>

        <ul>
          <li v-for="skill in skills" :key="skill._id || skill.id">
            <div>
              <strong>{{ skill.name }}</strong>
              <span>{{ skill.category || "General" }}</span>
            </div>

            <div class="row-actions">
              <button class="edit" @click="startEdit('skills', skill)">
                Edit
              </button>

              <button
                class="danger"
                @click="deleteItem('skills', skill._id || skill.id, skill.name)"
              >
                Delete
              </button>
            </div>
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

        <p v-if="projects.length === 0" class="empty">No projects found.</p>

        <ul>
          <li v-for="project in projects" :key="project._id || project.id">
            <div>
              <strong>{{ project.title || project.name }}</strong>
              <span>{{ project.status || "Planned" }}</span>
              <small>{{ project.github }}</small>
            </div>

            <div class="row-actions">
              <button class="edit" @click="startEdit('projects', project)">
                Edit
              </button>

              <button
                class="danger"
                @click="
                  deleteItem(
                    'projects',
                    project._id || project.id,
                    project.title || project.name
                  )
                "
              >
                Delete
              </button>
            </div>
          </li>
        </ul>
      </div>

      <div class="admin-card">
        <h2>Add Certificate</h2>

        <form @submit.prevent="addCertificate">
          <input v-model="certificateForm.name" placeholder="Certificate name" />
          <input v-model="certificateForm.provider" placeholder="Provider" />
          <input v-model="certificateForm.date" type="date" />
          <input v-model="certificateForm.link" placeholder="Certificate link" />
          <button>Add Certificate</button>
        </form>

        <h3>Certificates</h3>

        <p v-if="certificates.length === 0" class="empty">
          No certificates found.
        </p>

        <ul>
          <li v-for="certificate in certificates" :key="certificate._id || certificate.id">
            <div>
              <strong>{{ certificate.name }}</strong>
              <span>{{ certificate.provider || "No provider" }}</span>
              <small>{{ certificate.date }}</small>
            </div>

            <div class="row-actions">
              <button class="edit" @click="startEdit('certificates', certificate)">
                Edit
              </button>

              <button
                class="danger"
                @click="
                  deleteItem(
                    'certificates',
                    certificate._id || certificate.id,
                    certificate.name
                  )
                "
              >
                Delete
              </button>
            </div>
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

.admin-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.admin-actions button,
form button {
  background: white;
  color: #1d4ed8;
  border: none;
  padding: 12px 18px;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
}

.admin-actions .logout-admin {
  background: #fee2e2;
  color: #b91c1c;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 30px;
}

.stat-card,
.admin-card,
.edit-panel {
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

.edit-panel {
  margin-bottom: 30px;
  border: 2px solid #dbeafe;
}

.edit-panel h2 {
  margin-bottom: 15px;
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
  gap: 14px;
  align-items: center;
}

li div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

li span,
li small {
  color: #64748b;
  font-size: 13px;
}

.row-actions {
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
}

.edit,
.danger,
.cancel {
  border: none;
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
}

.edit {
  background: #dbeafe;
  color: #1d4ed8;
}

.danger {
  background: #fee2e2;
  color: #b91c1c;
}

.cancel {
  background: #e5e7eb;
  color: #374151;
}

.edit-actions {
  display: flex;
  gap: 10px;
}

.success,
.error,
.loading,
.empty {
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

.empty {
  color: #64748b;
  background: #f8fafc;
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

  li {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>