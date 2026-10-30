import axios from 'axios';
import { getToken } from '../utils/storage';

const axiosInstance = axios.create({
  baseURL: 'http://IP_LOKAL:5000/api', 
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;