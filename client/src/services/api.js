// frontend/src/utils/api.js

import axios from 'axios';

// This could be loaded from your environment variables or backend
const NGROK_URL = 'https://4aba-103-104-226-58.ngrok-free.app';

// Create an axios instance with the ngrok URL as the base URL
const api = axios.create({
  baseURL: NGROK_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// File upload instance with different headers
const fileApi = axios.create({
  baseURL: NGROK_URL,
  timeout: 60000, // 60 seconds for file uploads
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const uploadResumeFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fileApi.post('/upload', formData, {
    responseType: 'blob',
  });
  
  return response.data;
};

export const getSkillsData = async () => {
  const response = await api.get('/get_skills_data');
  return response.data;
};

export const getResumeData = async () => {
  const response = await api.get('/get_resume_data');
  return response.data;
};

export const sendResumeData = async (resumeData) => {
  const response = await api.post('/generate-resume', resumeData);
  return response.data;
};

export default {
  uploadResumeFile,
  getSkillsData,
  getResumeData,
  sendResumeData,
};