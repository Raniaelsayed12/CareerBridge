<template>
  <main class="admin-page">
    <section class="admin-hero">
      <div>
        <p class="eyebrow">ADMIN AREA</p>
        <h1>CareerBridge Admin Panel</h1>
        <p>Manage all accounts and the data that belongs to each user.</p>
      </div>

      <div class="hero-actions">
        <RouterLink to="/" class="btn light">Home</RouterLink>
        <RouterLink to="/dashboard" class="btn light">Dashboard</RouterLink>
        <button class="btn light" @click="loadAdminData">Refresh</button>
        <button class="btn logout" @click="logout">Logout</button>
      </div>
    </section>

    <section class="stats-grid">
      <article><strong>{{ users.length }}</strong><span>Accounts</span></article>
      <article><strong>{{ skills.length }}</strong><span>Skills</span></article>
      <article><strong>{{ projects.length }}</strong><span>Projects</span></article>
      <article><strong>{{ certificates.length }}</strong><span>Certificates</span></article>
    </section>

    <section class="admin-layout">
      <aside class="panel">
        <p class="eyebrow blue">ALL ACCOUNTS</p>
        <h2>Users</h2>

        <div class="admin-search">
          <input v-model="userSearchQuery" placeholder="Search users..." />
        </div>

        <div class="users-list">
          <div
            v-for="user in filteredUsers"
            :key="getUserKey(user)"
            class="user-card"
            :class="{ active: getUserKey(user) === selectedUserKey }"
            @click="selectUser(user)"
          >
            <div>
              <strong>{{ user.name || user.fullName || user.email }}</strong>
              <span>{{ user.email }}</span>
              <small>Role: {{ user.role || "user" }}</small>
            </div>

            <div class="mini-counts">
              <span>{{ getUserSkills(user).length }} S</span>
              <span>{{ getUserProjects(user).length }} P</span>
              <span>{{ getUserCertificates(user).length }} C</span>
            </div>
          </div>
        </div>
      </aside>

      <section class="panel">
        <p class="eyebrow blue">ACCOUNT FORM</p>
        <h2>{{ editingUserId ? "Edit account" : "Add account" }}</h2>

        <form class="grid-form" @submit.prevent="saveUser">
          <input v-model="userForm.name" placeholder="Full name" required />
          <input v-model="userForm.email" type="email" placeholder="Email" required />
          <input v-model="userForm.password" placeholder="Password" required />

          <select v-model="userForm.role">
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>

          <button class="btn primary" type="submit">
            {{ editingUserId ? "Update account" : "Add account" }}
          </button>

          <button v-if="editingUserId" class="btn danger" type="button" @click="cancelUserEdit">
            Cancel
          </button>
        </form>

        <div v-if="selectedUser" class="selected-box">
          <p class="eyebrow blue">SELECTED USER</p>
          <h2>{{ selectedUser.name || selectedUser.email }}</h2>
          <p>{{ selectedUser.email }} — {{ selectedUser.role || "user" }}</p>

          <div class="selected-actions">
            <button class="btn light bordered" @click="editUser(selectedUser)">Edit account</button>
            <button class="btn danger" @click="deleteUser(selectedUser)">Delete account</button>
          </div>
        </div>
      </section>
    </section>

    <section v-if="selectedUser" class="data-sections">
      <article class="panel">
        <p class="eyebrow blue">SKILLS OF {{ selectedUser.name || selectedUser.email }}</p>
        <h2>{{ editingSkillId ? "Edit skill" : "Add skill for selected user" }}</h2>

        <form class="grid-form" @submit.prevent="saveSkill">
          <input v-model="skillForm.name" placeholder="Skill name" required />
          <input v-model="skillForm.category" placeholder="Category" required />

          <button class="btn primary" type="submit">
            {{ editingSkillId ? "Update skill" : "Add skill" }}
          </button>

          <button v-if="editingSkillId" class="btn danger" type="button" @click="cancelSkillEdit">
            Cancel
          </button>
        </form>

        <div class="items-grid">
          <div v-for="skill in selectedSkills" :key="getId(skill)" class="item-card">
            <strong>{{ skill.name || skill.title }}</strong>
            <span>{{ skill.category || "Skill" }}</span>

            <div class="card-actions">
              <button @click="editSkill(skill)">Edit</button>
              <button class="delete" @click="deleteSkill(skill)">Delete</button>
            </div>
          </div>

          <p v-if="selectedSkills.length === 0" class="empty">No skills for this user.</p>
        </div>
      </article>

      <article class="panel">
        <p class="eyebrow blue">PROJECTS OF {{ selectedUser.name || selectedUser.email }}</p>
        <h2>{{ editingProjectId ? "Edit project" : "Add project for selected user" }}</h2>

        <form class="grid-form" @submit.prevent="saveProject">
          <input v-model="projectForm.title" placeholder="Project title" required />
          <input v-model="projectForm.description" placeholder="Description" required />
          <input v-model="projectForm.github" placeholder="GitHub link" />

          <select v-model="projectForm.status">
            <option>Planned</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <button class="btn primary" type="submit">
            {{ editingProjectId ? "Update project" : "Add project" }}
          </button>

          <button v-if="editingProjectId" class="btn danger" type="button" @click="cancelProjectEdit">
            Cancel
          </button>
        </form>

        <div class="items-grid">
          <div v-for="project in selectedProjects" :key="getId(project)" class="item-card">
            <strong>{{ project.title || project.name }}</strong>
            <span>{{ project.status || "Project" }}</span>
            <p>{{ project.description }}</p>

            <div class="card-actions">
              <button @click="editProject(project)">Edit</button>
              <button class="delete" @click="deleteProject(project)">Delete</button>
            </div>
          </div>

          <p v-if="selectedProjects.length === 0" class="empty">No projects for this user.</p>
        </div>
      </article>

      <article class="panel">
        <p class="eyebrow blue">CERTIFICATES OF {{ selectedUser.name || selectedUser.email }}</p>
        <h2>{{ editingCertificateId ? "Edit certificate" : "Add certificate for selected user" }}</h2>

        <form class="grid-form" @submit.prevent="saveCertificate">
          <input v-model="certificateForm.name" placeholder="Certificate name" required />
          <input v-model="certificateForm.provider" placeholder="Provider" required />
          <input v-model="certificateForm.date" type="date" />
          <input v-model="certificateForm.link" placeholder="Certificate link" />

          <button class="btn primary" type="submit">
            {{ editingCertificateId ? "Update certificate" : "Add certificate" }}
          </button>

          <button v-if="editingCertificateId" class="btn danger" type="button" @click="cancelCertificateEdit">
            Cancel
          </button>
        </form>

        <div class="items-grid">
          <div v-for="certificate in selectedCertificates" :key="getId(certificate)" class="item-card">
            <strong>{{ certificate.name || certificate.title }}</strong>
            <span>{{ certificate.provider }}</span>
            <p v-if="certificate.date">Date: {{ certificate.date }}</p>

            <div class="card-actions">
              <button @click="editCertificate(certificate)">Edit</button>
              <button class="delete" @click="deleteCertificate(certificate)">Delete</button>
            </div>
          </div>

          <p v-if="selectedCertificates.length === 0" class="empty">No certificates for this user.</p>
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

