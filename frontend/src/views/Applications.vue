<template>
  <main class="applications-page">
    <section class="applications-hero">
      <div>
        <span class="eyebrow">BEWERBUNGEN</span>
        <h1>Job Applications</h1>
        <p>
          Manage your job applications, interview status and career opportunities
          in one structured overview.
        </p>
      </div>

      <div class="hero-card">
        <strong>{{ filteredApplications.length }}</strong>
        <span>Applications saved</span>
      </div>
    </section>

    <section class="applications-grid">
      <form class="form-card" @submit.prevent="saveApplication">
        <h2>{{ editingId ? "Edit Application" : "Add Application" }}</h2>

        <label>
          Company
          <input v-model="form.company" type="text" placeholder="Company name" required />
        </label>

        <label>
          Position
          <input v-model="form.position" type="text" placeholder="Frontend Developer Intern" required />
        </label>

        <label>
          Status
          <select v-model="form.status">
            <option>Applied</option>
            <option>Interview</option>
            <option>Accepted</option>
            <option>Rejected</option>
            <option>Pending</option>
          </select>
        </label>

        <label>
          Date
          <input v-model="form.date" type="date" />
        </label>

        <label>
          Link
          <input v-model="form.link" type="url" placeholder="https://..." />
        </label>

        <label>
          Notes
          <textarea v-model="form.notes" rows="4" placeholder="Important notes about this application"></textarea>
        </label>

        <div class="form-actions">
          <button class="primary-btn" type="submit">
            {{ editingId ? "Update Application" : "Add Application" }}
          </button>
          <button v-if="editingId" class="secondary-btn" type="button" @click="resetForm">
            Cancel
          </button>
        </div>
      </form>

      <section class="list-card">
        <div class="list-header">
          <div>
            <h2>My Applications</h2>
            <p>User-specific job application overview</p>
          </div>

          <input
            v-model="search"
            class="search-input"
            type="search"
            placeholder="Search company or position..."
          />
        </div>

        <div v-if="loading" class="empty-state">Loading applications...</div>

        <div v-else-if="filteredApplications.length === 0" class="empty-state">
          No applications found.
        </div>

        <article
          v-for="application in filteredApplications"
          :key="application._id"
          class="application-card"
        >
          <div>
            <span class="status-badge">{{ application.status }}</span>
            <h3>{{ application.position }}</h3>
            <p>{{ application.company }}</p>
            <small>{{ application.date || "No date" }}</small>
            <p v-if="application.notes" class="notes">{{ application.notes }}</p>
            <a v-if="application.link" :href="application.link" target="_blank" rel="noreferrer">
              Open link
            </a>
          </div>

          <div class="card-actions">
            <button type="button" @click="editApplication(application)">Edit</button>
            <button class="danger" type="button" @click="deleteApplication(application._id)">
              Delete
            </button>
          </div>
        </article>
      </section>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import api from "../services/api";
import { useUserStore } from "../stores/userStore";
import { confirmAction } from "../utils/confirmDialog";

const userStore = useUserStore();

const applications = ref([]);
const loading = ref(false);
const search = ref("");
const editingId = ref(null);

const form = reactive({
  company: "",
  position: "",
  status: "Applied",
  date: "",
  link: "",
  notes: "",
});

const currentUserId = computed(() => userStore.user?._id || userStore.user?.id);

const filteredApplications = computed(() => {
  const query = search.value.trim().toLowerCase();

  return applications.value.filter((application) => {
    if (!query) return true;

    return (
      String(application.company || "").toLowerCase().includes(query) ||
      String(application.position || "").toLowerCase().includes(query) ||
      String(application.status || "").toLowerCase().includes(query)
    );
  });
});

async function loadApplications() {
  if (!currentUserId.value) return;

  loading.value = true;

  try {
    const response = await api.get(`/applications?userId=${currentUserId.value}`);
    applications.value = response.data;
  } finally {
    loading.value = false;
  }
}

