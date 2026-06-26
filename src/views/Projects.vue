<script setup>
import { ref, onMounted } from "vue";
import Navbar from "../components/Navbar.vue/Navbar.vue";
import api from "../services/api";

const projects = ref([]);

const title = ref("");
const description = ref("");
const github = ref("");

const editingId = ref(null);

async function loadProjects() {
  const response = await api.get("/projects");
  projects.value = response.data;
}

async function addProject() {
  try {
    if (editingId.value) {
      await api.put(`/projects/${editingId.value}`, {
        title: title.value,
        description: description.value,
        github: github.value,
      });

      editingId.value = null;
    } else {
      await api.post("/projects", {
        title: title.value,
        description: description.value,
        github: github.value,
      });
    }

    title.value = "";
    description.value = "";
    github.value = "";

    await loadProjects();

  } catch (error) {
    console.error(error);
  }
}

function editProject(project) {
  editingId.value = project._id;

  title.value = project.title;
  description.value = project.description;
  github.value = project.github;
}

async function deleteProject(id) {

  const confirmDelete = confirm(
    "Are you sure you want to delete this project?"
  );

  if (!confirmDelete) return;

  try {
    await api.delete(`/projects/${id}`);
    await loadProjects();
  } catch (error) {
    console.error(error);
  }
}

onMounted(() => {
  loadProjects();
});
</script>

<template>
  <Navbar />

  <div class="container">

    <h1>My Projects</h1>

    <div class="form">

      <input
        v-model="title"
        placeholder="Project Name"
      />

      <input
        v-model="github"
        placeholder="GitHub Link"
      />

      <textarea
        v-model="description"
        placeholder="Project Description"
      ></textarea>

      <button @click="addProject">
        {{ editingId ? "Update Project" : "Add Project" }}
      </button>

    </div>

    <div class="projects-grid">

      <div
        class="project-card"
        v-for="project in projects"
        :key="project._id"
      >

        <h2>{{ project.title }}</h2>

        <p>{{ project.description }}</p>

        <a
          :href="project.github"
          target="_blank"
        >
          GitHub Repository
        </a>

        <div class="buttons">

          <button
            class="edit-btn"
            @click="editProject(project)"
          >
            Edit
          </button>

          <button
            class="delete-btn"
            @click="deleteProject(project._id)"
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
  max-width: 600px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 40px;
}

.form input,
.form textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.form textarea {
  min-height: 100px;
}

.form button {
  background: #2563eb;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: .3s;
}

.form button:hover {
  background: #1d4ed8;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.project-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 0 15px #ddd;
  transition: .3s;
}

.project-card:hover {
  transform: translateY(-6px);
}

.project-card h2 {
  color: #2563eb;
}

.project-card p {
  margin: 15px 0;
}

.project-card a {
  display: block;
  margin-top: 10px;
  text-decoration: none;
  color: #2563eb;
  word-break: break-all;
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
  transition: .3s;
}

.edit-btn:hover {
  background: #059669;
}

.delete-btn {
  flex: 1;
  background: crimson;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: .3s;
}

.delete-btn:hover {
  background: #b91c1c;
}

@media(max-width:700px){

.container{
  padding:20px;
}

.buttons{
  flex-direction:column;
}

}
</style>