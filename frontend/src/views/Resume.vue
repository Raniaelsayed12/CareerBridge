<script setup>
import {
  computed,
  onMounted,
  ref,
} from "vue";

import Navbar from "../components/Navbar.vue/Navbar.vue";
import { useUserStore } from "../stores/userStore";
import api from "../services/api";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const userStore = useUserStore();

const resumeDocument = ref(null);

const skills = ref([]);
const projects = ref([]);
const certificates = ref([]);

const isLoading = ref(true);
const isDownloading = ref(false);
const errorMessage = ref("");

const initials = computed(() => {
  if (!userStore.name) {
    return "CB";
  }

  return userStore.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) =>
          word.charAt(0).toUpperCase()
      )
      .join("");
});

const displayName = computed(() => {
  return (
      userStore.name ||
      "CareerBridge User"
  );
});

const displayRole = computed(() => {
  return (
      userStore.role ||
      "Professional Profile"
  );
});

const displayBio = computed(() => {
  return (
      userStore.bio ||
      "Add a professional summary in your profile to introduce your experience, strengths and career goals."
  );
});

const githubUrl = computed(() => {
  const github = userStore.github?.trim();

  if (!github) {
    return "";
  }

  if (
      github.startsWith("http://") ||
      github.startsWith("https://")
  ) {
    return github;
  }

  return `https://${github}`;
});

const hasContactInformation = computed(() => {
  return Boolean(
      userStore.email ||
      userStore.city ||
      userStore.github
  );
});

function synchronizeStore() {
  userStore.skills = [...skills.value];

  userStore.projects = [
    ...projects.value,
  ];

  userStore.certificates = [
    ...certificates.value,
  ];
}

function getProjectInitials(title) {
  if (!title) {
    return "PR";
  }

  return title
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) =>
          word.charAt(0).toUpperCase()
      )
      .join("");
}

function getProjectUrl(url) {
  if (!url) {
    return "";
  }

  if (
      url.startsWith("http://") ||
      url.startsWith("https://")
  ) {
    return url;
  }

  return `https://${url}`;
}

function createSafeFileName(name) {
  const safeName = (
      name || "CareerBridge"
  )
      .trim()
      .replace(
          /[^a-zA-Z0-9-_ ]/g,
          ""
      )
      .replace(/\s+/g, "-");

  return `${
      safeName || "CareerBridge"
  }-Resume.pdf`;
}

async function loadResumeData() {
  errorMessage.value = "";
  isLoading.value = true;

  try {
    const [
      skillsResponse,
      projectsResponse,
      certificatesResponse,
    ] = await Promise.all([
      api.get("/skills"),
      api.get("/projects"),
      api.get("/certificates"),
    ]);

    skills.value = Array.isArray(
        skillsResponse.data
    )
        ? skillsResponse.data
        : [];

    projects.value = Array.isArray(
        projectsResponse.data
    )
        ? projectsResponse.data
        : [];

    certificates.value =
        Array.isArray(
            certificatesResponse.data
        )
            ? certificatesResponse.data
            : [];

    synchronizeStore();
  } catch (error) {
    console.error(
        "Could not load resume data:",
        error
    );

    errorMessage.value =
        error.response?.data?.message ||
        "Resume information could not be loaded.";
  } finally {
    isLoading.value = false;
  }
}

