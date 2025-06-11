// lib/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // All your API calls will start from /api
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
