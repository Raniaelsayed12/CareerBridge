<template>
  <main class="about-page">
    <section class="about-hero">
      <div>
        <p class="eyebrow">ABOUT CAREERBRIDGE</p>
        <h1>Build a stronger professional profile</h1>
        <p>
          CareerBridge is a digital portfolio platform that helps students and
          young professionals organize their skills, projects, certificates and
          career information in one structured workspace.
        </p>
      </div>

      <div class="about-card">
        <div class="logo-box">CB</div>
        <h2>Professional profile</h2>
        <p>Skills, projects and achievements in one place.</p>
      </div>
    </section>

    <section class="about-grid">
      <article>
        <h3>For Students</h3>
        <p>Students can document their skills, projects and certificates.</p>
      </article>

      <article>
        <h3>For Career Preparation</h3>
        <p>The resume page helps prepare a structured career overview.</p>
      </article>

      <article>
        <h3>For Admins</h3>
        <p>The admin panel manages users and their related data.</p>
      </article>
    </section>
  </main>
</template>

<style scoped>
.about-page {
  min-height: 100vh;
  background: #f4f7fb;
  color: #0f172a;
}

.about-hero {
  margin: 3rem 7%;
  padding: 4rem;
  border-radius: 30px;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 3rem;
  align-items: center;
  color: white;
  background: linear-gradient(135deg, #14264f, #3447f5);
}

.eyebrow {
  margin: 0;
  color: #dbeafe;
  letter-spacing: 0.3em;
  font-weight: 900;
}

.about-hero h1 {
  font-size: clamp(2.6rem, 6vw, 5rem);
  line-height: 1;
  margin: 1rem 0;
}

.about-hero p {
  line-height: 1.8;
  font-size: 1.1rem;
}

.about-card {
  padding: 2rem;
  border-radius: 24px;
  background: white;
  color: #0f172a;
}

.logo-box {
  width: 58px;
  height: 58px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: #3b4df5;
  color: white;
  font-weight: 900;
}

.about-grid {
  padding: 0 7% 5rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
}

.about-grid article {
  padding: 2rem;
  border-radius: 24px;
  background: white;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.about-grid p {
  color: #64748b;
  line-height: 1.6;
}

@media (max-width: 900px) {
  .about-hero,
  .about-grid {
    grid-template-columns: 1fr;
  }
}
</style>
