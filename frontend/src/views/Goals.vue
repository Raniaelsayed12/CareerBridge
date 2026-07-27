<template>
  <main class="feature-page">
    <section class="feature-hero">
      <div>
        <span class="eyebrow">KARRIEREZIELE</span>
        <h1>Career Goals</h1>
        <p>Plan learning goals, deadlines and personal career steps.</p>
      </div>

      <div class="hero-card">
        <strong>{{ filteredGoals.length }}</strong>
        <span>Goals saved</span>
      </div>
    </section>

    <section class="feature-grid">
      <form class="form-card" @submit.prevent="saveGoal">
        <h2>{{ editingId ? "Edit Goal" : "Add Goal" }}</h2>

        <label>
          Title
          <input v-model="form.title" required placeholder="Improve Vue.js skills" />
        </label>

        <label>
          Description
          <textarea v-model="form.description" rows="4" placeholder="Describe your goal"></textarea>
        </label>

        <label>
          Deadline
          <input v-model="form.deadline" type="date" />
        </label>

        <label>
          Status
          <select v-model="form.status">
            <option>Planned</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </label>

        <div class="actions">
          <button class="primary-btn" type="submit">{{ editingId ? "Update" : "Add" }}</button>
          <button v-if="editingId" class="secondary-btn" type="button" @click="resetForm">Cancel</button>
        </div>
      </form>

      <section class="list-card">
        <div class="list-header">
          <div>
            <h2>My Goals</h2>
            <p>User-specific career goals</p>
          </div>
          <input v-model="search" class="search-input" placeholder="Search..." />
        </div>

        <div v-if="filteredGoals.length === 0" class="empty-state">No goals found.</div>

        <article v-for="goal in filteredGoals" :key="goal._id" class="item-card">
          <div>
            <span class="badge">{{ goal.status }}</span>
            <h3>{{ goal.title }}</h3>
            <p v-if="goal.description">{{ goal.description }}</p>
            <small>{{ goal.deadline || "No deadline" }}</small>
          </div>

          <div class="card-actions">
            <button @click="editGoal(goal)">Edit</button>
            <button class="danger" @click="deleteGoal(goal._id)">Delete</button>
          </div>
        </article>
      </section>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import api from "../services/api";
import { useUserStore } from "../stores/userStore";
import { confirmAction } from "../utils/confirmDialog";

const userStore = useUserStore();
const goals = ref([]);
const search = ref("");
const editingId = ref(null);

const form = reactive({
  title: "",
  description: "",
  deadline: "",
  status: "Planned",
});

const currentUserId = computed(() => userStore.user?._id || userStore.user?.id);

const filteredGoals = computed(() => {
  const q = search.value.trim().toLowerCase();
  return goals.value.filter((goal) => {
    if (!q) return true;
    return (
      [goal.title, goal.description, goal.status]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .split(/\s+/)
            .some((word) => word.startsWith(q))
        )
    );
  });
});

async function loadGoals() {
  const response = await api.get(`/goals?userId=${currentUserId.value}`);
  goals.value = response.data;
}

async function saveGoal() {
  const payload = { ...form, userId: currentUserId.value };

  if (editingId.value) {
    await api.put(`/goals/${editingId.value}`, payload);
  } else {
    await api.post("/goals", payload);
  }

  resetForm();
  await loadGoals();
}

function editGoal(goal) {
  editingId.value = goal._id;
  form.title = goal.title || "";
  form.description = goal.description || "";
  form.deadline = goal.deadline || "";
  form.status = goal.status || "Planned";
}

async function deleteGoal(id) {
  const ok = await confirmAction("Möchten Sie dieses Ziel wirklich löschen?");
  if (!ok) return;
  await api.delete(`/goals/${id}`);
  await loadGoals();
}

function resetForm() {
  editingId.value = null;
  form.title = "";
  form.description = "";
  form.deadline = "";
  form.status = "Planned";
}

onMounted(loadGoals);
</script>

<style scoped>
.feature-page {
  padding: 2.5rem 5%;
  color: #0f172a;
}

.feature-hero {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  align-items: stretch;
  padding: 2rem;
  border-radius: 30px;
  background: linear-gradient(135deg, #0f172a, #2563eb);
  color: white;
  box-shadow: 0 22px 50px rgba(37, 99, 235, 0.18);
}

.eyebrow {
  display: inline-block;
  margin-bottom: 0.7rem;
  color: #bfdbfe;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.feature-hero h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.6rem);
}

.feature-hero p {
  max-width: 760px;
  color: #dbeafe;
  font-size: 1.05rem;
}

.hero-card {
  min-width: 180px;
  padding: 1.2rem;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.16);
  display: grid;
  place-items: center;
  text-align: center;
}

.hero-card strong {
  font-size: 3rem;
}

.hero-card span {
  color: #dbeafe;
  font-weight: 800;
}

.feature-grid {
  margin-top: 1.8rem;
  display: grid;
  grid-template-columns: minmax(280px, 390px) 1fr;
  gap: 1.3rem;
}

.form-card,
.list-card {
  background: white;
  border: 1px solid #dbe3ef;
  border-radius: 26px;
  padding: 1.4rem;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.form-card label {
  display: grid;
  gap: 0.35rem;
  margin-bottom: 0.9rem;
  font-weight: 850;
  color: #334155;
}

.form-card input,
.form-card select,
.form-card textarea,
.search-input {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  padding: 0.8rem 0.9rem;
  font: inherit;
  background: #f8fafc;
}

.actions,
.card-actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.primary-btn,
.secondary-btn,
.card-actions button {
  border: none;
  border-radius: 14px;
  padding: 0.75rem 1rem;
  font-weight: 900;
  cursor: pointer;
}

.primary-btn {
  background: #2563eb;
  color: white;
}

.secondary-btn {
  background: #e2e8f0;
  color: #0f172a;
}

.list-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.search-input {
  max-width: 330px;
}

.item-card {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: #f8fbff;
  margin-bottom: 0.9rem;
}

.item-card h3 {
  margin: 0.45rem 0 0.15rem;
}

.item-card p {
  margin: 0.2rem 0;
  color: #475569;
}

.item-card small {
  color: #64748b;
}

.badge {
  display: inline-flex;
  border-radius: 999px;
  padding: 0.25rem 0.65rem;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 0.78rem;
  font-weight: 950;
}

.danger {
  background: #fee2e2;
  color: #991b1b;
}

.empty-state {
  padding: 2rem;
  border-radius: 20px;
  background: #f8fafc;
  color: #64748b;
  text-align: center;
  font-weight: 800;
}

@media (max-width: 900px) {
  .feature-hero,
  .list-header,
  .item-card {
    flex-direction: column;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .search-input {
    max-width: none;
  }
}
</style>
