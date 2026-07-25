<script setup>
import Navbar from "../components/Navbar.vue/Navbar.vue";

const features = [
  {
    icon: "S",
    title: "Skills management",
    description:
        "Organize your technical and professional skills in one clear profile.",
  },
  {
    icon: "P",
    title: "Project portfolio",
    description:
        "Present your projects with descriptions and direct GitHub repository links.",
  },
  {
    icon: "C",
    title: "Certificates",
    description:
        "Record your certificates, courses and professional achievements.",
  },
  {
    icon: "R",
    title: "Professional resume",
    description:
        "Generate a structured resume based on the information stored in your profile.",
  },
];

const workflowSteps = [
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
        "Add your professional information, university, GitHub profile and biography.",
  },
  {
    number: "03",
    title: "Build your portfolio",
    description:
        "Add your skills, projects and certificates to showcase your experience.",
  },
  {
    number: "04",
    title: "Generate your resume",
    description:
        "Create and export a professional resume using your CareerBridge information.",
  },
];

const technologies = [
  "Vue.js",
  "Vite",
  "Pinia",
  "Vue Router",
  "Axios",
  "Node.js",
  "Express",
  "Local JSON Database",
];

const teamMembers = [
  {
    initials: "RA",
    name: "Rania Abdelaal",
    role: "Frontend Developer",
    contribution:
        "Started the CareerBridge project and developed the first user interface components.",
  },
  {
    initials: "HA",
    name: "Hania Alilat",
    role: "Full-Stack Development",
    contribution:
        "Improved the application structure, user profile and dashboard functionality.",
  },
  {
    initials: "AE",
    name: "Aly Elatrby",
    role: "Project Contributor",
    contribution:
        "Supported project planning, documentation and application development.",
  },
];
</script>

