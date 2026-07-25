<script setup>
import { computed, onMounted, ref } from "vue";
import Navbar from "../components/Navbar.vue/Navbar.vue";
import api from "../services/api";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();

const skills = ref([]);
const newSkillName = ref("");
const searchTerm = ref("");

const editingId = ref("");
const editingName = ref("");

const isLoading = ref(true);
const isSubmitting = ref(false);
const deletingId = ref("");

const successMessage = ref("");
const errorMessage = ref("");

const filteredSkills = computed(() => {
  const search = searchTerm.value.trim().toLowerCase();

  if (!search) {
    return skills.value;
  }

  return skills.value.filter((skill) =>
      skill.name.toLowerCase().includes(search)
  );
});

const skillsCountText = computed(() => {
  const count = skills.value.length;

  return count === 1
      ? "1 skill"
      : `${count} skills`;
});

function synchronizeStore() {
  userStore.skills = [...skills.value];
}

function clearMessages() {
  successMessage.value = "";
  errorMessage.value = "";
}

function getInitials(name) {
  if (!name) {
    return "SK";
  }

  return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
}

async function loadSkills() {
  clearMessages();
  isLoading.value = true;

  try {
    const response = await api.get("/skills");

    skills.value = Array.isArray(response.data)
        ? response.data
        : [];

    synchronizeStore();
  } catch (error) {
    console.error("Could not load skills:", error);

    errorMessage.value =
        error.response?.data?.message ||
        "Skills could not be loaded.";
  } finally {
    isLoading.value = false;
  }
}

async function addSkill() {
  clearMessages();

  const name = newSkillName.value.trim();

  if (!name) {
    errorMessage.value =
        "Please enter a skill name.";
    return;
  }

  const alreadyExists = skills.value.some(
      (skill) =>
          skill.name.toLowerCase() ===
          name.toLowerCase()
  );

  if (alreadyExists) {
    errorMessage.value =
        "This skill already exists.";
    return;
  }

  try {
    isSubmitting.value = true;

    const response = await api.post("/skills", {
      name,
    });

    skills.value.unshift(response.data);
    newSkillName.value = "";

    synchronizeStore();

    successMessage.value =
        "Skill added successfully.";
  } catch (error) {
    console.error("Could not add skill:", error);

    errorMessage.value =
        error.response?.data?.message ||
        "Skill could not be added.";
  } finally {
    isSubmitting.value = false;
  }
}

function startEdit(skill) {
  clearMessages();

  editingId.value = skill._id;
  editingName.value = skill.name;
}

function cancelEdit() {
  editingId.value = "";
  editingName.value = "";
}

async function saveEdit(skill) {
  clearMessages();

  const name = editingName.value.trim();

  if (!name) {
    errorMessage.value =
        "Skill name cannot be empty.";
    return;
  }

  const duplicateExists = skills.value.some(
      (item) =>
          item._id !== skill._id &&
          item.name.toLowerCase() ===
          name.toLowerCase()
  );

  if (duplicateExists) {
    errorMessage.value =
        "This skill already exists.";
    return;
  }

  try {
    const response = await api.put(
        `/skills/${skill._id}`,
        {
          name,
        }
    );

    const index = skills.value.findIndex(
        (item) => item._id === skill._id
    );

    if (index !== -1) {
      skills.value[index] = response.data;
    }

    synchronizeStore();
    cancelEdit();

    successMessage.value =
        "Skill updated successfully.";
  } catch (error) {
    console.error("Could not update skill:", error);

    errorMessage.value =
        error.response?.data?.message ||
        "Skill could not be updated.";
  }
}

async function deleteSkill(skill) {
  clearMessages();

  const confirmed = window.confirm(
      `Delete "${skill.name}"?`
  );

  if (!confirmed) {
    return;
  }

  try {
    deletingId.value = skill._id;

    await api.delete(`/skills/${skill._id}`);

    skills.value = skills.value.filter(
        (item) => item._id !== skill._id
    );

    synchronizeStore();

    successMessage.value =
        "Skill deleted successfully.";
  } catch (error) {
    console.error("Could not delete skill:", error);

    errorMessage.value =
        error.response?.data?.message ||
        "Skill could not be deleted.";
  } finally {
    deletingId.value = "";
  }
}

onMounted(loadSkills);
</script>

