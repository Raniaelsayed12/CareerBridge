<script setup>
import { computed, onMounted, ref } from "vue";
import Navbar from "../components/Navbar.vue/Navbar.vue";
import api from "../services/api";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();

const projects = ref([]);
const searchTerm = ref("");

const form = ref({
  title: "",
  description: "",
  github: "",
});

const editingId = ref("");
const editForm = ref({
  title: "",
  description: "",
  github: "",
});

const isLoading = ref(true);
const isSubmitting = ref(false);
const isUpdating = ref(false);
const deletingId = ref("");

const successMessage = ref("");
const errorMessage = ref("");

const filteredProjects = computed(() => {
  const search = searchTerm.value.trim().toLowerCase();

  if (!search) {
    return projects.value;
  }

  return projects.value.filter((project) => {
    const title = project.title?.toLowerCase() || "";
    const description =
        project.description?.toLowerCase() || "";

    return (
        title.includes(search) ||
        description.includes(search)
    );
  });
});

const projectCountText = computed(() => {
  const count = projects.value.length;

  return count === 1
      ? "1 project"
      : `${count} projects`;
});

function clearMessages() {
  successMessage.value = "";
  errorMessage.value = "";
}

function synchronizeStore() {
  userStore.projects = [...projects.value];
}

function isValidGithubUrl(url) {
  if (!url) {
    return true;
  }

  return (
      url.startsWith("https://github.com/") ||
      url.startsWith("http://github.com/")
  );
}

function getProjectInitials(title) {
  if (!title) {
    return "PR";
  }

  return title
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) =>
          word.charAt(0).toUpperCase()
      )
      .join("");
}

function normalizedGithubUrl(url) {
  if (!url) {
    return "";
  }

  if (
      url.startsWith("http://") ||
      url.startsWith("https://")
  ) {
    return url;
  }

  return `https://${url}`;
}

async function loadProjects() {
  clearMessages();
  isLoading.value = true;

  try {
    const response = await api.get("/projects");

    projects.value = Array.isArray(response.data)
        ? response.data
        : [];

    synchronizeStore();
  } catch (error) {
    console.error(
        "Could not load projects:",
        error
    );

    errorMessage.value =
        error.response?.data?.message ||
        "Projects could not be loaded.";
  } finally {
    isLoading.value = false;
  }
}

async function addProject() {
  clearMessages();

  const projectData = {
    title: form.value.title.trim(),
    description:
        form.value.description.trim(),
    github: form.value.github.trim(),
  };

  if (!projectData.title) {
    errorMessage.value =
        "Please enter a project title.";
    return;
  }

  if (projectData.title.length < 2) {
    errorMessage.value =
        "Project title must contain at least two characters.";
    return;
  }

  if (!isValidGithubUrl(projectData.github)) {
    errorMessage.value =
        "Please enter a complete GitHub repository URL.";
    return;
  }

  try {
    isSubmitting.value = true;

    const response = await api.post(
        "/projects",
        projectData
    );

    projects.value.unshift(response.data);

    form.value = {
      title: "",
      description: "",
      github: "",
    };

    synchronizeStore();

    successMessage.value =
        "Project added successfully.";
  } catch (error) {
    console.error(
        "Could not add project:",
        error
    );

    errorMessage.value =
        error.response?.data?.message ||
        "Project could not be added.";
  } finally {
    isSubmitting.value = false;
  }
}

function startEdit(project) {
  clearMessages();

  editingId.value = project._id;

  editForm.value = {
    title: project.title || "",
    description: project.description || "",
    github: project.github || "",
  };
}

function cancelEdit() {
  if (isUpdating.value) {
    return;
  }

  editingId.value = "";

  editForm.value = {
    title: "",
    description: "",
    github: "",
  };
}

