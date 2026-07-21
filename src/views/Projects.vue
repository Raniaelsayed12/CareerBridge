<script setup>
import { toast } from "vue3-toastify";
import { ref, onMounted, computed } from "vue";
import Navbar from "../components/Navbar.vue/Navbar.vue";
import api from "../services/api";

const projects = ref([]);

const title = ref("");
const description = ref("");
const github = ref("");

const editingId = ref(null);
const search = ref("");

async function loadProjects() {
  try {
    const response = await api.get("/projects");
    console.log(response.data);
    projects.value = response.data;
    console.log(projects.value);
  } catch (error) {
    console.error(error);
  }
}

async function addProject() {
  try {
    if (!title.value.trim()) {
      toast.error("Project title is required");
      return;
    }

    if (editingId.value) {
      await api.put(`/projects/${editingId.value}`, {
        title: title.value,
        description: description.value,
        github: github.value,
      });

      toast.success("Project updated successfully!");
      editingId.value = null;
    } else {
      await api.post("/projects", {
        title: title.value,
        description: description.value,
        github: github.value,
      });

      toast.success("Project added successfully!");
    }

    title.value = "";
    description.value = "";
    github.value = "";

    loadProjects();

  } catch (error) {
    console.error(error);
    toast.error("Something went wrong.");
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

    toast.success("Project deleted successfully!");

    loadProjects();

  } catch (error) {
    console.error(error);
    toast.error("Could not delete project.");
  }
}

const filteredProjects = computed(() => {
  return projects.value.filter((project) =>
    project.title.toLowerCase().includes(
      search.value.toLowerCase()
    )
  );
});

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

    <input
      v-model="search"
      class="search-input"
      placeholder="Search Project..."
    />

    <p
      v-if="filteredProjects.length === 0"
      class="empty-text"
    >
      No projects found.
    </p>

    <div class="projects-grid">

      <div
        class="project-card"
        v-for="project in filteredProjects"
        :key="project._id"
      >

        <div class="card-content">
        <h2>{{ project.title }}</h2>

        <p>{{ project.description }}</p>

        <a
          :href="project.github"
          target="_blank"
        >
          GitHub Repository
        </a>
      </div>

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
.container{max-width:1200px;margin:auto;padding:40px 20px;}
.container h1{text-align:center;margin-bottom:30px;}
.form{max-width:650px;margin:0 auto 40px;display:flex;flex-direction:column;gap:15px;}
.form input,.form textarea{padding:14px;border:1px solid #ddd;border-radius:12px;font-size:15px;}
.form textarea{min-height:100px;resize:none;}
.form button{background:#2563eb;color:#fff;border:none;padding:14px;border-radius:12px;cursor:pointer;}
.search-input{width:320px;padding:12px;border:1px solid #ddd;border-radius:12px;display:block;margin:0 auto 35px;}
.empty-text{text-align:center;color:#777;}
.projects-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
  gap:25px;
  align-items:stretch;
}

.project-card{
  background:#fff;
  border-radius:18px;
  padding:25px;
  box-shadow:0 8px 20px rgba(0,0,0,.08);
  display:flex;
  flex-direction:column;
  min-height:360px;
  transition:.3s;
}

.project-card:hover{
  transform:translateY(-6px);
}

.card-content{
  flex:1;
  display:flex;
  flex-direction:column;
}

.project-card h2{
  color:#2563eb;
  margin-bottom:12px;
  min-height:56px;
}

.project-card p{
  flex:1;
  color:#555;
  line-height:1.6;
  margin-bottom:15px;
  display:-webkit-box;
  -webkit-line-clamp:3;
  -webkit-box-orient:vertical;
  overflow:hidden;
}

.project-card a{
  color:#2563eb;
  text-decoration:none;
  font-weight:600;
  word-break:break-word;
}

.buttons{
  display:flex;
  gap:12px;
  margin-top:20px;
}

.edit-btn,
.delete-btn{
  flex:1;
  height:45px;
  border:none;
  border-radius:10px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:600;
  cursor:pointer;
}
@media(max-width:700px){.container{padding:20px}.search-input{width:100%}.projects-grid{grid-template-columns:1fr}}
</style>
