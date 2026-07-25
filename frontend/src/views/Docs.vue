<script setup>
import { onMounted, ref } from "vue";
import api from "../services/api";

const docs = ref([]);
const selectedDoc = ref("");
const content = ref("");
const error = ref("");

async function loadDocs() {
  try {
    const response = await api.get("/docs");
    docs.value = response.data || [];

    if (docs.value.length > 0) {
      openDoc(docs.value[0].name);
    }
  } catch (err) {
    error.value = "Could not load documentation files.";
  }
}

async function openDoc(name) {
  selectedDoc.value = name;

  try {
    const response = await api.get(`/docs/${name}`);
    content.value = response.data.content || "";
  } catch (err) {
    error.value = "Could not open this file.";
  }
}

onMounted(loadDocs);
</script>

<template>
  <main class="docs-page">
    <section class="hero">
      <p class="tag">PROJECT DOCUMENTATION</p>
      <h1>Markdown Files</h1>
      <p>Here you can view the project documentation files.</p>
    </section>

    <p v-if="error" class="error">{{ error }}</p>

    <section class="layout">
      <aside class="files">
        <h2>Files</h2>

        <button
          v-for="doc in docs"
          :key="doc.name"
          :class="{ active: selectedDoc === doc.name }"
          @click="openDoc(doc.name)"
        >
          {{ doc.name }}
        </button>

        <p v-if="docs.length === 0">No markdown files found.</p>
      </aside>

      <article class="viewer">
        <h2>{{ selectedDoc || "Choose a file" }}</h2>
        <pre>{{ content }}</pre>
      </article>
    </section>
  </main>
</template>

<style scoped>
.docs-page {
  min-height: 100vh;
  padding: 40px 7%;
  background: #f8fafc;
  color: #0f172a;
}

.hero,
.files,
.viewer,
.error {
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.hero {
  margin-bottom: 24px;
  background: linear-gradient(135deg, #172554, #4f46e5);
  color: white;
}

.tag {
  letter-spacing: 3px;
  font-weight: 900;
  color: #bfdbfe;
}

.layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
}

.files {
  display: grid;
  gap: 10px;
  align-content: start;
}

.files button {
  padding: 12px;
  border: 1px solid #dbeafe;
  background: #f8fafc;
  border-radius: 12px;
  text-align: left;
  font-weight: 800;
  cursor: pointer;
}

.files button.active {
  background: #2563eb;
  color: white;
}

pre {
  white-space: pre-wrap;
  word-break: break-word;
  background: #0f172a;
  color: #e5e7eb;
  border-radius: 14px;
  padding: 20px;
  line-height: 1.6;
}

.error {
  color: #b91c1c;
  margin-bottom: 18px;
  font-weight: 900;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
