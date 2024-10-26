import Cookies from 'js-cookie';

export const signOut = () => {
  // Clear all cookies
  Cookies.remove('token');
  Cookies.remove('email');
  Cookies.remove('userId');
  Cookies.remove('name');


  // Redirect to login page
  window.location.href = '/login';
}