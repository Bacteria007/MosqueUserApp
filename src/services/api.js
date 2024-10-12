import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseURL} from './constants';
import Toast from 'react-native-toast-message'; // Ensure Toast is imported

const api = axios.create({
  baseURL: `${baseURL}`,
});

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Generalized API Service function
export default async function ApiService({
  method = 'GET',
  url = '',
  data = {},
  params = {},
  headers = {
    'Content-Type': 'application/json',
  },
}) {
  console.log('API Service Call', {method, url, data, params, headers});
  const options = {
    method,
    url,
    data,
    params,
    headers,
  };

  try {
    const response = await api(options);
    console.log('API Response:', response.data);
    if (response.data.status) {
      return response.data;
    } else {
      // Show toast for API-specific error messages
      Toast.show({
        type: 'error',
        text1: response.data.message || 'Something went wrong!',
      });
    }
  } catch (error) {
    console.error(
      'API Error:',
      error.response ? error.response.data : error.message,
    );
    // Show toast for network errors
    Toast.show({
      type: 'error',
      // text1: 'Network Error',
      text1: error.response
        ? error.response.data.message
        : 'Unable to connect to the server.',
    });
    throw error.response ? error.response.data : new Error(error.message);
  }
}