<template>
  <Navbar />

  <main class="about-page">
    <div class="about-container">
      <section class="hero-section">
        <div class="hero-content">
          <span class="hero-label">
            About CareerBridge
          </span>

          <h1>
            Build a stronger professional profile
          </h1>

          <p>
            CareerBridge is a digital portfolio platform
            that helps students and young professionals
            organize their skills, projects, certificates
            and career information in one structured
            workspace.
          </p>

          <div class="hero-actions">
            <RouterLink
                to="/register"
                class="primary-action"
            >
              Create your profile
            </RouterLink>

            <RouterLink
                to="/login"
                class="secondary-action"
            >
              Sign in
            </RouterLink>
          </div>
        </div>

        <div class="hero-preview">
          <div class="preview-window">
            <div class="preview-header">
              <div class="window-controls">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <span class="preview-title">
                CareerBridge Profile
              </span>
            </div>

            <div class="preview-body">
              <div class="preview-profile">
                <div class="preview-avatar">
                  CB
                </div>

                <div>
                  <strong>
                    Professional profile
                  </strong>

                  <span>
                    Skills, projects and achievements
                  </span>
                </div>
              </div>

              <div class="preview-statistics">
                <div>
                  <strong>8</strong>
                  <span>Skills</span>
                </div>

                <div>
                  <strong>4</strong>
                  <span>Projects</span>
                </div>

                <div>
                  <strong>3</strong>
                  <span>Certificates</span>
                </div>
              </div>

              <div class="preview-progress">
                <div class="progress-heading">
                  <span>Profile progress</span>
                  <strong>86%</strong>
                </div>

                <div class="progress-track">
                  <div class="progress-value"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="mission-section">
        <div class="section-heading">
          <span class="section-label">
            Our purpose
          </span>

          <h2>
            A simple bridge between education and career
          </h2>

          <p>
            Students often have useful skills, academic
            projects and certificates, but their
            information is spread across different files
            and platforms. CareerBridge brings everything
            together in one clear and professional profile.
          </p>
        </div>

        <div class="mission-grid">
          <article class="mission-card">
            <span class="mission-number">
              01
            </span>

            <h3>Organize</h3>

            <p>
              Keep all professional information in one
              structured and accessible workspace.
            </p>
          </article>

          <article class="mission-card">
            <span class="mission-number">
              02
            </span>

            <h3>Present</h3>

            <p>
              Present skills, projects and achievements
              in a modern digital portfolio.
            </p>
          </article>

          <article class="mission-card">
            <span class="mission-number">
              03
            </span>

            <h3>Develop</h3>

            <p>
              Track profile progress and continue
              improving professional qualifications.
            </p>
          </article>
        </div>
      </section>

      <section class="features-section">
        <div class="section-heading centered">
          <span class="section-label">
            Platform features
          </span>

          <h2>
            Everything needed for a career profile
          </h2>

          <p>
            CareerBridge provides simple tools for
            building, managing and presenting professional
            experience.
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

            <h3>
              {{ feature.title }}
            </h3>

            <p>
              {{ feature.description }}
            </p>
          </article>
        </div>
      </section>

      <section class="workflow-section">
        <div class="workflow-heading">
          <div>
            <span class="section-label">
              How it works
            </span>

            <h2>
              Build your portfolio step by step
            </h2>
          </div>

          <p>
            The platform guides users from registration
            to a complete professional resume.
          </p>
        </div>

        <div class="workflow-grid">
          <article
              v-for="step in workflowSteps"
              :key="step.number"
              class="workflow-card"
          >
            <span class="workflow-number">
              {{ step.number }}
            </span>

            <div>
              <h3>{{ step.title }}</h3>

              <p>
                {{ step.description }}
              </p>
            </div>
          </article>
        </div>
      </section>

      <section class="technology-section">
        <div class="technology-content">
          <span class="section-label">
            Technology
          </span>

          <h2>
            Built with modern web technologies
          </h2>

          <p>
            CareerBridge combines a Vue.js frontend with
            a lightweight Node.js and Express backend.
            The current development version stores data
            locally and can later be migrated to a
            professional database.
          </p>
        </div>

        <div class="technology-list">
          <span
              v-for="technology in technologies"
              :key="technology"
              class="technology-item"
          >
            {{ technology }}
          </span>
        </div>
      </section>

      <section class="team-section">
        <div class="section-heading centered">
          <span class="section-label">
            Project team
          </span>

          <h2>
            Developed through teamwork
          </h2>

          <p>
            CareerBridge was developed as a collaborative
            university project with contributions across
            design, development and documentation.
          </p>
        </div>

        <div class="team-grid">
          <article
              v-for="member in teamMembers"
              :key="member.name"
              class="team-card"
          >
            <div class="member-avatar">
              {{ member.initials }}
            </div>

            <div class="member-content">
              <h3>{{ member.name }}</h3>

              <span class="member-role">
                {{ member.role }}
              </span>

              <p>
                {{ member.contribution }}
              </p>
            </div>
          </article>
        </div>
      </section>

      <section class="cta-section">
        <div>
          <span class="cta-label">
            Start building today
          </span>

          <h2>
            Turn your experience into a professional
            portfolio
          </h2>

          <p>
            Create your account and start organizing
            your career information with CareerBridge.
          </p>
        </div>

        <RouterLink
            to="/register"
            class="cta-button"
        >
          Create account
          <span>→</span>
        </RouterLink>
      </section>
    </div>
  </main>
</template>

<style scoped>
.about-page {
  min-height: calc(100vh - 72px);
  padding: 44px 24px 70px;
  color: #0f172a;
  background:
      radial-gradient(
          circle at 5% 5%,
          rgba(59, 130, 246, 0.11),
          transparent 25%
      ),
      #f8fafc;
  font-family:
      Inter,
      Arial,
      sans-serif;
}

.about-container {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
}

.hero-section {
  position: relative;
  min-height: 520px;
  padding: 65px 58px;
  box-sizing: border-box;
  overflow: hidden;
  display: grid;
  grid-template-columns:
    minmax(0, 1.05fr)
    minmax(380px, 0.95fr);
  align-items: center;
  gap: 60px;
  color: #ffffff;
  background:
      radial-gradient(
          circle at 85% 12%,
          rgba(255, 255, 255, 0.16),
          transparent 23%
      ),
      linear-gradient(
          135deg,
          #0f172a,
          #1e3a8a 55%,
          #4f46e5
      );
  border-radius: 29px;
  box-shadow:
      0 28px 65px
      rgba(30, 58, 138, 0.25);
}

.hero-section::before {
  position: absolute;
  left: -160px;
  bottom: -210px;
  width: 420px;
  height: 420px;
  content: "";
  background:
      rgba(255, 255, 255, 0.06);
  border-radius: 50%;
}

.hero-content,
.hero-preview {
  position: relative;
  z-index: 1;
}