async function downloadResume() {
  if (
      !resumeDocument.value ||
      isDownloading.value
  ) {
    return;
  }

  errorMessage.value = "";
  isDownloading.value = true;

  const resumeElement =
      resumeDocument.value;

  try {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    resumeElement.classList.add(
        "pdf-export"
    );

    /*
      Give the browser one frame to apply
      the export styles before taking the image.
    */
    await new Promise((resolve) => {
      requestAnimationFrame(resolve);
    });

    const canvas = await html2canvas(
        resumeElement,
        {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          scrollX: 0,
          scrollY: -window.scrollY,
          width: resumeElement.scrollWidth,
          height: resumeElement.scrollHeight,
          windowWidth:
          resumeElement.scrollWidth,
          windowHeight:
          resumeElement.scrollHeight,
        }
    );

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageWidthMm = 210;
    const pageHeightMm = 297;

    const pixelsPerMillimeter =
        canvas.width / pageWidthMm;

    /*
      ceil is important here.

      Math.floor can leave one or two pixels
      outside page one, which creates a useless
      second PDF page.
    */
    const pageHeightPixels = Math.ceil(
        pageHeightMm *
        pixelsPerMillimeter
    );

    /*
      Small differences may appear because CSS,
      canvas and PDF use different measurement
      systems. A tiny overflow is ignored.
    */
    const overflowTolerancePixels = 16;

    const fitsOnOnePage =
        canvas.height <=
        pageHeightPixels +
        overflowTolerancePixels;

    const effectiveCanvasHeight =
        fitsOnOnePage
            ? pageHeightPixels
            : canvas.height;

    let currentY = 0;
    let pageNumber = 0;

    while (
        currentY <
        effectiveCanvasHeight
        ) {
      const remainingHeight =
          effectiveCanvasHeight -
          currentY;

      /*
        Do not create another page when only
        a few rounding pixels remain.
      */
      if (
          pageNumber > 0 &&
          remainingHeight <=
          overflowTolerancePixels
      ) {
        break;
      }

      const sliceHeight = Math.min(
          pageHeightPixels,
          Math.max(
              0,
              canvas.height - currentY
          )
      );

      /*
        If no real canvas content remains,
        stop instead of adding a blank page.
      */
      if (sliceHeight <= 0) {
        break;
      }

      const pageCanvas =
          document.createElement(
              "canvas"
          );

      pageCanvas.width =
          canvas.width;

      /*
        Every PDF page receives a complete
        A4-sized canvas. Empty space stays white.
      */
      pageCanvas.height =
          pageHeightPixels;

      const context =
          pageCanvas.getContext("2d");

      if (!context) {
        throw new Error(
            "PDF canvas could not be created."
        );
      }

      context.fillStyle = "#ffffff";

      context.fillRect(
          0,
          0,
          pageCanvas.width,
          pageCanvas.height
      );

      context.drawImage(
          canvas,
          0,
          currentY,
          canvas.width,
          sliceHeight,
          0,
          0,
          canvas.width,
          sliceHeight
      );

      const imageData =
          pageCanvas.toDataURL(
              "image/jpeg",
              0.94
          );

      if (pageNumber > 0) {
        pdf.addPage(
            "a4",
            "portrait"
        );
      }

      pdf.addImage(
          imageData,
          "JPEG",
          0,
          0,
          pageWidthMm,
          pageHeightMm,
          undefined,
          "FAST"
      );

      currentY += sliceHeight;
      pageNumber += 1;

      /*
        The resume fits on page one.
        No second-page discussion required.
      */
      if (fitsOnOnePage) {
        break;
      }
    }

    pdf.save(
        createSafeFileName(
            userStore.name
        )
    );
  } catch (error) {
    console.error(
        "Could not create PDF:",
        error
    );

    errorMessage.value =
        "The PDF could not be generated. Please try again.";
  } finally {
    resumeElement.classList.remove(
        "pdf-export"
    );

    isDownloading.value = false;
  }
}

function printResume() {
  window.print();
}

onMounted(loadResumeData);
</script>

