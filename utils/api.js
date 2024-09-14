import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  withCredentials: true,
});

export const makeAuthenticatedRequest = async (url, method = 'GET', data = null) => {
  try {
    const config = {
      method,
      url,
      data,
    };

    // Log the headers being sent
    console.log('Request headers:', api.defaults.headers);

    const response = await api(config);
    return response.data;
  } catch (error) {
    console.error('Request failed:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Status code:', error.response.status);
    }
    throw error;
  }
};