.hero-label,
.section-label,
.cta-label {
  display: inline-block;
  margin-bottom: 12px;
  color: #93c5fd;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.hero-content h1 {
  max-width: 660px;
  margin: 0 0 22px;
  font-size: clamp(
      43px,
      5vw,
      65px
  );
  line-height: 1.04;
  letter-spacing: -2px;
}

.hero-content > p {
  max-width: 660px;
  margin: 0;
  color: #dbeafe;
  font-size: 17px;
  line-height: 1.8;
}

.hero-actions {
  margin-top: 32px;
  display: flex;
  gap: 13px;
}

.primary-action,
.secondary-action {
  min-height: 47px;
  padding: 13px 20px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 800;
  transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
}

.primary-action {
  color: #172554;
  background: #ffffff;
}

.secondary-action {
  color: #ffffff;
  background:
      rgba(255, 255, 255, 0.1);
  border:
      1px solid
      rgba(255, 255, 255, 0.23);
}

.primary-action:hover,
.secondary-action:hover {
  transform: translateY(-2px);
}

.preview-window {
  overflow: hidden;
  background:
      rgba(255, 255, 255, 0.97);
  border:
      1px solid
      rgba(255, 255, 255, 0.28);
  border-radius: 23px;
  box-shadow:
      0 30px 65px
      rgba(15, 23, 42, 0.32);
  transform: rotate(1.5deg);
}

.preview-header {
  padding: 15px 17px;
  display: flex;
  align-items: center;
  gap: 16px;
  background: #f8fafc;
  border-bottom:
      1px solid #e2e8f0;
}

.window-controls {
  display: flex;
  gap: 6px;
}

.window-controls span {
  width: 9px;
  height: 9px;
  background: #cbd5e1;
  border-radius: 50%;
}

.preview-title {
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
}

.preview-body {
  padding: 25px;
}

.preview-profile {
  display: flex;
  align-items: center;
  gap: 13px;
}

.preview-avatar {
  width: 50px;
  height: 50px;
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
  border-radius: 15px;
  font-size: 13px;
  font-weight: 900;
}

.preview-profile div:last-child {
  display: flex;
  flex-direction: column;
}

.preview-profile strong {
  color: #0f172a;
  font-size: 14px;
}

.preview-profile span {
  margin-top: 4px;
  color: #64748b;
  font-size: 11px;
}

.preview-statistics {
  margin-top: 25px;
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  gap: 10px;
}

.preview-statistics div {
  padding: 15px 9px;
  display: flex;
  flex-direction: column;
  text-align: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.preview-statistics strong {
  color: #2563eb;
  font-size: 20px;
}

.preview-statistics span {
  margin-top: 3px;
  color: #64748b;
  font-size: 9px;
  font-weight: 700;
}

.preview-progress {
  margin-top: 20px;
  padding: 16px;
  background: #eff6ff;
  border-radius: 12px;
}

.progress-heading {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  color: #334155;
  font-size: 11px;
  font-weight: 700;
}

.progress-track {
  height: 8px;
  overflow: hidden;
  background: #dbeafe;
  border-radius: 999px;
}

.progress-value {
  width: 86%;
  height: 100%;
  background:
      linear-gradient(
          90deg,
          #2563eb,
          #4f46e5
      );
  border-radius: 999px;
}

.mission-section,
.features-section,
.workflow-section,
.team-section {
  margin-top: 80px;
}

.section-heading {
  max-width: 760px;
}

.section-heading.centered {
  margin: 0 auto 38px;
  text-align: center;
}

.section-label {
  color: #2563eb;
}

.section-heading h2,
.workflow-heading h2,
.technology-content h2 {
  margin: 0 0 16px;
  color: #0f172a;
  font-size: clamp(
      31px,
      4vw,
      43px
  );
  line-height: 1.15;
  letter-spacing: -1px;
}

.section-heading p,
.workflow-heading > p,
.technology-content p {
  margin: 0;
  color: #64748b;
  font-size: 15px;
  line-height: 1.8;
}

.mission-grid {
  margin-top: 35px;
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  gap: 20px;
}

.mission-card {
  padding: 29px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 19px;
  box-shadow:
      0 12px 30px
      rgba(15, 23, 42, 0.06);
}

.mission-number {
  display: inline-block;
  margin-bottom: 28px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.mission-card h3 {
  margin: 0 0 10px;
  font-size: 21px;
}

.mission-card p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.75;
}

.features-grid {
  display: grid;
  grid-template-columns:
    repeat(4, 1fr);
  gap: 18px;
}

.feature-card {
  min-height: 245px;
  padding: 25px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  box-shadow:
      0 10px 28px
      rgba(15, 23, 42, 0.06);
  transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow:
      0 18px 38px
      rgba(15, 23, 42, 0.1);
}

.feature-icon {
  width: 49px;
  height: 49px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1d4ed8;
  background: #dbeafe;
  border-radius: 14px;
  font-weight: 900;
}

.feature-card h3 {
  margin: 0 0 10px;
  font-size: 18px;
}

.feature-card p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.75;
}

