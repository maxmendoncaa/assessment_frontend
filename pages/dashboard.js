import React, { useEffect, useState } from 'react';
import { makeAuthenticatedRequest } from '../utils/api';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log("ggs")
        
        // Fetch user-specific data
      //   const userDataResponse = await makeAuthenticatedRequest('/user');
      //   console.log('User data response:', userDataResponse);
      //   setUserData(userDataResponse);
        
      //   // Fetch user-specific assessments
      //   const assessmentsResponse = await makeAuthenticatedRequest('/assessments');
      //   console.log('Assessments response:', assessmentsResponse);
      //   setAssessments(assessmentsResponse);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(`Failed to fetch dashboard data: ${err.message}`);
        if (err.response && err.response.status === 401) {
          // Redirect to login if unauthorized
          router.push('/login');
        }
      }
    };

    fetchDashboardData();
  }, [router]);

  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {userData.firstName} {userData.lastName}</h1>
      <h2>Your Assessments</h2>
      <ul>
        {assessments.map(assessment => (
          <li key={assessment.id}>{assessment.title}</li>
        ))}
      </ul>
    </div>
  );
}