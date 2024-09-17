// pages/api/auth/me.js
import axios from 'axios';
import cookie from 'cookie';

export default async function meHandler(req, res) {
  const { token } = cookie.parse(req.headers.cookie || '');

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const response = await axios.get('http://localhost:8080/api/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