async function saveApplication() {
  const payload = {
    ...form,
    userId: currentUserId.value,
  };

  if (editingId.value) {
    await api.put(`/applications/${editingId.value}`, payload);
  } else {
    await api.post("/applications", payload);
  }

  resetForm();
  await loadApplications();
}

function editApplication(application) {
  editingId.value = application._id;
  form.company = application.company || "";
  form.position = application.position || "";
  form.status = application.status || "Applied";
  form.date = application.date || "";
  form.link = application.link || "";
  form.notes = application.notes || "";
}

async function deleteApplication(id) {
  const ok = await confirmAction("Möchten Sie diese Bewerbung wirklich löschen?");

  if (!ok) return;

  await api.delete(`/applications/${id}`);
  await loadApplications();
}

function resetForm() {
  editingId.value = null;
  form.company = "";
  form.position = "";
  form.status = "Applied";
  form.date = "";
  form.link = "";
  form.notes = "";
}

onMounted(loadApplications);
</script>

<style scoped>
.applications-page {
  padding: 2.5rem 5%;
  color: #0f172a;
}

.applications-hero {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  align-items: stretch;
  padding: 2rem;
  border-radius: 30px;
  background: linear-gradient(135deg, #0f172a, #2563eb);
  color: white;
  box-shadow: 0 22px 50px rgba(37, 99, 235, 0.18);
}

.eyebrow {
  display: inline-block;
  margin-bottom: 0.7rem;
  color: #bfdbfe;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.applications-hero h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.8rem);
}

.applications-hero p {
  max-width: 760px;
  color: #dbeafe;
  font-size: 1.05rem;
}

.hero-card {
  min-width: 190px;
  padding: 1.2rem;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.16);
  display: grid;
  place-items: center;
  text-align: center;
}

.hero-card strong {
  font-size: 3rem;
}

.hero-card span {
  color: #dbeafe;
  font-weight: 800;
}

.applications-grid {
  margin-top: 1.8rem;
  display: grid;
  grid-template-columns: minmax(280px, 390px) 1fr;
  gap: 1.3rem;
}

.form-card,
.list-card {
  background: white;
  border: 1px solid #dbe3ef;
  border-radius: 26px;
  padding: 1.4rem;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.form-card h2,
.list-card h2 {
  margin-top: 0;
}

.form-card label {
  display: grid;
  gap: 0.35rem;
  margin-bottom: 0.9rem;
  font-weight: 850;
  color: #334155;
}

.form-card input,
.form-card select,
.form-card textarea,
.search-input {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  padding: 0.8rem 0.9rem;
  font: inherit;
  background: #f8fafc;
}

.form-actions,
.card-actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.primary-btn,
.secondary-btn,
.card-actions button {
  border: none;
  border-radius: 14px;
  padding: 0.75rem 1rem;
  font-weight: 900;
  cursor: pointer;
}

.primary-btn {
  background: #2563eb;
  color: white;
}

.secondary-btn {
  background: #e2e8f0;
  color: #0f172a;
}

.list-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.list-header p {
  margin: 0.2rem 0 0;
  color: #64748b;
}

.search-input {
  max-width: 340px;
}

.application-card {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: #f8fbff;
  margin-bottom: 0.9rem;
}

.application-card h3 {
  margin: 0.45rem 0 0.15rem;
}

.application-card p {
  margin: 0.2rem 0;
  color: #475569;
}

.application-card small {
  color: #64748b;
}

.notes {
  margin-top: 0.6rem !important;
}

.status-badge {
  display: inline-flex;
  border-radius: 999px;
  padding: 0.25rem 0.65rem;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 0.78rem;
  font-weight: 950;
}

.danger {
  background: #fee2e2;
  color: #991b1b;
}

.empty-state {
  padding: 2rem;
  border-radius: 20px;
  background: #f8fafc;
  color: #64748b;
  text-align: center;
  font-weight: 800;
}

@media (max-width: 900px) {
  .applications-hero,
  .list-header,
  .application-card {
    flex-direction: column;
  }

  .applications-grid {
    grid-template-columns: 1fr;
  }

  .search-input {
    max-width: none;
  }
}
</style>