async function updateProject(project) {
  clearMessages();

  const projectData = {
    title: editForm.value.title.trim(),
    description:
        editForm.value.description.trim(),
    github: editForm.value.github.trim(),
  };

  if (!projectData.title) {
    errorMessage.value =
        "Project title is required.";
    return;
  }

  if (!isValidGithubUrl(projectData.github)) {
    errorMessage.value =
        "Please enter a complete GitHub repository URL.";
    return;
  }

  try {
    isUpdating.value = true;

    const response = await api.put(
        `/projects/${project._id}`,
        projectData
    );

    const projectIndex =
        projects.value.findIndex(
            (item) => item._id === project._id
        );

    if (projectIndex !== -1) {
      projects.value[projectIndex] =
          response.data;
    }

    synchronizeStore();
    cancelEdit();

    successMessage.value =
        "Project updated successfully.";
  } catch (error) {
    console.error(
        "Could not update project:",
        error
    );

    errorMessage.value =
        error.response?.data?.message ||
        "Project could not be updated.";
  } finally {
    isUpdating.value = false;
  }
}

async function deleteProject(project) {
  clearMessages();

  const confirmed = window.confirm(
      `Do you really want to delete "${project.title}"?`
  );

  if (!confirmed) {
    return;
  }

  try {
    deletingId.value = project._id;

    await api.delete(
        `/projects/${project._id}`
    );

    projects.value = projects.value.filter(
        (item) => item._id !== project._id
    );

    synchronizeStore();

    successMessage.value =
        "Project deleted successfully.";
  } catch (error) {
    console.error(
        "Could not delete project:",
        error
    );

    errorMessage.value =
        error.response?.data?.message ||
        "Project could not be deleted.";
  } finally {
    deletingId.value = "";
  }
}

onMounted(loadProjects);
</script>

