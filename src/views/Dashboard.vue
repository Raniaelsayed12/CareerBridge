<script setup>
import { computed } from "vue";
import Navbar from "../components/Navbar.vue/Navbar.vue";
import { useUserStore } from "../stores/userStore";

import { Bar } from "vue-chartjs";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const user = useUserStore();

const stats = computed(() => [
  {
    title: "Skills",
    value: user.skillsCount,
    icon: "💡",
  },
  {
    title: "Projects",
    value: user.projectsCount,
    icon: "🚀",
  },
  {
    title: "Certificates",
    value: user.certificatesCount,
    icon: "🏆",
  },
  {
    title: "Progress",
    value: user.progress,
    icon: "📈",
  },
]);

const chartData = computed(() => ({
  labels: ["Skills", "Projects", "Certificates"],
  datasets: [
    {
      label: "Career Statistics",
      data: [
        user.skillsCount,
        user.projectsCount,
        user.certificatesCount,
      ],
      backgroundColor: [
        "#2563eb",
        "#10b981",
        "#f59e0b",
      ],
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<template>
  <Navbar />

  <div class="dashboard">
    <h1>Dashboard</h1>

    <div class="cards">
      <div
        class="card"
        v-for="item in stats"
        :key="item.title"
      >
        <div class="icon">
          {{ item.icon }}
        </div>

        <h2>{{ item.value }}</h2>

        <p>{{ item.title }}</p>
      </div>
    </div>

    <div class="progress-section">
      <h2>Profile Completion</h2>

      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: user.progress + '%' }"
        ></div>
      </div>

      <p>{{ user.progress }}% Completed</p>
    </div>

    <div class="chart-container">
      <h2>Career Statistics</h2>

      <div class="chart-box">
        <Bar
          :data="chartData"
          :options="chartOptions"
        />
      </div>
    </div>
  </div>
</template>

<style>
.dashboard {
  padding: 40px;
  text-align: center;
}

.dashboard h1 {
  margin-bottom: 30px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 0 15px #ddd;
}

.icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.card h2 {
  color: #2563eb;
  font-size: 40px;
}

.progress-section {
  margin-top: 60px;
}

.progress-bar {
  width: 60%;
  height: 20px;
  background: #ddd;
  border-radius: 20px;
  margin: 20px auto;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #2563eb;
}

.chart-container {
  margin-top: 60px;
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 0 15px #ddd;
}

.chart-box {
  height: 400px;
}

.chart-container h2 {
  margin-bottom: 20px;
}
</style>