<template>
  <div class="no-print">
    <Navbar />
  </div>

  <main class="resume-page">
    <div class="resume-page-container">
      <section class="resume-toolbar no-print">
        <div>
          <span class="toolbar-label">
            Resume builder
          </span>

          <h1>
            Professional Resume
          </h1>

          <p>
            Review your information before
            downloading or printing your resume.
          </p>
        </div>

        <div class="toolbar-actions">
          <button
              class="secondary-action"
              type="button"
              :disabled="isLoading"
              @click="printResume"
          >
            Print resume
          </button>

          <button
              class="primary-action"
              type="button"
              :disabled="
              isLoading ||
              isDownloading
            "
              @click="downloadResume"
          >
            <span
                v-if="isDownloading"
                class="spinner"
            ></span>

            {{
            isDownloading
            ? "Creating PDF..."
            : "Download PDF"
            }}
          </button>
        </div>
      </section>

      <div
          v-if="errorMessage"
          class="error-message no-print"
          role="alert"
      >
        <span>!</span>

        {{ errorMessage }}
      </div>

      <div
          v-if="isLoading"
          class="loading-state no-print"
      >
        <span class="large-spinner"></span>

        <h2>
          Preparing your resume
        </h2>

        <p>
          Loading your profile, skills,
          projects and certificates.
        </p>
      </div>

      <div
          v-else
          class="document-scroll"
      >
        <article
            ref="resumeDocument"
            class="resume-document"
        >
          <header class="resume-header">
            <div class="identity-section">
              <div class="resume-avatar">
                {{ initials }}
              </div>

              <div class="identity-content">
                <span class="resume-label">
                  Professional Resume
                </span>

                <h1>
                  {{ displayName }}
                </h1>

                <p>
                  {{ displayRole }}
                </p>
              </div>
            </div>

            <div
                v-if="
                hasContactInformation
              "
                class="header-contact"
            >
              <a
                  v-if="userStore.email"
                  :href="
                  `mailto:${userStore.email}`
                "
              >
                {{ userStore.email }}
              </a>

              <span
                  v-if="userStore.city"
              >
                {{ userStore.city }}
              </span>

              <a
                  v-if="githubUrl"
                  :href="githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                GitHub Profile
              </a>
            </div>
          </header>

          <div class="resume-layout">
            <aside class="resume-sidebar">
              <section class="resume-section">
                <h2>Contact</h2>

                <div class="contact-list">
                  <div
                      v-if="
                      userStore.email
                    "
                      class="contact-item"
                  >
                    <span class="contact-mark">
                      @
                    </span>

                    <div>
                      <small>Email</small>

                      <span>
                        {{
                          userStore.email
                        }}
                      </span>
                    </div>
                  </div>

                  <div
                      v-if="userStore.city"
                      class="contact-item"
                  >
                    <span class="contact-mark">
                      L
                    </span>

                    <div>
                      <small>
                        Location
                      </small>

                      <span>
                        {{
                          userStore.city
                        }}
                      </span>
                    </div>
                  </div>

                  <div
                      v-if="githubUrl"
                      class="contact-item"
                  >
                    <span class="contact-mark">
                      G
                    </span>

                    <div>
                      <small>GitHub</small>

                      <a
                          :href="githubUrl"
                          target="_blank"
                          rel="noopener noreferrer"
                      >
                        {{
                        userStore.github
                        }}
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              <section class="resume-section">
                <h2>Skills</h2>

                <div
                    v-if="skills.length"
                    class="skills-list"
                >
                  <span
                      v-for="skill in skills"
                      :key="skill._id"
                      class="skill-item"
                  >
                    {{ skill.name }}
                  </span>
                </div>

                <p
                    v-else
                    class="empty-information"
                >
                  No skills added yet.
                </p>
              </section>

              <section class="resume-section">
                <h2>Education</h2>

                <div
                    v-if="
                    userStore.university
                  "
                    class="education-item"
                >
                  <span class="education-mark">
                    U
                  </span>

                  <div>
                    <strong>
                      {{
                      userStore.university
                      }}
                    </strong>

                    <span>
                      Higher education
                    </span>
                  </div>
                </div>

                <p
                    v-else
                    class="empty-information"
                >
                  No university added yet.
                </p>
              </section>

              <section class="resume-section">
                <h2>
                  Profile Status
                </h2>

                <div class="profile-completion">
                  <div class="completion-heading">
                    <span>
                      Profile completion
                    </span>

                    <strong>
                      {{
                      userStore.progress
                      }}%
                    </strong>
                  </div>

                  <div class="completion-track">
                    <div
                        class="completion-value"
                        :style="{
                        width:
                          `${userStore.progress}%`,
                      }"
                    ></div>
                  </div>
                </div>
              </section>
            </aside>

            <div class="resume-main-content">
              <section class="main-section">
                <div class="section-title">
                  <span>01</span>

                  <h2>
                    Professional Profile
                  </h2>
                </div>

                <p class="professional-summary">
                  {{ displayBio }}
                </p>
              </section>

              <section class="main-section">
                <div class="section-title">
                  <span>02</span>

                  <h2>Projects</h2>
                </div>

                <div
                    v-if="projects.length"
                    class="projects-list"
                >
                  <article
                      v-for="
                      project in projects
                    "
                      :key="project._id"
                      class="project-item"
                  >
                    <div class="project-heading">
                      <span class="project-mark">
                        {{
                          getProjectInitials(
                            project.title
                          )
                        }}
                      </span>

                      <div>
                        <h3>
                          {{
                          project.title ||
                          "Untitled Project"
                          }}
                        </h3>

                        <a
                            v-if="
                            project.github
                          "
                            :href="
                            getProjectUrl(
                              project.github
                            )
                          "
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                          GitHub repository
                        </a>
                      </div>
                    </div>

                    <p>
                      {{
                      project.description ||
                      "No project description provided."
                      }}
                    </p>
                  </article>
                </div>

                <p
                    v-else
                    class="empty-main-information"
                >
                  No projects added yet.
                </p>
              </section>

              <section class="main-section">
                <div class="section-title">
                  <span>03</span>

                  <h2>Certificates</h2>
                </div>

                <div
                    v-if="
                    certificates.length
                  "
                    class="certificates-list"
                >
                  <article
                      v-for="
                      certificate in certificates
                    "
                      :key="
                      certificate._id
                    "
                      class="certificate-item"
                  >
                    <span class="certificate-mark">
                      C
                    </span>

                    <div>
                      <h3>
                        {{
                        certificate.name
                        }}
                      </h3>

                      <p>
                        Issued by

                        <strong>
                          {{
                          certificate.provider
                          }}
                        </strong>
                      </p>
                    </div>
                  </article>
                </div>

                <p
                    v-else
                    class="empty-main-information"
                >
                  No certificates added yet.
                </p>
              </section>
            </div>
          </div>

          <footer class="resume-footer">
            <span>
              {{ displayName }}
            </span>

            <span>
              Generated with CareerBridge
            </span>
          </footer>
        </article>
      </div>
    </div>
  </main>
