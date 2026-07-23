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

<style scoped>
body{
  background:#f8fafc;
}

.hero{
  max-width:1100px;
  margin:60px auto;
  padding:90px 40px;
  text-align:center;
  border-radius:25px;
  background:linear-gradient(135deg,#1d4ed8,#3b82f6);
  color:white;
  box-shadow:0 20px 40px rgba(222, 230, 231, 0.25);
}

.hero h1{
  font-size:64px;
  margin-bottom:15px;
  color:#fff;
}

.hero h2{
  font-size:30px;
  color:#dbeafe;
  margin-bottom:25px;
}

.hero p{
  font-size:20px;
  color:#eff6ff;
  max-width:700px;
  margin:0 auto 35px;
  line-height:1.8;
}

.hero button{
 background: #2563eb;
  color:white;
  border:none;
  padding:16px 38px;
  border-radius:12px;
  font-size:17px;
  font-weight:bold;
  cursor:pointer;
  transition:.3s;
}

.hero button:hover{
  background: #1d4ed8;
  transform:translateY(-2px);
}

.features{
  max-width:1200px;
  margin:50px auto;
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:25px;
  padding:0 20px 40px;
}

.feature-card{
  background:white;
  border-radius:18px;
  padding:35px 25px;
  text-align:center;
  box-shadow:0 10px 25px rgba(0,0,0,.08);
  transition:.3s;
}

.feature-card:hover{
  transform:translateY(-8px);
}

.feature-card h3{
  color:#2563eb;
  margin-bottom:15px;
  font-size:24px;
}

.feature-card p{
  color:#64748b;
  line-height:1.6;
}

@media(max-width:768px){

  .hero{
    margin:30px 15px;
    padding:60px 20px;
  }

  .hero h1{
    font-size:42px;
  }

  .hero h2{
    font-size:24px;
  }

  .hero p{
    font-size:17px;
  }
}
</style>