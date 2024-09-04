// pages/dashboard.js
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        setUserData(response.data);
      } catch (error) {
        router.push('/login');
      }
    };

    fetchUserData();
  }, [router]);

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Welcome, {userData.name}</h2>
      <p>Email: {userData.email}</p>
      <button onClick={() => {
        axios.post('/api/auth/logout').then(() => router.push('/login'));
      }}>Logout</button>
    </div>
  );
}
