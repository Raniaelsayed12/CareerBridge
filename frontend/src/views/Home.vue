<template>
  <main class="home-page">
    <section class="hero">
      <div class="hero-text">
        <p class="badge">Your professional journey starts here</p>

        <h1>
          Build a career profile that
          <span>stands out.</span>
        </h1>

        <p class="subtitle">
          CareerBridge helps students and young professionals organize their
          skills, projects, certificates and career information in one modern
          digital workspace.
        </p>

        <div class="hero-actions">
          <RouterLink v-if="!isLoggedIn" to="/login" class="btn primary">
            Sign in
          </RouterLink>

          <RouterLink v-if="!isLoggedIn" to="/register" class="btn secondary">
            Create account
          </RouterLink>

          <RouterLink v-if="isLoggedIn" to="/dashboard" class="btn primary">
            Open Dashboard
          </RouterLink>

          <RouterLink v-if="isAdmin" to="/admin" class="btn secondary">
            Open Admin Panel
          </RouterLink>
        </div>
      </div>

      <div class="hero-card">
        <div class="card-header">
          <div class="logo-box">CB</div>
          <div>
            <strong>CareerBridge</strong>
            <span>Career Dashboard</span>
          </div>
        </div>

        <div class="overview-box">
          <small>Welcome to CareerBridge</small>
          <h2>Your career overview</h2>
        </div>

        <div class="mini-stats">
          <div>
            <strong>Skills</strong>
            <span>Manage abilities</span>
          </div>
          <div>
            <strong>Projects</strong>
            <span>Show your work</span>
          </div>
          <div>
            <strong>Certificates</strong>
            <span>Save achievements</span>
          </div>
        </div>

        <div class="progress-box">
          <strong>Profile progress</strong>
          <div class="progress-line">
            <span></span>
          </div>
        </div>
      </div>
    </section>

    <section class="features">
      <article>
        <h3>Skills</h3>
        <p>Collect and organize your technical and soft skills.</p>
      </article>

      <article>
        <h3>Projects</h3>
        <p>Document university, personal and team projects.</p>
      </article>

      <article>
        <h3>Certificates</h3>
        <p>Save certificates and learning achievements.</p>
      </article>

      <article>
        <h3>Resume</h3>
        <p>Present your career profile in a structured resume page.</p>
      </article>
    </section>
  </main>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();

const isLoggedIn = computed(() => !!userStore.user);
const isAdmin = computed(() => userStore.user?.role === "admin");
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f4f7fb;
  color: #0f172a;
}

.hero {
  min-height: calc(100vh - 90px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  padding: 5rem 7%;
}

.badge {
  display: inline-flex;
  padding: 0.6rem 1rem;
  border-radius: 999px;
  background: #e0e7ff;
  color: #1d4ed8;
  font-weight: 900;
}

.hero h1 {
  margin: 1.5rem 0;
  font-size: clamp(3rem, 7vw, 6rem);
  line-height: 0.95;
}

.hero h1 span {
  display: block;
  color: #3b4df5;
}

.subtitle {
  max-width: 650px;
  color: #64748b;
  font-size: 1.2rem;
  line-height: 1.8;
}

.hero-actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 1.4rem;
  border-radius: 16px;
  font-weight: 900;
  text-decoration: none;
}

.btn.primary {
  background: #2563eb;
  color: white;
}

.btn.secondary {
  background: white;
  color: #1d4ed8;
  border: 1px solid #dbe3ef;
}

.hero-card {
  padding: 2rem;
  border-radius: 28px;
  background: white;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.14);
}

.card-header {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.logo-box {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: #3b4df5;
  color: white;
  font-weight: 900;
}

.card-header span {
  display: block;
  color: #64748b;
  margin-top: 0.2rem;
}

.overview-box {
  margin: 2rem 0;
  padding: 2rem;
  border-radius: 24px;
  color: white;
  background: linear-gradient(135deg, #14264f, #3447f5);
}

.overview-box h2 {
  margin: 0.4rem 0 0;
  font-size: 2rem;
}

.mini-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.mini-stats div,
.progress-box {
  padding: 1rem;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
}

.mini-stats strong,
.mini-stats span {
  display: block;
}

.mini-stats span {
  color: #64748b;
  margin-top: 0.3rem;
}

.progress-line {
  margin-top: 1rem;
  height: 10px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}

.progress-line span {
  display: block;
  width: 82%;
  height: 100%;
  background: #3b4df5;
}

.features {
  padding: 0 7% 5rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.2rem;
}

.features article {
  padding: 1.6rem;
  border-radius: 22px;
  background: white;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.features h3 {
  margin-top: 0;
  font-size: 1.4rem;
}

.features p {
  color: #64748b;
  line-height: 1.6;
}

@media (max-width: 950px) {
  .hero,
  .features {
    grid-template-columns: 1fr;
  }

  .mini-stats {
    grid-template-columns: 1fr;
  }
}
</style>
