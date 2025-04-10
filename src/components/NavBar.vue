<template>
  <nav class="navbar">
    <div class="nav-left">
      <router-link to="/" class="logo">VideoAI</router-link>
      <template v-if="authStore.isAuthenticated">
        <router-link to="/images">Immagini</router-link>
        <router-link to="/videos" class="beta-link">Video <span class="beta-tag">BETA</span></router-link>
        <router-link to="/api-status" class="api-status-link">Stato API</router-link>
      </template>
    </div>
    <div class="nav-right">
      <template v-if="!authStore.isAuthenticated">
        <router-link to="/login" class="login-btn">Login</router-link>
      </template>
      <template v-else>
        <div class="user-menu">
          <span class="user-name">Utente</span>
          <button @click="logout" class="logout-btn">Logout</button>
        </div>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  background-color: #333;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.logo {
  font-weight: bold;
  font-size: 1.25rem;
  color: var(--primary-light) !important;
}

/* Stile comune per link e pulsanti */
.navbar a,
.navbar button {
  color: #fff;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s;
}

.navbar a:hover,
.navbar button:hover {
  color: var(--primary-light);
}

/* Indicatore link attivo */
.router-link-active:not(.logo):after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary-light);
}

/* Stile per il tag beta */
.beta-link {
  position: relative;
}

.beta-tag {
  position: absolute;
  top: -8px;
  right: -15px;
  background-color: var(--warning);
  color: white;
  font-size: 0.6rem;
  padding: 2px 4px;
  border-radius: 4px;
  font-weight: bold;
}

/* Stile per login e user menu */
.login-btn {
  background-color: var(--primary);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  transition: background-color 0.3s;
}

.login-btn:hover {
  background-color: var(--primary-dark);
  color: white;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-name {
  color: var(--gray-300);
  font-size: 0.9rem;
}

.logout-btn {
  color: var(--gray-300);
  transition: color 0.3s;
}

.logout-btn:hover {
  color: var(--danger);
}

.api-status-link {
  display: flex;
  align-items: center;
}

.api-status-link:before {
  content: '•';
  display: inline-block;
  color: var(--success);
  margin-right: 4px;
  font-size: 1.2rem;
}

/* Responsive styles */
@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }
  
  .nav-left, .nav-right {
    gap: 1rem;
  }
  
  .user-name {
    display: none;
  }
}
</style>