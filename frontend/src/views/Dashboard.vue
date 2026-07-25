<template>
  <main class="dashboard-page">
    <section class="dashboard-hero">
      <div>
        <p class="eyebrow">DASHBOARD</p>
        <h1>Welcome back, {{ userName }}</h1>
        <p>
          This is your personal CareerBridge overview. Here you can see your own
          skills, projects, certificates and profile progress.
        </p>
      </div>

      <div class="hero-actions">
        <RouterLink to="/" class="btn light">Home</RouterLink>
        <RouterLink to="/skills" class="btn light">Skills</RouterLink>
        <RouterLink to="/projects" class="btn light">Projects</RouterLink>
        <RouterLink to="/certificates" class="btn light">Certificates</RouterLink>
      </div>
    </section>

    <section class="stats-grid">
      <article class="stat-card">
        <strong>{{ skills.length }}</strong>
        <span>Skills</span>
      </article>

      <article class="stat-card">
        <strong>{{ projects.length }}</strong>
        <span>Projects</span>
      </article>

      <article class="stat-card">
        <strong>{{ certificates.length }}</strong>
        <span>Certificates</span>
      </article>

      <article class="stat-card progress-card">
        <strong>{{ profileProgress }}%</strong>
        <span>Profile progress</span>

        <div class="progress-track">
          <div class="progress-fill" :style="{ width: profileProgress + '%' }"></div>
        </div>
      </article>
    </section>

    <section class="dashboard-grid">
      <article class="panel">
        <p class="eyebrow blue">QUICK ACTIONS</p>
        <h2>Manage your career profile</h2>

        <div class="quick-actions">
          <RouterLink to="/skills" class="action-card">
            <strong>Add Skill</strong>
            <span>Manage your technical and soft skills.</span>
          </RouterLink>

          <RouterLink to="/projects" class="action-card">
            <strong>Add Project</strong>
            <span>Document your university and personal projects.</span>
          </RouterLink>

          <RouterLink to="/certificates" class="action-card">
            <strong>Add Certificate</strong>
            <span>Save certificates and learning achievements.</span>
          </RouterLink>

          <RouterLink to="/profile" class="action-card">
            <strong>Edit Profile</strong>
            <span>Update your personal career information.</span>
          </RouterLink>
        </div>
      </article>

      <article class="panel">
        <p class="eyebrow blue">CURRENT USER</p>
        <h2>{{ userName }}</h2>
        <p>{{ currentUser?.email }}</p>
        <p class="role-text">Role: {{ currentUser?.role || "user" }}</p>

        <div class="profile-box">
          <div class="profile-head">
            <strong>Profile completion</strong>
            <span>{{ profileProgress }}%</span>
          </div>

          <div class="progress-track">
            <div class="progress-fill" :style="{ width: profileProgress + '%' }"></div>
          </div>
        </div>

        <RouterLink
          v-if="currentUser?.role === 'admin'"
          to="/admin"
          class="admin-link"
        >
          Open Admin Panel
        </RouterLink>
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
const projects = ref([]);
const certificates = ref([]);

const currentUser = computed(() => userStore.user);

const userName = computed(() => {
  return (
    currentUser.value?.name ||
    currentUser.value?.fullName ||
    currentUser.value?.email ||
    "User"
  );
});

const currentUserId = computed(() => {
  return currentUser.value?._id || currentUser.value?.id || currentUser.value?.email;
});

const profileProgress = computed(() => {
  const savedProgress = Number(currentUser.value?.profileProgress);

  if (!Number.isNaN(savedProgress) && savedProgress >= 0) {
    return Math.min(100, Math.max(0, savedProgress));
  }

  const fields = [
    currentUser.value?.name || currentUser.value?.fullName,
    currentUser.value?.email,
    currentUser.value?.city,
    currentUser.value?.professionalRole,
    currentUser.value?.university,
  ];

  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
});

function normalizeList(data, key) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
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

async function refreshCurrentUser() {
  try {
    const response = await api.get("/users");
    const users = normalizeList(response.data, "users");

    const freshUser = users.find((user) => {
      return (
        user.email === currentUser.value?.email ||
        user._id === currentUser.value?._id ||
        user.id === currentUser.value?.id
      );
    });

    if (freshUser) {
      userStore.setUser(freshUser);
    }
  } catch (error) {
    console.error("Current user could not be refreshed:", error);
  }
}

async function loadDashboardData() {
  if (!currentUserId.value) return;

  try {
    await refreshCurrentUser();

    const [skillsRes, projectsRes, certificatesRes] = await Promise.all([
      api.get(`/skills?userId=${currentUserId.value}`),
      api.get(`/projects?userId=${currentUserId.value}`),
      api.get(`/certificates?userId=${currentUserId.value}`),
    ]);

    skills.value = normalizeList(skillsRes.data, "skills").filter(belongsToCurrentUser);
    projects.value = normalizeList(projectsRes.data, "projects").filter(belongsToCurrentUser);
    certificates.value = normalizeList(certificatesRes.data, "certificates").filter(belongsToCurrentUser);
  } catch (error) {
    console.error("Dashboard data could not be loaded:", error);
  }
}

onMounted(loadDashboardData);
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  padding: 3rem 7%;
  background: #f4f7fb;
  color: #0f172a;
}

.dashboard-hero {
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

.dashboard-hero h1 {
  margin: 0.5rem 0 1rem;
  font-size: clamp(2.2rem, 5vw, 4rem);
}

.dashboard-hero p {
  max-width: 720px;
  line-height: 1.7;
}

.eyebrow {
  margin: 0;
  font-size: 0.85rem;
  letter-spacing: 0.35em;
  font-weight: 900;
}

.blue {
  color: #2563eb;
}

.dashboard-hero .eyebrow {
  color: #dbeafe;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  justify-content: flex-end;
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  gap: 1.2rem;
  margin: 2rem 0;
}

.stat-card {
  padding: 2.2rem;
  border-radius: 24px;
  background: white;
  text-align: center;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.stat-card strong {
  display: block;
  font-size: 2.8rem;
  color: #2563eb;
  margin-bottom: 0.8rem;
}

.stat-card span {
  font-weight: 800;
}

.progress-card {
  text-align: left;
}

.progress-card strong,
.progress-card span {
  text-align: center;
}

.progress-track {
  width: 100%;
  height: 12px;
  margin-top: 1rem;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.panel {
  padding: 2rem;
  border-radius: 24px;
  background: white;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.panel h2 {
  margin: 0.8rem 0 1rem;
  font-size: 2rem;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(180px, 1fr));
  gap: 1rem;
}

.action-card {
  padding: 1.2rem;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  text-decoration: none;
  color: #0f172a;
}

.action-card strong,
.action-card span {
  display: block;
}

.action-card span {
  margin-top: 0.5rem;
  color: #64748b;
  line-height: 1.5;
}

.role-text {
  margin-top: 1rem;
  font-weight: 900;
  color: #2563eb;
}

.profile-box {
  margin-top: 1.5rem;
  padding: 1.2rem;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
}

.profile-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-weight: 900;
}

.profile-head span {
  color: #2563eb;
}

.admin-link {
  display: inline-flex;
  margin-top: 1.5rem;
  padding: 0.9rem 1.2rem;
  border-radius: 14px;
  background: #fee2e2;
  color: #991b1b;
  font-weight: 900;
  text-decoration: none;
}

@media (max-width: 950px) {
  .dashboard-hero,
  .dashboard-grid {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-grid,
  .quick-actions {
    grid-template-columns: 1fr;
  }

  .hero-actions {
    justify-content: flex-start;
  }
}
</style>
