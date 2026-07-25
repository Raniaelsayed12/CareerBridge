<script setup>
import {computed, onMounted, ref} from "vue";
import Navbar from "../components/Navbar.vue/Navbar.vue";
import {useUserStore} from "../stores/userStore";

const userStore = useUserStore();

const isLoading = ref(true);

const firstName = computed(() => {
  const name = userStore.name?.trim();

  if (!name) {
    return "User";
  }

  return name.split(/\s+/)[0];
});

const currentDate = computed(() => {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
});

const progressWidth = computed(() => {
  return `${userStore.progress}%`;
});

onMounted(async () => {
  try {
    await userStore.loadStatistics();
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <Navbar/>

  <main class="dashboard-page">
    <div class="dashboard-container">
      <section class="welcome-section">
        <div class="welcome-content">
          <span class="welcome-label">
            Career dashboard
          </span>

          <h1>
            Welcome back, {{ firstName }}
          </h1>

          <p>
            Track your progress, manage your achievements and continue building
            your professional profile.
          </p>

          <span class="current-date">
            {{ currentDate }}
          </span>
        </div>

        <div class="welcome-decoration">
          <div class="decoration-card">
            <span class="decoration-icon">↗</span>

            <div>
              <strong>{{ userStore.progress }}%</strong>
              <span>Profile completed</span>
            </div>
          </div>
        </div>
      </section>

      <section class="section-header">
        <div>
          <span class="section-label">Overview</span>
          <h2>Your career activity</h2>
        </div>

        <RouterLink
            to="/profile"
            class="profile-link"
        >
          View profile
          <span>→</span>
        </RouterLink>
      </section>

      <section class="statistics-grid">
        <article class="stat-card">
          <div class="stat-icon skills-icon">
            S
          </div>

          <div class="stat-content">
            <span class="stat-title">Skills</span>

            <strong v-if="!isLoading">
              {{ userStore.skillsCount }}
            </strong>

            <span v-else class="loading-number"></span>

            <p>Technical and professional skills</p>
          </div>

          <RouterLink
              to="/skills"
              class="card-link"
              aria-label="Open skills"
          >
            →
          </RouterLink>
        </article>

        <article class="stat-card">
          <div class="stat-icon projects-icon">
            P
          </div>

          <div class="stat-content">
            <span class="stat-title">Projects</span>

            <strong v-if="!isLoading">
              {{ userStore.projectsCount }}
            </strong>

            <span v-else class="loading-number"></span>

            <p>Projects added to your portfolio</p>
          </div>

          <RouterLink
              to="/projects"
              class="card-link"
              aria-label="Open projects"
          >
            →
          </RouterLink>
        </article>

        <article class="stat-card">
          <div class="stat-icon certificates-icon">
            C
          </div>

          <div class="stat-content">
            <span class="stat-title">Certificates</span>

            <strong v-if="!isLoading">
              {{ userStore.certificatesCount }}
            </strong>

            <span v-else class="loading-number"></span>

            <p>Certificates and achievements</p>
          </div>

          <RouterLink
              to="/certificates"
              class="card-link"
              aria-label="Open certificates"
          >
            →
          </RouterLink>
        </article>

        <article class="stat-card">
          <div class="stat-icon progress-icon">
            %
          </div>

          <div class="stat-content">
            <span class="stat-title">Progress</span>

            <strong v-if="!isLoading">
              {{ userStore.progress }}%
            </strong>

            <span v-else class="loading-number"></span>

            <p>Overall profile completion</p>
          </div>

          <RouterLink
              to="/profile"
              class="card-link"
              aria-label="Open profile"
          >
            →
          </RouterLink>
        </article>
      </section>

      <section class="dashboard-grid">
        <article class="progress-card">
          <div class="card-heading">
            <div>
              <span class="section-label">
                Profile strength
              </span>

              <h2>Complete your profile</h2>
            </div>

            <strong class="progress-percentage">
              {{ userStore.progress }}%
            </strong>
          </div>

          <div class="progress-track">
            <div
                class="progress-value"
                :style="{ width: progressWidth }"
            ></div>
          </div>

          <div class="progress-information">
            <p>
              Add your skills, projects, certificates and personal information
              to create a stronger professional profile.
            </p>

            <RouterLink
                to="/profile"
                class="primary-button"
            >
              Complete profile
            </RouterLink>
          </div>
        </article>

        <article class="quick-actions-card">
          <div class="card-heading">
            <div>
              <span class="section-label">
                Quick actions
              </span>

              <h2>Continue building</h2>
            </div>
          </div>

          <div class="quick-actions">
            <RouterLink
                to="/skills"
                class="quick-action"
            >
              <span class="quick-action-icon">+</span>

              <span>
                <strong>Add a skill</strong>
                <small>Update your technical skills</small>
              </span>

              <span class="quick-action-arrow">→</span>
            </RouterLink>

            <RouterLink
                to="/projects"
                class="quick-action"
            >
              <span class="quick-action-icon">+</span>

              <span>
                <strong>Add a project</strong>
                <small>Showcase your recent work</small>
              </span>

              <span class="quick-action-arrow">→</span>
            </RouterLink>

            <RouterLink
                to="/certificates"
                class="quick-action"
            >
              <span class="quick-action-icon">+</span>

              <span>
                <strong>Add a certificate</strong>
                <small>Record a new achievement</small>
              </span>

              <span class="quick-action-arrow">→</span>
            </RouterLink>
          </div>
        </article>
      </section>
    </div>
  </main>
</template>

<style scoped>
.dashboard-page {
  min-height: calc(100vh - 72px);
  padding: 44px 24px 70px;
  color: #0f172a;
  background: radial-gradient(
      circle at 5% 5%,
      rgba(59, 130, 246, 0.12),
      transparent 28%
  ),
  #f8fafc;
  font-family: Inter,
  Arial,
  sans-serif;
}

.dashboard-container {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
}

.welcome-section {
  position: relative;
  min-height: 270px;
  padding: 48px 52px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  color: #ffffff;
  background: linear-gradient(
      135deg,
      #172554 0%,
      #1d4ed8 58%,
      #4f46e5 100%
  );
  border-radius: 28px;
  box-shadow: 0 24px 55px rgba(30, 64, 175, 0.23);
}

.welcome-section::before {
  position: absolute;
  top: -120px;
  right: -70px;
  width: 330px;
  height: 330px;
  content: "";
  background: rgba(255, 255, 255, 0.09);
  border-radius: 50%;
}

.welcome-section::after {
  position: absolute;
  right: 220px;
  bottom: -140px;
  width: 250px;
  height: 250px;
  content: "";
  background: rgba(255, 255, 255, 0.06);
  border-radius: 50%;
}

.welcome-content,
.welcome-decoration {
  position: relative;
  z-index: 1;
}

.welcome-content {
  max-width: 690px;
}

.welcome-label,
.section-label {
  display: inline-block;
  margin-bottom: 10px;
  color: #93c5fd;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.welcome-content h1 {
  margin: 0 0 16px;
  font-size: clamp(36px, 5vw, 55px);
  line-height: 1.08;
  letter-spacing: -1.6px;
}

.welcome-content p {
  max-width: 650px;
  margin: 0 0 22px;
  color: #dbeafe;
  font-size: 17px;
  line-height: 1.7;
}

.current-date {
  display: inline-flex;
  padding: 9px 13px;
  color: #e0e7ff;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
}

.decoration-card {
  min-width: 190px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 18px;
  backdrop-filter: blur(10px);
}

.decoration-icon {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #172554;
  background: #dbeafe;
  border-radius: 13px;
  font-size: 22px;
  font-weight: 900;
}

.decoration-card div {
  display: flex;
  flex-direction: column;
}

.decoration-card strong {
  font-size: 26px;
}

.decoration-card span:last-child {
  color: #dbeafe;
  font-size: 12px;
}

.section-header {
  margin: 44px 0 20px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}

.section-header .section-label,
.card-heading .section-label {
  color: #2563eb;
}

.section-header h2,
.card-heading h2 {
  margin: 0;
  color: #0f172a;
  font-size: 24px;
  letter-spacing: -0.5px;
}

.profile-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #2563eb;
  text-decoration: none;
  font-size: 14px;
  font-weight: 800;
}

.profile-link:hover {
  color: #1d4ed8;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.stat-card {
  position: relative;
  min-height: 190px;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 19px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
  transition: transform 0.2s ease,
  box-shadow 0.2s ease,
  border-color 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  border-color: #bfdbfe;
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 900;
}

.skills-icon {
  color: #1d4ed8;
  background: #dbeafe;
}

.projects-icon {
  color: #6d28d9;
  background: #ede9fe;
}

.certificates-icon {
  color: #b45309;
  background: #fef3c7;
}

.progress-icon {
  color: #047857;
  background: #d1fae5;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-title {
  margin-bottom: 8px;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
}

.stat-content strong {
  margin-bottom: 8px;
  color: #0f172a;
  font-size: 34px;
  line-height: 1;
}

.stat-content p {
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
  line-height: 1.5;
}

.card-link {
  position: absolute;
  right: 18px;
  bottom: 18px;
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  background: #eff6ff;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 900;
}

.loading-number {
  width: 55px;
  height: 34px;
  margin-bottom: 8px;
  display: block;
  background: linear-gradient(
      90deg,
      #e2e8f0,
      #f1f5f9,
      #e2e8f0
  );
  border-radius: 8px;
  background-size: 200% 100%;
  animation: loading 1.2s infinite;
}

.dashboard-grid {
  margin-top: 22px;
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  gap: 22px;
}

.progress-card,
.quick-actions-card {
  padding: 30px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 22px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.06);
}

.card-heading {
  margin-bottom: 28px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.progress-percentage {
  color: #2563eb;
  font-size: 30px;
}

.progress-track {
  width: 100%;
  height: 12px;
  overflow: hidden;
  background: #e2e8f0;
  border-radius: 999px;
}

.progress-value {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #4f46e5);
  border-radius: 999px;
  transition: width 0.5s ease;
}

.progress-information {
  margin-top: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
}

.progress-information p {
  max-width: 570px;
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.7;
}

.primary-button {
  flex-shrink: 0;
  padding: 12px 17px;
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  border-radius: 11px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 800;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.quick-action {
  padding: 13px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  color: #0f172a;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 13px;
  text-decoration: none;
  transition: background 0.2s ease,
  border-color 0.2s ease,
  transform 0.2s ease;
}

.quick-action:hover {
  transform: translateX(2px);
  background: #eff6ff;
  border-color: #bfdbfe;
}

.quick-action-icon {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: #2563eb;
  border-radius: 10px;
  font-size: 20px;
}

.quick-action span:nth-child(2) {
  display: flex;
  flex-direction: column;
}

.quick-action strong {
  font-size: 13px;
}

.quick-action small {
  margin-top: 3px;
  color: #64748b;
  font-size: 11px;
}

.quick-action-arrow {
  color: #2563eb;
  font-weight: 900;
}

@keyframes loading {
  from {
    background-position: 200% 0;
  }

  to {
    background-position: -200% 0;
  }
}

@media (max-width: 1050px) {
  .statistics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .dashboard-page {
    padding: 28px 16px 55px;
  }

  .welcome-section {
    min-height: auto;
    padding: 38px 28px;
    flex-direction: column;
    align-items: flex-start;
  }

  .welcome-decoration {
    width: 100%;
  }

  .decoration-card {
    box-sizing: border-box;
  }

  .section-header {
    align-items: flex-start;
  }

  .progress-information {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 560px) {
  .statistics-grid {
    grid-template-columns: 1fr;
  }

  .welcome-content h1 {
    font-size: 34px;
  }

  .section-header {
    flex-direction: column;
  }

  .stat-card {
    min-height: 165px;
  }

  .progress-card,
  .quick-actions-card {
    padding: 23px;
  }

  .card-heading {
    flex-direction: column;
  }
}
</style>