const users = ref([]);
const skills = ref([]);
const projects = ref([]);
const certificates = ref([]);
const selectedUserKey = ref("");
const userSearchQuery = ref("");

const editingUserId = ref("");
const editingSkillId = ref("");
const editingProjectId = ref("");
const editingCertificateId = ref("");

const userForm = ref({ name: "", email: "", password: "", role: "user" });
const skillForm = ref({ name: "", category: "" });
const projectForm = ref({ title: "", description: "", github: "", status: "Planned" });
const certificateForm = ref({ name: "", provider: "", date: "", link: "" });

function normalizeList(data, key) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function getId(item) {
  return item?._id || item?.id;
}

function getUserKey(user) {
  return user?._id || user?.id || user?.email || "";
}

function belongsToUser(item, user) {
  const userKeys = [user?._id, user?.id, user?.email].filter(Boolean);
  const owners = [
    item?.userId,
    item?.ownerId,
    item?.accountId,
    item?.userEmail,
    item?.email,
    item?.createdBy,
  ].filter(Boolean);

  return owners.some((owner) => userKeys.includes(owner));
}

function getUserSkills(user) {
  return skills.value.filter((item) => belongsToUser(item, user));
}

function getUserProjects(user) {
  return projects.value.filter((item) => belongsToUser(item, user));
}

function getUserCertificates(user) {
  return certificates.value.filter((item) => belongsToUser(item, user));
}

const filteredUsers = computed(() => {
  const query = userSearchQuery.value.trim().toLowerCase();

  if (!query) {
    return users.value;
  }

  return users.value.filter((user) => {
    const name = String(user.name || "").toLowerCase();
    const email = String(user.email || "").toLowerCase();

    return name.startsWith(query) || email.startsWith(query);
  });
});

