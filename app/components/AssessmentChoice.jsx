'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axios';

export default function AssessmentChoicePage({ moduleId }) {
  const [assessments, setAssessments] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await axiosInstance.get(`api/v1/modules/${moduleId}/assessments/user`, { withCredentials: true });
        setAssessments(response.data);
      } catch (err) {
        console.error('Error fetching assessments:', err);
        setError(`Failed to fetch assessments: ${err.message}`);
      }
    };

    fetchAssessments();
  }, [moduleId]);

  const handleAssessmentClick = (assessmentId) => {
    router.push(`/assessments/${assessmentId}`);
  };

  if (error) return <div className="error-message">Error: {error}</div>;
  if (assessments.length === 0) return <div className="loading-message">Loading...</div>;

  return (
    <div className="assessment-choice-container">
      <h1>Assessments</h1>
      <div className="assessments-grid">
        {assessments.map(assessment => (
          <div key={assessment.id} className="assessment-card" onClick={() => handleAssessmentClick(assessment.id)}>
            <h3>{assessment.title}</h3>
            <p>Category: {assessment.assessmentCategory}</p>
            <p>Weighting: {assessment.assessmentWeighting}%</p>
            <p>Your Role: {assessment.userRole}</p>
          </div>
        ))}
      </div>
    </div>
  );
}