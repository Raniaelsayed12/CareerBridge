<script setup>
import { ref, onMounted, computed } from "vue";
import Navbar from "../components/Navbar.vue/Navbar.vue";
import api from "../services/api";
import { toast } from "vue3-toastify";

const skills = ref([]);

const newSkill = ref("");
const editingId = ref(null);
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
 if (!newSkill.value.trim()) {
  toast.error("Please enter a skill.");
  return;
}
  try {
    if (editingId.value) {
      await api.put(`/skills/${editingId.value}`, {
        name: newSkill.value,
      });
      toast.success("Skill updated successfully!");

      editingId.value = null;
    } else {
      await api.post("/skills", {
        name: newSkill.value,
      });
      toast.success("Skill added successfully!");
    }

    newSkill.value = "";
    await loadSkills();
  } catch (error) {
    toast.error("Something went wrong.");
    console.error(error);
  }
}

function editSkill(skill) {
  editingId.value = skill._id;
  newSkill.value = skill.name;
}
async function removeSkill(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this skill?"
  );

  if (!confirmDelete) return;

  try {
    await api.delete(`/skills/${id}`);

    toast.success("Skill deleted successfully!");

    await loadSkills();

  } catch (error) {
    console.error(error);
    toast.error("Could not delete skill.");
  }
}

const filteredSkills = computed(() => {
  return skills.value.filter((skill) =>
    skill.name.toLowerCase().includes(search.value.toLowerCase())
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
        {{ editingId ? "Update Skill" : "Add Skill" }}
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
        v-for="skill in filteredSkills"
        :key="skill._id"
        class="skill-card"
      >
        <h3>{{ skill.name.toUpperCase() }}</h3>

        <div class="buttons">
          <button
            class="edit-btn"
            @click="editSkill(skill)"
          >
            Edit
          </button>

          <button
            class="delete-btn"
            @click="removeSkill(skill._id)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.container{
  max-width:1200px;
  margin:auto;
  padding:40px 20px;
}

.container h1{
  text-align:center;
  margin-bottom:35px;
  color:#1e293b;
}

.add-skill{
  max-width:650px;
  margin:0 auto 35px;
  display:flex;
  gap:12px;
}

.add-skill input{
  flex:1;
  padding:14px;
  border:1px solid #ddd;
  border-radius:12px;
  font-size:15px;
}

.add-skill button{
  background:#2563eb;
  color:#fff;
  border:none;
  border-radius:12px;
  padding:0 25px;
  font-weight:600;
  cursor:pointer;
  transition:.3s;
}

.add-skill button:hover{
  background:#1d4ed8;
}

.search-input{
  width:320px;
  padding:12px;
  border:1px solid #ddd;
  border-radius:12px;
  display:block;
  margin:0 auto 35px;
}

.empty-text{
  text-align:center;
  color:#777;
  margin-bottom:20px;
}

.skills-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:25px;
}

.skill-card{
  background:#fff;
  border-radius:18px;
  padding:25px;
  box-shadow:0 8px 20px rgba(0,0,0,.08);
  display:flex;
  flex-direction:column;
  min-height:180px;
  transition:.3s;
}

.skill-card:hover{
  transform:translateY(-6px);
}

.skill-card h3{
  color:#2563eb;
  text-align:center;
  margin-bottom:25px;
  letter-spacing:1px;
}

.buttons{
  display:flex;
  gap:12px;
  margin-top:auto;
}

.edit-btn,
.delete-btn{
  flex:1;
  height:45px;
  border:none;
  border-radius:10px;
  display:flex;
  justify-content:center;
  align-items:center;
  font-weight:600;
  color:#fff;
  cursor:pointer;
  transition:.3s;
}

.edit-btn{
  background:#2563eb;
}

.edit-btn:hover{
  background:#1d4ed8;
}

.delete-btn{
  background:#ef4444;
}

.delete-btn:hover{
  background:#dc2626;
}

@media(max-width:700px){

  .container{
    padding:20px;
  }

  .add-skill{
    flex-direction:column;
  }

  .add-skill input,
  .search-input{
    width:100%;
  }

  .buttons{
    flex-direction:column;
  }
}
</style>