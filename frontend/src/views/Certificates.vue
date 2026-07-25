<script setup>
import { computed, onMounted, ref } from "vue";
import Navbar from "../components/Navbar.vue/Navbar.vue";
import api from "../services/api";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();

const certificates = ref([]);
const searchTerm = ref("");

const form = ref({
  name: "",
  provider: "",
});

const editingId = ref("");

const editForm = ref({
  name: "",
  provider: "",
});

const isLoading = ref(true);
const isSubmitting = ref(false);
const isUpdating = ref(false);
const deletingId = ref("");

const successMessage = ref("");
const errorMessage = ref("");

const filteredCertificates = computed(() => {
  const search = searchTerm.value
      .trim()
      .toLowerCase();

  if (!search) {
    return certificates.value;
  }

  return certificates.value.filter((certificate) => {
    const name =
        certificate.name?.toLowerCase() || "";

    const provider =
        certificate.provider?.toLowerCase() || "";

    return (
        name.includes(search) ||
        provider.includes(search)
    );
  });
});

const certificateCountText = computed(() => {
  const count = certificates.value.length;

  return count === 1
      ? "1 certificate"
      : `${count} certificates`;
});

function clearMessages() {
  successMessage.value = "";
  errorMessage.value = "";
}

function synchronizeStore() {
  userStore.certificates = [
    ...certificates.value,
  ];
}

function getCertificateInitials(name) {
  if (!name) {
    return "CE";
  }

  return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) =>
          word.charAt(0).toUpperCase()
      )
      .join("");
}

async function loadCertificates() {
  clearMessages();
  isLoading.value = true;

  try {
    const response =
        await api.get("/certificates");

    certificates.value =
        Array.isArray(response.data)
            ? response.data
            : [];

    synchronizeStore();
  } catch (error) {
    console.error(
        "Could not load certificates:",
        error
    );

    errorMessage.value =
        error.response?.data?.message ||
        "Certificates could not be loaded.";
  } finally {
    isLoading.value = false;
  }
}

async function addCertificate() {
  clearMessages();

  const certificateData = {
    name: form.value.name.trim(),
    provider: form.value.provider.trim(),
  };

  if (
      !certificateData.name ||
      !certificateData.provider
  ) {
    errorMessage.value =
        "Certificate name and provider are required.";
    return;
  }

  const duplicateExists =
      certificates.value.some((certificate) => {
        return (
            certificate.name.toLowerCase() ===
            certificateData.name.toLowerCase() &&
            certificate.provider.toLowerCase() ===
            certificateData.provider.toLowerCase()
        );
      });

  if (duplicateExists) {
    errorMessage.value =
        "This certificate already exists.";
    return;
  }

  try {
    isSubmitting.value = true;

    const response = await api.post(
        "/certificates",
        certificateData
    );

    certificates.value.unshift(
        response.data
    );

    form.value = {
      name: "",
      provider: "",
    };

    synchronizeStore();

    successMessage.value =
        "Certificate added successfully.";
  } catch (error) {
    console.error(
        "Could not add certificate:",
        error
    );

    errorMessage.value =
        error.response?.data?.message ||
        "Certificate could not be added.";
  } finally {
    isSubmitting.value = false;
  }
}

function startEdit(certificate) {
  clearMessages();

  editingId.value = certificate._id;

  editForm.value = {
    name: certificate.name || "",
    provider: certificate.provider || "",
  };
}

function cancelEdit() {
  if (isUpdating.value) {
    return;
  }

  editingId.value = "";

  editForm.value = {
    name: "",
    provider: "",
  };
}

async function updateCertificate(
    certificate
) {
  clearMessages();

  const certificateData = {
    name: editForm.value.name.trim(),
    provider:
        editForm.value.provider.trim(),
  };

  if (
      !certificateData.name ||
      !certificateData.provider
  ) {
    errorMessage.value =
        "Certificate name and provider are required.";
    return;
  }

  const duplicateExists =
      certificates.value.some((item) => {
        return (
            item._id !== certificate._id &&
            item.name.toLowerCase() ===
            certificateData.name.toLowerCase() &&
            item.provider.toLowerCase() ===
            certificateData.provider.toLowerCase()
        );
      });

  if (duplicateExists) {
    errorMessage.value =
        "This certificate already exists.";
    return;
  }

  try {
    isUpdating.value = true;

    const response = await api.put(
        `/certificates/${certificate._id}`,
        certificateData
    );

    const certificateIndex =
        certificates.value.findIndex(
            (item) =>
                item._id === certificate._id
        );

    if (certificateIndex !== -1) {
      certificates.value[
          certificateIndex
          ] = response.data;
    }

    synchronizeStore();
    cancelEdit();

    successMessage.value =
        "Certificate updated successfully.";
  } catch (error) {
    console.error(
        "Could not update certificate:",
        error
    );

    errorMessage.value =
        error.response?.data?.message ||
        "Certificate could not be updated.";
  } finally {
    isUpdating.value = false;
  }
}

