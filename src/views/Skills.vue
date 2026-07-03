<script setup>
import { ref, onMounted, computed } from "vue";
import Navbar from "../components/Navbar.vue/Navbar.vue";
import api from "../services/api";

const skills = ref([]);
const newSkill = ref("");
const search = ref("");

async function loadSkills() {
  try {
    const response = await api.get("/skills");
    skills.value = response.data;
  } catch (error) {
    console.error(error);
  }
}

async function addSkill() {
  const skillName = newSkill.value.trim();

  if (!skillName) return;

  const exists = skills.value.some(
    (skill) =>
      skill.name.toLowerCase() ===
      skillName.toLowerCase()
  );

  if (exists) {
    alert("Skill already exists!");
    return;
  }

  try {
    await api.post("/skills", {
      name: skillName,
    });

    newSkill.value = "";
    await loadSkills();
  } catch (error) {
    console.error(error);
  }
}

async function removeSkill(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this skill?"
  );

  if (!confirmDelete) return;

  try {
    await api.delete(`/skills/${id}`);
    await loadSkills();
  } catch (error) {
    console.error(error);
  }
}

const filteredSkills = computed(() => {
  return skills.value.filter((skill) =>
    skill.name.toLowerCase().includes(
      search.value.toLowerCase()
    )
  );
});

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

    <input
      v-model="search"
      class="search-input"
      placeholder="Search Skill..."
    />

    <p
      v-if="filteredSkills.length === 0"
      class="empty-text"
    >
      No skills found.
    </p>

    <div class="skills-grid">
      <div
        class="skill-card"
        v-for="skill in filteredSkills"
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

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.skill-card {
  background: white;
  padding: 25px;
  text-align: center;
  border-radius: 15px;
  box-shadow: 0 0 15px #ddd;
  transition: 0.3s;
}

.skill-card:hover {
  transform: translateY(-6px);
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

@media (max-width: 600px) {
  .container {
    padding: 20px;
  }

  .add-skill {
    flex-direction: column;
  }

  .search-input,
  .add-skill input {
    width: 100%;
  }
}
</style>