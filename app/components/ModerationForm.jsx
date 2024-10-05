'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axios';

const ROLES = {
  MODULE_ASSESSMENT_LEAD: 'MODULE_ASSESSMENT_LEAD',
  INTERNAL_MODERATOR: 'INTERNAL_MODERATOR',
  EXTERNAL_EXAMINER: 'EXTERNAL_EXAMINER',
  PROGRAMME_DIRECTOR: 'PROGRAMME_DIRECTOR'
};

const SECTIONS = {
  ASSESSMENT_DETAILS: 'ASSESSMENT_DETAILS',
  INTERNAL_MODERATION: 'INTERNAL_MODERATION',
  EXTERNAL_EXAMINER_REVIEW: 'EXTERNAL_EXAMINER_REVIEW',
  PROGRAMME_DIRECTOR_CONFIRMATION: 'PROGRAMME_DIRECTOR_CONFIRMATION'
};

export default function EPSModerationForm({ assessmentId }) {
  const [assessment, setAssessment] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [currentSection, setCurrentSection] = useState(SECTIONS.ASSESSMENT_DETAILS);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/assessments/${assessmentId}`);
        setAssessment(response.data);
        setUserRole(response.data.userRole);
        determineCurrentSection(response.data);
      } catch (err) {
        setError('Failed to fetch assessment data');
      }
    };

    if (assessmentId) {
      fetchAssessment();
    }
  }, [assessmentId]);

  const determineCurrentSection = (assessmentData) => {
    if (!assessmentData.internalModeratorSignature) {
      setCurrentSection(SECTIONS.ASSESSMENT_DETAILS);
    } else if (!assessmentData.externalExaminerSignature) {
      setCurrentSection(SECTIONS.INTERNAL_MODERATION);
    } else if (!assessmentData.programmeDirectorSignature) {
      setCurrentSection(SECTIONS.EXTERNAL_EXAMINER_REVIEW);
    } else {
      setCurrentSection(SECTIONS.PROGRAMME_DIRECTOR_CONFIRMATION);
    }
  };

  const handleInputChange = (e) => {
    setAssessment({ ...assessment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`/api/v1/assessments/${assessmentId}`, assessment);
      setAssessment(response.data);
      moveToNextSection();
    } catch (err) {
      setError('Failed to update assessment');
    }
  };

  const moveToNextSection = () => {
    switch (currentSection) {
      case SECTIONS.ASSESSMENT_DETAILS:
        setCurrentSection(SECTIONS.INTERNAL_MODERATION);
        break;
      case SECTIONS.INTERNAL_MODERATION:
        setCurrentSection(SECTIONS.EXTERNAL_EXAMINER_REVIEW);
        break;
      case SECTIONS.EXTERNAL_EXAMINER_REVIEW:
        setCurrentSection(SECTIONS.PROGRAMME_DIRECTOR_CONFIRMATION);
        break;
      // No need to handle PROGRAMME_DIRECTOR_CONFIRMATION as it's the last section
    }
  };

  const renderAssessmentDetails = () => (
    <div>
      <h2>Assessment Details</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={assessment.title}
          onChange={handleInputChange}
          disabled={userRole !== ROLES.MODULE_ASSESSMENT_LEAD}
          placeholder="Assessment Title"
        />
        <input
          name="moduleCode"
          value={assessment.moduleCode}
          onChange={handleInputChange}
          disabled={userRole !== ROLES.MODULE_ASSESSMENT_LEAD}
          placeholder="Module Code"
        />
        <input
          name="assessmentWeighting"
          type="number"
          value={assessment.assessmentWeighting}
          onChange={handleInputChange}
          disabled={userRole !== ROLES.MODULE_ASSESSMENT_LEAD}
          placeholder="Assessment Weighting (%)"
        />
        <select
          name="assessmentCategory"
          value={assessment.assessmentCategory}
          onChange={handleInputChange}
          disabled={userRole !== ROLES.MODULE_ASSESSMENT_LEAD}
        >
          <option value="">Select Assessment Category</option>
          <option value="EXAM">Exam</option>
          <option value="COURSEWORK">Coursework</option>
          <option value="PRACTICAL">Practical</option>
        </select>
        <button type="submit" disabled={userRole !== ROLES.MODULE_ASSESSMENT_LEAD}>
          Submit Assessment Details
        </button>
      </form>
    </div>
  );

  const renderInternalModeration = () => (
    <div>
      <h2>Internal Moderation</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          name="internalModeratorComments"
          value={assessment.internalModeratorComments || ''}
          onChange={handleInputChange}
          disabled={userRole !== ROLES.INTERNAL_MODERATOR}
          placeholder="Internal Moderator Comments"
        />
        <button type="submit" disabled={userRole !== ROLES.INTERNAL_MODERATOR}>
          Submit Internal Moderation
        </button>
      </form>
    </div>
  );

  const renderExternalExaminerReview = () => (
    <div>
      <h2>External Examiner Review</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          name="externalExaminerComments"
          value={assessment.externalExaminerComments || ''}
          onChange={handleInputChange}
          disabled={userRole !== ROLES.EXTERNAL_EXAMINER}
          placeholder="External Examiner Comments"
        />
        <select
          name="externalExaminerApproval"
          value={assessment.externalExaminerApproval}
          onChange={handleInputChange}
          disabled={userRole !== ROLES.EXTERNAL_EXAMINER}
        >
          <option value="">Select Approval Status</option>
          <option value="APPROVED">Approved</option>
          <option value="NEEDS_REVISION">Needs Revision</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <button type="submit" disabled={userRole !== ROLES.EXTERNAL_EXAMINER}>
          Submit External Examiner Review
        </button>
      </form>
    </div>
  );

  const renderProgrammeDirectorConfirmation = () => (
    <div>
      <h2>Programme Director Confirmation</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          name="programmeDirectorComments"
          value={assessment.programmeDirectorComments || ''}
          onChange={handleInputChange}
          disabled={userRole !== ROLES.PROGRAMME_DIRECTOR}
          placeholder="Programme Director Comments"
        />
        <select
          name="programmeDirectorApproval"
          value={assessment.programmeDirectorApproval}
          onChange={handleInputChange}
          disabled={userRole !== ROLES.PROGRAMME_DIRECTOR}
        >
          <option value="">Select Approval Status</option>
          <option value="APPROVED">Approved</option>
          <option value="NEEDS_REVISION">Needs Revision</option>
        </select>
        <button type="submit" disabled={userRole !== ROLES.PROGRAMME_DIRECTOR}>
          Submit Programme Director Confirmation
        </button>
      </form>
    </div>
  );

  const renderSection = () => {
    switch (currentSection) {
      case SECTIONS.ASSESSMENT_DETAILS:
        return renderAssessmentDetails();
      case SECTIONS.INTERNAL_MODERATION:
        return renderInternalModeration();
      case SECTIONS.EXTERNAL_EXAMINER_REVIEW:
        return renderExternalExaminerReview();
      case SECTIONS.PROGRAMME_DIRECTOR_CONFIRMATION:
        return renderProgrammeDirectorConfirmation();
      default:
        return null;
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (!assessment) return <div>Loading...</div>;

  return (
    <div className="eps-moderation-form">
      <h1>EPS Moderation Form</h1>
      {renderSection()}
    </div>
  );
}