<template>
  <Navbar />

  <main class="skills-page">
    <div class="skills-container">
      <section class="page-header">
        <div class="header-content">
          <span class="header-label">
            Career profile
          </span>

          <h1>Skills</h1>

          <p>
            Add and manage the technical and professional
            skills that represent your experience.
          </p>
        </div>

        <div class="header-statistic">
          <span class="statistic-icon">
            S
          </span>

          <div>
            <strong>{{ skills.length }}</strong>
            <span>{{ skillsCountText }}</span>
          </div>
        </div>
      </section>

      <div
          v-if="successMessage"
          class="message success-message"
          role="status"
      >
        <span>✓</span>
        {{ successMessage }}

        <button
            type="button"
            aria-label="Close message"
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
        <span>!</span>
        {{ errorMessage }}

        <button
            type="button"
            aria-label="Close message"
            @click="errorMessage = ''"
        >
          ×
        </button>
      </div>

      <section class="control-panel">
        <form
            class="add-skill-form"
            @submit.prevent="addSkill"
        >
          <div class="form-heading">
            <div>
              <span class="section-label">
                New skill
              </span>

              <h2>Add a skill</h2>
            </div>

            <p>
              Add technologies, tools or professional
              competencies to your profile.
            </p>
          </div>

          <div class="add-field">
            <input
                v-model="newSkillName"
                type="text"
                placeholder="Example: Vue.js, Python or Project Management"
                maxlength="80"
                :disabled="isSubmitting"
            />

            <button
                type="submit"
                :disabled="isSubmitting"
            >
              <span
                  v-if="isSubmitting"
                  class="spinner"
              ></span>

              {{
              isSubmitting
              ? "Adding..."
              : "Add skill"
              }}
            </button>
          </div>
        </form>

        <div class="search-section">
          <label for="skill-search">
            Search skills
          </label>

          <div class="search-field">
            <span class="search-icon">⌕</span>

            <input
                id="skill-search"
                v-model="searchTerm"
                type="search"
                placeholder="Search by skill name..."
            />

            <button
                v-if="searchTerm"
                type="button"
                class="clear-search"
                aria-label="Clear search"
                @click="searchTerm = ''"
            >
              ×
            </button>
          </div>
        </div>
      </section>

      <section class="skills-section">
        <div class="section-heading">
          <div>
            <span class="section-label">
              Skill collection
            </span>

            <h2>Your skills</h2>
          </div>

          <span class="result-count">
            {{ filteredSkills.length }}
            result{{
              filteredSkills.length === 1
                ? ""
                : "s"
            }}
          </span>
        </div>

        <div
            v-if="isLoading"
            class="skills-grid"
        >
          <article
              v-for="item in 4"
              :key="item"
              class="skill-card loading-card"
          >
            <span class="loading-icon"></span>
            <span class="loading-title"></span>
            <span class="loading-actions"></span>
          </article>
        </div>

        <div
            v-else-if="filteredSkills.length"
            class="skills-grid"
        >
          <article
              v-for="skill in filteredSkills"
              :key="skill._id"
              class="skill-card"
          >
            <template v-if="editingId !== skill._id">
              <div class="skill-top">
                <span class="skill-icon">
                  {{ getInitials(skill.name) }}
                </span>

                <span class="skill-badge">
                  Skill
                </span>
              </div>

              <div class="skill-content">
                <h3>{{ skill.name }}</h3>

                <p>
                  Professional competency included in
                  your CareerBridge profile.
                </p>
              </div>

              <div class="skill-actions">
                <button
                    class="edit-button"
                    type="button"
                    @click="startEdit(skill)"
                >
                  Edit
                </button>

                <button
                    class="delete-button"
                    type="button"
                    :disabled="deletingId === skill._id"
                    @click="deleteSkill(skill)"
                >
                  {{
                  deletingId === skill._id
                  ? "Deleting..."
                  : "Delete"
                  }}
                </button>
              </div>
            </template>

            <form
                v-else
                class="edit-form"
                @submit.prevent="saveEdit(skill)"
            >
              <span class="section-label">
                Edit skill
              </span>

              <label :for="`skill-${skill._id}`">
                Skill name
              </label>

              <input
                  :id="`skill-${skill._id}`"
                  v-model="editingName"
                  type="text"
                  maxlength="80"
                  autofocus
              />

              <div class="edit-actions">
                <button
                    class="save-button"
                    type="submit"
                >
                  Save
                </button>

                <button
                    class="cancel-button"
                    type="button"
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
            S
          </span>

          <h3>
            {{
            searchTerm
            ? "No matching skills found"
            : "No skills added yet"
            }}
          </h3>

          <p>
            {{
            searchTerm
            ? "Try another search term."
            : "Add your first skill using the form above."
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
.skills-page {
  min-height: calc(100vh - 72px);
  padding: 44px 24px 70px;
  color: #0f172a;
  background:
      radial-gradient(
          circle at 5% 5%,
          rgba(59, 130, 246, 0.1),
          transparent 28%
      ),
      #f8fafc;
  font-family:
      Inter,
      Arial,
      sans-serif;
}

.skills-container {
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
          circle at 90% 15%,
          rgba(255, 255, 255, 0.15),
          transparent 25%
      ),
      linear-gradient(
          135deg,
          #172554,
          #1d4ed8 60%,
          #4f46e5
      );
  border-radius: 26px;
  box-shadow:
      0 22px 50px rgba(30, 64, 175, 0.2);
}

.page-header::after {
  position: absolute;
  right: -80px;
  bottom: -150px;
  width: 320px;
  height: 320px;
  content: "";
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
}

.header-content,
.header-statistic {
  position: relative;
  z-index: 1;
}

.header-content {
  max-width: 700px;
}

.header-label,
.section-label {
  display: inline-block;
  margin-bottom: 9px;
  color: #93c5fd;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
}

.header-content h1 {
  margin: 0 0 14px;
  font-size: clamp(38px, 5vw, 54px);
  line-height: 1.05;
  letter-spacing: -1.4px;
}

.header-content p {
  max-width: 660px;
  margin: 0;
  color: #dbeafe;
  font-size: 16px;
  line-height: 1.7;
}

.header-statistic {
  min-width: 190px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.12);
  border:
      1px solid rgba(255, 255, 255, 0.18);
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
  color: #172554;
  background: #dbeafe;
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
  color: #dbeafe;
  font-size: 12px;
}

