<script setup>
import { computed } from "vue";
import Navbar from "../components/Navbar.vue/Navbar.vue";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();

const isAuthenticated = computed(() => {
  return userStore.loggedIn;
});

const firstName = computed(() => {
  const name = userStore.name?.trim();

  if (!name) {
    return "there";
  }

  return name.split(/\s+/)[0];
});

const primaryAction = computed(() => {
  return isAuthenticated.value
      ? {
        label: "Open dashboard",
        route: "/dashboard",
      }
      : {
        label: "Create your profile",
        route: "/register",
      };
});

const secondaryAction = computed(() => {
  return isAuthenticated.value
      ? {
        label: "View profile",
        route: "/profile",
      }
      : {
        label: "Explore the platform",
        route: "/about",
      };
});

const features = [
  {
    icon: "S",
    title: "Manage your skills",
    description:
        "Create a structured overview of your technical and professional competencies.",
  },
  {
    icon: "P",
    title: "Showcase projects",
    description:
        "Present your practical work with descriptions and direct GitHub links.",
  },
  {
    icon: "C",
    title: "Record certificates",
    description:
        "Keep courses, certificates and professional achievements in one place.",
  },
  {
    icon: "R",
    title: "Generate a resume",
    description:
        "Turn your CareerBridge profile into a clean and professional PDF resume.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create your account",
    description:
        "Register and access your personal CareerBridge workspace.",
  },
  {
    number: "02",
    title: "Complete your profile",
    description:
        "Add your contact information, role, university and professional summary.",
  },
  {
    number: "03",
    title: "Build your portfolio",
    description:
        "Organize your skills, projects and certificates.",
  },
  {
    number: "04",
    title: "Export your resume",
    description:
        "Generate a professional PDF resume from your saved information.",
  },
];
</script>