.workflow-section {
  padding: 45px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 25px;
  box-shadow:
      0 14px 36px
      rgba(15, 23, 42, 0.06);
}

.workflow-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
}

.workflow-heading > p {
  max-width: 420px;
}

.workflow-grid {
  margin-top: 38px;
  display: grid;
  grid-template-columns:
    repeat(2, 1fr);
  gap: 17px;
}

.workflow-card {
  padding: 22px;
  display: flex;
  gap: 17px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
}

.workflow-number {
  width: 43px;
  height: 43px;
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
  border-radius: 12px;
  font-size: 11px;
  font-weight: 900;
}

.workflow-card h3 {
  margin: 0 0 7px;
  font-size: 16px;
}

.workflow-card p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.65;
}

.technology-section {
  margin-top: 80px;
  padding: 48px;
  display: grid;
  grid-template-columns:
    1fr 1fr;
  align-items: center;
  gap: 55px;
  color: #ffffff;
  background: #0f172a;
  border-radius: 25px;
}

.technology-content h2 {
  color: #ffffff;
}

.technology-content p {
  color: #cbd5e1;
}

.technology-list {
  display: flex;
  flex-wrap: wrap;
  gap: 11px;
}

.technology-item {
  padding: 11px 14px;
  color: #dbeafe;
  background:
      rgba(59, 130, 246, 0.13);
  border:
      1px solid
      rgba(147, 197, 253, 0.18);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
}

.team-grid {
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  gap: 20px;
}

.team-card {
  padding: 28px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 19px;
  box-shadow:
      0 11px 30px
      rgba(15, 23, 42, 0.06);
}

.member-avatar {
  width: 59px;
  height: 59px;
  margin-bottom: 20px;
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
  border-radius: 17px;
  font-size: 14px;
  font-weight: 900;
}

.member-content h3 {
  margin: 0;
  font-size: 19px;
}

.member-role {
  display: inline-block;
  margin-top: 7px;
  color: #2563eb;
  font-size: 11px;
  font-weight: 800;
}

.member-content p {
  margin: 15px 0 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.75;
}

.cta-section {
  margin-top: 80px;
  padding: 48px 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 45px;
  color: #ffffff;
  background:
      linear-gradient(
          135deg,
          #1d4ed8,
          #4f46e5
      );
  border-radius: 25px;
  box-shadow:
      0 20px 45px
      rgba(37, 99, 235, 0.22);
}

.cta-label {
  color: #bfdbfe;
}

.cta-section h2 {
  max-width: 720px;
  margin: 0 0 12px;
  font-size: 34px;
  line-height: 1.2;
}

.cta-section p {
  margin: 0;
  color: #dbeafe;
  font-size: 14px;
}

.cta-button {
  flex-shrink: 0;
  padding: 14px 19px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1e3a8a;
  background: #ffffff;
  border-radius: 11px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 800;
}

@media (max-width: 1000px) {
  .hero-section {
    grid-template-columns: 1fr;
  }

  .hero-preview {
    max-width: 570px;
  }

  .features-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .technology-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 850px) {
  .mission-grid,
  .team-grid {
    grid-template-columns: 1fr;
  }

  .workflow-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .cta-section {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 700px) {
  .about-page {
    padding: 26px 15px 55px;
  }

  .hero-section {
    min-height: auto;
    padding: 39px 27px;
  }

  .hero-content h1 {
    font-size: 40px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .primary-action,
  .secondary-action {
    width: 100%;
  }

  .workflow-section,
  .technology-section,
  .cta-section {
    padding: 30px 24px;
  }

  .workflow-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .features-grid {
    grid-template-columns: 1fr;
  }

  .preview-statistics {
    grid-template-columns: 1fr;
  }

  .preview-window {
    transform: none;
  }

  .cta-section h2 {
    font-size: 28px;
  }

  .cta-button {
    width: 100%;
    box-sizing: border-box;
    justify-content: center;
  }
}
</style>