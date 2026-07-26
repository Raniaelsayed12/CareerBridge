<template>
  <main class="certificates-page">
    <section class="certificates-hero">
      <div>
        <p class="eyebrow">PROFESSIONAL ACHIEVEMENTS</p>
        <h1>Certificates</h1>
        <p>Record your courses, qualifications and professional certificates.</p>

        <div class="hero-actions">
          <RouterLink to="/" class="btn light">Home</RouterLink>
          <RouterLink to="/dashboard" class="btn light">Dashboard</RouterLink>
        </div>
      </div>

      <div class="hero-count">
        <strong>{{ certificates.length }}</strong>
        <span>certificates</span>
      </div>
    </section>

    <section class="form-panel">
      <p class="eyebrow">NEW ACHIEVEMENT</p>
      <h2>{{ editingId ? "Edit certificate" : "Add a certificate" }}</h2>

      <form class="certificate-form" @submit.prevent="saveCertificate">
        <input v-model="form.name" placeholder="Certificate name" required />
        <input v-model="form.provider" placeholder="Provider or institution" required />
        <input v-model="form.date" type="date" />
        <input v-model="form.link" placeholder="Certificate link" />

        <button class="btn primary" type="submit">
          {{ editingId ? "Update certificate" : "Add certificate" }}
        </button>

        <button v-if="editingId" class="btn danger" type="button" @click="cancelEdit">
          Cancel
        </button>
      </form>
    </section>

    <section class="search-panel">
      <input v-model="searchQuery" placeholder="Search certificates..." />
    </section>

    <section class="certificates-grid">
      <article v-if="filteredCertificates.length === 0" class="empty-card">
        No certificates added yet. Add your first certificate to document your achievements.
      </article>

      <article
        v-for="certificate in filteredCertificates"
        :key="getCertificateId(certificate)"
        class="certificate-card"
      >
        <span class="tag">Certificate</span>

        <p class="qualification">Qualification</p>
        <h3>{{ certificate.name || certificate.title }}</h3>
        <p>{{ certificate.provider }}</p>
        <p v-if="certificate.date">Date: {{ certificate.date }}</p>

        <a v-if="certificate.link" :href="certificate.link" target="_blank">
          View certificate
        </a>

        <div class="card-actions">
          <button class="edit-btn" @click="editCertificate(certificate)">Edit</button>
          <button class="delete-btn" @click="deleteCertificate(certificate)">Delete</button>
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

const certificates = ref([]);
const searchQuery = ref("");
const editingId = ref("");

const form = ref({
  name: "",
  provider: "",
  date: "",
  link: "",
});

const currentUserId = computed(() => {
  return userStore.user?._id || userStore.user?.id || userStore.user?.email;
});

function belongsToCurrentUser(item) {
  const keys = [
    currentUserId.value,
    userStore.user?._id,
    userStore.user?.id,
    userStore.user?.email,
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


const filteredCertificates = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();

  if (!query) return certificates.value;

  return certificates.value.filter((certificate) => {
    const name = (certificate.name || certificate.title || "").toLowerCase();
    const provider = (certificate.provider || "").toLowerCase();
    const date = (certificate.date || "").toLowerCase();
    return name.includes(query) || provider.includes(query) || date.includes(query);
  });
});

function normalizeList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.certificates)) return data.certificates;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function getCertificateId(certificate) {
  return certificate._id || certificate.id;
}

async function loadCertificates() {
  if (!currentUserId.value) return;

  try {
    const response = await api.get(`/certificates?userId=${currentUserId.value}`);
    certificates.value = normalizeList(response.data).filter(belongsToCurrentUser);
  } catch (error) {
    console.error("Certificates could not be loaded:", error);
  }
}

async function saveCertificate() {
  if (!currentUserId.value) return;

  const payload = {
    name: form.value.name,
    provider: form.value.provider,
    date: form.value.date,
    link: form.value.link,
    userId: currentUserId.value,
  };

  try {
    if (editingId.value) {
      await api.put(`/certificates/${editingId.value}`, payload);
    } else {
      await api.post("/certificates", payload);
    }

    form.value = {
      name: "",
      provider: "",
      date: "",
      link: "",
    };

    editingId.value = "";
    await loadCertificates();
  } catch (error) {
    console.error("Certificate could not be saved:", error);
  }
}

