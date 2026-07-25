<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();
const router = useRouter();

const currentUserId = ref("");
const certificates = ref([]);
const search = ref("");
const message = ref("");
const error = ref("");
const editingId = ref("");

const form = ref({
  name: "",
  provider: "",
  date: "",
  link: "",
});

const filteredCertificates = computed(() => {
  const value = search.value.toLowerCase().trim();

  if (!value) return certificates.value;

  return certificates.value.filter((certificate) => {
    return (
      certificate.name?.toLowerCase().includes(value) ||
      certificate.provider?.toLowerCase().includes(value)
    );
  });
});



function goHome() {
  router.push("/");
}

function goDashboard() {
  router.push("/dashboard");
}

function clearForm() {
  form.value = {
    name: "",
    provider: "",
    date: "",
    link: "",
  };

  editingId.value = "";
}

async function resolveCurrentUser() {
  const response = await api.get("/users");

  const currentEmail = (userStore.email || "").toLowerCase().trim();

  const currentUser = response.data.find(
    (user) => user.email.toLowerCase().trim() === currentEmail
  );

  currentUserId.value = currentUser?._id || "";
}

async function loadCertificates() {
  try {
    if (!currentUserId.value) {
      await resolveCurrentUser();
    }

    const response = await api.get(`/certificates?userId=${currentUserId.value}`);
    certificates.value = response.data || [];
  } catch (err) {
    error.value = "Certificates could not be loaded.";
  }
}

async function saveCertificate() {
  if (!form.value.name || !form.value.provider) {
    error.value = "Certificate name and provider are required.";
    message.value = "";
    return;
  }

  try {
    const payload = {
      userId: currentUserId.value,
      name: form.value.name,
      provider: form.value.provider,
      date: form.value.date,
      link: form.value.link,
    };

    if (editingId.value) {
      await api.put(`/certificates/${editingId.value}`, payload);
      message.value = "Certificate updated successfully.";
    } else {
      await api.post("/certificates", payload);
      message.value = "Certificate added successfully.";
    }

    error.value = "";
    clearForm();
    await loadCertificates();
  } catch (err) {
    error.value = err.response?.data?.message || "Certificate could not be saved.";
    message.value = "";
  }
}

function editCertificate(certificate) {
  editingId.value = certificate._id;

  form.value = {
    name: certificate.name || "",
    provider: certificate.provider || "",
    date: certificate.date || "",
    link: certificate.link || "",
  };
}

async function deleteCertificate(certificate) {
  if (!confirm(`Delete certificate: ${certificate.name}?`)) return;

  try {
    await api.delete(`/certificates/${certificate._id}`);
    message.value = "Certificate deleted successfully.";
    error.value = "";
    await loadCertificates();
  } catch (err) {
    error.value = "Certificate could not be deleted.";
    message.value = "";
  }
}

onMounted(loadCertificates);
</script>

