<script setup>
import { computed, onMounted } from "vue";
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

onMounted(async () => {
  await user.loadStatistics();
});

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
    value: `${user.progress}%`,
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
      borderRadius: 10,
      borderSkipped: false,
      maxBarThickness: 60,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: false,
    },

    title: {
      display: false,
    },

    tooltip: {
      backgroundColor: "#1e293b",
      titleColor: "#fff",
      bodyColor: "#fff",
      padding: 12,
      cornerRadius: 8,
    },
  },

  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
      grid: {
        color: "#e5e7eb",
      },
    },

    x: {
      grid: {
        display: false,
      },
    },
  },
};
</script>

<template>
  <Navbar />

  <div class="dashboard">

    <div class="hero">
      <h1>
        Welcome back, {{ user.user?.name || "User" }} 👋
      </h1>

      <p>
        Track your career journey and manage all your achievements in one place.
      </p>
    </div>

    <p class="subtitle">
      Monitor your skills, projects and certificates from one dashboard.
    </p>

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

    <div class="quick-actions">

      <h2>Quick Actions</h2>

      <div class="action-grid">

        <router-link
          to="/skills"
          class="action-card"
        >
          <div class="action-icon">💡</div>

          <h3>Add Skills</h3>

          <p>Manage your skills</p>
        </router-link>

        <router-link
          to="/projects"
          class="action-card"
        >
          <div class="action-icon">🚀</div>

          <h3>Add Projects</h3>

          <p>Create new projects</p>
        </router-link>

        <router-link
          to="/certificates"
          class="action-card"
        >
          <div class="action-icon">🏆</div>

          <h3>Add Certificates</h3>

          <p>Store your certificates</p>
        </router-link>

        <router-link
          to="/profile"
          class="action-card"
        >
          <div class="action-icon">👤</div>

          <h3>My Profile</h3>

          <p>View your profile</p>
        </router-link>

      </div>

    </div>

    <div class="chart-container">

      <h2>Career Statistics</h2>

      <p class="chart-subtitle">
        Overview of your career achievements.
      </p>

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
.dashboard{
  max-width:1200px;
  margin:auto;
  padding:40px 20px;
  text-align:center;
  background:#f8fafc;
  min-height:100vh;
}

.hero{
  background:linear-gradient(135deg,#2563eb,#3b82f6);
  color:#fff;
  padding:45px 30px;
  border-radius:20px;
  margin-bottom:30px;
  box-shadow:0 10px 25px rgba(37,99,235,.25);
}

.hero h1{
  margin-bottom:12px;
  font-size:38px;
}

.hero p{
  font-size:18px;
  opacity:.95;
}

.subtitle{
  color:#64748b;
  margin:25px 0 40px;
  font-size:18px;
}

.cards{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:20px;
}

.card{
  background:#fff;
  padding:30px;
  border-radius:20px;
  border:1px solid #e2e8f0;
  box-shadow:0 10px 30px rgba(0,0,0,.08);
  transition:.3s;
  cursor:pointer;
}

.card:hover{
  transform:translateY(-8px);
  box-shadow:0 18px 35px rgba(0,0,0,.15);
}

.icon{
  font-size:42px;
  margin-bottom:15px;
}

.card h2{
  color:#2563eb;
  font-size:38px;
  margin:10px 0;
}

.card p{
  color:#64748b;
  font-size:16px;
}

.progress-section{
  margin-top:60px;
  background:#fff;
  padding:30px;
  border-radius:20px;
  border:1px solid #e2e8f0;
  box-shadow:0 10px 30px rgba(0,0,0,.08);
}

.progress-bar{
  width:70%;
  height:18px;
  background:#e5e7eb;
  border-radius:20px;
  margin:20px auto;
  overflow:hidden;
}

.progress-fill{
  height:100%;
  background:linear-gradient(90deg,#2563eb,#3b82f6);
  transition:width .8s ease;
}

.chart-container{
  margin-top:60px;
  background:#fff;
  padding:30px;
  border-radius:20px;
  border:1px solid #e2e8f0;
  box-shadow:0 10px 30px rgba(0,0,0,.08);
}

.chart-container h2{
  margin-bottom:10px;
}

.chart-subtitle{
  color:#64748b;
  margin-bottom:20px;
}

.chart-box{
  height:400px;
}
.quick-actions{
  margin-top:60px;
}

.quick-actions h2{
  margin-bottom:25px;
}

.action-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:20px;
}

.action-card{
  background:#fff;
  padding:30px;
  border-radius:18px;
  text-decoration:none;
  color:#2563eb;
  border:1px solid #e2e8f0;
  box-shadow:0 10px 30px rgba(0,0,0,.08);
  transition:.3s;
}

.action-card:hover{
  transform:translateY(-8px);
  background:#2563eb;
  color:#fff;
}

.action-icon{
  font-size:42px;
  margin-bottom:15px;
}

.action-card h3{
  margin:10px 0;
  font-size:20px;
}

.action-card p{
  color:#64748b;
  font-size:14px;
}

.action-card:hover p{
  color:#fff;
}

@media (max-width:900px){

  .cards{
    grid-template-columns:repeat(2,1fr);
  }

  .progress-bar{
    width:100%;
  }

  .chart-box{
    height:300px;
  }
}

@media (max-width:600px){

  .dashboard{
    padding:20px;
  }

  .hero{
    padding:25px 20px;
  }

  .hero h1{
    font-size:28px;
  }

  .hero p{
    font-size:16px;
  }

  .cards{
    grid-template-columns:1fr;
  }

  .action-grid{
    grid-template-columns:1fr;
  }
}
</style>