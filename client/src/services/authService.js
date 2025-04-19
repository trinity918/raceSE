// src/services/authService.js
import api from './api';
import { jwtDecode } from 'jwt-decode'; // Changed from import jwt_decode from 'jwt-decode';

export const authService = {
  async login(identifier, password) {
    const response = await api.post('/auth/local', { identifier, password });
    if (response.data.jwt) {
      localStorage.setItem('token', response.data.jwt);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(username, email, password) {
    const response = await api.post('/auth/local/register', { username, email, password });
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isTokenValid() {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token); // Changed from jwt_decode(token);
      return decoded.exp > Date.now() / 1000;
    } catch (error) {
      return false;
    }
  }
};