<template>
  <main class="page">
    <section class="hero">
      <div>
        <p class="tag">PROFESSIONAL ACHIEVEMENTS</p>
        <h1>Certificates</h1>
        <p>
          Record your courses, qualifications and professional certificates.
        </p>
        <div class="hero-actions">
          <button type="button" @click="goHome">Home</button>
          <button type="button" @click="goDashboard">Dashboard</button>
        </div>
      </div>

      <div class="counter">
        <strong>{{ certificates.length }}</strong>
        <span>certificates</span>
      </div>
    </section>

    <p v-if="message" class="success">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>

    <section class="form-card">
      <div>
        <p class="tag orange">NEW ACHIEVEMENT</p>
        <h2>{{ editingId ? "Edit certificate" : "Add a certificate" }}</h2>
      </div>

      <form @submit.prevent="saveCertificate">
        <input v-model="form.name" placeholder="Certificate name" />
        <input v-model="form.provider" placeholder="Provider or institution" />
        <input v-model="form.date" type="date" />
        <input v-model="form.link" placeholder="Certificate link" />

        <div class="buttons">
          <button type="submit">
            {{ editingId ? "Save changes" : "Add certificate" }}
          </button>

          <button v-if="editingId" type="button" class="secondary" @click="clearForm">
            Cancel
          </button>
        </div>
      </form>
    </section>

    <section class="list-header">
      <div>
        <p class="tag orange">CERTIFICATE COLLECTION</p>
        <h2>Your certificates</h2>
      </div>

      <input v-model="search" placeholder="Search certificates..." />
    </section>

    <section class="cards">
      <article
        v-for="certificate in filteredCertificates"
        :key="certificate._id"
        class="card"
      >
        <div class="card-top">
          <span class="icon">
            {{ certificate.name?.slice(0, 2).toUpperCase() }}
          </span>

          <span class="badge">CERTIFICATE</span>
        </div>

        <p class="tag orange">QUALIFICATION</p>
        <h3>{{ certificate.name }}</h3>
        <p>{{ certificate.provider }}</p>
        <p v-if="certificate.date">Date: {{ certificate.date }}</p>

        <a v-if="certificate.link" :href="certificate.link" target="_blank">
          Open certificate
        </a>

        <div class="card-actions">
          <button class="edit" @click="editCertificate(certificate)">Edit</button>
          <button class="delete" @click="deleteCertificate(certificate)">Delete</button>
        </div>
      </article>

      <p v-if="filteredCertificates.length === 0" class="empty">
        No certificates for this account.
      </p>
    </section>
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 40px 7%;
  background: #f8fafc;
  color: #0f172a;
}

.hero {
  background: linear-gradient(135deg, #7c2d12, #f59e0b);
  color: white;
  border-radius: 24px;
  padding: 45px;
  display: flex;
  justify-content: space-between;
  gap: 25px;
  align-items: center;
  margin-bottom: 28px;
}

.hero h1 {
  font-size: 52px;
  margin: 8px 0;
}

.tag {
  letter-spacing: 3px;
  font-size: 13px;
  font-weight: 800;
}

.orange {
  color: #c2410c;
}

.counter {
  background: rgba(255, 255, 255, 0.22);
  border-radius: 18px;
  padding: 22px 38px;
  display: grid;
  gap: 4px;
  text-align: center;
}

.counter strong {
  font-size: 34px;
}

.hero-actions {
  display: flex;
  gap: 10px;
  margin-top: 22px;
}

.hero-actions button {
  background: white;
  color: #1d4ed8;
  border: none;
  border-radius: 12px;
  padding: 12px 18px;
  font-weight: 800;
  cursor: pointer;
}

.form-card,
.card,
.empty {
  background: white;
  border-radius: 18px;
  padding: 28px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-top: 18px;
}

input,
select {
  width: 100%;
  box-sizing: border-box;
  padding: 14px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
}

.buttons {
  grid-column: 1 / -1;
  display: flex;
  gap: 10px;
}

button {
  border: none;
  border-radius: 12px;
  padding: 13px 18px;
  font-weight: 800;
  cursor: pointer;
}

form button {
  background: #d97706;
  color: white;
}

.secondary {
  background: #e5e7eb;
  color: #374151;
}

.success,
.error {
  background: white;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 18px;
  font-weight: 800;
}

.success {
  color: #15803d;
}

.error {
  color: #b91c1c;
}

.list-header {
  margin: 32px 0 18px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: end;
}

.list-header input {
  max-width: 330px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.icon {
  background: #fef3c7;
  color: #92400e;
  border-radius: 14px;
  padding: 14px;
  font-weight: 900;
}

.badge {
  border: 1px solid #facc15;
  color: #92400e;
  border-radius: 999px;
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 800;
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

.edit {
  background: #dbeafe;
  color: #1d4ed8;
}

.delete {
  background: #fee2e2;
  color: #b91c1c;
}

.empty {
  grid-column: 1 / -1;
  color: #64748b;
}

@media (max-width: 900px) {
  .hero,
  .list-header {
    flex-direction: column;
    align-items: flex-start;
  }

  form,
  .cards {
    grid-template-columns: 1fr;
  }
}
</style>
