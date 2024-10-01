

// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8080/api/v1',
//   withCredentials: true,
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
//     if (token) {
//       console.log(document.cookie);

//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export const makeAuthenticatedRequest = async (url, method = 'GET', data = null) => {
//   try {
//     const config = {
//       method,
//       url,
//       data,
//     };

//     const response = await api(config);
//     return response.data;
//   } catch (error) {
//     console.error('Request failed:', error.message);
//     if (error.response && error.response.status === 401) {
//       // Redirect to login page on unauthorized access
//       window.location.href = '/login';
//     }
//     throw error;
//   }
// };