</template>

<style scoped>
.resume-page {
  min-height: calc(100vh - 72px);
  padding: 38px 24px 70px;
  color: #0f172a;
  background: #eef2f7;
  font-family:
      Arial,
      Helvetica,
      sans-serif;
}

.resume-page-container {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
}

.resume-toolbar {
  margin-bottom: 24px;
  padding: 25px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  background: #ffffff;
  border: 1px solid #dbe3ee;
  border-radius: 18px;
  box-shadow:
      0 12px 30px
      rgba(15, 23, 42, 0.07);
}

.toolbar-label {
  display: inline-block;
  margin-bottom: 7px;
  color: #2563eb;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.3px;
  text-transform: uppercase;
}

.resume-toolbar h1 {
  margin: 0 0 7px;
  color: #0f172a;
  font-size: 27px;
  letter-spacing: -0.5px;
}

.resume-toolbar p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.toolbar-actions {
  display: flex;
  gap: 11px;
  flex-shrink: 0;
}

.primary-action,
.secondary-action {
  min-height: 44px;
  padding: 11px 17px;
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
}

.primary-action {
  color: #ffffff;
  background:
      linear-gradient(
          135deg,
          #2563eb,
          #4f46e5
      );
  border: 0;
}

.secondary-action {
  color: #334155;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
}

