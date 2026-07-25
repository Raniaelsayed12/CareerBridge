<template>
  <main class="docs-page">
    <section class="docs-hero no-print">
      <div>
        <p class="eyebrow">USER DOCUMENTATION</p>
        <h1>{{ userName }} Docs</h1>
        <p>
          This page shows only the skills, projects and certificates of the
          currently logged-in user.
        </p>
      </div>

      <div class="hero-actions">
        <RouterLink to="/" class="btn light">Home</RouterLink>
        <RouterLink to="/dashboard" class="btn light">Dashboard</RouterLink>
        <button class="btn light" @click="printDoc">Print</button>
        <button class="btn light" @click="printDoc">Save as PDF</button>
      </div>
    </section>

    <section class="docs-layout">
      <aside class="docs-sidebar no-print">
        <p class="eyebrow blue">USER DATA</p>
        <h2>{{ userName }}</h2>

        <button
          v-for="doc in docs"
          :key="doc.key"
          class="doc-link"
          :class="{ active: selectedKey === doc.key }"
          @click="selectedKey = doc.key"
        >
          {{ doc.title }}
        </button>
      </aside>

      <article class="doc-paper">
        <p class="eyebrow blue">CAREERBRIDGE USER DOCS</p>
        <h2>{{ selectedDoc.title }}</h2>
        <pre class="doc-content">{{ selectedDoc.content }}</pre>
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

const selectedKey = ref("overview");
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
    "Current User"
  );
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

async function loadUserData() {
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
    console.error("User documentation data could not be loaded:", error);
  }
}

const docs = computed(() => {
  const skillLines = skills.value.length
    ? skills.value.map((skill) => `- ${skill.name || skill.title} (${skill.category || "Skill"})`).join("\n")
    : "- No skills added yet.";

  const projectLines = projects.value.length
    ? projects.value.map((project) => `- ${project.title || project.name}: ${project.description || ""} [${project.status || "Project"}]`).join("\n")
    : "- No projects added yet.";

  const certificateLines = certificates.value.length
    ? certificates.value.map((certificate) => `- ${certificate.name || certificate.title} — ${certificate.provider || ""} ${certificate.date ? "(" + certificate.date + ")" : ""}`).join("\n")
    : "- No certificates added yet.";

  return [
    {
      key: "overview",
      title: `${userName.value} Data`,
      content: `${userName.value} Career Data

Email:
${currentUser.value?.email || ""}

Role:
${currentUser.value?.role || "user"}

Skills:
${skillLines}

Projects:
${projectLines}

Certificates:
${certificateLines}`,
    },
    {
      key: "skills",
      title: "My Skills",
      content: `Skills of ${userName.value}

${skillLines}`,
    },
    {
      key: "projects",
      title: "My Projects",
      content: `Projects of ${userName.value}

${projectLines}`,
    },
    {
      key: "certificates",
      title: "My Certificates",
      content: `Certificates of ${userName.value}

${certificateLines}`,
    },
  ];
});

const selectedDoc = computed(() => {
  return docs.value.find((doc) => doc.key === selectedKey.value) || docs.value[0];
});

function printDoc() {
  window.print();
}

onMounted(loadUserData);
</script>

<style scoped>
.docs-page {
  min-height: 100vh;
  padding: 3rem 7%;
  background: #f4f7fb;
  color: #0f172a;
}

.docs-hero {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  align-items: center;
  padding: 3rem;
  border-radius: 28px;
  color: white;
  background: linear-gradient(135deg, #14264f, #3447f5);
}

.docs-hero h1 {
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

.docs-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 1.5rem;
  margin-top: 2rem;
}

.docs-sidebar,
.doc-paper {
  padding: 2rem;
  border-radius: 24px;
  background: white;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.doc-link {
  width: 100%;
  margin-top: 0.7rem;
  padding: 0.9rem 1rem;
  border: 1px solid #dbe3ef;
  border-radius: 14px;
  background: #f8fafc;
  color: #0f172a;
  font-weight: 800;
  text-align: left;
  cursor: pointer;
}

.doc-link.active {
  background: #e0e7ff;
  color: #1d4ed8;
  border-color: #2563eb;
}

.doc-paper h2 {
  margin: 1rem 0 1.5rem;
  font-size: 2.4rem;
}

.doc-content {
  white-space: pre-wrap;
  font-family: inherit;
  line-height: 1.8;
  color: #334155;
  font-size: 1rem;
}

@media (max-width: 900px) {
  .docs-hero,
  .docs-layout {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: flex-start;
  }
}

@media print {
  .no-print,
  .navbar {
    display: none !important;
  }

  .docs-page {
    padding: 0;
    background: white;
  }

  .docs-layout {
    display: block;
    margin: 0;
  }

  .doc-paper {
    box-shadow: none;
    border-radius: 0;
  }
}
</style>