async function deleteCertificate(
    certificate
) {
  clearMessages();

  const confirmed = window.confirm(
      `Do you really want to delete "${certificate.name}"?`
  );

  if (!confirmed) {
    return;
  }

  try {
    deletingId.value = certificate._id;

    await api.delete(
        `/certificates/${certificate._id}`
    );

    certificates.value =
        certificates.value.filter(
            (item) =>
                item._id !== certificate._id
        );

    synchronizeStore();

    successMessage.value =
        "Certificate deleted successfully.";
  } catch (error) {
    console.error(
        "Could not delete certificate:",
        error
    );

    errorMessage.value =
        error.response?.data?.message ||
        "Certificate could not be deleted.";
  } finally {
    deletingId.value = "";
  }
}

onMounted(loadCertificates);
</script>

<template>
  <Navbar />

  <main class="certificates-page">
    <div class="certificates-container">
      <section class="page-header">
        <div class="header-content">
          <span class="header-label">
            Professional achievements
          </span>

          <h1>Certificates</h1>

          <p>
            Record your courses, qualifications and
            professional certificates to strengthen
            your CareerBridge profile.
          </p>
        </div>

        <div class="header-statistic">
          <span class="statistic-icon">
            C
          </span>

          <div>
            <strong>
              {{ certificates.length }}
            </strong>

            <span>
              {{ certificateCountText }}
            </span>
          </div>
        </div>
      </section>

      <div
          v-if="successMessage"
          class="message success-message"
          role="status"
      >
        <span class="message-symbol">
          ✓
        </span>

        <span>
          {{ successMessage }}
        </span>

        <button
            type="button"
            aria-label="Close success message"
            @click="successMessage = ''"
        >
          ×
        </button>
      </div>

      <div
          v-if="errorMessage"
          class="message error-message"
          role="alert"
      >
        <span class="message-symbol">
          !
        </span>

        <span>
          {{ errorMessage }}
        </span>

        <button
            type="button"
            aria-label="Close error message"
            @click="errorMessage = ''"
        >
          ×
        </button>
      </div>

      <section class="certificate-form-card">
        <div class="form-heading">
          <div>
            <span class="section-label">
              New achievement
            </span>

            <h2>Add a certificate</h2>
          </div>

          <p>
            Enter the certificate title and the
            organization or institution that issued it.
          </p>
        </div>

        <form
            class="certificate-form"
            @submit.prevent="addCertificate"
        >
          <div class="form-grid">
            <div class="form-group">
              <label for="certificate-name">
                Certificate name
                <span>*</span>
              </label>

              <input
                  id="certificate-name"
                  v-model="form.name"
                  type="text"
                  maxlength="120"
                  placeholder="Example: Vue.js Fundamentals"
                  :disabled="isSubmitting"
              />
            </div>

            <div class="form-group">
              <label for="certificate-provider">
                Provider or institution
                <span>*</span>
              </label>

              <input
                  id="certificate-provider"
                  v-model="form.provider"
                  type="text"
                  maxlength="120"
                  placeholder="Example: Coursera or University"
                  :disabled="isSubmitting"
              />
            </div>
          </div>

          <div class="form-actions">
            <button
                class="primary-button"
                type="submit"
                :disabled="isSubmitting"
            >
              <span
                  v-if="isSubmitting"
                  class="spinner"
              ></span>

              {{
              isSubmitting
              ? "Adding certificate..."
              : "Add certificate"
              }}
            </button>
          </div>
        </form>
      </section>

      <section class="certificates-section">
        <div class="certificates-toolbar">
          <div>
            <span class="section-label">
              Certificate collection
            </span>

            <h2>Your certificates</h2>
          </div>

          <div class="search-field">
            <span class="search-icon">
              ⌕
            </span>

            <input
                v-model="searchTerm"
                type="search"
                placeholder="Search certificates..."
                aria-label="Search certificates"
            />

            <button
                v-if="searchTerm"
                type="button"
                aria-label="Clear search"
                @click="searchTerm = ''"
            >
              ×
            </button>
          </div>
        </div>

        <div
            v-if="isLoading"
            class="certificates-grid"
        >
          <article
              v-for="item in 4"
              :key="item"
              class="certificate-card loading-card"
          >
            <div class="loading-icon"></div>
            <div class="loading-title"></div>
            <div class="loading-provider"></div>
            <div class="loading-actions"></div>
          </article>
        </div>

        <div
            v-else-if="
            filteredCertificates.length
          "
            class="certificates-grid"
        >
          <article
              v-for="certificate in filteredCertificates"
              :key="certificate._id"
              class="certificate-card"
          >
            <template
                v-if="
                editingId !== certificate._id
              "
            >
              <div class="certificate-header">
                <span class="certificate-icon">
                  {{
                    getCertificateInitials(
                      certificate.name
                    )
                  }}
                </span>

                <span class="certificate-badge">
                  Certificate
                </span>
              </div>

              <div class="certificate-content">
                <span class="content-label">
                  Qualification
                </span>

                <h3>
                  {{ certificate.name }}
                </h3>

                <div class="provider-information">
                  <span class="provider-icon">
                    P
                  </span>

                  <div>
                    <small>
                      Issued by
                    </small>

                    <strong>
                      {{
                      certificate.provider
                      }}
                    </strong>
                  </div>
                </div>
              </div>

              <div class="certificate-footer">
                <span class="achievement-text">
                  Professional achievement
                </span>
              </div>

              <div class="certificate-actions">
                <button
                    class="edit-button"
                    type="button"
                    @click="
                    startEdit(certificate)
                  "
                >
                  Edit
                </button>

                <button
                    class="delete-button"
                    type="button"
                    :disabled="
                    deletingId ===
                    certificate._id
                  "
                    @click="
                    deleteCertificate(
                      certificate
                    )
                  "
                >
                  {{
                  deletingId ===
                  certificate._id
                  ? "Deleting..."
                  : "Delete"
                  }}
                </button>
              </div>
            </template>

            <form
                v-else
                class="edit-certificate-form"
                @submit.prevent="
                updateCertificate(
                  certificate
                )
              "
            >
              <div class="edit-heading">
                <span class="section-label">
                  Certificate settings
                </span>

                <h3>
                  Edit certificate
                </h3>
              </div>

              <div class="form-group">
                <label
                    :for="`edit-name-${certificate._id}`"
                >
                  Certificate name
                </label>

                <input
                    :id="`edit-name-${certificate._id}`"
                    v-model="editForm.name"
                    type="text"
                    maxlength="120"
                    :disabled="isUpdating"
                />
              </div>

              <div class="form-group">
                <label
                    :for="`edit-provider-${certificate._id}`"
                >
                  Provider or institution
                </label>

                <input
                    :id="`edit-provider-${certificate._id}`"
                    v-model="editForm.provider"
                    type="text"
                    maxlength="120"
                    :disabled="isUpdating"
                />
              </div>

              <div class="edit-actions">
                <button
                    class="save-button"
                    type="submit"
                    :disabled="isUpdating"
                >
                  {{
                  isUpdating
                  ? "Saving..."
                  : "Save changes"
                  }}
                </button>

                <button
                    class="cancel-button"
                    type="button"
                    :disabled="isUpdating"
                    @click="cancelEdit"
                >
                  Cancel
                </button>
              </div>
            </form>
          </article>
        </div>

        <div
            v-else
            class="empty-state"
        >
          <span class="empty-icon">
            C
          </span>

          <h3>
            {{
            searchTerm
            ? "No matching certificates found"
            : "No certificates added yet"
            }}
          </h3>

          <p>
            {{
            searchTerm
            ? "Try searching by certificate name or provider."
            : "Use the form above to add your first certificate."
            }}
          </p>

          <button
              v-if="searchTerm"
              type="button"
              @click="searchTerm = ''"
          >
            Clear search
          </button>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.certificates-page {
  min-height: calc(100vh - 72px);
  padding: 44px 24px 70px;
  color: #0f172a;
  background:
      radial-gradient(
          circle at 5% 5%,
          rgba(245, 158, 11, 0.1),
          transparent 28%
      ),
      #f8fafc;
  font-family:
      Inter,
      Arial,
      sans-serif;
}