.message {
  margin-top: 20px;
  padding: 13px 16px;
  display: grid;
  grid-template-columns: auto 1fr auto;
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
  border-radius: 6px;
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

.control-panel {
  margin-top: 24px;
  padding: 30px;
  display: grid;
  grid-template-columns: 1.4fr 0.6fr;
  align-items: end;
  gap: 28px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 21px;
  box-shadow:
      0 12px 32px rgba(15, 23, 42, 0.06);
}

.form-heading {
  margin-bottom: 19px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}

.section-label {
  color: #2563eb;
}

.form-heading h2,
.section-heading h2 {
  margin: 0;
  color: #0f172a;
  font-size: 23px;
  letter-spacing: -0.4px;
}

.form-heading p {
  max-width: 390px;
  margin: 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.6;
}

.add-field {
  display: flex;
  gap: 11px;
}

.add-field input,
.search-field input,
.edit-form input {
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

.add-field input:focus,
.search-field input:focus,
.edit-form input:focus {
  background: #ffffff;
  border-color: #2563eb;
  box-shadow:
      0 0 0 4px rgba(37, 99, 235, 0.11);
}

.add-field button {
  min-width: 135px;
  padding: 12px 18px;
  color: #ffffff;
  background:
      linear-gradient(135deg, #2563eb, #4f46e5);
  border: 0;
  border-radius: 11px;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
}

.add-field button:disabled {
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
      2px solid rgba(255, 255, 255, 0.45);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.search-section label {
  display: block;
  margin-bottom: 9px;
  color: #334155;
  font-size: 13px;
  font-weight: 800;
}

.search-field {
  position: relative;
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

.clear-search {
  position: absolute;
  top: 50%;
  right: 11px;
  padding: 3px 7px;
  color: #64748b;
  background: transparent;
  border: 0;
  cursor: pointer;
  font-size: 18px;
  transform: translateY(-50%);
}

.skills-section {
  margin-top: 28px;
}

.section-heading {
  margin-bottom: 18px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}

.result-count {
  padding: 8px 11px;
  color: #475569;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 700;
}

.skills-grid {
  display: grid;
  grid-template-columns:
    repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.skill-card {
  min-height: 245px;
  padding: 23px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  box-shadow:
      0 10px 28px rgba(15, 23, 42, 0.06);
  transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      border-color 0.2s ease;
}

.skill-card:hover {
  transform: translateY(-3px);
  border-color: #bfdbfe;
  box-shadow:
      0 17px 35px rgba(15, 23, 42, 0.1);
}

.skill-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.skill-icon {
  width: 47px;
  height: 47px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1d4ed8;
  background: #dbeafe;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 900;
}

.skill-badge {
  padding: 6px 9px;
  color: #2563eb;
  background: #eff6ff;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
}

.skill-content {
  flex: 1;
  padding: 23px 0;
}

.skill-content h3 {
  margin: 0 0 9px;
  color: #0f172a;
  font-size: 19px;
}

.skill-content p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.65;
}

.skill-actions,
.edit-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
}

.skill-actions button,
.edit-actions button {
  min-height: 40px;
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 800;
}

.edit-button,
.save-button {
  color: #ffffff;
  background: #2563eb;
  border: 1px solid #2563eb;
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

.skill-actions button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.edit-form {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.edit-form label {
  margin: 12px 0 8px;
  color: #334155;
  font-size: 13px;
  font-weight: 800;
}

.edit-actions {
  margin-top: auto;
  padding-top: 20px;
}

.empty-state {
  padding: 65px 25px;
  text-align: center;
  background: #ffffff;
  border: 1px dashed #cbd5e1;
  border-radius: 18px;
}

.empty-icon {
  width: 58px;
  height: 58px;
  margin: 0 auto 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  background: #dbeafe;
  border-radius: 17px;
  font-weight: 900;
}

.empty-state h3 {
  margin: 0 0 8px;
  font-size: 20px;
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
  background: #2563eb;
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
  width: 47px;
  height: 47px;
}

.loading-title {
  width: 65%;
  height: 23px;
  margin-top: 35px;
}

.loading-actions {
  width: 100%;
  height: 40px;
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

@media (max-width: 980px) {
  .control-panel {
    grid-template-columns: 1fr;
  }

  .skills-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .skills-page {
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

  .control-panel {
    padding: 22px;
  }

  .form-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .add-field {
    flex-direction: column;
  }

  .add-field button {
    width: 100%;
  }
}

@media (max-width: 540px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .header-content h1 {
    font-size: 36px;
  }
}
</style>