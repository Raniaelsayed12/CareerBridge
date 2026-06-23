<script setup>
import { ref } from "vue";
import Navbar from "../components/Navbar.vue/Navbar.vue";
import { useUserStore } from "../stores/userStore";

const user = useUserStore();

const certificateName = ref("");
const providerName = ref("");

function addCertificate() {
  if (
    certificateName.value.trim() &&
    providerName.value.trim()
  ) {
    user.addCertificate({
      name: certificateName.value,
      provider: providerName.value,
    });

    certificateName.value = "";
    providerName.value = "";
  }
}

function deleteCertificate(index) {
  user.deleteCertificate(index);
}
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
        Add Certificate
      </button>
    </div>

    <div class="cert-grid">
      <div
        class="cert-card"
        v-for="(certificate, index) in user.certificates"
        :key="index"
      >
        <h3>🏆 {{ certificate.name }}</h3>

        <p>{{ certificate.provider }}</p>

        <button
          class="delete-btn"
          @click="deleteCertificate(index)"
        >
          Delete
        </button>
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
  gap: 10px;
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
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.cert-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 0 15px #ddd;
}

.delete-btn {
  margin-top: 15px;
  background: crimson;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}
</style>