// pages/api/auth/logout.js
import cookie from 'cookie';

export default function logoutHandler(req, res) {
  if (req.method === 'POST') {
    res.setHeader('Set-Cookie', cookie.serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: -1,
      sameSite: 'strict',
      path: '/',
    }));

    return res.status(200).json({ message: 'Logout successful' });
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
