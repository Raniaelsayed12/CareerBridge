<script setup>
import Navbar from "../components/Navbar.vue/Navbar.vue";
</script>

<template>
  <Navbar />

  <div class="about-container">

    <h1>About CareerBridge</h1>

    <p class="intro">
      CareerBridge is a web application that helps students build and manage
      their professional portfolio in one place.
    </p>

    <div class="cards">

      <div class="card">
        <h2>Our Mission</h2>

        <p>
          Help students organize their skills, projects, and certificates
          to create a professional profile for internships and jobs.
        </p>
      </div>

      <div class="card">
        <h2>Main Features</h2>

        <ul>
          <li>Manage Skills</li>
          <li>Manage Projects</li>
          <li>Manage Certificates</li>
          <li>Personal Dashboard</li>
          <li>User Profile</li>
        </ul>
      </div>

      <div class="card">
        <h2>Technologies</h2>

        <ul>
          <li>Vue 3</li>
          <li>Vue Router</li>
          <li>Pinia</li>
          <li>Axios</li>
          <li>Node.js</li>
          <li>Express.js</li>
          <li>MongoDB Atlas</li>
        </ul>
      </div>

    </div>

  </div>
</template>

<style scoped>

.about-container{
  max-width:1100px;
  margin:60px auto;
  padding:20px;
  text-align:center;
}

.about-container h1{
  color:#2563eb;
  margin-bottom:20px;
}

.intro{
  max-width:800px;
  margin:auto;
  font-size:18px;
  line-height:1.8;
  color:#555;
}

.cards{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:25px;
  margin-top:50px;
}

.card{
  background:white;
  padding:30px;
  border-radius:18px;
  box-shadow:0 10px 20px rgba(0,0,0,.08);
  transition:.3s;
}

.card:hover{
  transform:translateY(-8px);
}

.card h2{
  color:#2563eb;
  margin-bottom:15px;
}

.card p{
  line-height:1.8;
}

.card ul{
  list-style:none;
  padding:0;
}

.card li{
  margin:10px 0;
}

</style>