<script setup>
import { ref, onMounted, computed } from "vue";
import Navbar from "../components/Navbar.vue/Navbar.vue";
import api from "../services/api";
import { toast } from "vue3-toastify";

const certificates = ref([]);


const certificateName = ref("");
const providerName = ref("");
const search = ref("");

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
  toast.error("Please fill in all fields.");
  return;
}

  try {
    if (editingId.value) {
      await api.put(`/certificates/${editingId.value}`,
       {
        name: certificateName.value,
        provider: providerName.value,
      })
      ;
      toast.success("Certificate updated successfully!");

      editingId.value = null;
    } else {
      await api.post("/certificates", {
        name: certificateName.value,
        provider: providerName.value,
      });
      toast.success("Certificate added successfully!");
    }

    certificateName.value = "";
    providerName.value = "";

    await loadCertificates();
  } catch (error) {
    toast.error("Something went wrong.");
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

  try {
    await api.delete(`/certificates/${id}`);

    toast.success("Certificate deleted successfully!");

    await loadCertificates();

  } catch (error) {
    console.error(error);
    toast.error("Could not delete certificate.");
  }
}
const filteredCertificates = computed(() => {
  return certificates.value.filter((certificate) =>
    certificate.name.toLowerCase().includes(
      search.value.toLowerCase()
    )
  );
});

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

    <input
      v-model="search"
      class="search-input"
      placeholder="Search Certificate..."
    />

    <p
      v-if="filteredCertificates.length === 0"
      class="empty-text"
    >
      No certificates found.
    </p>

    <div class="cert-grid">
      <div
        class="cert-card"
        v-for="certificate in filteredCertificates"
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

.search-input {
  width: 300px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  display: block;
  margin: 0 auto 30px;
}

.empty-text {
  text-align: center;
  color: gray;
  margin-bottom: 20px;
}

.cert-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
  gap:25px;
}

.cert-card{
  background:#ffffff;
  border-radius:18px;
  padding:25px;
  box-shadow:0 8px 20px rgba(0,0,0,.08);
  transition:.3s;
}

.cert-card:hover{
  transform:translateY(-5px);
}

.cert-card h3{
  color:#2563eb;
  margin-bottom:10px;
}

.cert-card p{
  color:#555;
  margin-bottom:25px;
}

.buttons{
  display:flex;
  gap:12px;
  align-items:stretch;
}

.edit-btn,
.delete-btn{
  flex:1;
  display:flex;
  justify-content:center;
  align-items:center;

  height:48px;
  margin:0;
  padding:0;

  border:none;
  border-radius:10px;

  font-size:15px;
  font-weight:600;
  color:#fff;

  cursor:pointer;
  box-sizing:border-box;
}

.edit-btn{
  background:#2563eb;
}

.edit-btn:hover{
  background:#1d4ed8;
}

.delete-btn{
  background:#ef4444;
}

.delete-btn:hover{
  background:#dc2626;
}
.delete-btn:hover{
  background:#dc2626;

}
@media (max-width: 700px) {
  .container {
    padding: 20px;
  }

  .buttons {
    flex-direction: column;
  }

  .search-input {
    width: 100%;
  }
}
</style>