<template>
  <Navbar />

  <main class="home-page">
    <section class="hero-section">
      <div class="hero-background">
        <span class="background-circle circle-one"></span>
        <span class="background-circle circle-two"></span>
      </div>

      <div class="hero-container">
        <div class="hero-content">
          <span class="hero-badge">
            <span class="badge-dot"></span>
            Your professional journey starts here
          </span>

          <h1>
            Build a career profile that
            <span>stands out.</span>
          </h1>

          <p>
            CareerBridge helps students and young professionals organize
            their skills, projects, certificates and career information
            in one modern digital workspace.
          </p>

          <div class="hero-actions">
            <RouterLink
                :to="primaryAction.route"
                class="primary-button"
            >
              {{ primaryAction.label }}

              <span class="button-arrow">→</span>
            </RouterLink>

            <RouterLink
                :to="secondaryAction.route"
                class="secondary-button"
            >
              {{ secondaryAction.label }}
            </RouterLink>
          </div>

          <div class="hero-benefits">
            <div class="benefit">
              <span class="check-icon">✓</span>
              <span>Free local workspace</span>
            </div>

            <div class="benefit">
              <span class="check-icon">✓</span>
              <span>Professional PDF resume</span>
            </div>

            <div class="benefit">
              <span class="check-icon">✓</span>
              <span>Simple portfolio management</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="dashboard-preview">
            <div class="preview-toolbar">
              <div class="preview-brand">
                <span class="preview-logo">CB</span>

                <div>
                  <strong>CareerBridge</strong>
                  <small>Career Dashboard</small>
                </div>
              </div>

              <span class="preview-status">
                Active
              </span>
            </div>

            <div class="preview-welcome">
              <div>
                <small>
                  {{
                  isAuthenticated
                  ? `Welcome back, ${firstName}`
                  : "Welcome to CareerBridge"
                  }}
                </small>

                <strong>
                  Your career overview
                </strong>
              </div>

              <span class="welcome-symbol">↗</span>
            </div>

            <div class="preview-statistics">
              <article>
                <span class="stat-icon skills-stat">
                  S
                </span>

                <div>
                  <strong>
                    {{
                    isAuthenticated
                    ? userStore.skillsCount
                    : 8
                    }}
                  </strong>

                  <small>Skills</small>
                </div>
              </article>

              <article>
                <span class="stat-icon projects-stat">
                  P
                </span>

                <div>
                  <strong>
                    {{
                    isAuthenticated
                    ? userStore.projectsCount
                    : 4
                    }}
                  </strong>

                  <small>Projects</small>
                </div>
              </article>

              <article>
                <span class="stat-icon certificates-stat">
                  C
                </span>

                <div>
                  <strong>
                    {{
                    isAuthenticated
                    ? userStore.certificatesCount
                    : 3
                    }}
                  </strong>

                  <small>Certificates</small>
                </div>
              </article>
            </div>

            <div class="preview-progress">
              <div class="progress-header">
                <div>
                  <strong>Profile progress</strong>
                  <span>
                    Continue building your profile
                  </span>
                </div>

                <strong class="progress-value-text">
                  {{
                  isAuthenticated
                  ? userStore.progress
                  : 86
                  }}%
                </strong>
              </div>

              <div class="progress-track">
                <div
                    class="progress-value"
                    :style="{
                    width: `${
                      isAuthenticated
                        ? userStore.progress
                        : 86
                    }%`,
                  }"
                ></div>
              </div>
            </div>

            <div class="preview-activity">
              <div class="activity-heading">
                <strong>Recent activity</strong>
                <span>View all</span>
              </div>

              <div class="activity-item">
                <span class="activity-icon">+</span>

                <div>
                  <strong>Portfolio updated</strong>
                  <small>
                    New professional information added
                  </small>
                </div>

                <span class="activity-time">
                  Today
                </span>
              </div>

              <div class="activity-item">
                <span class="activity-icon violet">
                  ✓
                </span>

                <div>
                  <strong>Resume ready</strong>
                  <small>
                    Your PDF resume can be exported
                  </small>
                </div>

                <span class="activity-time">
                  Ready
                </span>
              </div>
            </div>
          </div>

          <div class="floating-card floating-card-top">
            <span class="floating-icon">✓</span>

            <div>
              <strong>Profile updated</strong>
              <small>Information saved successfully</small>
            </div>
          </div>

          <div class="floating-card floating-card-bottom">
            <span class="floating-icon document-icon">R</span>

            <div>
              <strong>Resume ready</strong>
              <small>Download a professional PDF</small>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="trust-section">
      <div class="trust-container">
        <p>
          Built with modern technologies for a clear and reliable experience
        </p>

        <div class="technology-list">
          <span>Vue.js</span>
          <span>Vite</span>
          <span>Pinia</span>
          <span>Node.js</span>
          <span>Express</span>
        </div>
      </div>
    </section>

    <section class="features-section">
      <div class="section-container">
        <div class="section-heading centered">
          <span class="section-label">
            Everything in one place
          </span>

          <h2>
            Build and manage your professional identity
          </h2>

          <p>
            CareerBridge gives you the essential tools to organize your
            experience and present it professionally.
          </p>
        </div>

        <div class="features-grid">
          <article
              v-for="feature in features"
              :key="feature.title"
              class="feature-card"
          >
            <span class="feature-icon">
              {{ feature.icon }}
            </span>

            <h3>{{ feature.title }}</h3>

            <p>
              {{ feature.description }}
            </p>

            <span class="feature-link">
              Learn more
              <span>→</span>
            </span>
          </article>
        </div>
      </div>
    </section>

    <section class="portfolio-section">
      <div class="section-container portfolio-container">
        <div class="portfolio-visual">
          <div class="profile-preview">
            <div class="profile-cover"></div>

            <div class="profile-body">
              <div class="profile-avatar">
                CB
              </div>

              <span class="verified-badge">
                ✓ Profile ready
              </span>

              <h3>Professional Profile</h3>

              <p>
                A complete overview of your skills, projects,
                education and achievements.
              </p>

              <div class="profile-information">
                <div>
                  <span>Email</span>
                  <strong>name@example.com</strong>
                </div>

                <div>
                  <span>Role</span>
                  <strong>Frontend Developer</strong>
                </div>
              </div>

              <div class="profile-tags">
                <span>Vue.js</span>
                <span>JavaScript</span>
                <span>Git</span>
              </div>
            </div>
          </div>
        </div>

        <div class="portfolio-content">
          <span class="section-label">
            A profile that grows with you
          </span>

          <h2>
            Turn your experience into a professional portfolio
          </h2>

          <p>
            Your achievements should not remain scattered across documents,
            emails and different platforms. CareerBridge brings them together
            in one structured profile.
          </p>

          <div class="portfolio-benefits">
            <div>
              <span>01</span>

              <div>
                <strong>Clear organization</strong>
                <p>
                  Keep all important career information in one place.
                </p>
              </div>
            </div>

            <div>
              <span>02</span>

              <div>
                <strong>Easy updates</strong>
                <p>
                  Add or edit information whenever your experience grows.
                </p>
              </div>
            </div>

            <div>
              <span>03</span>

              <div>
                <strong>Professional presentation</strong>
                <p>
                  Present your profile and resume with a consistent design.
                </p>
              </div>
            </div>
          </div>

          <RouterLink
              :to="primaryAction.route"
              class="text-link"
          >
            Start building your profile
            <span>→</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="workflow-section">
      <div class="section-container">
        <div class="section-heading workflow-heading">
          <div>
            <span class="section-label">
              Simple workflow
            </span>

            <h2>
              From registration to resume in four steps
            </h2>
          </div>

          <p>
            CareerBridge keeps the process simple, because humans already
            created enough complicated forms elsewhere.
          </p>
        </div>

        <div class="steps-grid">
          <article
              v-for="step in steps"
              :key="step.number"
              class="step-card"
          >
            <span class="step-number">
              {{ step.number }}
            </span>

            <div class="step-line"></div>

            <h3>{{ step.title }}</h3>

            <p>
              {{ step.description }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="section-container">
        <div class="cta-card">
          <div class="cta-decoration"></div>

          <div class="cta-content">
            <span class="cta-label">
              Start your next career step
            </span>

            <h2>
              Build a profile that represents your real potential
            </h2>

            <p>
              Organize your experience, strengthen your professional
              presentation and generate a modern resume.
            </p>
          </div>

          <div class="cta-actions">
            <RouterLink
                :to="primaryAction.route"
                class="cta-primary"
            >
              {{ primaryAction.label }}
              <span>→</span>
            </RouterLink>

            <RouterLink
                to="/about"
                class="cta-secondary"
            >
              About CareerBridge
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <footer class="home-footer">
      <div class="footer-container">
        <RouterLink
            to="/"
            class="footer-brand"
        >
          <span>CB</span>
          CareerBridge
        </RouterLink>

        <p>
          Build, organize and present your professional journey.
        </p>

        <div class="footer-links">
          <RouterLink to="/">
            Home
          </RouterLink>

          <RouterLink to="/about">
            About
          </RouterLink>

          <RouterLink
              :to="
              isAuthenticated
                ? '/dashboard'
                : '/login'
            "
          >
            {{
            isAuthenticated
            ? "Dashboard"
            : "Sign in"
            }}
          </RouterLink>
        </div>
      </div>
    </footer>
  </main>
</template>

<style scoped>
.home-page {
  min-height: calc(100vh - 72px);
  color: #0f172a;
  background: #ffffff;
  font-family:
      Inter,
      Arial,
      sans-serif;
}

.hero-section {
  position: relative;
  overflow: hidden;
  padding: 82px 24px 95px;
  background:
      radial-gradient(
          circle at 8% 12%,
          rgba(59, 130, 246, 0.13),
          transparent 29%
      ),
      radial-gradient(
          circle at 92% 85%,
          rgba(99, 102, 241, 0.11),
          transparent 27%
      ),
      #f8fafc;
}

.hero-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.background-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(1px);
}

