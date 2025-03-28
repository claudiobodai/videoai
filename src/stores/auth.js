import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('user-token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    login(token) {
      this.token = token
      localStorage.setItem('user-token', token)
    },
    logout() {
      this.token = null
      localStorage.removeItem('user-token')
    },
  },
})
