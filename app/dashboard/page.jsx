'use client';

import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
// import { makeAuthenticatedRequest } from '../utils/api';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('Fetching data...');
        
        // Sample Data: Replace with real API calls
        const userDataResponse = { firstName: 'Max', lastName: 'Michael' }; // Simulate user data response
        const assessmentsResponse = [
          { id: 1, title: 'Software Engineering Assessment' },
          { id: 2, title: 'Data Structures Assessment' },
        ]; // Simulate assessment data response
        
        setUserData(userDataResponse);
        setAssessments(assessmentsResponse);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(`Failed to fetch dashboard data: ${err.message}`);
        if (err.response && err.response.status === 401) {
          // Redirect to login if unauthorized
          redirect('/login');
        }
      }
    };

    fetchDashboardData();
  }, []);

  const handleDetailsClick = (assessmentId) => {
    redirect(`/assessment/${assessmentId}`);
  };

  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <h1>Welcome, {userData.firstName} {userData.lastName}</h1>
      <h2>Your Assessments</h2>

      <div className="assessments-container">
        {assessments.map(assessment => (
          <div key={assessment.id} className="assessment-card">
            <h3>{assessment.title}</h3>
            <button 
              className="details-button" 
              onClick={() => handleDetailsClick(assessment.id)}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
