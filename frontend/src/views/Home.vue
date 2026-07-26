<template>
  <main class="home-page">
    <section class="hero">
      <div class="hero-text">
        <h1>
          Build a<br />
          career profile<br />
          that <span>stands out.</span>
        </h1>

        <p>
          CareerBridge helps students and young professionals organize their
          skills, projects, certificates and career information in one modern
          digital workspace.
        </p>

        <RouterLink
          :to="userStore.isLoggedIn ? '/dashboard' : '/login'"
          class="primary-btn"
        >
          Open Dashboard
        </RouterLink>
      </div>

      <div class="preview-card">
        <div class="preview-header">
          <small>Welcome to CareerBridge</small>
          <h2>Your career overview</h2>
        </div>

        <div class="preview-grid">
          <article>
            <strong>Skills</strong>
            <span>Manage abilities</span>
          </article>
          <article>
            <strong>Projects</strong>
            <span>Show your work</span>
          </article>
          <article>
            <strong>Certificates</strong>
            <span>Save achievements</span>
          </article>
        </div>

        <div class="progress-card">
          <strong>Profile progress</strong>
          <div class="progress-track">
            <div class="progress-fill"></div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();
</script>

<style scoped>
.home-page {
  width: min(1180px, calc(100% - 64px));
  margin: 0 auto;
  padding: 80px 0 90px;
}

.hero {
  min-height: 620px;
  display: grid;
  grid-template-columns: 1fr 0.92fr;
  align-items: center;
  gap: 72px;
}

.hero-text h1 {
  margin: 0;
  color: #0f172a;
  font-size: clamp(4.2rem, 7vw, 6.7rem);
  line-height: 0.98;
  letter-spacing: -0.035em;
  font-weight: 950;
}

.hero-text h1 span {
  color: #3447f5;
}

.hero-text p {
  max-width: 600px;
  margin: 28px 0 32px;
  color: #64748b;
  font-size: 1.08rem;
  line-height: 1.75;
}

.primary-btn {
  min-height: 52px;
  padding: 0.95rem 1.35rem;
  border-radius: 14px;
  background: #2563eb;
  color: white;
  font-weight: 900;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 18px 35px rgba(37, 99, 235, 0.25);
}

.preview-card {
  background: #ffffff;
  border-radius: 28px;
  padding: 28px;
  border: 1px solid #dbe3ef;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.12);
}

.preview-header {
  padding: 30px;
  border-radius: 22px;
  background: linear-gradient(135deg, #14264f, #3447f5);
  color: white;
  margin-bottom: 24px;
}

.preview-header small {
  color: #dbeafe;
  font-weight: 800;
}

.preview-header h2 {
  margin: 8px 0 0;
  font-size: 2rem;
  line-height: 1.15;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 18px;
}

.preview-grid article,
.progress-card {
  padding: 18px;
  border-radius: 18px;
  background: #f8fbff;
  border: 1px solid #dbe3ef;
}

.preview-grid strong,
.progress-card strong {
  display: block;
  color: #0f172a;
  margin-bottom: 6px;
}

.preview-grid span {
  color: #64748b;
  font-size: 0.9rem;
}

.progress-track {
  height: 12px;
  margin-top: 14px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  width: 82%;
  height: 100%;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  border-radius: 999px;
}

@media (max-width: 980px) {
  .home-page {
    width: min(100% - 32px, 1180px);
    padding: 40px 0 60px;
  }

  .hero {
    grid-template-columns: 1fr;
    gap: 36px;
  }

  .preview-grid {
    grid-template-columns: 1fr;
  }

  .hero-text h1 {
    font-size: 3.5rem;
  }
}
</style>
