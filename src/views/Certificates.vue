<script setup>
import { ref, onMounted } from "vue";
import Navbar from "../components/Navbar.vue/Navbar.vue";
import api from "../services/api";

const certificates = ref([]);

const certificateName = ref("");
const providerName = ref("");

const editingId = ref(null);

async function loadCertificates() {
  const response = await api.get("/certificates");
  certificates.value = response.data;
}

async function addCertificate() {
  if (
    !certificateName.value.trim() ||
    !providerName.value.trim()
  ) {
    return;
  }

  try {
    if (editingId.value) {
      await api.put(`/certificates/${editingId.value}`, {
        name: certificateName.value,
        provider: providerName.value,
      });

      editingId.value = null;
    } else {
      await api.post("/certificates", {
        name: certificateName.value,
        provider: providerName.value,
      });
    }

    certificateName.value = "";
    providerName.value = "";

    await loadCertificates();

  } catch (error) {
    console.error(error);
  }
}

function editCertificate(certificate) {
  editingId.value = certificate._id;

  certificateName.value = certificate.name;
  providerName.value = certificate.provider;
}

async function deleteCertificate(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this certificate?"
  );

  if (!confirmDelete) return;

  await api.delete(`/certificates/${id}`);

  await loadCertificates();
}

onMounted(() => {
  loadCertificates();
});
</script>

<template>
  <Navbar />

  <div class="container">
    <h1>My Certificates</h1>

    <div class="form">
      <input
        v-model="certificateName"
        placeholder="Certificate Name"
      />

      <input
        v-model="providerName"
        placeholder="Provider"
      />

      <button @click="addCertificate">
        {{ editingId ? "Update Certificate" : "Add Certificate" }}
      </button>
    </div>

    <div class="cert-grid">
      <div
        class="cert-card"
        v-for="certificate in certificates"
        :key="certificate._id"
      >
        <h3>{{ certificate.name }}</h3>

        <p>{{ certificate.provider }}</p>

        <div class="buttons">
          <button
            class="edit-btn"
            @click="editCertificate(certificate)"
          >
            Edit
          </button>

          <button
            class="delete-btn"
            @click="deleteCertificate(certificate._id)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.container {
  padding: 40px;
}

.container h1 {
  text-align: center;
  margin-bottom: 30px;
}

.form {
  max-width: 500px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 40px;
}

.form input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.form button {
  background: #2563eb;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
}

.cert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.cert-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 0 15px #ddd;
}

.cert-card h3 {
  color: #2563eb;
}

.buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.edit-btn {
  flex: 1;
  background: #10b981;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
}

.delete-btn {
  flex: 1;
  background: crimson;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
}
</style>