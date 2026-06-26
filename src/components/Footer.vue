<script setup>
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <h2>CareerBridge</h2>

      <p>
        Helping students build their professional careers.
      </p>

      <div class="links">
        <a
          href="https://github.com/Raniaelsayed12/CareerBridge"
          target="_blank"
        >
          GitHub
        </a>

        <a
          href="https://www.linkedin.com/"
          target="_blank"
        >
          LinkedIn
        </a>

        <a href="mailto:example@email.com">
          Contact
        </a>
      </div>

      <p class="copy">
        © 2026 CareerBridge. All Rights Reserved.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: 60px;
  background: #2563eb;
  color: white;
  padding: 35px 20px;
  text-align: center;
}

.footer-content h2 {
  margin-bottom: 10px;
}

.footer-content p {
  margin: 8px 0;
}

.links {
  margin: 20px 0;
}

.links a {
  color: white;
  text-decoration: none;
  margin: 0 15px;
  font-weight: bold;
}

.links a:hover {
  text-decoration: underline;
}

.copy {
  margin-top: 20px;
  opacity: .8;
}
</style>