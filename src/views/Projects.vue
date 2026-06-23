<script setup>
import { ref } from "vue";
import Navbar from "../components/Navbar.vue/Navbar.vue";
import { useUserStore } from "../stores/userStore";

const user = useUserStore();

const title = ref("");
const description = ref("");
const github = ref("");

function addProject() {
  if (
    title.value.trim() &&
    description.value.trim()
  ) {
    user.addProject({
      title: title.value,
      description: description.value,
      github: github.value,
    });

    title.value = "";
    description.value = "";
    github.value = "";
  }
}

function deleteProject(index) {
  user.deleteProject(index);
}
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
        v-for="(project, index) in user.projects"
        :key="index"
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
          @click="deleteProject(index)"
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
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
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