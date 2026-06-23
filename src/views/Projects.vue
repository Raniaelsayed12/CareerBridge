<script setup>
import { ref, onMounted } from "vue";
import Navbar from "../components/Navbar.vue/Navbar.vue";
import api from "../services/api";

const projects = ref([]);

const title = ref("");
const description = ref("");
const github = ref("");

async function loadProjects() {
  const response = await api.get("/projects");
  projects.value = response.data;
}

async function addProject() {
 

  try {
    const response = await api.post("/projects", {
      title: title.value,
      description: description.value,
      github: github.value,
    });

    
    console.log(response.data);

    title.value = "";
    description.value = "";
    github.value = "";

    await loadProjects();

  } catch (error) {
    console.log("ERROR");
    ;
  }
}

async function deleteProject(id) {
  await api.delete(`/projects/${id}`);
  loadProjects();
}

onMounted(async () => {
  await loadProjects();
  console.log(projects.value);
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
        Add Project
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

        <button
          class="delete-btn"
          @click="deleteProject(project._id)"
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
}

.project-card h2 {
  color: #2563eb;
}

.project-card a {
  display: block;
  margin-top: 10px;
  text-decoration: none;
  color: #2563eb;
}
</style>