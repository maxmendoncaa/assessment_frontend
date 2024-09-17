// "use client"
// import { redirect } from 'next/navigation';
// import { useState } from 'react';

// const title = () => {
//   const showText = true;

//   return (
//     <div style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px' }}>
//       {showText ? <p><b>Login</b></p> : null}
//     </div>
//   );
// };

// export default function page() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
 

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
    
//     try {
//       const response = await fetch('../api/auth/login.js', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       if (response.ok) {
//         redirect('/dashboard'); // Redirect to dashboard on success
//       } else {
//         const data = await response.json();
//         setError(data.message || 'Login failed');
//       }
//     } catch (err) {
//       setError('An error occurred. Please try again.');
//     }
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '50px' }}>
//       {title()}
//       <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '300px' }}>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           required
//           style={{ width: '100%', padding: '10px', marginBottom: '15px', textAlign: 'center' }}
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           required
//           style={{ width: '100%', padding: '10px', marginBottom: '15px', textAlign: 'center' }}
//         />
//         {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
//         <button type="submit" style={{ padding: '10px 20px' }}>Login</button>
//       </form>
//     </div>
//   );
// }
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // Use router for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state

    try {
      // Make the API request to the backend directly from the client-side
      const response = await axios.post('http://localhost:8080/api/v1/auth/authenticate', {
        email,
        password,
      });

      const { accessToken, user } = response.data;

      // Store the JWT in cookies manually
      document.cookie = `token=${accessToken}; path=/; max-age=${60 * 60 * 24}; secure; samesite=strict;`;

      // Redirect to dashboard upon success
      router.push('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '50px' }}>
      <h2 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px' }}><b>Login</b></h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '300px' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ width: '100%', padding: '10px', marginBottom: '15px', textAlign: 'center' }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{ width: '100%', padding: '10px', marginBottom: '15px', textAlign: 'center' }}
        />
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <button type="submit" style={{ padding: '10px 20px' }}>Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