.certificates-container {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
}

.page-header {
  position: relative;
  min-height: 230px;
  padding: 44px 48px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  color: #ffffff;
  background:
      radial-gradient(
          circle at 87% 18%,
          rgba(255, 255, 255, 0.16),
          transparent 24%
      ),
      linear-gradient(
          135deg,
          #451a03,
          #b45309 58%,
          #f59e0b
      );
  border-radius: 26px;
  box-shadow:
      0 22px 50px
      rgba(180, 83, 9, 0.22);
}

.page-header::after {
  position: absolute;
  right: -90px;
  bottom: -160px;
  width: 350px;
  height: 350px;
  content: "";
  background:
      rgba(255, 255, 255, 0.08);
  border-radius: 50%;
}

.header-content,
.header-statistic {
  position: relative;
  z-index: 1;
}

.header-content {
  max-width: 710px;
}

.header-label,
.section-label {
  display: inline-block;
  margin-bottom: 9px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
}

.header-label {
  color: #fde68a;
}

.section-label {
  color: #b45309;
}

.header-content h1 {
  margin: 0 0 14px;
  font-size: clamp(
      38px,
      5vw,
      54px
  );
  line-height: 1.05;
  letter-spacing: -1.4px;
}

.header-content p {
  max-width: 660px;
  margin: 0;
  color: #fef3c7;
  font-size: 16px;
  line-height: 1.7;
}

