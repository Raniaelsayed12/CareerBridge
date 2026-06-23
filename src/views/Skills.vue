<script setup>
import { ref, onMounted } from "vue";
import Navbar from "../components/Navbar.vue/Navbar.vue";
import api from "../services/api";

const skills = ref([]);
const newSkill = ref("");

async function loadSkills() {
  const response = await api.get("/skills");
  skills.value = response.data;
}

async function addSkill() {
  if (!newSkill.value.trim()) return;

  await api.post("/skills", {
    name: newSkill.value,
  });

  newSkill.value = "";
  loadSkills();
}

async function removeSkill(id) {
  await api.delete(`/skills/${id}`);
  loadSkills();
}

onMounted(() => {
  loadSkills();
});
</script>

<template>
  <Navbar />

  <div class="container">
    <h1>My Skills</h1>

    <div class="add-skill">
      <input
        v-model="newSkill"
        placeholder="Enter a new skill"
      />

      <button @click="addSkill">
        Add Skill
      </button>
    </div>

    <div class="skills-grid">
      <div
        class="skill-card"
        v-for="skill in skills"
        :key="skill._id"
      >
        <h3>{{ skill.name }}</h3>

        <button
          class="delete-btn"
          @click="removeSkill(skill._id)"
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

.add-skill {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
}

.add-skill input {
  width: 300px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.add-skill button {
  background: #2563eb;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  cursor: pointer;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.skill-card {
  background: white;
  padding: 25px;
  text-align: center;
  border-radius: 15px;
  box-shadow: 0 0 15px #ddd;
}

.delete-btn {
  margin-top: 10px;
  background: crimson;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}
</style>