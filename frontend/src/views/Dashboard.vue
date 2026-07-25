<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { useUserStore } from "../stores/userStore";

const router = useRouter();
const userStore = useUserStore();

const currentUser = ref(null);
const skills = ref([]);
const projects = ref([]);
const certificates = ref([]);
const error = ref("");

const progress = computed(() => {
  let score = 20;

  score += Math.min(skills.value.length * 10, 25);
  score += Math.min(projects.value.length * 15, 30);
  score += Math.min(certificates.value.length * 10, 25);

  return Math.min(score, 100);
});

const recentItems = computed(() => {
  return [
    ...skills.value.slice(0, 2).map((item) => ({
      title: item.name,
      type: "Skill",
    })),
    ...projects.value.slice(0, 2).map((item) => ({
      title: item.title || item.name,
      type: "Project",
    })),
    ...certificates.value.slice(0, 2).map((item) => ({
      title: item.name,
      type: "Certificate",
    })),
  ];
});

async function resolveCurrentUser() {
  const response = await api.get("/users");

  const email = (userStore.email || "").toLowerCase().trim();

  currentUser.value = response.data.find(
    (user) => user.email.toLowerCase().trim() === email
  );
}

async function loadDashboard() {
  try {
    await resolveCurrentUser();

    if (!currentUser.value) {
      error.value = "Current user could not be found.";
      return;
    }

    if (currentUser.value.role === "admin") {
      router.push("/admin");
      return;
    }

    const userId = currentUser.value._id;

    const [skillsRes, projectsRes, certificatesRes] = await Promise.all([
      api.get(`/skills?userId=${userId}`),
      api.get(`/projects?userId=${userId}`),
      api.get(`/certificates?userId=${userId}`),
    ]);

    skills.value = skillsRes.data || [];
    projects.value = projectsRes.data || [];
    certificates.value = certificatesRes.data || [];
  } catch (err) {
    error.value = "Dashboard data could not be loaded.";
  }
}

function goHome() {
  router.push("/");
}

function goTo(path) {
  router.push(path);
}

onMounted(loadDashboard);
</script>

<template>
  <main class="dashboard-page">
    <section class="hero">
      <div>
        <p class="tag">CAREER OVERVIEW</p>
        <h1>Welcome back, {{ currentUser?.name || userStore.name }}</h1>
        <p>
          This dashboard shows only your own skills, projects and certificates.
        </p>
      </div>

      <div class="hero-actions">
        <button @click="goHome">Home</button>
        <button @click="loadDashboard">Refresh</button>
      </div>
    </section>

    <p v-if="error" class="error">{{ error }}</p>

    <section class="stats-grid">
      <article class="stat-card" @click="goTo('/skills')">
        <span>S</span>
        <h2>{{ skills.length }}</h2>
        <p>Skills</p>
      </article>

      <article class="stat-card" @click="goTo('/projects')">
        <span>P</span>
        <h2>{{ projects.length }}</h2>
        <p>Projects</p>
      </article>

      <article class="stat-card" @click="goTo('/certificates')">
        <span>C</span>
        <h2>{{ certificates.length }}</h2>
        <p>Certificates</p>
      </article>
    </section>

    <section class="progress-card">
      <div>
        <h2>Profile progress</h2>
        <p>Progress is calculated from your personal data.</p>
      </div>

      <strong>{{ progress }}%</strong>

      <div class="progress-bar">
        <div :style="{ width: progress + '%' }"></div>
      </div>
    </section>

    <section class="content-grid">
      <article class="panel">
        <h2>Your skills</h2>

        <p v-if="skills.length === 0" class="empty">No skills yet.</p>

        <ul>
          <li v-for="skill in skills" :key="skill._id">
            <strong>{{ skill.name }}</strong>
            <span>{{ skill.category || "General" }}</span>
          </li>
        </ul>

        <button @click="goTo('/skills')">Manage skills</button>
      </article>

      <article class="panel">
        <h2>Your projects</h2>

        <p v-if="projects.length === 0" class="empty">No projects yet.</p>

        <ul>
          <li v-for="project in projects" :key="project._id">
            <strong>{{ project.title || project.name }}</strong>
            <span>{{ project.status || "Planned" }}</span>
          </li>
        </ul>

        <button @click="goTo('/projects')">Manage projects</button>
      </article>

      <article class="panel">
        <h2>Your certificates</h2>

        <p v-if="certificates.length === 0" class="empty">No certificates yet.</p>

        <ul>
          <li v-for="certificate in certificates" :key="certificate._id">
            <strong>{{ certificate.name }}</strong>
            <span>{{ certificate.provider || "No provider" }}</span>
          </li>
        </ul>

        <button @click="goTo('/certificates')">Manage certificates</button>
      </article>

      <article class="panel">
        <h2>Recent activity</h2>

        <p v-if="recentItems.length === 0" class="empty">No activity yet.</p>

        <ul>
          <li v-for="item in recentItems" :key="item.type + item.title">
            <strong>{{ item.title }}</strong>
            <span>{{ item.type }}</span>
          </li>
        </ul>

        <button @click="goTo('/resume')">Open resume</button>
      </article>
    </section>
  </main>
</template>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  padding: 40px 7%;
  background: #f8fafc;
  color: #0f172a;
}

.hero {
  background: linear-gradient(135deg, #172554, #4f46e5);
  color: white;
  border-radius: 24px;
  padding: 38px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  margin-bottom: 28px;
}

.tag {
  letter-spacing: 3px;
  font-size: 13px;
  font-weight: 800;
  color: #bfdbfe;
}

.hero h1 {
  font-size: 42px;
  margin: 8px 0;
}

.hero-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.hero-actions button {
  background: white;
  color: #1d4ed8;
  border: none;
  border-radius: 12px;
  padding: 13px 18px;
  font-weight: 800;
  cursor: pointer;
}

.hero button,
.panel button {
  border: none;
  border-radius: 12px;
  padding: 13px 18px;
  font-weight: 800;
  cursor: pointer;
}

.hero button {
  background: white;
  color: #1d4ed8;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  margin-bottom: 24px;
}

.stat-card,
.progress-card,
.panel,
.error {
  background: white;
  border-radius: 18px;
  padding: 25px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.stat-card {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
}

.stat-card span {
  background: #dbeafe;
  color: #1d4ed8;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 900;
}

.stat-card h2 {
  color: #2563eb;
  font-size: 36px;
  margin: 18px 0 4px;
}

.progress-card {
  margin-bottom: 24px;
}

.progress-card strong {
  display: block;
  color: #2563eb;
  font-size: 30px;
  margin: 14px 0;
}

.progress-bar {
  height: 12px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar div {
  height: 100%;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.panel h2 {
  margin-bottom: 15px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0 0 18px;
}

li {
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

li span,
.empty {
  color: #64748b;
}

.panel button {
  background: #2563eb;
  color: white;
}

.error {
  color: #b91c1c;
  margin-bottom: 18px;
  font-weight: 800;
}

@media (max-width: 900px) {
  .hero,
  .stats-grid,
  .content-grid {
    grid-template-columns: 1fr;
  }

  .hero {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
