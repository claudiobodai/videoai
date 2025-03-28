<template>
    <nav class="navbar">
      <div class="nav-left">
        <router-link to="/">Home</router-link>
        <template v-if="authStore.isAuthenticated">
          <router-link to="/images">Immagini</router-link>
          <router-link to="/videos">Video</router-link>
        </template>
      </div>
      <div class="nav-right">
        <template v-if="!authStore.isAuthenticated">
          <router-link to="/login">Login</router-link>
        </template>
        <template v-else>
          <button @click="logout">Logout</button>
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
    padding: 1rem;
    display: flex;
    justify-content: space-between; /* Spinge le due sezioni agli estremi */
    align-items: center;
  }
  
  .nav-left,
  .nav-right {
    display: flex;
    align-items: center;
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
    padding: 0.5rem 1rem;
  }
  </style>
  