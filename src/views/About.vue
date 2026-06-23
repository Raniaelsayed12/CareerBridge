<script setup>
import Navbar from "../components/Navbar.vue/Navbar.vue";
</script>

<template>
  <Navbar />

  <div class="about">
    <h1>About CareerBridge</h1>

    <p>
      CareerBridge is a platform designed to help
      students organize their skills, projects and
      certificates in one place.
    </p>

    <p>
      Our mission is to support students in building
      a strong professional profile and preparing
      for their future careers.
    </p>
  </div>
</template>

<style>
.about {
  max-width: 800px;
  margin: 80px auto;
  text-align: center;
}

.about h1 {
  color: #2563eb;
  margin-bottom: 20px;
}

.about p {
  font-size: 20px;
  line-height: 1.8;
}
</style>