.header-statistic {
  min-width: 190px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  background:
      rgba(255, 255, 255, 0.12);
  border:
      1px solid
      rgba(255, 255, 255, 0.18);
  border-radius: 17px;
  backdrop-filter: blur(10px);
}

.statistic-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #92400e;
  background: #fef3c7;
  border-radius: 14px;
  font-weight: 900;
}

.header-statistic div {
  display: flex;
  flex-direction: column;
}

.header-statistic strong {
  font-size: 27px;
}

.header-statistic div span {
  color: #fef3c7;
  font-size: 12px;
}

.message {
  margin-top: 20px;
  padding: 13px 16px;
  display: grid;
  grid-template-columns:
    auto 1fr auto;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
}

.message button {
  padding: 2px 7px;
  color: inherit;
  background: transparent;
  border: 0;
  cursor: pointer;
  font-size: 20px;
}

.success-message {
  color: #047857;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
}

.error-message {
  color: #b91c1c;
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.certificate-form-card {
  margin-top: 24px;
  padding: 30px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 21px;
  box-shadow:
      0 12px 32px
      rgba(15, 23, 42, 0.06);
}

.form-heading {
  margin-bottom: 24px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 25px;
}

.form-heading h2,
.certificates-toolbar h2 {
  margin: 0;
  color: #0f172a;
  font-size: 24px;
  letter-spacing: -0.5px;
}

.form-heading p {
  max-width: 450px;
  margin: 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.65;
}

.form-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #334155;
  font-size: 13px;
  font-weight: 800;
}

.form-group label span {
  color: #dc2626;
}

.form-group input,
.search-field input {
  width: 100%;
  box-sizing: border-box;
  padding: 13px 15px;
  color: #0f172a;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 11px;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  transition:
      background 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;
}

.form-group input:focus,
.search-field input:focus {
  background: #ffffff;
  border-color: #d97706;
  box-shadow:
      0 0 0 4px
      rgba(217, 119, 6, 0.11);
}

.form-group input:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.form-actions {
  margin-top: 23px;
  display: flex;
  justify-content: flex-end;
}

.primary-button {
  min-width: 155px;
  min-height: 44px;
  padding: 12px 18px;
  color: #ffffff;
  background:
      linear-gradient(
          135deg,
          #b45309,
          #f59e0b
      );
  border: 0;
  border-radius: 11px;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
}