.primary-action:disabled,
.secondary-action:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.spinner {
  width: 14px;
  height: 14px;
  margin-right: 7px;
  display: inline-block;
  vertical-align: -2px;
  border:
      2px solid
      rgba(255, 255, 255, 0.45);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.error-message {
  margin-bottom: 20px;
  padding: 13px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #b91c1c;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 11px;
  font-size: 13px;
  font-weight: 700;
}

.loading-state {
  min-height: 350px;
  padding: 50px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1px solid #dbe3ee;
  border-radius: 18px;
  text-align: center;
}

.large-spinner {
  width: 42px;
  height: 42px;
  margin-bottom: 20px;
  border: 4px solid #dbeafe;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-state h2 {
  margin: 0 0 8px;
  font-size: 21px;
}

.loading-state p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.document-scroll {
  width: 100%;
  overflow-x: auto;
  padding: 4px 4px 20px;
}

.resume-document {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  color: #1e293b;
  background: #ffffff;
  box-shadow:
      0 22px 55px
      rgba(15, 23, 42, 0.15);
}

.resume-document.pdf-export {
  box-shadow: none;
}

.resume-header {
  min-height: 53mm;
  padding: 15mm 15mm 12mm;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12mm;
  color: #ffffff;
  background:
      radial-gradient(
          circle at 90% 10%,
          rgba(255, 255, 255, 0.12),
          transparent 25%
      ),
      linear-gradient(
          135deg,
          #0f172a,
          #1e3a8a
      );
}

.identity-section {
  display: flex;
  align-items: center;
  gap: 6mm;
}

.resume-avatar {
  width: 22mm;
  height: 22mm;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #172554;
  background: #ffffff;
  border-radius: 5mm;
  font-size: 24px;
  font-weight: 900;
  letter-spacing: -1px;
}

.identity-content {
  min-width: 0;
}

.resume-label {
  display: inline-block;
  margin-bottom: 2mm;
  color: #93c5fd;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
}

.identity-content h1 {
  margin: 0 0 2mm;
  color: #ffffff;
  font-size: 29px;
  line-height: 1.08;
  letter-spacing: -0.8px;
}

.identity-content p {
  margin: 0;
  color: #dbeafe;
  font-size: 13px;
  font-weight: 700;
}

.header-contact {
  max-width: 58mm;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2.3mm;
  text-align: right;
}

.header-contact a,
.header-contact span {
  max-width: 100%;
  overflow: hidden;
  color: #dbeafe;
  font-size: 9px;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.resume-layout {
  flex: 1;
  display: grid;
  grid-template-columns:
    62mm 1fr;
  align-items: stretch;
}

.resume-sidebar {
  padding: 11mm 8mm;
  background: #f1f5f9;
  border-right: 1px solid #dbe3ee;
}

.resume-main-content {
  padding: 11mm 12mm;
}

.resume-section {
  margin-bottom: 9mm;
  break-inside: avoid;
  page-break-inside: avoid;
}

.resume-section:last-child {
  margin-bottom: 0;
}

.resume-section h2 {
  margin: 0 0 4mm;
  padding-bottom: 2.2mm;
  color: #0f172a;
  border-bottom: 1px solid #cbd5e1;
  font-size: 11px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 3.7mm;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 3mm;
}

.contact-mark {
  width: 7mm;
  height: 7mm;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: #2563eb;
  border-radius: 2mm;
  font-size: 8px;
  font-weight: 900;
}

.contact-item div {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.contact-item small {
  margin-bottom: 1mm;
  color: #64748b;
  font-size: 7px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.contact-item span,
.contact-item a {
  overflow-wrap: anywhere;
  color: #334155;
  font-size: 8.5px;
  line-height: 1.45;
  text-decoration: none;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 2mm;
}

.skill-item {
  padding: 2mm 2.7mm;
  color: #1d4ed8;
  background: #dbeafe;
  border-radius: 2mm;
  font-size: 8px;
  font-weight: 800;
}

.education-item {
  display: flex;
  align-items: flex-start;
  gap: 3mm;
}

.education-mark {
  width: 8mm;
  height: 8mm;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: #0f172a;
  border-radius: 2mm;
  font-size: 8px;
  font-weight: 900;
}

.education-item div {
  display: flex;
  flex-direction: column;
}

.education-item strong {
  color: #1e293b;
  font-size: 9px;
  line-height: 1.45;
}

.education-item div span {
  margin-top: 1mm;
  color: #64748b;
  font-size: 8px;
}

.empty-information {
  margin: 0;
  color: #94a3b8;
  font-size: 8.5px;
  font-style: italic;
  line-height: 1.5;
}

.profile-completion {
  padding: 3mm;
  background: #ffffff;
  border: 1px solid #dbe3ee;
  border-radius: 2.5mm;
}

.completion-heading {
  margin-bottom: 2mm;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2mm;
  color: #475569;
  font-size: 7.5px;
  font-weight: 700;
}

.completion-heading strong {
  color: #2563eb;
}

.completion-track {
  height: 2.2mm;
  overflow: hidden;
  background: #dbeafe;
  border-radius: 999px;
}

.completion-value {
  height: 100%;
  background:
      linear-gradient(
          90deg,
          #2563eb,
          #4f46e5
      );
  border-radius: 999px;
}

.main-section {
  margin-bottom: 10mm;
  break-inside: avoid;
  page-break-inside: avoid;
}

.main-section:last-child {
  margin-bottom: 0;
}

.section-title {
  margin-bottom: 4mm;
  display: flex;
  align-items: center;
  gap: 3mm;
}

.section-title > span {
  width: 8mm;
  height: 8mm;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: #2563eb;
  border-radius: 2mm;
  font-size: 7px;
  font-weight: 900;
}

.section-title h2 {
  margin: 0;
  color: #0f172a;
  font-size: 14px;
  letter-spacing: -0.2px;
}

.professional-summary {
  margin: 0;
  color: #475569;
  font-size: 9.5px;
  line-height: 1.75;
  white-space: pre-line;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 4mm;
}

.project-item {
  padding: 4mm;
  background: #f8fafc;
  border: 1px solid #dbe3ee;
  border-left: 1.2mm solid #2563eb;
  border-radius: 2.5mm;
  break-inside: avoid;
  page-break-inside: avoid;
}

.project-heading {
  margin-bottom: 2.5mm;
  display: flex;
  align-items: flex-start;
  gap: 3mm;
}

.project-mark {
  width: 9mm;
  height: 9mm;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1d4ed8;
  background: #dbeafe;
  border-radius: 2.2mm;
  font-size: 7px;
  font-weight: 900;
}

.project-heading div {
  min-width: 0;
}

.project-heading h3 {
  margin: 0 0 1mm;
  color: #0f172a;
  font-size: 10.5px;
}

.project-heading a {
  color: #2563eb;
  font-size: 7.5px;
  font-weight: 700;
  text-decoration: none;
}

.project-item > p {
  margin: 0;
  color: #64748b;
  font-size: 8.5px;
  line-height: 1.65;
  white-space: pre-line;
}

.certificates-list {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 3.2mm;
}

.certificate-item {
  padding: 3.5mm;
  display: flex;
  align-items: flex-start;
  gap: 3mm;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 2.5mm;
  break-inside: avoid;
  page-break-inside: avoid;
}

.certificate-mark {
  width: 8mm;
  height: 8mm;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: #d97706;
  border-radius: 2mm;
  font-size: 7px;
  font-weight: 900;
}

.certificate-item h3 {
  margin: 0 0 1.2mm;
  color: #78350f;
  font-size: 9px;
  line-height: 1.35;
}

.certificate-item p {
  margin: 0;
  color: #92400e;
  font-size: 7.5px;
  line-height: 1.45;
}

.empty-main-information {
  margin: 0;
  padding: 4mm;
  color: #94a3b8;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 2.5mm;
  font-size: 8.5px;
  font-style: italic;
}

.resume-footer {
  min-height: 13mm;
  margin-top: auto;
  padding: 3.5mm 12mm;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5mm;
  color: #94a3b8;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  font-size: 7.5px;
  font-weight: 700;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 850px) {
  .resume-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .toolbar-actions {
    width: 100%;
  }

  .primary-action,
  .secondary-action {
    flex: 1;
  }
}

@media (max-width: 520px) {
  .resume-page {
    padding: 24px 10px 45px;
  }

  .toolbar-actions {
    flex-direction: column;
  }

  .primary-action,
  .secondary-action {
    width: 100%;
  }
}

@media print {
  :global(@page) {
    size: A4 portrait;
    margin: 0;
  }

  :global(html),
  :global(body) {
    margin: 0;
    padding: 0;
    background: #ffffff;
  }

  .no-print {
    display: none !important;
  }

  .resume-page {
    min-height: auto;
    padding: 0;
    background: #ffffff;
  }

  .resume-page-container {
    max-width: none;
  }

  .document-scroll {
    overflow: visible;
    padding: 0;
  }

  .resume-document {
    width: 210mm;
    min-height: 297mm;
    margin: 0;
    box-shadow: none;
  }

  .project-item,
  .certificate-item,
  .main-section,
  .resume-section {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
</style>