<template>
  <Navbar />

  <main class="projects-page">
    <div class="projects-container">
      <section class="page-header">
        <div class="header-content">
          <span class="header-label">
            Professional portfolio
          </span>

          <h1>Projects</h1>

          <p>
            Present the projects that demonstrate your
            experience, technical skills and practical
            achievements.
          </p>
        </div>

        <div class="header-statistic">
          <span class="statistic-icon">
            P
          </span>

          <div>
            <strong>{{ projects.length }}</strong>
            <span>{{ projectCountText }}</span>
          </div>
        </div>
      </section>

      <div
          v-if="successMessage"
          class="message success-message"
          role="status"
      >
        <span class="message-symbol">✓</span>

        <span>{{ successMessage }}</span>

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
        <span class="message-symbol">!</span>

        <span>{{ errorMessage }}</span>

        <button
            type="button"
            aria-label="Close error message"
            @click="errorMessage = ''"
        >
          ×
        </button>
      </div>

      <section class="project-form-card">
        <div class="form-heading">
          <div>
            <span class="section-label">
              New portfolio item
            </span>

            <h2>Add a project</h2>
          </div>

          <p>
            Add the project title, a useful description
            and an optional GitHub repository.
          </p>
        </div>

        <form
            class="project-form"
            @submit.prevent="addProject"
        >
          <div class="form-grid">
            <div class="form-group">
              <label for="project-title">
                Project title
                <span>*</span>
              </label>

              <input
                  id="project-title"
                  v-model="form.title"
                  type="text"
                  placeholder="Example: CareerBridge"
                  maxlength="100"
                  :disabled="isSubmitting"
              />
            </div>

            <div class="form-group">
              <label for="project-github">
                GitHub repository
              </label>

              <input
                  id="project-github"
                  v-model="form.github"
                  type="url"
                  placeholder="https://github.com/username/project"
                  :disabled="isSubmitting"
              />
            </div>

            <div class="form-group full-width">
              <label for="project-description">
                Project description
              </label>

              <textarea
                  id="project-description"
                  v-model="form.description"
                  rows="4"
                  maxlength="600"
                  placeholder="Explain the purpose, technologies and results of the project..."
                  :disabled="isSubmitting"
              ></textarea>

              <small class="character-counter">
                {{ form.description.length }}/600
              </small>
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
              ? "Adding project..."
              : "Add project"
              }}
            </button>
          </div>
        </form>
      </section>

      <section class="projects-section">
        <div class="projects-toolbar">
          <div>
            <span class="section-label">
              Project collection
            </span>

            <h2>Your projects</h2>
          </div>

          <div class="search-field">
            <span class="search-icon">⌕</span>

            <input
                v-model="searchTerm"
                type="search"
                placeholder="Search projects..."
                aria-label="Search projects"
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
            class="projects-grid"
        >
          <article
              v-for="item in 4"
              :key="item"
              class="project-card loading-card"
          >
            <div class="loading-header"></div>
            <div class="loading-title"></div>
            <div class="loading-description"></div>
            <div class="loading-actions"></div>
          </article>
        </div>

        <div
            v-else-if="filteredProjects.length"
            class="projects-grid"
        >
          <article
              v-for="project in filteredProjects"
              :key="project._id"
              class="project-card"
          >
            <template
                v-if="editingId !== project._id"
            >
              <div class="project-card-header">
                <span class="project-icon">
                  {{
                    getProjectInitials(
                      project.title
                    )
                  }}
                </span>

                <span class="project-badge">
                  Portfolio project
                </span>
              </div>

              <div class="project-content">
                <h3>{{ project.title }}</h3>

                <p>
                  {{
                  project.description ||
                  "No project description has been added yet."
                  }}
                </p>
              </div>

              <a
                  v-if="project.github"
                  :href="
                  normalizedGithubUrl(
                    project.github
                  )
                "
                  class="github-link"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                <span class="github-mark">G</span>

                <span>Open GitHub repository</span>

                <span>↗</span>
              </a>

              <div
                  v-else
                  class="missing-github"
              >
                No GitHub repository provided
              </div>

              <div class="project-actions">
                <button
                    class="edit-button"
                    type="button"
                    @click="startEdit(project)"
                >
                  Edit
                </button>

                <button
                    class="delete-button"
                    type="button"
                    :disabled="
                    deletingId === project._id
                  "
                    @click="deleteProject(project)"
                >
                  {{
                  deletingId === project._id
                  ? "Deleting..."
                  : "Delete"
                  }}
                </button>
              </div>
            </template>

            <form
                v-else
                class="edit-project-form"
                @submit.prevent="
                updateProject(project)
              "
            >
              <div class="edit-heading">
                <span class="section-label">
                  Project settings
                </span>

                <h3>Edit project</h3>
              </div>

              <div class="form-group">
                <label
                    :for="`edit-title-${project._id}`"
                >
                  Project title
                </label>

                <input
                    :id="`edit-title-${project._id}`"
                    v-model="editForm.title"
                    type="text"
                    maxlength="100"
                    :disabled="isUpdating"
                />
              </div>

              <div class="form-group">
                <label
                    :for="`edit-github-${project._id}`"
                >
                  GitHub repository
                </label>

                <input
                    :id="`edit-github-${project._id}`"
                    v-model="editForm.github"
                    type="url"
                    placeholder="https://github.com/username/project"
                    :disabled="isUpdating"
                />
              </div>

              <div class="form-group">
                <label
                    :for="`edit-description-${project._id}`"
                >
                  Description
                </label>

                <textarea
                    :id="`edit-description-${project._id}`"
                    v-model="editForm.description"
                    rows="5"
                    maxlength="600"
                    :disabled="isUpdating"
                ></textarea>
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
          <span class="empty-icon">P</span>

          <h3>
            {{
            searchTerm
            ? "No matching projects found"
            : "No projects added yet"
            }}
          </h3>

          <p>
            {{
            searchTerm
            ? "Try another title or description."
            : "Use the form above to add your first portfolio project."
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
.projects-page {
  min-height: calc(100vh - 72px);
  padding: 44px 24px 70px;
  color: #0f172a;
  background:
      radial-gradient(
          circle at 5% 5%,
          rgba(99, 102, 241, 0.11),
          transparent 28%
      ),
      #f8fafc;
  font-family:
      Inter,
      Arial,
      sans-serif;
}

.projects-container {
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
          #172554,
          #4338ca 58%,
          #7c3aed
      );
  border-radius: 26px;
  box-shadow:
      0 22px 50px rgba(67, 56, 202, 0.22);
}

.page-header::after {
  position: absolute;
  right: -90px;
  bottom: -160px;
  width: 350px;
  height: 350px;
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
  max-width: 710px;
}

.header-label,
.section-label {
  display: inline-block;
  margin-bottom: 9px;
  color: #c7d2fe;
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
  color: #e0e7ff;
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
  color: #4338ca;
  background: #e0e7ff;
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
  color: #e0e7ff;
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

.project-form-card {
  margin-top: 24px;
  padding: 30px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 21px;
  box-shadow:
      0 12px 32px rgba(15, 23, 42, 0.06);
}

.form-heading {
  margin-bottom: 24px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 25px;
}

.section-label {
  color: #4f46e5;
}

.form-heading h2,
.projects-toolbar h2 {
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

.form-group.full-width {
  grid-column: 1 / -1;
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
.form-group textarea,
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
  resize: vertical;
  transition:
      background 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.search-field input:focus {
  background: #ffffff;
  border-color: #4f46e5;
  box-shadow:
      0 0 0 4px rgba(79, 70, 229, 0.11);
}

.form-group input:disabled,
.form-group textarea:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.character-counter {
  display: block;
  margin-top: 7px;
  color: #94a3b8;
  font-size: 11px;
  text-align: right;
}

.form-actions {
  margin-top: 23px;
  display: flex;
  justify-content: flex-end;
}

.primary-button {
  min-width: 145px;
  min-height: 44px;
  padding: 12px 18px;
  color: #ffffff;
  background:
      linear-gradient(
          135deg,
          #4f46e5,
          #7c3aed
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
      2px solid rgba(255, 255, 255, 0.45);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.projects-section {
  margin-top: 30px;
}

.projects-toolbar {
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

.projects-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.project-card {
  min-height: 385px;
  padding: 25px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 19px;
  box-shadow:
      0 11px 30px rgba(15, 23, 42, 0.06);
  transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      border-color 0.2s ease;
}

.project-card:hover {
  transform: translateY(-3px);
  border-color: #c7d2fe;
  box-shadow:
      0 18px 38px rgba(15, 23, 42, 0.1);
}

.project-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.project-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4338ca;
  background: #e0e7ff;
  border-radius: 15px;
  font-size: 13px;
  font-weight: 900;
}

.project-badge {
  padding: 7px 10px;
  color: #5b21b6;
  background: #f3e8ff;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
}

.project-content {
  flex: 1;
  padding: 24px 0 20px;
}

.project-content h3 {
  margin: 0 0 11px;
  color: #0f172a;
  font-size: 21px;
  letter-spacing: -0.3px;
}

.project-content p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.75;
  white-space: pre-line;
}

.github-link,
.missing-github {
  min-height: 45px;
  padding: 11px 13px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 11px;
  font-size: 12px;
  font-weight: 800;
}

.github-link {
  color: #4338ca;
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  text-decoration: none;
}

.github-link span:nth-child(2) {
  flex: 1;
}

.github-mark {
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: #4338ca;
  border-radius: 7px;
}

.missing-github {
  color: #64748b;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
}

.project-actions,
.edit-actions {
  margin-top: 17px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.project-actions button,
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
  background: #4f46e5;
  border: 1px solid #4f46e5;
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

.project-actions button:disabled,
.edit-actions button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.edit-project-form {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  color: #4338ca;
  background: #e0e7ff;
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
  background: #4f46e5;
  border: 0;
  border-radius: 9px;
  cursor: pointer;
  font-weight: 700;
}

.loading-card {
  pointer-events: none;
}

.loading-header,
.loading-title,
.loading-description,
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

.loading-header {
  width: 50px;
  height: 50px;
}

.loading-title {
  width: 65%;
  height: 25px;
  margin-top: 28px;
}

.loading-description {
  width: 100%;
  height: 75px;
  margin-top: 17px;
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

@media (max-width: 850px) {
  .projects-grid,
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: auto;
  }

  .form-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 700px) {
  .projects-page {
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

  .project-form-card {
    padding: 22px;
  }

  .projects-toolbar {
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

@media (max-width: 480px) {
  .header-content h1 {
    font-size: 36px;
  }

  .project-card {
    padding: 21px;
  }
}
</style>