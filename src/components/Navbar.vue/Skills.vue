<script setup>
import { ref } from "vue";
import Navbar from "../components/Navbar.vue/Navbar.vue";
import { useUserStore } from "../stores/userStore";

const user = useUserStore();

const newSkill = ref("");

function addSkill() {
  if (newSkill.value.trim() !== "") {
    user.addSkill(newSkill.value);
    newSkill.value = "";
  }
}

function removeSkill(index) {
  user.deleteSkill(index);
}
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
        v-for="(skill, index) in user.skills"
        :key="index"
      >
        <h3>{{ skill }}</h3>

        <button
          class="delete-btn"
          @click="removeSkill(index)"
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
  border-radius: 15px;
  text-align: center;
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