.primary-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.spinner {
  width: 14px;
  height: 14px;
  margin-right: 7px;
  display: inline-block;
  vertical-align: -2px;
  border:
      2px solid
      rgba(255, 255, 255, 0.45);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.certificates-section {
  margin-top: 30px;
}

.certificates-toolbar {
  margin-bottom: 19px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 25px;
}

.search-field {
  position: relative;
  width: min(100%, 330px);
}

.search-field input {
  padding-left: 42px;
  padding-right: 38px;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 15px;
  color: #64748b;
  transform: translateY(-50%);
}

.search-field button {
  position: absolute;
  top: 50%;
  right: 10px;
  padding: 3px 7px;
  color: #64748b;
  background: transparent;
  border: 0;
  cursor: pointer;
  font-size: 18px;
  transform: translateY(-50%);
}

.certificates-grid {
  display: grid;
  grid-template-columns:
    repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.certificate-card {
  min-height: 350px;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 19px;
  box-shadow:
      0 11px 30px
      rgba(15, 23, 42, 0.06);
  transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      border-color 0.2s ease;
}

.certificate-card:hover {
  transform: translateY(-3px);
  border-color: #fde68a;
  box-shadow:
      0 18px 38px
      rgba(15, 23, 42, 0.1);
}

.certificate-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.certificate-icon {
  width: 51px;
  height: 51px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #92400e;
  background: #fef3c7;
  border-radius: 15px;
  font-size: 13px;
  font-weight: 900;
}

.certificate-badge {
  padding: 7px 10px;
  color: #92400e;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
}

.certificate-content {
  flex: 1;
  padding: 24px 0 18px;
}

.content-label {
  display: inline-block;
  margin-bottom: 7px;
  color: #d97706;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.certificate-content h3 {
  margin: 0 0 22px;
  color: #0f172a;
  font-size: 20px;
  line-height: 1.35;
}

.provider-information {
  padding: 13px;
  display: flex;
  align-items: center;
  gap: 11px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.provider-icon {
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #92400e;
  background: #fef3c7;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 900;
}

.provider-information div {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.provider-information small {
  margin-bottom: 3px;
  color: #94a3b8;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.provider-information strong {
  overflow: hidden;
  color: #334155;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.certificate-footer {
  margin-bottom: 16px;
  padding-top: 15px;
  border-top: 1px solid #e2e8f0;
}

.achievement-text {
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
}

.certificate-actions,
.edit-actions {
  display: grid;
  grid-template-columns:
    1fr 1fr;
  gap: 10px;
}

.certificate-actions button,
.edit-actions button {
  min-height: 41px;
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 800;
}

.edit-button,
.save-button {
  color: #ffffff;
  background: #d97706;
  border: 1px solid #d97706;
}

.delete-button {
  color: #b91c1c;
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.cancel-button {
  color: #475569;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
}

.certificate-actions button:disabled,
.edit-actions button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.edit-certificate-form {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.edit-heading h3 {
  margin: 0;
  font-size: 22px;
}

.edit-actions {
  margin-top: auto;
}

.empty-state {
  padding: 70px 25px;
  text-align: center;
  background: #ffffff;
  border: 1px dashed #cbd5e1;
  border-radius: 19px;
}

.empty-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #92400e;
  background: #fef3c7;
  border-radius: 18px;
  font-weight: 900;
}

.empty-state h3 {
  margin: 0 0 9px;
  font-size: 21px;
}

.empty-state p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.empty-state button {
  margin-top: 20px;
  padding: 10px 15px;
  color: #ffffff;
  background: #d97706;
  border: 0;
  border-radius: 9px;
  cursor: pointer;
  font-weight: 700;
}

.loading-card {
  pointer-events: none;
}

.loading-icon,
.loading-title,
.loading-provider,
.loading-actions {
  display: block;
  background:
      linear-gradient(
          90deg,
          #e2e8f0,
          #f1f5f9,
          #e2e8f0
      );
  background-size: 200% 100%;
  border-radius: 9px;
  animation: loading 1.2s infinite;
}

.loading-icon {
  width: 51px;
  height: 51px;
}

.loading-title {
  width: 72%;
  height: 25px;
  margin-top: 29px;
}

.loading-provider {
  width: 100%;
  height: 61px;
  margin-top: 22px;
}

.loading-actions {
  width: 100%;
  height: 42px;
  margin-top: auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes loading {
  from {
    background-position: 200% 0;
  }

  to {
    background-position: -200% 0;
  }
}

@media (max-width: 1000px) {
  .certificates-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 800px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 700px) {
  .certificates-page {
    padding: 26px 15px 55px;
  }

  .page-header {
    min-height: auto;
    padding: 35px 27px;
    flex-direction: column;
    align-items: flex-start;
  }

  .header-statistic {
    width: 100%;
    box-sizing: border-box;
  }

  .certificate-form-card {
    padding: 22px;
  }

  .certificates-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .search-field {
    width: 100%;
  }

  .form-actions {
    justify-content: stretch;
  }

  .primary-button {
    width: 100%;
  }
}

@media (max-width: 580px) {
  .certificates-grid {
    grid-template-columns: 1fr;
  }

  .header-content h1 {
    font-size: 36px;
  }

  .certificate-card {
    padding: 21px;
  }
}
</style>