<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../services/api";

const users = ref([]);
const skills = ref([]);
const projects = ref([]);
const certificates = ref([]);
const loading = ref(true);
const error = ref("");

const stats = computed(() => [
  { label: "Users", value: users.value.length },
  { label: "Skills", value: skills.value.length },
  { label: "Projects", value: projects.value.length },
  { label: "Certificates", value: certificates.value.length },
]);

async function loadData() {
  loading.value = true;
  error.value = "";

  try {
    const [u, s, p, c] = await Promise.all([
      api.get("/users"),
      api.get("/skills"),
      api.get("/projects"),
      api.get("/certificates"),
    ]);

    users.value = u.data || [];
    skills.value = s.data || [];
    projects.value = p.data || [];
    certificates.value = c.data || [];
  } catch (e) {
    error.value = "Backend data could not be loaded.";
  } finally {
    loading.value = false;
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
        <p>Overview of users, skills, projects and certificates.</p>
      </div>

      <button @click="loadData">Refresh</button>
    </section>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="loading" class="loading">Loading data...</p>

    <section class="stats-grid">
      <div v-for="item in stats" :key="item.label" class="stat-card">
        <h2>{{ item.value }}</h2>
        <p>{{ item.label }}</p>
      </div>
    </section>

    <section class="tables">
      <div class="card">
        <h2>Users</h2>
        <ul>
          <li v-for="user in users" :key="user._id || user.email">
            {{ user.name }} — {{ user.email }}
          </li>
        </ul>
      </div>

      <div class="card">
        <h2>Skills</h2>
        <ul>
          <li v-for="skill in skills" :key="skill._id || skill.name">
            {{ skill.name }}
          </li>
        </ul>
      </div>

      <div class="card">
        <h2>Projects</h2>
        <ul>
          <li v-for="project in projects" :key="project._id || project.title">
            {{ project.title || project.name }}
          </li>
        </ul>
      </div>

      <div class="card">
        <h2>Certificates</h2>
        <ul>
          <li v-for="certificate in certificates" :key="certificate._id || certificate.name">
            {{ certificate.name }} — {{ certificate.provider }}
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

.admin-header button {
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
.card {
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

.tables {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.card h2 {
  margin-bottom: 15px;
}

.card li {
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.error,
.loading {
  background: white;
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 18px;
  font-weight: bold;
}

.error {
  color: #b91c1c;
}

@media (max-width: 900px) {
  .stats-grid,
  .tables {
    grid-template-columns: 1fr;
  }

  .admin-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
