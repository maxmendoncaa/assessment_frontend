
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axios';
import ModuleDetails from '../moduleDetails/page';
import Cookies from 'js-cookie'
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

export default function ModerationForm({ assessmentId }) {
  const [assessment, setAssessment] = useState({
    title: '',
    moduleCode: '',
    moduleLeader: '',
    assessmentWeighting: '',
    assessmentCategory: '',
    plannedIssueDate: '',
    submissionDate: '',
    moduleAssessmentLeadSignature: '',
    moduleAssessmentLeadSignatureDate: '',
    internalModeratorComments: '',
    internalModeratorSignature: '',
    internalModeratorSignatureDate: '',
    skills: '',
    plannedIssueDate: '',
    courseworkSubmissionDate: '',
    moduleAssessmentLead: '',
    externalExaminerComments: '',
    externalExaminerApproval: '',
    externalExaminerSignature: '',
    externalExaminerSignatureDate: '',
    programmeDirectorComments: '',
    programmeDirectorApproval: '',
    programmeDirectorSignature: '',
    programmeDirectorSignatureDate: '',
    userRoles: []
  });
  const [currentSection, setCurrentSection] = useState(SECTIONS.ASSESSMENT_DETAILS);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessment = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/api/v1/assessments/${assessmentId}`);
        console.log("Full API response:", response.data);
        setAssessment({
          ...assessment,
          ...response.data,
          skills: response.data.skills || '',
          userRoles: response.data.userRoles || []
        });
        
        console.log("User roles:", response.data.userRoles);
        determineCurrentSection(response.data);
      } catch (err) {
        console.error("Error fetching assessment:", err);
        setError(`Failed to fetch assessment data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    if (assessmentId) {
      fetchAssessment();
    }
  }, [assessmentId]);

  console.log("Test",assessment);

  const isUserAllowedToEdit = (requiredRole) => {
    console.log("Checking role:", requiredRole, "User roles:", assessment.userRoles);
    return assessment.userRoles && assessment.userRoles.includes(requiredRole);
  };

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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axiosInstance.put(`/api/v1/assessments/${assessmentId}`, assessment);
  //     console.log("Update response:", response.data);
  //     setAssessment(response.data);
  //     moveToNextSection();
  //   } catch (err) {
  //     console.error("Error updating assessment:", err);
  //     setError(`Failed to update assessment: ${err.message}`);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const currentDateTime = new Date().toISOString(); // Get current date and time in ISO format
      const response = await axiosInstance.put(`/api/v1/assessments/${assessmentId}`, {
        ...assessment,
        skills: assessment.skills,
        moduleAssessmentLeadSignatureDate: currentDateTime,
        moduleAssessmentLeadSignature: "Submitted by "+Cookies.get('name')
      });
      console.log("Update response:", response.data);
      setAssessment(response.data);
      moveToNextSection();
    } catch (err) {
      console.error("Error updating assessment:", err);
      setError(`Failed to update assessment: ${err.message}`);
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
    }
  };

  
  const renderAssessmentDetails = () => {
    console.log("Rendering Assessment Details. Current assessment state:", assessment);
    const canEdit = isUserAllowedToEdit(ROLES.MODULE_ASSESSMENT_LEAD);
    console.log("Can edit:", canEdit);

    return (
      <div>
        <h2>Assessment Details</h2>
        <form onSubmit={handleSubmit}>
          <p>Title: {assessment.title}</p>
          <p>Module Code: {assessment.moduleCode}</p>
          <p>Module Assessment Lead: {assessment.moduleAssessmentLead}</p>
          <p>Assessment Weighting: {assessment.assessmentWeighting}%</p>
          <p>Assessment Category: {assessment.assessmentCategory}</p>
          
          <label>
            Skills:
            {canEdit ? (
              <textarea
                name="skills"
                value={assessment.skills}
                onChange={handleInputChange}
                //placeholder="Enter skills for this assessment"
              />
            ) : (
              <p>{assessment.skills || 'No skills specified for this assessment'}</p>
            )}
          </label>
          
          <label>
            Planned Issue Date:
            {canEdit ? (
              <input
                type="date"
                name="plannedIssueDate"
                value={assessment.plannedIssueDate || ''}
                onChange={handleInputChange}
              />
            ) : (
              <p>{assessment.plannedIssueDate || 'Not set'}</p>
            )}
          </label>
          
          <label>
            Coursework Submission Date:
            {canEdit ? (
              <input
                type="date"
                name="courseworkSubmissionDate"
                value={assessment.courseworkSubmissionDate || ''}
                onChange={handleInputChange}
              />
            ) : (
              <p>{assessment.courseworkSubmissionDate || 'Not set'}</p>
            )}
          </label>
          
          {canEdit && (
            <>
              <p>Module Assessment Lead Signature: {assessment.moduleAssessmentLeadSignature || 'Not signed'}</p>
      <p>Signature Date: {assessment.moduleAssessmentLeadSignatureDate ? new Date(assessment.moduleAssessmentLeadSignatureDate).toLocaleString() : 'Not dated'}</p>
      <button type="submit">Submit Assessment Details</button>
            </>
          )}
        </form>
      </div>
    );
  };

  const renderInternalModeration = () => (
    <div>
      <h2>Internal Moderation</h2>
      <form onSubmit={handleSubmit}>
        {isUserAllowedToEdit(ROLES.INTERNAL_MODERATOR) ? (
          <>
            <textarea
              name="internalModeratorComments"
              value={assessment.internalModeratorComments || ''}
              onChange={handleInputChange}
              placeholder="Internal Moderator Comments"
            />
            <input
              type="text"
              name="internalModeratorSignature"
              value={assessment.internalModeratorSignature || ''}
              onChange={handleInputChange}
              placeholder="Internal Moderator Signature"
            />
            <input
              type="date"
              name="internalModeratorSignatureDate"
              value={assessment.internalModeratorSignatureDate || ''}
              onChange={handleInputChange}
            />
            <button type="submit">Submit Internal Moderation</button>
          </>
        ) : (
          <>
            <p>Internal Moderator Comments: {assessment.internalModeratorComments || 'No comments yet.'}</p>
            <p>Internal Moderator Signature: {assessment.internalModeratorSignature || 'Not signed'}</p>
            <p>Signature Date: {assessment.internalModeratorSignatureDate || 'Not dated'}</p>
          </>
        )}
      </form>
    </div>
  );

  const renderExternalExaminerReview = () => (
    <div>
      <h2>External Examiner Review</h2>
      <form onSubmit={handleSubmit}>
        {isUserAllowedToEdit(ROLES.EXTERNAL_EXAMINER) ? (
          <>
            <textarea
              name="externalExaminerComments"
              value={assessment.externalExaminerComments || ''}
              onChange={handleInputChange}
              placeholder="External Examiner Comments"
            />
            <select
              name="externalExaminerApproval"
              value={assessment.externalExaminerApproval || ''}
              onChange={handleInputChange}
            >
              <option value="">Select Approval Status</option>
              <option value="APPROVED">Approved</option>
              <option value="NEEDS_REVISION">Needs Revision</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <input
              type="text"
              name="externalExaminerSignature"
              value={assessment.externalExaminerSignature || ''}
              onChange={handleInputChange}
              placeholder="External Examiner Signature"
            />
            <input
              type="date"
              name="externalExaminerSignatureDate"
              value={assessment.externalExaminerSignatureDate || ''}
              onChange={handleInputChange}
            />
            <button type="submit">Submit External Examiner Review</button>
          </>
        ) : (
          <>
            <p>External Examiner Comments: {assessment.externalExaminerComments || 'No comments yet.'}</p>
            <p>Approval Status: {assessment.externalExaminerApproval || 'Not reviewed yet.'}</p>
            <p>External Examiner Signature: {assessment.externalExaminerSignature || 'Not signed'}</p>
            <p>Signature Date: {assessment.externalExaminerSignatureDate || 'Not dated'}</p>
          </>
        )}
      </form>
    </div>
  );

  const renderProgrammeDirectorConfirmation = () => (
    <div>
      <h2>Programme Director Confirmation</h2>
      <form onSubmit={handleSubmit}>
        {isUserAllowedToEdit(ROLES.PROGRAMME_DIRECTOR) ? (
          <>
            <textarea
              name="programmeDirectorComments"
              value={assessment.programmeDirectorComments || ''}
              onChange={handleInputChange}
              placeholder="Programme Director Comments"
            />
            <select
              name="programmeDirectorApproval"
              value={assessment.programmeDirectorApproval || ''}
              onChange={handleInputChange}
            >
              <option value="">Select Approval Status</option>
              <option value="APPROVED">Approved</option>
              <option value="NEEDS_REVISION">Needs Revision</option>
            </select>
            <input
              type="text"
              name="programmeDirectorSignature"
              value={assessment.programmeDirectorSignature || ''}
              onChange={handleInputChange}
              placeholder="Programme Director Signature"
            />
            <input
              type="date"
              name="programmeDirectorSignatureDate"
              value={assessment.programmeDirectorSignatureDate || ''}
              onChange={handleInputChange}
            />
            <button type="submit">Submit Programme Director Confirmation</button>
          </>
        ) : (
          <>
            <p>Programme Director Comments: {assessment.programmeDirectorComments || 'No comments yet.'}</p>
            <p>Approval Status: {assessment.programmeDirectorApproval || 'Not reviewed yet.'}</p>
            <p>Programme Director Signature: {assessment.programmeDirectorSignature || 'Not signed'}</p>
            <p>Signature Date: {assessment.programmeDirectorSignatureDate || 'Not dated'}</p>
          </>
        )}
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="eps-moderation-form">
      <h1>EPS Moderation Form</h1>
      
      {assessment.moduleCode && <ModuleDetails moduleCode={assessment.moduleCode} />}
      
      <h2>Assessment Moderation Form</h2>
      <div>
        <h3>Debug Information</h3>
        <p>Current user roles: {JSON.stringify(assessment.userRoles)}</p>
        <p>Current section: {currentSection}</p>
        <p>Can edit assessment details: {isUserAllowedToEdit(ROLES.MODULE_ASSESSMENT_LEAD).toString()}</p>
      </div>
      {renderSection()}
    </div>
  );
}