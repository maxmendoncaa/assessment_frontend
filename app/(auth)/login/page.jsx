'use client';

import axiosInstance from '@/utils/axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Button, Form } from 'react-bootstrap';


const page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // const router = useRouter(); // Use router for redirection

  useEffect(()=>{
    if(Cookies.get('role')==='ADMIN')
      {
        window.location.href = "/admin" 
      }
  },[])
  const handleSubmit =  (e) => {
    e.preventDefault();
   // setError(''); // Reset error state

       axiosInstance.post('api/v1/auth/authenticate', {
          email,
          password,
        }).then((data)=>{
          console.log(data)
          Cookies.set('token',data.data.access_token)
          Cookies.set('email',data.data.user.email)
          Cookies.set('userId',data.data.user.userId)
          Cookies.set('role',data.data.user.role)
          
        }).then(()=>{
          // redirect("/dashboard")
          
          window.location.href="/dashboard"
        }).catch((err)=>{
          setError(err.message);
        })
    // try {
    //   // Make the API request to the backend directly from the client-side
    //   const response = await axios.post('http://localhost:8080/api/v1/auth/authenticate', {
    //     email,
    //     password,
    //   }).then((data)=>{console.log(data)})

    //   const { accessToken, user } = response.data;

    //   // Store the JWT in cookies manually
    //  // document.cookie = `token=${accessToken}; path=/; max-age=${60 * 60 * 24}; secure; samesite=Lax;`;


    //   // Redirect to dashboard upon success
    //   router.push('/dashboard');
    // } catch (error) {
    //   setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    // }
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '50px' }}>
      <img 
        src="/astonlogo.png" 
        alt="Aston University Login" 
        style={{ 
          width: '400px',  // Adjust width as needed
          marginBottom: '0px',
          objectFit: 'contain',
          scale:'110%'
        }} 
      /><br></br>
      <Form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '300px' }}>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ width: '100%', padding: '10px', marginBottom: '15px', textAlign: 'center' }}
        />
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{ width: '100%', padding: '10px', marginBottom: '15px', textAlign: 'center' }}
        />
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <Button type="submit" style={{ padding: '10px 20px' }}>Login</Button>
      </Form>
    </div>
  );
};

export default page;
