<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Navbar from "../components/Navbar.vue/Navbar.vue";
import api from "../services/api";

const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");

async function register() {
  if (!name.value || !email.value || !password.value) {
    alert("Please fill all fields");
    return;
  }

  try {
    const response = await api.post("/register", {
      name: name.value,
      email: email.value,
      password: password.value,
    });

    alert(response.data.message);

    name.value = "";
    email.value = "";
    password.value = "";

    router.push("/login");
  } catch (error) {
    if (error.response) {
      alert(error.response.data.message);
    } else {
      alert("Server Error");
      console.log(error);
    }
  }
}
</script>

<template>
  <Navbar />

  <div class="register-container">
    <div class="register-card">
      <h1>Create Account</h1>

      <input
        v-model="name"
        type="text"
        placeholder="Full Name"
      />

      <input
        v-model="email"
        type="email"
        placeholder="Email"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
      />

      <button @click="register">
        Register
      </button>
    </div>
  </div>
</template>

<style scoped>
.register-container{
  display:flex;
  justify-content:center;
  margin-top:80px;
}

.register-card{
  width:420px;
  background:white;
  padding:40px;
  border-radius:20px;
  box-shadow:0 0 20px #ddd;
}

.register-card h1{
  text-align:center;
  margin-bottom:25px;
}

.register-card input{
  width:100%;
  padding:12px;
  margin-bottom:15px;
  border:1px solid #ddd;
  border-radius:10px;
  box-sizing:border-box;
}

.register-card button{
  width:100%;
  padding:12px;
  background:#2563eb;
  color:white;
  border:none;
  border-radius:10px;
  font-size:16px;
  cursor:pointer;
  transition:.3s;
}

.register-card button:hover{
  background:#1d4ed8;
  transform:scale(1.03);
}

.register-card button:active{
  transform:scale(.96);
}
</style>