.circle-one {
  top: 80px;
  left: -170px;
  width: 390px;
  height: 390px;
  background: rgba(37, 99, 235, 0.08);
}

.circle-two {
  right: -130px;
  bottom: -180px;
  width: 420px;
  height: 420px;
  background: rgba(79, 70, 229, 0.08);
}

.hero-container,
.section-container,
.trust-container,
.footer-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
}

.hero-container {
  display: grid;
  grid-template-columns:
    minmax(0, 0.92fr)
    minmax(480px, 1.08fr);
  align-items: center;
  gap: 75px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 25px;
  padding: 9px 13px;
  color: #1d4ed8;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: #2563eb;
  border-radius: 50%;
  box-shadow:
      0 0 0 5px
      rgba(37, 99, 235, 0.1);
}

.hero-content h1 {
  max-width: 690px;
  margin: 0 0 24px;
  color: #0f172a;
  font-size: clamp(
      48px,
      6vw,
      74px
  );
  line-height: 1.02;
  letter-spacing: -3px;
}

.hero-content h1 span {
  color: transparent;
  background:
      linear-gradient(
          135deg,
          #2563eb,
          #4f46e5
      );
  background-clip: text;
  -webkit-background-clip: text;
}

.hero-content > p {
  max-width: 650px;
  margin: 0;
  color: #64748b;
  font-size: 17px;
  line-height: 1.8;
}

