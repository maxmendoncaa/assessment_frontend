'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axios';

const AssessmentRoles = {
  EXTERNAL_EXAMINER: 'EXTERNAL_EXAMINER',
  INTERNAL_MODERATOR: 'INTERNAL_MODERATOR',
  PROGRAMME_DIRECTOR: 'PROGRAMME_DIRECTOR',
  MODULE_ASSESSMENT_LEAD: 'MODULE_ASSESSMENT_LEAD'
};

export default function AssessmentPage({ assessmentId }) {
  const [assessment, setAssessment] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchAssessmentAndUserRole = async () => {
      try {
        const [assessmentResponse, userRoleResponse] = await Promise.all([
          axiosInstance.get(`api/v1/assessments/${assessmentId}`),
          axiosInstance.get('api/v1/users/me/role')
        ]);
        setAssessment(assessmentResponse.data);
        setUserRole(userRoleResponse.data);
      } catch (err) {
        console.error('Failed to fetch assessment or user role:', err);
        setError('Failed to load assessment data');
      }
    };
    fetchAssessmentAndUserRole();
  }, [assessmentId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`api/v1/assessments/${assessmentId}/update`, {
        role: userRole,
        ...formData
      });
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to update assessment');
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (!assessment || !userRole) return <div>Loading...</div>;

  const renderForm = () => {
    switch (userRole) {
      case AssessmentRoles.EXTERNAL_EXAMINER:
        return (
          <>
            <h2>External Examiner Form</h2>
            <textarea
              name="comments"
              value={formData.comments || ''}
              onChange={handleChange}
              placeholder="Comments"
            />
            <select
              name="reviewAgain"
              value={formData.reviewAgain || ''}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </>
        );
      case AssessmentRoles.INTERNAL_MODERATOR:
        return (
          <>
            <h2>Internal Moderator Form</h2>
            <textarea
              name="moderatorComments"
              value={formData.moderatorComments || ''}
              onChange={handleChange}
              placeholder="Moderator Comments"
            />
            <input
              type="date"
              name="moderationDate"
              value={formData.moderationDate || ''}
              onChange={handleChange}
            />
          </>
        );
      case AssessmentRoles.PROGRAMME_DIRECTOR:
        return (
          <>
            <h2>Programme Director Form</h2>
            <select
              name="approved"
              value={formData.approved || ''}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="true">Approved</option>
              <option value="false">Not Approved</option>
            </select>
            <textarea
              name="directorComments"
              value={formData.directorComments || ''}
              onChange={handleChange}
              placeholder="Comments"
            />
          </>
        );
      case AssessmentRoles.MODULE_ASSESSMENT_LEAD:
        return (
          <>
            <h2>Module Assessment Lead Form</h2>
            <input
              type="number"
              name="totalSubmissions"
              value={formData.totalSubmissions || ''}
              onChange={handleChange}
              placeholder="Total Submissions"
            />
            <input
              type="number"
              name="failedSubmissions"
              value={formData.failedSubmissions || ''}
              onChange={handleChange}
              placeholder="Failed Submissions"
            />
            <textarea
              name="leadComments"
              value={formData.leadComments || ''}
              onChange={handleChange}
              placeholder="Comments"
            />
          </>
        );
      default:
        return <div>You do not have permission to edit this assessment.</div>;
    }
  };

  return (
    <div className="assessment-page">
      <h1>Assessment: {assessment.title}</h1>
      <p>Category: {assessment.assessmentCategory}</p>
      <p>Weighting: {assessment.assessmentWeighting}%</p>
      <form onSubmit={handleSubmit}>
        {renderForm()}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}