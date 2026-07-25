<template>
  <main class="resume-page">
    <section class="resume-hero">
      <div>
        <p class="eyebrow">PERSONAL RESUME</p>
        <h1>{{ userName }}</h1>
        <p>
          This resume is generated from the current user's profile, skills,
          projects and certificates.
        </p>
      </div>

      <div class="hero-actions">
        <RouterLink to="/" class="btn light">Home</RouterLink>
        <RouterLink to="/dashboard" class="btn light">Dashboard</RouterLink>
        <button class="btn light" @click="printResume">Print Resume</button>
      </div>
    </section>

    <section class="resume-sheet">
      <header class="resume-header">
        <div>
          <h2>{{ userName }}</h2>
          <p class="title">{{ professionalTitle }}</p>
        </div>

        <div class="contact">
          <p>{{ currentUser?.email }}</p>
          <p v-if="currentUser?.city">{{ currentUser.city }}</p>
          <p v-if="currentUser?.university">{{ currentUser.university }}</p>
          <a v-if="currentUser?.github" :href="currentUser.github" target="_blank">
            GitHub Profile
          </a>
        </div>
      </header>

      <section v-if="currentUser?.bio" class="resume-section">
        <h3>Profile</h3>
        <p>{{ currentUser.bio }}</p>
      </section>

      <section class="resume-section">
        <h3>Skills</h3>
        <p v-if="skills.length === 0" class="empty">No skills added yet.</p>

        <div v-else class="chips">
          <span v-for="skill in skills" :key="getId(skill)">
            {{ skill.name || skill.title }} · {{ skill.category || "Skill" }}
          </span>
        </div>
      </section>

      <section class="resume-section">
        <h3>Projects</h3>
        <p v-if="projects.length === 0" class="empty">No projects added yet.</p>

        <article v-for="project in projects" :key="getId(project)" class="resume-item">
          <h4>{{ project.title || project.name }}</h4>
          <p>{{ project.description }}</p>
          <small>{{ project.status || "Project" }}</small>
          <a v-if="project.github || project.link" :href="project.github || project.link" target="_blank">
            Project link
          </a>
        </article>
      </section>

      <section class="resume-section">
        <h3>Certificates</h3>
        <p v-if="certificates.length === 0" class="empty">
          No certificates added yet.
        </p>

        <article
          v-for="certificate in certificates"
          :key="getId(certificate)"
          class="resume-item"
        >
          <h4>{{ certificate.name || certificate.title }}</h4>
          <p>{{ certificate.provider }}</p>
          <small v-if="certificate.date">Date: {{ certificate.date }}</small>
        </article>
      </section>
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

const currentUserId = computed(() => {
  return currentUser.value?._id || currentUser.value?.id || currentUser.value?.email;
});

const userName = computed(() => {
  return (
    currentUser.value?.name ||
    currentUser.value?.fullName ||
    currentUser.value?.email ||
    "User"
  );
});

const professionalTitle = computed(() => {
  return (
    currentUser.value?.professionalRole ||
    currentUser.value?.professionalTitle ||
    currentUser.value?.title ||
    "CareerBridge User"
  );
});

function normalizeList(data, key) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function getId(item) {
  return item?._id || item?.id || item?.name || item?.title;
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

async function loadResumeData() {
  if (!currentUserId.value) return;

  try {
    const [skillsRes, projectsRes, certificatesRes] = await Promise.all([
      api.get(`/skills?userId=${currentUserId.value}`),
      api.get(`/projects?userId=${currentUserId.value}`),
      api.get(`/certificates?userId=${currentUserId.value}`),
    ]);

    skills.value = normalizeList(skillsRes.data, "skills").filter(belongsToCurrentUser);
    projects.value = normalizeList(projectsRes.data, "projects").filter(belongsToCurrentUser);
    certificates.value = normalizeList(certificatesRes.data, "certificates").filter(belongsToCurrentUser);
  } catch (error) {
    console.error("Resume data could not be loaded:", error);
  }
}

function printResume() {
  window.print();
}

onMounted(loadResumeData);
</script>

<style scoped>
.resume-page {
  min-height: 100vh;
  padding: 3rem 7%;
  background: #f4f7fb;
  color: #0f172a;
}

.resume-hero {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  align-items: center;
  padding: 3rem;
  border-radius: 28px;
  color: white;
  background: linear-gradient(135deg, #14264f, #3447f5);
}

.resume-hero h1 {
  margin: 0.5rem 0 1rem;
  font-size: clamp(2.2rem, 5vw, 4rem);
}

.eyebrow {
  margin: 0;
  letter-spacing: 0.3em;
  font-weight: 900;
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

.resume-sheet {
  margin: 2rem auto 0;
  max-width: 1000px;
  padding: 3rem;
  border-radius: 28px;
  background: white;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.1);
}

.resume-header {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.resume-header h2 {
  margin: 0;
  font-size: 2.6rem;
}

.title {
  color: #2563eb;
  font-weight: 900;
}

.contact {
  text-align: right;
  color: #64748b;
}

.contact p {
  margin: 0.25rem 0;
}

.resume-section {
  margin-top: 2rem;
}

.resume-section h3 {
  color: #2563eb;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.95rem;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

.chips span {
  padding: 0.7rem 0.9rem;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-weight: 800;
}

.resume-item {
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.resume-item h4 {
  margin: 0 0 0.4rem;
  font-size: 1.25rem;
}

.resume-item p {
  color: #475569;
  line-height: 1.6;
}

.resume-item small {
  display: block;
  color: #64748b;
  font-weight: 800;
}

.empty {
  color: #64748b;
  font-weight: 700;
}

@media (max-width: 850px) {
  .resume-hero,
  .resume-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .contact {
    text-align: left;
  }
}

@media print {
  .navbar,
  .resume-hero {
    display: none !important;
  }

  .resume-page {
    padding: 0;
    background: white;
  }

  .resume-sheet {
    box-shadow: none;
    border-radius: 0;
  }
}
</style>
