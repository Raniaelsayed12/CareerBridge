<template>
  <main class="home-page">
    <section class="home-layout">
      <div class="home-content">
        <h1>CareerBridge</h1>

        <p class="lead">
          A clean student career platform for managing profile information,
          skills, certificates, resume and personal documentation in one place.
        </p>

        <div class="feature-grid">
          <article>
            <span>👤</span>
            <div>
              <h3>User Profile</h3>
              <p>Keep personal information and profile progress organized.</p>
            </div>
          </article>

          <article>
            <span>🧠</span>
            <div>
              <h3>Skills</h3>
              <p>Manage technical and soft skills clearly.</p>
            </div>
          </article>

          <article>
            <span>🏅</span>
            <div>
              <h3>Certificates</h3>
              <p>Store certificates, providers and completion dates.</p>
            </div>
          </article>

          <article>
            <span>📄</span>
            <div>
              <h3>Resume</h3>
              <p>Generate a resume from the current user data.</p>
            </div>
          </article>

          <article>
            <span>📚</span>
            <div>
              <h3>Docs</h3>
              <p>Display documentation data for the logged-in user.</p>
            </div>
          </article>

          <article>
            <span>🛡️</span>
            <div>
              <h3>Admin Panel</h3>
              <p>Manage users and their career information.</p>
            </div>
          </article>
        </div>
      </div>

      <aside class="welcome-card">
        <div class="tabs">
          <RouterLink to="/login">Login</RouterLink>
          <RouterLink to="/register">Register</RouterLink>
        </div>

        <h2>Welcome back</h2>

        <p>
          Access your personal dashboard, update your profile and prepare your
          career documents.
        </p>

        <RouterLink to="/login" class="primary-action">Get Started</RouterLink>
        <RouterLink to="/register" class="secondary-action">Create account</RouterLink>
        <RouterLink to="/about" class="about-action">Learn more about CareerBridge</RouterLink>
      </aside>
    </section>
  </main>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
.home-page {
  width: min(1160px, calc(100% - 64px));
  margin: 0 auto;
  padding: 76px 0 90px;
}

.home-layout {
  display: grid;
  grid-template-columns: 1.12fr 0.88fr;
  gap: 68px;
  align-items: center;
}

.home-content {
  max-width: 720px;
}

h1 {
  margin: 0;
  color: #0f172a;
  font-size: clamp(4rem, 7vw, 6.2rem);
  line-height: 1;
  letter-spacing: -0.02em;
  font-weight: 950;
}

.lead {
  max-width: 680px;
  margin: 26px 0 34px;
  color: #475569;
  font-size: 1.16rem;
  line-height: 1.75;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(230px, 1fr));
  gap: 16px;
}

.feature-grid article {
  min-height: 96px;
  padding: 18px;
  border-radius: 22px;
  background: #ffffff;
  border: 1px solid #dbe3ef;
  box-shadow: 0 14px 35px rgba(15, 23, 42, 0.07);
  display: flex;
  gap: 16px;
  align-items: center;
}

.feature-grid span {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: #dbeafe;
  display: grid;
  place-items: center;
  font-size: 1.45rem;
  flex-shrink: 0;
}

.feature-grid h3 {
  margin: 0 0 5px;
  color: #0f172a;
  font-size: 1rem;
}

.feature-grid p {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.35;
}

.welcome-card {
  padding: 34px;
  border-radius: 30px;
  background: #ffffff;
  border: 1px solid #dbe3ef;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.14);
}

.tabs {
  height: 46px;
  padding: 4px;
  margin-bottom: 34px;
  border-radius: 15px;
  background: #eef2f7;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.tabs a {
  display: grid;
  place-items: center;
  border-radius: 12px;
  text-decoration: none;
  color: #64748b;
  font-weight: 900;
}

.tabs a:first-child {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
}

.welcome-card h2 {
  margin: 0 0 10px;
  color: #0f172a;
  font-size: 2rem;
  letter-spacing: -0.01em;
}

.welcome-card p {
  margin: 0 0 24px;
  color: #64748b;
  line-height: 1.7;
}

.primary-action,
.secondary-action {
  min-height: 54px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  text-decoration: none;
  font-weight: 900;
  margin-bottom: 12px;
}

.primary-action {
  background: #2563eb;
  color: white;
}

.secondary-action {
  background: #dbeafe;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.about-action {
  display: block;
  margin-top: 18px;
  text-align: center;
  color: #2563eb;
  font-weight: 850;
  text-decoration: none;
}

@media (max-width: 980px) {
  .home-page {
    width: min(100% - 32px, 1160px);
    padding: 38px 0 60px;
  }

  .home-layout {
    grid-template-columns: 1fr;
    gap: 36px;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