const selectedUser = computed(() => {
  return users.value.find((user) => getUserKey(user) === selectedUserKey.value);
});

const selectedSkills = computed(() => selectedUser.value ? getUserSkills(selectedUser.value) : []);
const selectedProjects = computed(() => selectedUser.value ? getUserProjects(selectedUser.value) : []);
const selectedCertificates = computed(() => selectedUser.value ? getUserCertificates(selectedUser.value) : []);

function selectUser(user) {
  selectedUserKey.value = getUserKey(user);
}

async function loadAdminData() {
  try {
    const [usersRes, skillsRes, projectsRes, certificatesRes] = await Promise.all([
      api.get("/users"),
      api.get("/skills"),
      api.get("/projects"),
      api.get("/certificates"),
    ]);

    users.value = normalizeList(usersRes.data, "users");
    skills.value = normalizeList(skillsRes.data, "skills");
    projects.value = normalizeList(projectsRes.data, "projects");
    certificates.value = normalizeList(certificatesRes.data, "certificates");

    if (!selectedUserKey.value && users.value.length) {
      const firstNormalUser = users.value.find((user) => user.role !== "admin");
      selectedUserKey.value = getUserKey(firstNormalUser || users.value[0]);
    }
  } catch (error) {
    console.error("Admin data could not be loaded:", error);
  }
}

async function saveUser() {
  try {
    const payload = { ...userForm.value };

    if (editingUserId.value) {
      await api.put(`/users/${editingUserId.value}`, payload);
    } else {
      await api.post("/users", payload);
    }

    cancelUserEdit();
    await loadAdminData();
  } catch (error) {
    console.error("User could not be saved:", error);
  }
}

function editUser(user) {
  editingUserId.value = getUserKey(user);
  userForm.value = {
    name: user.name || user.fullName || "",
    email: user.email || "",
    password: user.password || "",
    role: user.role || "user",
  };
}

function cancelUserEdit() {
  editingUserId.value = "";
  userForm.value = { name: "", email: "", password: "", role: "user" };
}

async function deleteUser(user) {
  if (!(await confirmAction("Are you sure you want to delete this account?"))) return;

  const id = getUserKey(user);
  if (!id) return;

  try {
    await api.delete(`/users/${id}`);
    if (selectedUserKey.value === id) selectedUserKey.value = "";
    await loadAdminData();
  } catch (error) {
    console.error("User could not be deleted:", error);
  }
}

async function saveSkill() {
  if (!selectedUser.value) return;

  const payload = {
    ...skillForm.value,
    userId: getUserKey(selectedUser.value),
  };

  try {
    if (editingSkillId.value) {
      await api.put(`/skills/${editingSkillId.value}`, payload);
    } else {
      await api.post("/skills", payload);
    }

    cancelSkillEdit();
    await loadAdminData();
  } catch (error) {
    console.error("Skill could not be saved:", error);
  }
}

function editSkill(skill) {
  editingSkillId.value = getId(skill);
  skillForm.value = {
    name: skill.name || skill.title || "",
    category: skill.category || "",
  };
}

function cancelSkillEdit() {
  editingSkillId.value = "";
  skillForm.value = { name: "", category: "" };
}

async function deleteSkill(skill) {
  if (!(await confirmAction("Are you sure you want to delete this skill?"))) return;

  const id = getId(skill);
  if (!id) return;

  try {
    await api.delete(`/skills/${id}`);
    await loadAdminData();
  } catch (error) {
    console.error("Skill could not be deleted:", error);
  }
}

async function saveProject() {
  if (!selectedUser.value) return;

  const payload = {
    ...projectForm.value,
    userId: getUserKey(selectedUser.value),
  };

  try {
    if (editingProjectId.value) {
      await api.put(`/projects/${editingProjectId.value}`, payload);
    } else {
      await api.post("/projects", payload);
    }

    cancelProjectEdit();
    await loadAdminData();
  } catch (error) {
    console.error("Project could not be saved:", error);
  }
}

function editProject(project) {
  editingProjectId.value = getId(project);
  projectForm.value = {
    title: project.title || project.name || "",
    description: project.description || "",
    github: project.github || project.link || "",
    status: project.status || "Planned",
  };
}

function cancelProjectEdit() {
  editingProjectId.value = "";
  projectForm.value = { title: "", description: "", github: "", status: "Planned" };
}