.hero-actions {
  margin-top: 34px;
  display: flex;
  align-items: center;
  gap: 13px;
}

.primary-button,
.secondary-button {
  min-height: 50px;
  padding: 14px 20px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 800;
  transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      background 0.2s ease;
}

.primary-button {
  gap: 11px;
  color: #ffffff;
  background:
      linear-gradient(
          135deg,
          #2563eb,
          #4f46e5
      );
  box-shadow:
      0 15px 30px
      rgba(37, 99, 235, 0.24);
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow:
      0 20px 38px
      rgba(37, 99, 235, 0.3);
}

.button-arrow {
  font-size: 18px;
}

.secondary-button {
  color: #334155;
  background: #ffffff;
  border: 1px solid #cbd5e1;
}

.secondary-button:hover {
  transform: translateY(-2px);
  background: #f8fafc;
  box-shadow:
      0 12px 24px
      rgba(15, 23, 42, 0.08);
}

.hero-benefits {
  margin-top: 31px;
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}

.benefit {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
}

.check-icon {
  width: 19px;
  height: 19px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #047857;
  background: #d1fae5;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 900;
}

.hero-visual {
  position: relative;
  min-height: 540px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard-preview {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 570px;
  padding: 24px;
  box-sizing: border-box;
  background:
      rgba(255, 255, 255, 0.96);
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  box-shadow:
      0 36px 75px
      rgba(15, 23, 42, 0.16);
  transform: rotate(1deg);
}

.preview-toolbar {
  padding-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e2e8f0;
}

.preview-brand {
  display: flex;
  align-items: center;
  gap: 11px;
}

.preview-logo {
  width: 39px;
  height: 39px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background:
      linear-gradient(
          135deg,
          #2563eb,
          #4f46e5
      );
  border-radius: 11px;
  font-size: 11px;
  font-weight: 900;
}

.preview-brand div {
  display: flex;
  flex-direction: column;
}

.preview-brand strong {
  color: #0f172a;
  font-size: 13px;
}

.preview-brand small {
  margin-top: 3px;
  color: #94a3b8;
  font-size: 9px;
}

.preview-status {
  padding: 6px 9px;
  color: #047857;
  background: #ecfdf5;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 800;
}

.preview-welcome {
  margin-top: 19px;
  padding: 19px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
  background:
      linear-gradient(
          135deg,
          #1e3a8a,
          #4f46e5
      );
  border-radius: 16px;
}

.preview-welcome div {
  display: flex;
  flex-direction: column;
}

.preview-welcome small {
  color: #bfdbfe;
  font-size: 9px;
}

.preview-welcome strong {
  margin-top: 5px;
  font-size: 16px;
}

.welcome-symbol {
  width: 37px;
  height: 37px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e3a8a;
  background: #ffffff;
  border-radius: 11px;
  font-size: 20px;
  font-weight: 900;
}

.preview-statistics {
  margin-top: 17px;
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  gap: 10px;
}

.preview-statistics article {
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.stat-icon {
  width: 33px;
  height: 33px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  font-size: 9px;
  font-weight: 900;
}

.skills-stat {
  color: #1d4ed8;
  background: #dbeafe;
}

.projects-stat {
  color: #6d28d9;
  background: #ede9fe;
}

.certificates-stat {
  color: #b45309;
  background: #fef3c7;
}

.preview-statistics article div {
  display: flex;
  flex-direction: column;
}

.preview-statistics strong {
  color: #0f172a;
  font-size: 17px;
}

.preview-statistics small {
  margin-top: 2px;
  color: #64748b;
  font-size: 8px;
}

.preview-progress {
  margin-top: 17px;
  padding: 17px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 13px;
}

.progress-header {
  margin-bottom: 11px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.progress-header > div {
  display: flex;
  flex-direction: column;
}

.progress-header strong {
  color: #0f172a;
  font-size: 11px;
}

.progress-header span {
  margin-top: 3px;
  color: #94a3b8;
  font-size: 8px;
}

.progress-value-text {
  color: #2563eb !important;
  font-size: 16px !important;
}

.progress-track {
  height: 7px;
  overflow: hidden;
  background: #e2e8f0;
  border-radius: 999px;
}

.progress-value {
  height: 100%;
  background:
      linear-gradient(
          90deg,
          #2563eb,
          #4f46e5
      );
  border-radius: 999px;
}

.preview-activity {
  margin-top: 17px;
}

.activity-heading {
  margin-bottom: 11px;
  display: flex;
  justify-content: space-between;
  color: #64748b;
  font-size: 9px;
}

.activity-heading strong {
  color: #334155;
}

.activity-heading span {
  color: #2563eb;
  font-weight: 800;
}

.activity-item {
  padding: 11px 0;
  display: grid;
  grid-template-columns:
    auto 1fr auto;
  align-items: center;
  gap: 10px;
  border-top: 1px solid #f1f5f9;
}

.activity-icon {
  width: 31px;
  height: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1d4ed8;
  background: #dbeafe;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 900;
}

.activity-icon.violet {
  color: #6d28d9;
  background: #ede9fe;
}

.activity-item div {
  display: flex;
  flex-direction: column;
}

.activity-item strong {
  color: #334155;
  font-size: 9px;
}

.activity-item small {
  margin-top: 3px;
  color: #94a3b8;
  font-size: 7px;
}

.activity-time {
  color: #94a3b8;
  font-size: 7px;
  font-weight: 700;
}

.floating-card {
  position: absolute;
  z-index: 3;
  padding: 13px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 13px;
  box-shadow:
      0 18px 35px
      rgba(15, 23, 42, 0.13);
}

.floating-card-top {
  top: 27px;
  right: -20px;
}

.floating-card-bottom {
  left: -25px;
  bottom: 29px;
}

.floating-icon {
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #047857;
  background: #d1fae5;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 900;
}

.document-icon {
  color: #6d28d9;
  background: #ede9fe;
}

.floating-card div {
  display: flex;
  flex-direction: column;
}

.floating-card strong {
  color: #0f172a;
  font-size: 10px;
}

.floating-card small {
  margin-top: 3px;
  color: #94a3b8;
  font-size: 7px;
}

.trust-section {
  padding: 24px;
  background: #ffffff;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
}

.trust-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 35px;
}

.trust-container p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.technology-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 11px;
}

.technology-list span {
  padding: 8px 11px;
  color: #475569;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 800;
}

.features-section,
.workflow-section {
  padding: 95px 24px;
  background: #ffffff;
}

.section-heading {
  max-width: 760px;
}

.section-heading.centered {
  margin: 0 auto 45px;
  text-align: center;
}

.section-label,
.cta-label {
  display: inline-block;
  margin-bottom: 11px;
  color: #2563eb;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 1.4px;
  text-transform: uppercase;
}

.section-heading h2,
.portfolio-content h2,
.cta-content h2 {
  margin: 0 0 17px;
  color: #0f172a;
  font-size: clamp(
      34px,
      4vw,
      48px
  );
  line-height: 1.12;
  letter-spacing: -1.3px;
}

.section-heading p,
.portfolio-content > p,
.cta-content p {
  margin: 0;
  color: #64748b;
  font-size: 15px;
  line-height: 1.8;
}

.features-grid {
  display: grid;
  grid-template-columns:
    repeat(4, 1fr);
  gap: 18px;
}

.feature-card {
  min-height: 270px;
  padding: 27px;
  box-sizing: border-box;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 19px;
  box-shadow:
      0 10px 28px
      rgba(15, 23, 42, 0.05);
  transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      border-color 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: #bfdbfe;
  box-shadow:
      0 20px 42px
      rgba(15, 23, 42, 0.1);
}

.feature-icon {
  width: 51px;
  height: 51px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1d4ed8;
  background: #dbeafe;
  border-radius: 15px;
  font-size: 13px;
  font-weight: 900;
}

.feature-card h3 {
  margin: 0 0 11px;
  color: #0f172a;
  font-size: 18px;
}

.feature-card p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.75;
}