function editCertificate(certificate) {
  editingId.value = getCertificateId(certificate);
  form.value = {
    name: certificate.name || certificate.title || "",
    provider: certificate.provider || "",
    date: certificate.date || "",
    link: certificate.link || "",
  };
}

function cancelEdit() {
  editingId.value = "";
  form.value = {
    name: "",
    provider: "",
    date: "",
    link: "",
  };
}

async function deleteCertificate(certificate) {
  if (!(await confirmAction("Are you sure you want to delete this certificate?"))) return;

  const id = getCertificateId(certificate);
  if (!id) return;

  try {
    await api.delete(`/certificates/${id}`);
    await loadCertificates();
  } catch (error) {
    console.error("Certificate could not be deleted:", error);
  }
}

onMounted(loadCertificates);
</script>

<style scoped>
.certificates-page,
.admin-info-page {
  min-height: 100vh;
  padding: 3rem 7%;
  background: #f4f7fb;
  color: #0f172a;
}

.certificates-hero {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  align-items: center;
  padding: 3rem;
  border-radius: 28px;
  color: white;
  background: linear-gradient(135deg, #9a3412, #f59e0b);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
}

.certificates-hero h1 {
  margin: 0.5rem 0 1rem;
  font-size: clamp(2.2rem, 5vw, 4rem);
}

.eyebrow {
  margin: 0;
  color: #c2410c;
  letter-spacing: 0.3em;
  font-weight: 900;
  text-transform: uppercase;
}

.certificates-hero .eyebrow {
  color: #ffedd5;
}

.hero-actions {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}

.hero-count {
  min-width: 140px;
  padding: 1.5rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.22);
  text-align: center;
}

.hero-count strong {
  display: block;
  font-size: 2.8rem;
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

.btn.primary {
  background: #ea580c;
  color: white;
}

.btn.danger {
  background: #fee2e2;
  color: #991b1b;
}

.form-panel,
.search-panel,
.admin-info-card {
  margin: 2rem 0;
  padding: 2rem;
  border-radius: 24px;
  background: white;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.certificate-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.9rem;
}

input {
  width: 100%;
  padding: 1rem;
  border-radius: 14px;
  border: 1px solid #dbe3ef;
  font: inherit;
}

.certificates-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(220px, 1fr));
  gap: 1.5rem;
}

.certificate-card,
.empty-card {
  padding: 2rem;
  border-radius: 24px;
  background: white;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.certificate-card {
  text-align: center;
}

.tag {
  display: inline-flex;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  border: 1px solid #f59e0b;
  color: #b45309;
  font-weight: 900;
}

.qualification {
  margin-top: 1.5rem;
  color: #c2410c;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  font-weight: 900;
}

.certificate-card h3 {
  font-size: 1.4rem;
  margin: 0.8rem 0;
}

.certificate-card p {
  color: #64748b;
}

.card-actions {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  margin-top: 1.5rem;
}

.edit-btn,
.delete-btn {
  border: none;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  font-weight: 900;
  cursor: pointer;
}

.edit-btn {
  background: #dbeafe;
  color: #1d4ed8;
}

.delete-btn {
  background: #fee2e2;
  color: #b91c1c;
}

.admin-info-page {
  display: grid;
  place-items: center;
}

.admin-info-card {
  width: min(850px, 100%);
  margin: 0;
}

.admin-info-card h1 {
  font-size: clamp(2rem, 5vw, 4rem);
  margin: 1rem 0;
}

.admin-info-card p {
  color: #64748b;
  line-height: 1.7;
}

.admin-info-btn {
  display: inline-flex;
  margin-top: 1.5rem;
  padding: 1rem 1.3rem;
  border-radius: 14px;
  background: #2563eb;
  color: white;
  font-weight: 900;
  text-decoration: none;
}

@media (max-width: 950px) {
  .certificates-hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .certificate-form,
  .certificates-grid {
    grid-template-columns: 1fr;
  }
}
</style>
