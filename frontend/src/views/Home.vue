<template>
  <main class="cb-home-page">
    <section class="cb-landing">
      <div class="cb-left">
        <span class="cb-pill">Presentation Frameworks · Westfälische Hochschule</span>

        <h1>Your Career Profile in One Place</h1>

        <p class="cb-subtitle">
          CareerBridge helps students organize their skills, projects, certificates,
          resume and personal documentation in one clean web application.
        </p>

        <div class="cb-feature-grid">
          <article class="cb-feature-card">
            <div class="cb-icon">👤</div>
            <div>
              <h3>User Profile</h3>
              <p>Personal data and profile progress</p>
            </div>
          </article>

          <article class="cb-feature-card">
            <div class="cb-icon">🧠</div>
            <div>
              <h3>Skills</h3>
              <p>Technical and soft skills</p>
            </div>
          </article>

          <article class="cb-feature-card">
            <div class="cb-icon">💼</div>
            <div>
              <h3>Projects</h3>
              <p>University and personal work</p>
            </div>
          </article>

          <article class="cb-feature-card">
            <div class="cb-icon">🏅</div>
            <div>
              <h3>Certificates</h3>
              <p>Certificates and achievements</p>
            </div>
          </article>

          <article class="cb-feature-card">
            <div class="cb-icon">📄</div>
            <div>
              <h3>Resume</h3>
              <p>Generated from user data</p>
            </div>
          </article>

          <article class="cb-feature-card">
            <div class="cb-icon">🛡️</div>
            <div>
              <h3>Admin Panel</h3>
              <p>Manage users and content</p>
            </div>
          </article>
        </div>

        <div class="cb-actions">
          <RouterLink to="/login" class="cb-btn cb-primary">Get Started</RouterLink>
          <RouterLink to="/about" class="cb-btn cb-secondary">Learn More</RouterLink>
        </div>
      </div>

      <div class="cb-right">
        <div class="cb-login-preview">
          <div class="cb-tabs">
            <span class="active">Login</span>
            <span>Register</span>
          </div>

          <h2>Welcome back</h2>
          <p>Sign in to open your personal dashboard.</p>

          <div class="cb-input-preview">Email address</div>
          <div class="cb-input-preview">Password</div>

          <RouterLink to="/login" class="cb-signin-preview">Sign In</RouterLink>

          <div class="cb-demo-users">
            <div>
              <strong>Hania</strong>
              <span>100% profile</span>
            </div>
            <div>
              <strong>Rania</strong>
              <span>60% profile</span>
            </div>
            <div>
              <strong>Aly</strong>
              <span>20% profile</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cb-bottom">
      <article>
        <strong>Vue 3</strong>
        <span>Modern frontend</span>
      </article>
      <article>
        <strong>Pinia</strong>
        <span>State management</span>
      </article>
      <article>
        <strong>Express</strong>
        <span>Local backend API</span>
      </article>
      <article>
        <strong>JSON DB</strong>
        <span>local-db.json</span>
      </article>
    </section>
  </main>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
.cb-home-page {
  width: min(1180px, calc(100% - 72px)) !important;
  margin: 0 auto !important;
  padding: 70px 0 80px !important;
}

.cb-landing {
  min-height: 620px;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  align-items: center;
  gap: 70px;
}

.cb-left {
  max-width: 720px;
}

.cb-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  background: #dbeafe;
  color: #2563eb;
  font-size: 0.9rem;
  font-weight: 900;
  margin-bottom: 24px;
}

.cb-pill::before {
  content: "✦";
  color: #2563eb;
}

h1 {
  margin: 0;
  color: #0f172a;
  font-size: clamp(3.2rem, 6vw, 5.6rem);
  line-height: 1.02;
  letter-spacing: -0.06em;
  font-weight: 950;
}

.cb-subtitle {
  margin: 24px 0 30px;
  color: #475569;
  font-size: 1.18rem;
  line-height: 1.75;
  max-width: 650px;
}

.cb-feature-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(230px, 1fr));
  gap: 16px;
  margin: 30px 0 34px;
}

.cb-feature-card {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 92px;
  padding: 16px 18px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid #dbe3ef;
  border-radius: 20px;
  box-shadow: 0 14px 35px rgba(15, 23, 42, 0.07);
}

.cb-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: linear-gradient(135deg, #dbeafe, #ffffff);
  display: grid;
  place-items: center;
  font-size: 1.6rem;
  border: 1px solid #bfdbfe;
  flex-shrink: 0;
}

.cb-feature-card h3 {
  margin: 0 0 5px;
  color: #0f172a;
  font-size: 1.03rem;
  font-weight: 900;
}

.cb-feature-card p {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.35;
}

.cb-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.cb-btn {
  min-height: 50px;
  padding: 0.9rem 1.35rem;
  border-radius: 16px;
  font-weight: 900;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.cb-primary {
  background: #2563eb;
  color: white;
  box-shadow: 0 18px 35px rgba(37, 99, 235, 0.25);
}

.cb-secondary {
  background: white;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.cb-right {
  display: flex;
  justify-content: center;
}

.cb-login-preview {
  width: min(410px, 100%);
  padding: 28px;
  border-radius: 28px;
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.14);
}

.cb-tabs {
  height: 44px;
  background: #eef2f7;
  border-radius: 14px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 4px;
  margin-bottom: 34px;
}

.cb-tabs span {
  display: grid;
  place-items: center;
  border-radius: 11px;
  font-weight: 800;
  color: #64748b;
}

.cb-tabs .active {
  background: white;
  color: #0f172a;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
}

.cb-login-preview h2 {
  margin: 0 0 8px;
  font-size: 1.9rem;
  color: #0f172a;
}

.cb-login-preview p {
  margin: 0 0 24px;
  color: #64748b;
}

.cb-input-preview {
  height: 54px;
  border: 1px solid #dbe3ef;
  border-radius: 14px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  color: #94a3b8;
  margin-bottom: 14px;
  background: #fbfdff;
}

.cb-signin-preview {
  height: 54px;
  border-radius: 15px;
  background: #2563eb;
  color: white;
  font-weight: 900;
  display: grid;
  place-items: center;
  text-decoration: none;
  margin: 18px 0 24px;
}

.cb-demo-users {
  display: grid;
  gap: 10px;
}

.cb-demo-users div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  background: #f8fbff;
  border: 1px solid #dbeafe;
}

.cb-demo-users strong {
  color: #14264f;
}

.cb-demo-users span {
  color: #2563eb;
  font-weight: 800;
}

.cb-bottom {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.cb-bottom article {
  padding: 22px;
  border-radius: 20px;
  background: white;
  border: 1px solid #dbe3ef;
  box-shadow: 0 14px 35px rgba(15, 23, 42, 0.06);
}

.cb-bottom strong {
  display: block;
  color: #2563eb;
  font-size: 1.25rem;
  margin-bottom: 6px;
}

.cb-bottom span {
  color: #64748b;
}

@media (max-width: 980px) {
  .cb-home-page {
    width: min(100% - 34px, 1180px) !important;
    padding: 34px 0 60px !important;
  }

  .cb-landing {
    grid-template-columns: 1fr;
    gap: 34px;
  }

  .cb-feature-grid,
  .cb-bottom {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 3rem;
  }
}
</style>