.feature-link {
  margin-top: 25px;
  display: inline-flex;
  gap: 7px;
  color: #2563eb;
  font-size: 11px;
  font-weight: 800;
}

.portfolio-section {
  padding: 95px 24px;
  background: #f8fafc;
}

.portfolio-container {
  display: grid;
  grid-template-columns:
    minmax(0, 0.9fr)
    minmax(0, 1.1fr);
  align-items: center;
  gap: 85px;
}

.portfolio-visual {
  display: flex;
  justify-content: center;
}

.profile-preview {
  width: 100%;
  max-width: 470px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 23px;
  box-shadow:
      0 27px 60px
      rgba(15, 23, 42, 0.13);
  transform: rotate(-1.5deg);
}

.profile-cover {
  height: 115px;
  background:
      radial-gradient(
          circle at 85% 20%,
          rgba(255, 255, 255, 0.15),
          transparent 25%
      ),
      linear-gradient(
          135deg,
          #172554,
          #4f46e5
      );
}

.profile-body {
  position: relative;
  padding: 55px 30px 30px;
}

.profile-avatar {
  position: absolute;
  top: -43px;
  left: 30px;
  width: 79px;
  height: 79px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background:
      linear-gradient(
          135deg,
          #2563eb,
          #4f46e5
      );
  border: 6px solid #ffffff;
  border-radius: 22px;
  font-size: 14px;
  font-weight: 900;
}

