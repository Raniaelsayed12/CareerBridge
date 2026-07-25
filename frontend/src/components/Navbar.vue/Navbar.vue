<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/userStore";

const router = useRouter();
const userStore = useUserStore();

const menuOpen = ref(false);

const isAuthenticated = computed(() => userStore.loggedIn);

const adminEmails = [
  "haniaalilat24@gmail.com",
];

const isAdmin = computed(() => {
  return (
    isAuthenticated.value &&
    adminEmails.includes((userStore.email || "").toLowerCase().trim())
  );
});

const displayName = computed(() => {
  return userStore.name || "User";
});

const initials = computed(() => {
  return userStore.name ? userStore.name.charAt(0).toUpperCase() : "U";
});

function closeMenu() {
  menuOpen.value = false;
}

function handleLogout() {
  userStore.logout();
  menuOpen.value = false;
  router.push("/login");
}
</script>

<template>
  <header class="navbar">
    <div class="navbar-container">
      <RouterLink to="/" class="brand" @click="closeMenu">
        <span class="brand-icon">CB</span>

        <span class="brand-text">
          CareerBridge
        </span>
      </RouterLink>

      <button
        class="menu-button"
        type="button"
        :aria-expanded="menuOpen"
        aria-label="Open navigation menu"
        @click="menuOpen = !menuOpen"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav :class="['navigation', { open: menuOpen }]">
        <div class="navigation-links">
          <RouterLink to="/" class="navigation-link" @click="closeMenu">
            Home
          </RouterLink>

          <RouterLink
            v-if="isAuthenticated"
            to="/dashboard"
            class="navigation-link"
            @click="closeMenu"
          >
            Dashboard
          </RouterLink>

          <RouterLink
            v-if="isAuthenticated"
            to="/skills"
            class="navigation-link"
            @click="closeMenu"
          >
            Skills
          </RouterLink>

          <RouterLink
            v-if="isAuthenticated"
            to="/projects"
            class="navigation-link"
            @click="closeMenu"
          >
            Projects
          </RouterLink>

          <RouterLink
            v-if="isAuthenticated"
            to="/certificates"
            class="navigation-link"
            @click="closeMenu"
          >
            Certificates
          </RouterLink>

          <RouterLink
            v-if="isAuthenticated"
            to="/resume"
            class="navigation-link"
            @click="closeMenu"
          >
            Resume
          </RouterLink>

          <RouterLink to="/about" class="navigation-link" @click="closeMenu">
            About
          </RouterLink>

          <RouterLink
            v-if="isAdmin"
            to="/admin"
            class="navigation-link"
            @click="closeMenu"
          >
            Admin
          </RouterLink>
        </div>

        <div v-if="!isAuthenticated" class="guest-actions">
          <RouterLink to="/login" class="login-link" @click="closeMenu">
            Sign in
          </RouterLink>

          <RouterLink to="/register" class="register-button" @click="closeMenu">
            Create account
          </RouterLink>
        </div>

        <div v-else class="user-actions">
          <RouterLink to="/profile" class="user-profile" @click="closeMenu">
            <span class="user-avatar">
              {{ initials }}
            </span>

            <span class="user-details">
              <span class="user-label">
                Signed in as
              </span>

              <span class="user-name">
                {{ displayName }}
              </span>
            </span>
          </RouterLink>

          <button class="logout-button" type="button" @click="handleLogout">
            Logout
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  background: rgba(15, 23, 42, 0.96);
  border-bottom: 1px solid rgba(148, 163, 184, 0.14);
  backdrop-filter: blur(18px);
  font-family:
    Inter,
    Arial,
    sans-serif;
}

.navbar-container {
  width: 100%;
  max-width: 1440px;
  min-height: 72px;
  margin: 0 auto;
  padding: 0 32px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #ffffff;
  text-decoration: none;
  flex-shrink: 0;
}

.brand-icon {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  border-radius: 11px;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.28);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.7px;
}

.brand-text {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.navigation {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 28px;
  flex: 1;
}

.navigation-links {
  display: flex;
  align-items: center;
  gap: 6px;
}

.navigation-link {
  position: relative;
  padding: 10px 11px;
  color: #cbd5e1;
  border-radius: 9px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition:
    color 0.2s ease,
    background 0.2s ease;
}

.navigation-link:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

.navigation-link.router-link-active {
  color: #ffffff;
  background: rgba(59, 130, 246, 0.16);
}

.guest-actions,
.user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.login-link {
  padding: 10px 14px;
  color: #e2e8f0;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
}

.login-link:hover {
  color: #ffffff;
}

.register-button {
  padding: 11px 17px;
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  border-radius: 10px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.22);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.register-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 22px rgba(37, 99, 235, 0.3);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px 6px 6px;
  color: #ffffff;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 12px;
  text-decoration: none;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.user-profile:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(148, 163, 184, 0.35);
}

.user-avatar {
  width: 35px;
  height: 35px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  border-radius: 10px;
  font-size: 13px;
  font-weight: 800;
}

.user-details {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-label {
  color: #94a3b8;
  font-size: 10px;
  font-weight: 500;
}

.user-name {
  max-width: 120px;
  overflow: hidden;
  color: #f8fafc;
  font-size: 13px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logout-button {
  padding: 10px 14px;
  color: #fecaca;
  background: transparent;
  border: 1px solid rgba(248, 113, 113, 0.35);
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.logout-button:hover {
  color: #ffffff;
  background: #dc2626;
  border-color: #dc2626;
}

.menu-button {
  display: none;
  width: 42px;
  height: 42px;
  padding: 9px;
  background: transparent;
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 10px;
  cursor: pointer;
}

.menu-button span {
  display: block;
  width: 100%;
  height: 2px;
  margin: 5px 0;
  background: #ffffff;
  border-radius: 10px;
}

@media (max-width: 1100px) {
  .navbar-container {
    padding: 0 20px;
  }

  .navigation {
    gap: 14px;
  }

  .navigation-link {
    padding: 9px 7px;
    font-size: 13px;
  }

  .user-label {
    display: none;
  }
}

@media (max-width: 900px) {
  .navbar-container {
    min-height: 68px;
    flex-wrap: wrap;
  }

  .menu-button {
    display: block;
  }

  .navigation {
    position: absolute;
    top: 68px;
    left: 0;
    right: 0;
    max-height: 0;
    padding: 0 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 18px;
    background: #0f172a;
    border-bottom: 1px solid rgba(148, 163, 184, 0.18);
    opacity: 0;
    visibility: hidden;
    transition:
      max-height 0.3s ease,
      padding 0.3s ease,
      opacity 0.2s ease;
  }

  .navigation.open {
    max-height: 650px;
    padding-top: 20px;
    padding-bottom: 24px;
    opacity: 1;
    visibility: visible;
  }

  .navigation-links {
    flex-direction: column;
    align-items: stretch;
  }

  .navigation-link {
    width: 100%;
    box-sizing: border-box;
    padding: 12px 14px;
  }

  .guest-actions,
  .user-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .login-link,
  .register-button,
  .logout-button {
    width: 100%;
    box-sizing: border-box;
    text-align: center;
  }

  .user-profile {
    width: 100%;
    box-sizing: border-box;
  }
}

@media (max-width: 480px) {
  .navbar-container {
    padding: 0 14px;
  }

  .brand-text {
    font-size: 18px;
  }

  .brand-icon {
    width: 35px;
    height: 35px;
  }
}
</style>