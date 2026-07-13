<script setup>
import Navbar from "../components/Navbar.vue/Navbar.vue";
import { useUserStore } from "../stores/userStore";

const user = useUserStore();
</script>

<template>
  <Navbar />

  <main class="about-page">
    <section class="hero-section">
      <h1>About CareerBridge</h1>
      <p>
        CareerBridge is a student career platform that helps users organize
        their skills, projects and certificates in one place.
      </p>
    </section>

    <section class="info-section">
      <div class="info-card">
        <h2>Project Goal</h2>
        <p>
          The goal of this project is to apply modern front-end technologies
          such as Vue.js, Vite, Pinia and Vue Router in a practical web
          application.
        </p>
      </div>

      <div class="info-card">
        <h2>Learning Focus</h2>
        <p>
          The project focuses on component-based architecture, state management,
          routing, reusable UI elements, demo data, documentation and continuous
          development with GitHub.
        </p>
      </div>
    </section>

    <section class="team-section">
      <h2>Our Team</h2>

      <div class="team-grid">
        <div
          v-for="member in user.teamMembers"
          :key="member.name"
          class="team-card"
        >
          <div class="avatar">
            {{ member.name.charAt(0) }}
          </div>

          <h3>{{ member.name }}</h3>
          <p class="role">{{ member.role }}</p>
          <p class="contribution">{{ member.contribution }}</p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.about-page {
  padding: 60px 8%;
  color: #1f2937;
}

.hero-section {
  text-align: center;
  margin-bottom: 50px;
}

.hero-section h1 {
  font-size: 44px;
  color: #1e293b;
  margin-bottom: 15px;
}

.hero-section p {
  font-size: 20px;
  max-width: 850px;
  margin: 0 auto;
  line-height: 1.6;
}

.info-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-bottom: 60px;
}

.info-card,
.team-card {
  background: white;
  border-radius: 18px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.info-card h2 {
  color: #2563eb;
  margin-bottom: 15px;
}

.info-card p {
  line-height: 1.6;
  font-size: 17px;
}

.team-section {
  text-align: center;
}

.team-section h2 {
  font-size: 36px;
  margin-bottom: 35px;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.team-card {
  text-align: center;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  font-size: 34px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.team-card h3 {
  font-size: 24px;
  margin-bottom: 8px;
}

.role {
  color: #2563eb;
  font-weight: bold;
  margin-bottom: 15px;
}

.contribution {
  font-size: 16px;
  line-height: 1.5;
  color: #4b5563;
}

@media (max-width: 900px) {
  .info-section,
  .team-grid {
    grid-template-columns: 1fr;
  }

  .hero-section h1 {
    font-size: 34px;
  }
}
</style>