async function deleteProject(project) {
  if (!(await confirmAction("Are you sure you want to delete this project?"))) return;

  const id = getId(project);
  if (!id) return;

  try {
    await api.delete(`/projects/${id}`);
    await loadAdminData();
  } catch (error) {
    console.error("Project could not be deleted:", error);
  }
}

async function saveCertificate() {
  if (!selectedUser.value) return;

  const payload = {
    ...certificateForm.value,
    userId: getUserKey(selectedUser.value),
  };

  try {
    if (editingCertificateId.value) {
      await api.put(`/certificates/${editingCertificateId.value}`, payload);
    } else {
      await api.post("/certificates", payload);
    }

    cancelCertificateEdit();
    await loadAdminData();
  } catch (error) {
    console.error("Certificate could not be saved:", error);
  }
}

function editCertificate(certificate) {
  editingCertificateId.value = getId(certificate);
  certificateForm.value = {
    name: certificate.name || certificate.title || "",
    provider: certificate.provider || "",
    date: certificate.date || "",
    link: certificate.link || "",
  };
}

function cancelCertificateEdit() {
  editingCertificateId.value = "";
  certificateForm.value = { name: "", provider: "", date: "", link: "" };
}

async function deleteCertificate(certificate) {
  if (!(await confirmAction("Are you sure you want to delete this certificate?"))) return;

  const id = getId(certificate);
  if (!id) return;

  try {
    await api.delete(`/certificates/${id}`);
    await loadAdminData();
  } catch (error) {
    console.error("Certificate could not be deleted:", error);
  }
}

function logout() {
  userStore.logout();
  window.location.href = "/login";
}

onMounted(loadAdminData);
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  padding: 3rem 7%;
  background: #f4f7fb;
  color: #0f172a;
}

.admin-hero {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  align-items: center;
  padding: 3rem;
  border-radius: 28px;
  color: white;
  background: linear-gradient(135deg, #14264f, #3447f5);
}

.admin-hero h1 {
  margin: 0.5rem 0 1rem;
  font-size: clamp(2.2rem, 5vw, 4rem);
}

.eyebrow {
  margin: 0;
  letter-spacing: 0.3em;
  font-weight: 900;
}

.blue {
  color: #2563eb;
}

.hero-actions,
.selected-actions,
.card-actions {
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

.btn.bordered {
  border: 1px solid #dbe3ef;
}

.btn.primary {
  background: #2563eb;
  color: white;
}

.btn.danger,
.btn.logout {
  background: #fee2e2;
  color: #991b1b;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.2rem;
  margin: 2rem 0;
}

.stats-grid article,
.panel {
  padding: 2rem;
  border-radius: 24px;
  background: white;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.stats-grid article {
  text-align: center;
}

.stats-grid strong {
  display: block;
  font-size: 2.8rem;
  color: #2563eb;
}

.stats-grid span {
  font-weight: 900;
}

.admin-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
}

.admin-search {
  margin-bottom: 1rem;
}

.admin-search input {
  width: 100%;
  padding: 1rem;
  border-radius: 14px;
  border: 1px solid #dbe3ef;
  font: inherit;
}

.users-list,
.items-grid {
  display: grid;
  gap: 0.9rem;
}

.user-card {
  padding: 1rem;
  border-radius: 18px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  cursor: pointer;
}

.user-card.active {
  background: #e0e7ff;
  border-color: #2563eb;
}

.user-card strong,
.user-card span,
.user-card small {
  display: block;
}

.user-card span,
.user-card small,
.item-card span,
.empty {
  color: #64748b;
}

.mini-counts {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}

.mini-counts span {
  padding: 0.35rem 0.5rem;
  border-radius: 10px;
  background: white;
  color: #1d4ed8;
  font-weight: 900;
}

.grid-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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

.selected-box {
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 20px;
  background: #f8fafc;
}

.data-sections {
  display: grid;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.item-card {
  padding: 1rem;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
}

.item-card strong,
.item-card span {
  display: block;
}

.item-card p {
  color: #475569;
}

.card-actions button {
  border: none;
  padding: 0.65rem 0.9rem;
  border-radius: 12px;
  background: #dbeafe;
  color: #1d4ed8;
  font-weight: 900;
  cursor: pointer;
}

.card-actions .delete {
  background: #fee2e2;
  color: #991b1b;
}

@media (max-width: 950px) {
  .admin-hero,
  .admin-layout,
  .stats-grid,
  .grid-form {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
