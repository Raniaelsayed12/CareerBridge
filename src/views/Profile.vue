<script setup>
import Navbar from "../components/Navbar.vue/Navbar.vue";
import { useUserStore } from "../stores/userStore";

const user = useUserStore();
</script>

<template>
  <Navbar />

  <div class="profile-container">
    <div class="profile-card">

      <img
        src="https://i.pravatar.cc/200"
        alt="Profile"
        class="profile-image"
      />

      <h1>{{ user.name }}</h1>

      <h3>{{ user.role }}</h3>

      <div class="info">

        <div class="item">
          <span>Name</span>
          <p>{{ user.name }}</p>
        </div>

        <div class="item">
          <span>Email</span>
          <p>{{ user.email }}</p>
        </div>

        <div class="item">
          <span>City</span>
          <p>{{ user.city }}</p>
        </div>

        <div class="item">
          <span>University</span>
          <p>Faculty of Computers & AI</p>
        </div>

        <div class="item">
          <span>Role</span>
          <p>{{ user.role }}</p>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>

.profile-container{
  display:flex;
  justify-content:center;
  padding:50px 20px;
}

.profile-card{
  width:100%;
  max-width:700px;
  background:#fff;
  border-radius:20px;
  padding:40px;
  box-shadow:0 10px 25px rgba(0,0,0,.1);
  text-align:center;
}

.profile-image{
  width:170px;
  height:170px;
  border-radius:50%;
  object-fit:cover;
  border:5px solid #2563eb;
  margin-bottom:20px;
}

.profile-card h1{
  margin:10px 0;
}

.profile-card h3{
  color:#2563eb;
  margin-bottom:30px;
}

.info{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:20px;
}

.item{
  background:#f8f9fb;
  border-radius:15px;
  padding:20px;
}

.item span{
  display:block;
  color:#2563eb;
  font-weight:bold;
  margin-bottom:8px;
}

.item p{
  margin:0;
  color:#444;
}

@media(max-width:700px){

.info{
grid-template-columns:1fr;
}

.profile-card{
padding:25px;
}

.profile-image{
width:140px;
height:140px;
}

}

</style>