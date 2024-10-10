import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseURL } from './constants';

// Create a base API instance with interceptor
const api = axios.create({
  baseURL: `${baseURL}`, // Replace with your backend API URL
});

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Generalized API Service function
export default async function ApiService({ method = 'GET', url = '', data = {}, params = {}, headers = {
  'Content-Type': 'application/json'
} }) {
  console.log('API Service Call', { method, url, data, params, headers });

  try {
    // Set up request options
    const options = {
      method,
      url,
      data,
      params,
      headers
    };

    // Make API call
    const response = await api(options);
    // console.log('API Response:', response.data);
    if(response.data.status){
      return response.data;
    }
    else{
      return response.data.message;
    }
  } catch (error) {
    console.error('API Error:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error(error.message); // Propagate the error
  }
}
