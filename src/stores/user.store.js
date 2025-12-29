import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    avatarUrl: (state) =>
      state.user?.fotoPerfil
        ? `http://localhost:3000${state.user.fotoPerfil}`
        : '/avatar-default.png'
  },

  actions: {
    async fetchUser() {
      const token = localStorage.getItem('token');

      const { data } = await axios.get(
        'http://localhost:3000/api/user/me',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      this.user = data;
    },

    clearUser() {
      this.user = null;
      localStorage.removeItem('token');
    }
  }
});