.verified-badge {
  position: absolute;
  top: 18px;
  right: 25px;
  padding: 7px 9px;
  color: #047857;
  background: #ecfdf5;
  border-radius: 999px;
  font-size: 8px;
  font-weight: 800;
}

.profile-body h3 {
  margin: 0 0 8px;
  color: #0f172a;
  font-size: 21px;
}

.profile-body > p {
  margin: 0;
  color: #64748b;
  font-size: 11px;
  line-height: 1.7;
}

.profile-information {
  margin-top: 23px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 11px;
}

.profile-information div {
  padding: 13px;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.profile-information span {
  color: #94a3b8;
  font-size: 8px;
  text-transform: uppercase;
}

.profile-information strong {
  margin-top: 5px;
  color: #334155;
  font-size: 9px;
}

.profile-tags {
  margin-top: 19px;
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.profile-tags span {
  padding: 7px 9px;
  color: #1d4ed8;
  background: #dbeafe;
  border-radius: 7px;
  font-size: 8px;
  font-weight: 800;
}

.portfolio-content h2 {
  max-width: 640px;
}

.portfolio-benefits {
  margin-top: 31px;
  display: flex;
  flex-direction: column;
  gap: 19px;
}

.portfolio-benefits > div {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.portfolio-benefits > div > span {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background:
      linear-gradient(
          135deg,
          #2563eb,
          #4f46e5
      );
  border-radius: 11px;
  font-size: 9px;
  font-weight: 900;
}

.portfolio-benefits div div {
  display: flex;
  flex-direction: column;
}

.portfolio-benefits strong {
  color: #0f172a;
  font-size: 14px;
}

.portfolio-benefits p {
  margin: 5px 0 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.6;
}

.text-link {
  margin-top: 32px;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: #2563eb;
  text-decoration: none;
  font-size: 13px;
  font-weight: 900;
}

.workflow-heading {
  max-width: none;
  margin-bottom: 45px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 45px;
}

.workflow-heading > div {
  max-width: 650px;
}

.workflow-heading > p {
  max-width: 440px;
}

.steps-grid {
  display: grid;
  grid-template-columns:
    repeat(4, 1fr);
  gap: 18px;
}

.step-card {
  position: relative;
  padding: 28px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
}

.step-number {
  display: inline-block;
  margin-bottom: 22px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 900;
}

.step-line {
  position: absolute;
  top: 35px;
  right: -20px;
  width: 85px;
  height: 1px;
  background: #dbeafe;
}

.step-card h3 {
  margin: 0 0 10px;
  color: #0f172a;
  font-size: 17px;
}

.step-card p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.7;
}

.cta-section {
  padding: 40px 24px 95px;
  background: #ffffff;
}

.cta-card {
  position: relative;
  padding: 55px 58px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 50px;
  color: #ffffff;
  background:
      radial-gradient(
          circle at 90% 15%,
          rgba(255, 255, 255, 0.14),
          transparent 25%
      ),
      linear-gradient(
          135deg,
          #172554,
          #1d4ed8 60%,
          #4f46e5
      );
  border-radius: 26px;
  box-shadow:
      0 24px 55px
      rgba(30, 64, 175, 0.22);
}

.cta-decoration {
  position: absolute;
  right: -100px;
  bottom: -170px;
  width: 360px;
  height: 360px;
  background:
      rgba(255, 255, 255, 0.07);
  border-radius: 50%;
}

.cta-content,
.cta-actions {
  position: relative;
  z-index: 1;
}

.cta-content {
  max-width: 720px;
}

.cta-label {
  color: #bfdbfe;
}

.cta-content h2 {
  color: #ffffff;
}

.cta-content p {
  max-width: 640px;
  color: #dbeafe;
}

.cta-actions {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.cta-primary,
.cta-secondary {
  min-width: 190px;
  min-height: 48px;
  padding: 13px 18px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border-radius: 11px;
  text-decoration: none;
  font-size: 12px;
  font-weight: 900;
}

.cta-primary {
  color: #1e3a8a;
  background: #ffffff;
}

.cta-secondary {
  color: #ffffff;
  background:
      rgba(255, 255, 255, 0.1);
  border:
      1px solid
      rgba(255, 255, 255, 0.2);
}

.home-footer {
  padding: 30px 24px;
  color: #cbd5e1;
  background: #0f172a;
}

.footer-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ffffff;
  text-decoration: none;
  font-size: 15px;
  font-weight: 900;
}

.footer-brand span {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background:
      linear-gradient(
          135deg,
          #2563eb,
          #4f46e5
      );
  border-radius: 9px;
  font-size: 9px;
}

.footer-container p {
  margin: 0;
  color: #94a3b8;
  font-size: 11px;
}

.footer-links {
  display: flex;
  gap: 18px;
}

.footer-links a {
  color: #cbd5e1;
  text-decoration: none;
  font-size: 11px;
  font-weight: 700;
}

.footer-links a:hover {
  color: #ffffff;
}

@media (max-width: 1100px) {
  .hero-container {
    grid-template-columns: 1fr;
  }

  .hero-content {
    max-width: 760px;
  }

  .hero-visual {
    width: 100%;
    max-width: 680px;
    margin: 0 auto;
  }

  .features-grid,
  .steps-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .portfolio-container {
    gap: 55px;
  }
}

@media (max-width: 850px) {
  .portfolio-container {
    grid-template-columns: 1fr;
  }

  .portfolio-visual {
    order: 2;
  }

  .portfolio-content {
    order: 1;
  }

  .workflow-heading,
  .cta-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .cta-actions {
    width: 100%;
    flex-direction: row;
  }

  .cta-primary,
  .cta-secondary {
    flex: 1;
  }

  .trust-container,
  .footer-container {
    flex-direction: column;
    text-align: center;
  }

  .technology-list {
    justify-content: center;
  }
}

@media (max-width: 650px) {
  .hero-section {
    padding: 55px 16px 75px;
  }

  .hero-container {
    gap: 45px;
  }

  .hero-content h1 {
    font-size: 45px;
    letter-spacing: -1.8px;
  }

  .hero-content > p {
    font-size: 15px;
  }

  .hero-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
  }

  .hero-benefits {
    align-items: flex-start;
    flex-direction: column;
  }

  .hero-visual {
    min-height: auto;
  }

  .dashboard-preview {
    padding: 17px;
    transform: none;
  }

  .preview-statistics {
    grid-template-columns: 1fr;
  }

  .floating-card {
    display: none;
  }

  .features-section,
  .portfolio-section,
  .workflow-section {
    padding: 70px 16px;
  }

  .features-grid,
  .steps-grid {
    grid-template-columns: 1fr;
  }

  .section-heading h2,
  .portfolio-content h2,
  .cta-content h2 {
    font-size: 34px;
  }

  .profile-preview {
    transform: none;
  }

  .profile-information {
    grid-template-columns: 1fr;
  }

  .cta-section {
    padding: 25px 16px 70px;
  }

  .cta-card {
    padding: 38px 25px;
  }

  .cta-actions {
    flex-direction: column;
  }

  .cta-primary,
  .cta-secondary {
    width: 100%;
  }

  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 430px) {
  .hero-content h1 {
    font-size: 38px;
  }

  .hero-badge {
    font-size: 10px;
  }

  .preview-toolbar {
    align-items: flex-start;
  }

  .preview-status {
    display: none;
  }

  .preview-welcome {
    align-items: flex-start;
    gap: 15px;
  }

  .preview-activity {
    display: none;
  }
}
</style>