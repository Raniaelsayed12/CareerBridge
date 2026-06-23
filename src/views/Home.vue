<script setup>
import Navbar from "../components/Navbar.vue/Navbar.vue";
</script>

<template>
  <Navbar />

  <section class="hero">
    <h1>CareerBridge</h1>

    <h2>Build Your Career Path</h2>

    <p>
      A platform that helps students organize
      their skills, projects and certificates.
    </p>

    <router-link to="/register">
      <button>Start Now</button>
    </router-link>
  </section>

  <section class="features">
    <div class="feature-card">
      <h3>Skills</h3>
      <p>Manage your technical skills.</p>
    </div>

    <div class="feature-card">
      <h3>Projects</h3>
      <p>Showcase your best projects.</p>
    </div>

    <div class="feature-card">
      <h3>Certificates</h3>
      <p>Store all your certificates in one place.</p>
    </div>
  </section>
</template>

<style>
.hero {
  text-align: center;
  margin-top: 100px;
}

.hero h1 {
  font-size: 60px;
  color: #1e293b;
}

.hero h2 {
  color: #2563eb;
  margin-top: 10px;
}

.hero p {
  font-size: 20px;
  margin: 20px;
}

.hero button {
  padding: 15px 30px;
  border: none;
  background: #2563eb;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
}

.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 40px;
}

.feature-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 0 15px #ddd;
  text-align: center;
}

.feature-card h3 {
  color: #2563eb;
  margin-bottom: 10px;
}
</style>