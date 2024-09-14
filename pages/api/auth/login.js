// // pages/api/auth/login.js
// import axios from 'axios';
// import cookie from 'cookie';

// export default async function loginHandler(req, res) {
//   if (req.method === 'POST') {
//     const { email, password } = req.body;

//     try {
//       const response = await axios.post('http://localhost:8080/api/auth/login', {
//         email,
//         password,
//       });

//       const { token } = response.data;

//       // Set the JWT as an HttpOnly cookie
//       res.setHeader('Set-Cookie', cookie.serialize('token', token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV !== 'development',
//         maxAge: 60 * 60 * 24, // 1 day
//         sameSite: 'strict',
//         path: '/',
//       }));

//       return res.status(200).json({ message: 'Login successful' });
//     } catch (error) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
import axios from 'axios';
import cookie from 'cookie';

export default async function loginHandler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/authenticate', {
        email,
        password,
      });

      const { accessToken, user } = response.data;

      res.setHeader('Set-Cookie', cookie.serialize('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: 'strict',
        path: '/',
      }));

      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      res.status(401).json({ message: error.response?.data?.message || 'Invalid email or password' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}