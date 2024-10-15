import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/utils/axios';
import ModuleDetails from '../moduleDetails/page';
import Cookies from 'js-cookie';

const ROLES = {
  MODULE_ASSESSMENT_LEAD: 'MODULE_ASSESSMENT_LEAD',
  INTERNAL_MODERATOR: 'INTERNAL_MODERATOR',
  EXTERNAL_EXAMINER: 'EXTERNAL_EXAMINER',
  PROGRAMME_DIRECTOR: 'PROGRAMME_DIRECTOR'
};

const SECTIONS = {
  ASSESSMENT_DETAILS: 'ASSESSMENT_DETAILS',
  INTERNAL_MODERATION: 'INTERNAL_MODERATION',
  RESPONSE_TO_INTERNAL_MODERATOR: 'RESPONSE_TO_INTERNAL_MODERATOR',
  EXTERNAL_EXAMINER_REVIEW: 'EXTERNAL_EXAMINER_REVIEW',
  RESPONSE_TO_EXTERNAL_EXAMINER: 'RESPONSE_TO_EXTERNAL_EXAMINER',
  PROGRAMME_DIRECTOR_CONFIRMATION: 'PROGRAMME_DIRECTOR_CONFIRMATION',
  MODERATION_OF_MARKS: 'MODERATION_OF_MARKS',
  ASSESSMENT_LEAD_STAGE_2: 'ASSESSMENT_LEAD_STAGE_2',
  FINAL_CONFIRMATION: 'FINAL_CONFIRMATION'
};

const TRIGGERS = {
  ASSESSMENT_DETAILS: 'assessmentDetailsTrigger',
  INTERNAL_MODERATOR: 'internalModeratorDetailsTrigger',
  EXTERNAL_EXAMINER: 'externalExaminerDetailsTrigger',
  PROGRAMME_DIRECTOR: 'programmeDirectorDetailsTrigger',
  MODERATION_OF_MARKS: 'internalModeratorModerationOfMarksTrigger',
  MODERATOR_COMMENTS: 'stage2ModeratorCommentsTrigger',
  ASSESSMENT_LEAD_STAGE_2: 'stage2ModuleAssessmentLeadCommentsTrigger'
};

export default function ModerationForm({ assessmentId }) {
  const [assessment, setAssessment] = useState({
    id: '',
    title: '',
    moduleCode: '',
    moduleLeader: '',
    assessmentWeighting: '',
    assessmentCategory: '',
    skills: '',
    plannedIssueDate: '',
    courseworkSubmissionDate: '',
    moduleAssessmentLeadSignature: '',
    moduleAssessmentLeadSignatureDateTime: null,
    internalModeratorComments: '',
    internalModeratorSignature: '',
    internalModeratorSignatureDateTime: null,
    responseToInternalModerator: '',
    externalExaminerComments: '',
    externalExaminerApproval: '',
    externalExaminer_signature: '',
    externalExaminerSignatureDateTime: null,
    responseToExternalExaminer: '',
    programmeDirectorApproval: '',
    programmeDirectorSignatureDateTime: null,
    programmeDirectorConfirmation_signature: 'Pending',
    assessmentDeadline: '',
    markingCompletedDate: '',
    moderationCompletedDate: '',
    totalSubmissions: '',
    failedSubmissions: '',
    moderatedSubmissions: '',
    teachingImpactDetails: '',
    stage2_moderatorComments: '',
    moderatorSignatureDateTime: null,
    stage2_assessmentLeadComments: '',
    stage2ModuleAssessmentLeadSignatureDateTime: null,
    programmeDirectorConfirmation_signature_stage2: '',
    userRoles: [],
    participants: [],
    assessmentDetailsTrigger: 'Not Completed',
    internalModeratorDetailsTrigger: 'Not Completed',
    externalExaminerDetailsTrigger: 'Not Completed',
    programmeDirectorDetailsTrigger: 'Not Completed',
    internalModeratorModerationOfMarksTrigger: 'Not Completed',
    stage2ModeratorCommentsTrigger: 'Not Completed',
    stage2ModuleAssessmentLeadCommentsTrigger: 'Not Completed'
  });

  const [currentSection, setCurrentSection] = useState(SECTIONS.ASSESSMENT_DETAILS);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [editMode, setEditMode] = useState({});

  const setEditModeForSection = useCallback((section, isEditing) => {
    setEditMode(prevEditMode => ({
      ...prevEditMode,
      [section]: isEditing
    }));
  }, []);

  useEffect(() => {
    const fetchAssessment = async () => {
      setLoading(true);
      try {
        const [assessmentResponse, participantsResponse] = await Promise.all([
          axiosInstance.get(`/api/v1/assessments/${assessmentId}`),
          axiosInstance.get(`/api/v1/assessments/${assessmentId}/participants`)
        ]);
        setAssessment({
          ...assessmentResponse.data,
          userRoles: assessmentResponse.data.userRoles || []
        });
        setParticipants(participantsResponse.data);
        determineCurrentSection(assessmentResponse.data);
      } catch (err) {
        console.error("Error fetching assessment:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (assessmentId) {
      fetchAssessment();
    }
  }, [assessmentId]);

  // Prevent page refresh and handle form submission
  const handleSubmit = async (e, section) => {
    e.preventDefault(); // Prevents full page refresh
    const updatedAssessment = { ...assessment };

    try {
      // Reset next triggers after the section
      resetSubsequentTriggers(TRIGGERS[section]);

      const response = await axiosInstance.put(`/api/v1/assessments/${assessmentId}`, updatedAssessment);
      setAssessment(response.data);
      setEditModeForSection(section, false);
      determineCurrentSection(response.data); // Recalculate current section
    } catch (err) {
      console.error("Error submitting assessment:", err);
    }
  };

  // Determine current section based on incomplete triggers
  const determineCurrentSection = useCallback((assessmentData) => {
    const triggers = [
      { trigger: TRIGGERS.ASSESSMENT_DETAILS, section: SECTIONS.ASSESSMENT_DETAILS },
      { trigger: TRIGGERS.INTERNAL_MODERATOR, section: SECTIONS.INTERNAL_MODERATION },
      { trigger: TRIGGERS.EXTERNAL_EXAMINER, section: SECTIONS.EXTERNAL_EXAMINER_REVIEW },
      { trigger: TRIGGERS.PROGRAMME_DIRECTOR, section: SECTIONS.PROGRAMME_DIRECTOR_CONFIRMATION },
      { trigger: TRIGGERS.MODERATION_OF_MARKS, section: SECTIONS.MODERATION_OF_MARKS },
      { trigger: TRIGGERS.MODERATOR_COMMENTS, section: SECTIONS.ASSESSMENT_LEAD_STAGE_2 },
      { trigger: TRIGGERS.ASSESSMENT_LEAD_STAGE_2, section: SECTIONS.FINAL_CONFIRMATION }
    ];

    for (const { trigger, section } of triggers) {
      if (assessmentData[trigger] !== 'Completed') {
        setCurrentSection(section);
        return;
      }
    }
  }, []);

  // Reset all triggers after the current section
  const resetSubsequentTriggers = (triggerName) => {
    const updatedAssessment = { ...assessment };
    const triggerOrder = Object.values(TRIGGERS);
    const startResetIndex = triggerOrder.indexOf(triggerName) + 1;

    for (let i = startResetIndex; i < triggerOrder.length; i++) {
      updatedAssessment[triggerOrder[i]] = 'Not Completed';
    }
    setAssessment(updatedAssessment);
  };

  const handleTriggerClick = async (triggerName) => {
    try {
      const updatedAssessment = {
        ...assessment,
        [triggerName]: 'Completed'
      };
      resetSubsequentTriggers(triggerName); // Reset triggers after the current one

      const response = await axiosInstance.put(`/api/v1/assessments/${assessmentId}`, updatedAssessment);
      setAssessment(response.data);
      determineCurrentSection(response.data); // Determine the new current section
    } catch (err) {
      console.error("Error updating trigger:", err);
    }
  };

  // Check if the user is allowed to edit and determine button rendering
  const renderTriggerButton = (triggerName, requiredRole, sectionName) => {
    const canAccess = isUserAllowedToEdit(requiredRole);
    const isCompleted = assessment[triggerName] === 'Completed';
    const isPreviousCompleted = isPreviousTriggerCompleted(triggerName);

    // Only render if the current section has been completed
    if (currentSection === sectionName) {
      return (
        <button
          onClick={() => handleTriggerClick(triggerName)}
          disabled={!canAccess || isCompleted || !isPreviousCompleted}
        >
          {isCompleted ? 'Completed' : 'Mark as Completed'}
        </button>
      );
    }
    return null;
  };

  const isPreviousTriggerCompleted = (currentTrigger) => {
    const triggerOrder = Object.values(TRIGGERS);
    const currentIndex = triggerOrder.indexOf(currentTrigger);
    if (currentIndex === 0) return true;
    const previousTrigger = triggerOrder[currentIndex - 1];
    return assessment[previousTrigger] === 'Completed';
  };

  const handleInputChange = (e) => {
    setAssessment({ ...assessment, [e.target.name]: e.target.value });
  };

  // Check if all fields in a section are filled
  const areAllFieldsFilled = (fields) => {
    return fields.every(field => {
      const value = assessment[field.name];
      return typeof value === 'string' ? value.trim() !== '' : value !== null && value !== undefined;
    });
  
  };

  // Render each section with conditional buttons and section hiding
  const renderSection = (sectionName, fields, role) => {
    const canEdit = isUserAllowedToEdit(role) && editMode[sectionName];
    const showSubmit = areAllFieldsFilled(fields);

    return (
      <div style={{ display: currentSection === sectionName || isPreviousTriggerCompleted(TRIGGERS[sectionName]) ? 'block' : 'none' }}>
        <h2>{sectionName.replace(/_/g, ' ')}</h2>
        <form onSubmit={(e) => handleSubmit(e, sectionName)}>
          {fields.map(field => (
            <div key={field.name}>
              <label>
                {field.label}:
                {canEdit ? (
                  <input
                    type={field.type}
                    name={field.name}
                    value={assessment[field.name] || ''}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  <p>{assessment[field.name] || 'Not set'}</p>
                )}
              </label>
            </div>
          ))}
          {isUserAllowedToEdit(role) && (
            canEdit ? (
              <>
                {showSubmit && (
                  <button type="submit">Submit {sectionName.replace(/_/g, ' ')}</button>
                )}
                <button type="button" onClick={() => setEditModeForSection(sectionName, false)}>
                  Cancel
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setEditModeForSection(sectionName, true)}>
                Edit {sectionName.replace(/_/g, ' ')}
              </button>
            )
          )}
        </form>
        {/* Render the trigger button after each section */}
        {renderTriggerButton(TRIGGERS[sectionName], role, sectionName)}
      </div>
    );
  };

  const isUserAllowedToEdit = useCallback((requiredRole) => {
    return assessment.userRoles && assessment.userRoles.includes(requiredRole);
  }, [assessment.userRoles]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="eps-moderation-form">
      <h1>EPS Moderation Form</h1>
      {assessment.moduleCode && <ModuleDetails moduleCode={assessment.moduleCode} />}

      {/* Render sections up to and including the current section */}
      {renderSection(SECTIONS.ASSESSMENT_DETAILS, [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'skills', label: 'Skills', type: 'textarea' },
        { name: 'assessmentCategory', label: 'Assessment Category', type: 'text' },
        { name: 'assessmentWeighting', label: 'Assessment Weighting', type: 'number' },
        { name: 'plannedIssueDate', label: 'Planned Issue Date', type: 'date' },
        { name: 'courseworkSubmissionDate', label: 'Coursework Submission Date', type: 'date' }
      ], ROLES.MODULE_ASSESSMENT_LEAD)}

      {currentSection !== SECTIONS.ASSESSMENT_DETAILS && (
        <>
          {renderSection(SECTIONS.INTERNAL_MODERATION, [
            { name: 'internalModeratorComments', label: 'Internal Moderator Comments', type: 'textarea' }
          ], ROLES.INTERNAL_MODERATOR)}

          {renderSection(SECTIONS.RESPONSE_TO_INTERNAL_MODERATOR, [
            { name: 'responseToInternalModerator', label: 'Response to Internal Moderator', type: 'textarea' }
          ], ROLES.MODULE_ASSESSMENT_LEAD)}

          {renderSection(SECTIONS.EXTERNAL_EXAMINER_REVIEW, [
            { name: 'externalExaminerComments', label: 'External Examiner Comments', type: 'textarea' },
            { name: 'externalExaminerApproval', label: 'External Examiner Approval', type: 'select', options: [
              { value: 'APPROVED', label: 'Approved' },
              { value: 'NEEDS_REVISION', label: 'Needs Revision' }
            ]}
          ], ROLES.EXTERNAL_EXAMINER)}

          {renderSection(SECTIONS.PROGRAMME_DIRECTOR_CONFIRMATION, [
            { name: 'programmeDirectorApproval', label: 'Programme Director Approval', type: 'select', options: [
              { value: 'APPROVED', label: 'Approved' },
              { value: 'NEEDS_REVISION', label: 'Needs Revision' }
            ]}
          ], ROLES.PROGRAMME_DIRECTOR)}

          {renderSection(SECTIONS.MODERATION_OF_MARKS, [
            { name: 'assessmentDeadline', label: 'Assessment Deadline', type: 'date' },
            { name: 'markingCompletedDate', label: 'Marking Completed Date', type: 'date' },
            { name: 'moderationCompletedDate', label: 'Moderation Completed Date', type: 'date' },
            { name: 'totalSubmissions', label: 'Total Submissions', type: 'number' },
            { name: 'failedSubmissions', label: 'Failed Submissions', type: 'number' },
            { name: 'moderatedSubmissions', label: 'Moderated Submissions', type: 'number' },
            { name: 'teachingImpactDetails', label: 'Teaching Impact Details', type: 'textarea' }
          ], ROLES.INTERNAL_MODERATOR)}

          {renderSection(SECTIONS.ASSESSMENT_LEAD_STAGE_2, [
            { name: 'stage2_assessmentLeadComments', label: 'Stage 2 Assessment Lead Comments', type: 'textarea' }
          ], ROLES.MODULE_ASSESSMENT_LEAD)}

          {renderSection(SECTIONS.FINAL_CONFIRMATION, [
            { name: 'programmeDirectorConfirmation_signature_stage2', label: 'Programme Director Final Confirmation', type: 'text' }
          ], ROLES.PROGRAMME_DIRECTOR)}
        </>
      )}
    </div>
  );
}







//v4
// import React, { useState, useEffect, useCallback } from 'react';
// import axiosInstance from '@/utils/axios';
// import ModuleDetails from '../moduleDetails/page';
// import Cookies from 'js-cookie';

// const ROLES = {
//   MODULE_ASSESSMENT_LEAD: 'MODULE_ASSESSMENT_LEAD',
//   INTERNAL_MODERATOR: 'INTERNAL_MODERATOR',
//   EXTERNAL_EXAMINER: 'EXTERNAL_EXAMINER',
//   PROGRAMME_DIRECTOR: 'PROGRAMME_DIRECTOR'
// };

// const SECTIONS = {
//   ASSESSMENT_DETAILS: 'ASSESSMENT_DETAILS',
//   INTERNAL_MODERATION: 'INTERNAL_MODERATION',
//   RESPONSE_TO_INTERNAL_MODERATOR: 'RESPONSE_TO_INTERNAL_MODERATOR',
//   EXTERNAL_EXAMINER_REVIEW: 'EXTERNAL_EXAMINER_REVIEW',
//   RESPONSE_TO_EXTERNAL_EXAMINER: 'RESPONSE_TO_EXTERNAL_EXAMINER',
//   PROGRAMME_DIRECTOR_CONFIRMATION: 'PROGRAMME_DIRECTOR_CONFIRMATION',
//   MODERATION_OF_MARKS: 'MODERATION_OF_MARKS',
//   ASSESSMENT_LEAD_STAGE_2: 'ASSESSMENT_LEAD_STAGE_2',
//   FINAL_CONFIRMATION: 'FINAL_CONFIRMATION'
// };

// const TRIGGERS = {
//   ASSESSMENT_DETAILS: 'assessmentDetailsTrigger',
//   INTERNAL_MODERATOR: 'internalModeratorDetailsTrigger',
//   EXTERNAL_EXAMINER: 'externalExaminerDetailsTrigger',
//   PROGRAMME_DIRECTOR: 'programmeDirectorDetailsTrigger',
//   MODERATION_OF_MARKS: 'internalModeratorModerationOfMarksTrigger',
//   MODERATOR_COMMENTS: 'stage2ModeratorCommentsTrigger',
//   ASSESSMENT_LEAD_STAGE_2: 'stage2ModuleAssessmentLeadCommentsTrigger'
// };

// export default function ModerationForm({ assessmentId }) {
//   const [assessment, setAssessment] = useState({
//     id: '',
//     title: '',
//     moduleCode: '',
//     moduleLeader: '',
//     assessmentWeighting: '',
//     assessmentCategory: '',
//     skills: '',
//     plannedIssueDate: '',
//     courseworkSubmissionDate: '',
//     moduleAssessmentLeadSignature: '',
//     moduleAssessmentLeadSignatureDateTime: null,
//     internalModeratorComments: '',
//     internalModeratorSignature: '',
//     internalModeratorSignatureDateTime: null,
//     responseToInternalModerator: '',
//     externalExaminerComments: '',
//     externalExaminerApproval: '',
//     externalExaminer_signature: '',
//     externalExaminerSignatureDateTime: null,
//     responseToExternalExaminer: '',
//     programmeDirectorApproval: '',
//     programmeDirectorSignatureDateTime: null,
//     programmeDirectorConfirmation_signature: 'Pending',
//     assessmentDeadline: '',
//     markingCompletedDate: '',
//     moderationCompletedDate: '',
//     totalSubmissions: '',
//     failedSubmissions: '',
//     moderatedSubmissions: '',
//     teachingImpactDetails: '',
//     stage2_moderatorComments: '',
//     moderatorSignatureDateTime: null,
//     stage2_assessmentLeadComments: '',
//     stage2ModuleAssessmentLeadSignatureDateTime: null,
//     programmeDirectorConfirmation_signature_stage2: '',
//     userRoles: [],
//     participants: [],
//     assessmentDetailsTrigger: 'Not Completed',
//     internalModeratorDetailsTrigger: 'Not Completed',
//     externalExaminerDetailsTrigger: 'Not Completed',
//     programmeDirectorDetailsTrigger: 'Not Completed',
//     internalModeratorModerationOfMarksTrigger: 'Not Completed',
//     stage2ModeratorCommentsTrigger: 'Not Completed',
//     stage2ModuleAssessmentLeadCommentsTrigger: 'Not Completed'
//   });

//   const [currentSection, setCurrentSection] = useState(SECTIONS.ASSESSMENT_DETAILS);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [participants, setParticipants] = useState([]);
//   const [editMode, setEditMode] = useState({});

//   const setEditModeForSection = useCallback((section, isEditing) => {
//     setEditMode(prevEditMode => ({
//       ...prevEditMode,
//       [section]: isEditing
//     }));
//   }, []);

//   useEffect(() => {
//     const fetchAssessment = async () => {
//       setLoading(true);
//       try {
//         const [assessmentResponse, participantsResponse] = await Promise.all([
//           axiosInstance.get(`/api/v1/assessments/${assessmentId}`),
//           axiosInstance.get(`/api/v1/assessments/${assessmentId}/participants`)
//         ]);
        
//         setAssessment({
//           ...assessmentResponse.data,
//           userRoles: assessmentResponse.data.userRoles || []
//         });
        
//         setParticipants(participantsResponse.data);
//         determineCurrentSection(assessmentResponse.data);
//       } catch (err) {
//         console.error("Error fetching assessment:", err);
//         setError(`Failed to fetch assessment data: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     if (assessmentId) {
//       fetchAssessment();
//     }
//   }, [assessmentId]);

//   const getParticipantsByRole = useCallback((role) => {
//     return participants.filter(p => p.roles.includes(role));
//   }, [participants]);

//   const isUserAllowedToEdit = useCallback((requiredRole) => {
//     return assessment.userRoles && assessment.userRoles.includes(requiredRole);
//   }, [assessment.userRoles]);

//   const determineCurrentSection = useCallback((assessmentData) => {
//     const triggers = [
//       { trigger: TRIGGERS.ASSESSMENT_DETAILS, section: SECTIONS.ASSESSMENT_DETAILS },
//       { trigger: TRIGGERS.INTERNAL_MODERATOR, section: SECTIONS.INTERNAL_MODERATION },
//       { trigger: TRIGGERS.EXTERNAL_EXAMINER, section: SECTIONS.EXTERNAL_EXAMINER_REVIEW },
//       { trigger: TRIGGERS.PROGRAMME_DIRECTOR, section: SECTIONS.PROGRAMME_DIRECTOR_CONFIRMATION },
//       { trigger: TRIGGERS.MODERATION_OF_MARKS, section: SECTIONS.MODERATION_OF_MARKS },
//       { trigger: TRIGGERS.MODERATOR_COMMENTS, section: SECTIONS.ASSESSMENT_LEAD_STAGE_2 },
//       { trigger: TRIGGERS.ASSESSMENT_LEAD_STAGE_2, section: SECTIONS.FINAL_CONFIRMATION }
//     ];

//     for (const { trigger, section } of triggers) {
//       if (assessmentData[trigger] !== 'Completed') {
//         setCurrentSection(section);
//         return;
//       }
//     }
//   }, []);

//   const handleInputChange = (e) => {
//     setAssessment({ ...assessment, [e.target.name]: e.target.value });
//   };

//   const areAllFieldsFilled = (section) => {
//     const requiredFields = {
//       [SECTIONS.ASSESSMENT_DETAILS]: ['skills', 'plannedIssueDate', 'courseworkSubmissionDate'],
//       [SECTIONS.INTERNAL_MODERATION]: ['internalModeratorComments'],
//       [SECTIONS.RESPONSE_TO_INTERNAL_MODERATOR]: ['responseToInternalModerator'],
//       [SECTIONS.EXTERNAL_EXAMINER_REVIEW]: ['externalExaminerComments', 'externalExaminerApproval'],
//       [SECTIONS.RESPONSE_TO_EXTERNAL_EXAMINER]: ['responseToExternalExaminer'],
//       [SECTIONS.PROGRAMME_DIRECTOR_CONFIRMATION]: ['programmeDirectorApproval'],
//       [SECTIONS.MODERATION_OF_MARKS]: ['assessmentDeadline', 'markingCompletedDate', 'moderationCompletedDate', 'totalSubmissions', 'failedSubmissions', 'moderatedSubmissions', 'teachingImpactDetails'],
//       [SECTIONS.ASSESSMENT_LEAD_STAGE_2]: ['stage2_assessmentLeadComments'],
//       [SECTIONS.FINAL_CONFIRMATION]: ['programmeDirectorConfirmation_signature_stage2']
//     };

//     return requiredFields[section].every(field => assessment[field]);
//   };

//   const handleSubmit = async (e, section) => {
//     e.preventDefault();
    
//     const roleForSection = {
//       [SECTIONS.ASSESSMENT_DETAILS]: ROLES.MODULE_ASSESSMENT_LEAD,
//       [SECTIONS.INTERNAL_MODERATION]: ROLES.INTERNAL_MODERATOR,
//       [SECTIONS.RESPONSE_TO_INTERNAL_MODERATOR]: ROLES.MODULE_ASSESSMENT_LEAD,
//       [SECTIONS.EXTERNAL_EXAMINER_REVIEW]: ROLES.EXTERNAL_EXAMINER,
//       [SECTIONS.RESPONSE_TO_EXTERNAL_EXAMINER]: ROLES.MODULE_ASSESSMENT_LEAD,
//       [SECTIONS.PROGRAMME_DIRECTOR_CONFIRMATION]: ROLES.PROGRAMME_DIRECTOR,
//       [SECTIONS.MODERATION_OF_MARKS]: ROLES.INTERNAL_MODERATOR,
//       [SECTIONS.ASSESSMENT_LEAD_STAGE_2]: ROLES.MODULE_ASSESSMENT_LEAD,
//       [SECTIONS.FINAL_CONFIRMATION]: ROLES.PROGRAMME_DIRECTOR
//     };
    
//     if (!isUserAllowedToEdit(roleForSection[section])) {
//       setError("You don't have permission to submit this section.");
//       return;
//     }
  
//     if (!areAllFieldsFilled(section)) {
//       setError("Please fill in all required fields before submitting.");
//       return;
//     }
  
//     try {
//       const currentDateTime = new Date().toISOString();
//       const updatedAssessment = {
//         ...assessment,
//         [`${section.toLowerCase()}Signature`]: `Submitted by ${Cookies.get('name')}`,
//         [`${section.toLowerCase()}SignatureDateTime`]: currentDateTime
//       };
  
//       // Update the corresponding trigger
//       const triggerForSection = Object.entries(TRIGGERS).find(([_, value]) => value.includes(section.toLowerCase()));
//       if (triggerForSection) {
//         updatedAssessment[triggerForSection[1]] = 'Completed';
//       }
  
//       const response = await axiosInstance.put(`/api/v1/assessments/${assessmentId}`, updatedAssessment);
//       setAssessment(response.data);
//       setEditModeForSection(section, false);
//       determineCurrentSection(response.data);
//     } catch (err) {
//       console.error("Error updating assessment:", err);
//       setError(`Failed to update assessment: ${err.message}`);
//     }
//   };

//   const renderSection = (sectionName, fields, role) => {
//     const canEdit = isUserAllowedToEdit(role) && editMode[sectionName];
  
//     return (
//       <div>
//         <h2>{sectionName.replace(/_/g, ' ')}</h2>
//         <form onSubmit={(e) => handleSubmit(e, sectionName)}>
//           {fields.map(field => (
//             <div key={field.name}>
//               <label>
//                 {field.label}:
//                 {canEdit ? (
//                   field.type === 'textarea' ? (
//                     <textarea
//                       name={field.name}
//                       value={assessment[field.name] || ''}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   ) : field.type === 'select' ? (
//                     <select
//                       name={field.name}
//                       value={assessment[field.name] || ''}
//                       onChange={handleInputChange}
//                       required
//                     >
//                       <option value="">Select an option</option>
//                       {field.options.map(option => (
//                         <option key={option.value} value={option.value}>{option.label}</option>
//                       ))}
//                     </select>
//                   ) : (
//                     <input
//                       type={field.type}
//                       name={field.name}
//                       value={assessment[field.name] || ''}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   )
//                 ) : (
//                   <p>{assessment[field.name] || 'Not set'}</p>
//                 )}
//               </label>
//             </div>
//           ))}
          
//           {isUserAllowedToEdit(role) && (
//             canEdit ? (
//               <>
//                 <button type="submit">Submit {sectionName.replace(/_/g, ' ')}</button>
//                 <button type="button" onClick={() => setEditModeForSection(sectionName, false)}>
//                   Cancel
//                 </button>
//               </>
//             ) : (
//               <button type="button" onClick={() => setEditModeForSection(sectionName, true)}>
//                 Edit {sectionName.replace(/_/g, ' ')}
//               </button>
//             )
//           )}
//         </form>
//       </div>
//     );
//   };

//   const renderTriggerButton = (triggerName, requiredRole) => {
//     const canAccess = isUserAllowedToEdit(requiredRole);
//     const isCompleted = assessment[triggerName] === 'Completed';
//     const isPreviousCompleted = isPreviousTriggerCompleted(triggerName);

//     return (
//       <button
//         onClick={() => handleTriggerClick(triggerName)}
//         disabled={!canAccess || isCompleted || !isPreviousCompleted}
//       >
//         {isCompleted ? 'Completed' : 'Mark as Completed'}
//       </button>
//     );
//   };

//   const isPreviousTriggerCompleted = (currentTrigger) => {
//     const triggerOrder = Object.values(TRIGGERS);
//     const currentIndex = triggerOrder.indexOf(currentTrigger);
//     if (currentIndex === 0) return true;
//     const previousTrigger = triggerOrder[currentIndex - 1];
//     return assessment[previousTrigger] === 'Completed';
//   };

//   const handleTriggerClick = async (triggerName) => {
//     try {
//       const updatedAssessment = {
//         ...assessment,
//         [triggerName]: 'Completed'
//       };
//       const response = await axiosInstance.put(`/api/v1/assessments/${assessmentId}`, updatedAssessment);
//       setAssessment(response.data);
//       determineCurrentSection(response.data);
//     } catch (err) {
//       console.error("Error updating trigger:", err);
//       setError(`Failed to update trigger: ${err.message}`);
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div className="eps-moderation-form">
//        <div>
//         <h3>Debug Information</h3>
//          <p>Current user roles: {JSON.stringify(assessment.userRoles)}</p>
//          <p>Current section: {currentSection}</p>
//          <p>Can edit assessment details: {isUserAllowedToEdit(ROLES.MODULE_ASSESSMENT_LEAD).toString()}</p>
//          <p>All Participants: {JSON.stringify(participants)}</p>
//          <p>Module Assessment Leads: {JSON.stringify(getParticipantsByRole(ROLES.MODULE_ASSESSMENT_LEAD))}</p>
//        </div>
//       <h1>EPS Moderation Form</h1>

//       {assessment.moduleCode && <ModuleDetails moduleCode={assessment.moduleCode} />}
      
//       {renderSection(SECTIONS.ASSESSMENT_DETAILS, [
//         { name: 'title', label: 'Title', type: 'text' },
//         { name: 'skills', label: 'Skills', type: 'textarea' },
//         { name: 'assessmentCategory', label: 'Assessment Category', type: 'text' },
//         { name: 'assessmentWeighting', label: 'Assessment Weighting', type: 'number' },
//         { name: 'plannedIssueDate', label: 'Planned Issue Date', type: 'date' },
//         { name: 'courseworkSubmissionDate', label: 'Coursework Submission Date', type: 'date' }
//       ], ROLES.MODULE_ASSESSMENT_LEAD)}
//       {renderTriggerButton(TRIGGERS.ASSESSMENT_DETAILS, ROLES.MODULE_ASSESSMENT_LEAD)}

//       {currentSection !== SECTIONS.ASSESSMENT_DETAILS && (
//         <>
//           {renderSection(SECTIONS.INTERNAL_MODERATION, [
//             { name: 'internalModeratorComments', label: 'Internal Moderator Comments', type: 'textarea' }
//           ], ROLES.INTERNAL_MODERATOR)}
          
//           {renderSection(SECTIONS.RESPONSE_TO_INTERNAL_MODERATOR, [
//             { name: 'responseToInternalModerator', label: 'Response to Internal Moderator', type: 'textarea' }
//           ], ROLES.MODULE_ASSESSMENT_LEAD)}
//           {renderTriggerButton(TRIGGERS.INTERNAL_MODERATOR, ROLES.MODULE_ASSESSMENT_LEAD)}
          
//           {renderSection(SECTIONS.EXTERNAL_EXAMINER_REVIEW, [
//             { name: 'externalExaminerComments', label: 'External Examiner Comments', type: 'textarea' },
//             { name: 'externalExaminerApproval', label: 'External Examiner Approval', type: 'select', options: [
//               { value: 'APPROVED', label: 'Approved' },
//               { value: 'NEEDS_REVISION', label: 'Needs Revision' }
//             ]}
//           ], ROLES.EXTERNAL_EXAMINER)}
          
//           {renderSection(SECTIONS.RESPONSE_TO_EXTERNAL_EXAMINER, [
//             { name: 'responseToExternalExaminer', label: 'Response to External Examiner', type: 'textarea' }
//           ], ROLES.MODULE_ASSESSMENT_LEAD)}
//           {renderTriggerButton(TRIGGERS.EXTERNAL_EXAMINER, ROLES.MODULE_ASSESSMENT_LEAD)}
          
//           {renderSection(SECTIONS.PROGRAMME_DIRECTOR_CONFIRMATION, [
//             { name: 'programmeDirectorApproval', label: 'Programme Director Approval', type: 'select', options: [
//               { value: 'APPROVED', label: 'Approved' },
//               { value: 'NEEDS_REVISION', label: 'Needs Revision' }
//             ]}
//           ], ROLES.PROGRAMME_DIRECTOR)}
//           {renderTriggerButton(TRIGGERS.PROGRAMME_DIRECTOR, ROLES.PROGRAMME_DIRECTOR)}
          
//           {renderSection(SECTIONS.MODERATION_OF_MARKS, [
//             { name: 'assessmentDeadline', label: 'Assessment Deadline', type: 'date' },
//             { name: 'markingCompletedDate', label: 'Marking Completed Date', type: 'date' },
//             { name: 'moderationCompletedDate', label: 'Moderation Completed Date', type: 'date' },
//             { name: 'totalSubmissions', label: 'Total Submissions', type: 'number' },
//             { name: 'failedSubmissions', label: 'Failed Submissions', type: 'number' },
//             { name: 'moderatedSubmissions', label: 'Moderated Submissions', type: 'number' },
//             { name: 'teachingImpactDetails', label: 'Teaching Impact Details', type: 'textarea' },
//             { name: 'stage2_moderatorComments', label: 'Stage 2 Moderator Comments', type: 'textarea' }
//           ], ROLES.INTERNAL_MODERATOR)}
//           {renderTriggerButton(TRIGGERS.MODERATION_OF_MARKS, ROLES.MODULE_ASSESSMENT_LEAD)}
          
//           {renderSection(SECTIONS.ASSESSMENT_LEAD_STAGE_2, [
//             { name: 'stage2_assessmentLeadComments', label: 'Stage 2 Assessment Lead Comments', type: 'textarea' }
//           ], ROLES.MODULE_ASSESSMENT_LEAD)}
//           {renderTriggerButton(TRIGGERS.ASSESSMENT_LEAD_STAGE_2, ROLES.MODULE_ASSESSMENT_LEAD)}
          
//           {renderSection(SECTIONS.FINAL_CONFIRMATION, [
//             { name: 'programmeDirectorConfirmation_signature_stage2', label: 'Programme Director Final Confirmation', type: 'text' }
//           ], ROLES.PROGRAMME_DIRECTOR)}
//         </>
//       )}
//     </div>
 
//   );
// }










//v2
// import React, { useState, useEffect, useCallback } from 'react';
// import axiosInstance from '@/utils/axios';
// import ModuleDetails from '../moduleDetails/page';
// import Cookies from 'js-cookie';

// const ROLES = {
//   MODULE_ASSESSMENT_LEAD: 'MODULE_ASSESSMENT_LEAD',
//   INTERNAL_MODERATOR: 'INTERNAL_MODERATOR',
//   EXTERNAL_EXAMINER: 'EXTERNAL_EXAMINER',
//   PROGRAMME_DIRECTOR: 'PROGRAMME_DIRECTOR'
// };

// const SECTIONS = {
//   ASSESSMENT_DETAILS: 'ASSESSMENT_DETAILS',
//   INTERNAL_MODERATION: 'INTERNAL_MODERATION',
//   RESPONSE_TO_INTERNAL_MODERATOR: 'RESPONSE_TO_INTERNAL_MODERATOR',
//   EXTERNAL_EXAMINER_REVIEW: 'EXTERNAL_EXAMINER_REVIEW',
//   RESPONSE_TO_EXTERNAL_EXAMINER: 'RESPONSE_TO_EXTERNAL_EXAMINER',
//   PROGRAMME_DIRECTOR_CONFIRMATION: 'PROGRAMME_DIRECTOR_CONFIRMATION',
//   MODERATION_OF_MARKS: 'MODERATION_OF_MARKS',
//   ASSESSMENT_LEAD_STAGE_2: 'ASSESSMENT_LEAD_STAGE_2',
//   FINAL_CONFIRMATION: 'FINAL_CONFIRMATION'
// };

// const TRIGGERS = {
//   ASSESSMENT_DETAILS: 'assessmentDetailsTrigger',
//   INTERNAL_MODERATOR: 'internalModeratorDetailsTrigger',
//   EXTERNAL_EXAMINER: 'externalExaminerDetailsTrigger',
//   PROGRAMME_DIRECTOR: 'programmeDirectorDetailsTrigger',
//   MODERATION_OF_MARKS: 'internalModeratorModerationOfMarksTrigger',
//   MODERATOR_COMMENTS: 'stage2ModeratorCommentsTrigger',
//   ASSESSMENT_LEAD_STAGE_2: 'stage2ModuleAssessmentLeadCommentsTrigger'
// };

// export default function ModerationForm({ assessmentId }) {
//   const [assessment, setAssessment] = useState({
//     id: '',
//     title: '',
//     moduleCode: '',
//     moduleLeader: '',
//     assessmentWeighting: '',
//     assessmentCategory: '',
//     skills: '',
//     plannedIssueDate: '',
//     courseworkSubmissionDate: '',
//     moduleAssessmentLeadSignature: '',
//     moduleAssessmentLeadSignatureDateTime: null,
//     internalModeratorComments: '',
//     internalModeratorSignature: '',
//     internalModeratorSignatureDateTime: null,
//     responseToInternalModerator: '',
//     externalExaminerComments: '',
//     externalExaminerApproval: '',
//     externalExaminer_signature: '',
//     externalExaminerSignatureDateTime: null,
//     responseToExternalExaminer: '',
//     programmeDirectorApproval: '',
//     programmeDirectorSignatureDateTime: null,
//     programmeDirectorConfirmation_signature: 'Pending',
//     assessmentDeadline: '',
//     markingCompletedDate: '',
//     moderationCompletedDate: '',
//     totalSubmissions: '',
//     failedSubmissions: '',
//     moderatedSubmissions: '',
//     teachingImpactDetails: '',
//     stage2_moderatorComments: '',
//     moderatorSignatureDateTime: null,
//     stage2_assessmentLeadComments: '',
//     stage2ModuleAssessmentLeadSignatureDateTime: null,
//     programmeDirectorConfirmation_signature_stage2: '',
//     userRoles: [],
//     participants: [],
//     assessmentDetailsTrigger: 'Not Completed',
//     internalModeratorDetailsTrigger: 'Not Completed',
//     externalExaminerDetailsTrigger: 'Not Completed',
//     programmeDirectorDetailsTrigger: 'Not Completed',
//     internalModeratorModerationOfMarksTrigger: 'Not Completed',
//     stage2ModeratorCommentsTrigger: 'Not Completed',
//     stage2ModuleAssessmentLeadCommentsTrigger: 'Not Completed'
//   });

//   const [currentSection, setCurrentSection] = useState(SECTIONS.ASSESSMENT_DETAILS);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [participants, setParticipants] = useState([]);
//   const [editMode, setEditMode] = useState({});

//   const setEditModeForSection = useCallback((section, isEditing) => {
//     setEditMode(prevEditMode => ({
//       ...prevEditMode,
//       [section]: isEditing
//     }));
//   }, []);

//   useEffect(() => {
//     const fetchAssessment = async () => {
//       setLoading(true);
//       try {
//         const [assessmentResponse, participantsResponse] = await Promise.all([
//           axiosInstance.get(`/api/v1/assessments/${assessmentId}`),
//           axiosInstance.get(`/api/v1/assessments/${assessmentId}/participants`)
//         ]);
        
//         setAssessment({
//           ...assessmentResponse.data,
//           userRoles: assessmentResponse.data.userRoles || []
//         });
        
//         setParticipants(participantsResponse.data);
//         determineCurrentSection(assessmentResponse.data);
//       } catch (err) {
//         console.error("Error fetching assessment:", err);
//         setError(`Failed to fetch assessment data: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     if (assessmentId) {
//       fetchAssessment();
//     }
//   }, [assessmentId]);

//   const getParticipantsByRole = useCallback((role) => {
//     return participants.filter(p => p.roles.includes(role));
//   }, [participants]);

//   const isUserAllowedToEdit = useCallback((requiredRole) => {
//     return assessment.userRoles && assessment.userRoles.includes(requiredRole);
//   }, [assessment.userRoles]);

//   const determineCurrentSection = useCallback((assessmentData) => {
//     const triggers = [
//       { trigger: TRIGGERS.ASSESSMENT_DETAILS, section: SECTIONS.ASSESSMENT_DETAILS },
//       { trigger: TRIGGERS.INTERNAL_MODERATOR, section: SECTIONS.INTERNAL_MODERATION },
//       { trigger: TRIGGERS.EXTERNAL_EXAMINER, section: SECTIONS.EXTERNAL_EXAMINER_REVIEW },
//       { trigger: TRIGGERS.PROGRAMME_DIRECTOR, section: SECTIONS.PROGRAMME_DIRECTOR_CONFIRMATION },
//       { trigger: TRIGGERS.MODERATION_OF_MARKS, section: SECTIONS.MODERATION_OF_MARKS },
//       { trigger: TRIGGERS.MODERATOR_COMMENTS, section: SECTIONS.ASSESSMENT_LEAD_STAGE_2 },
//       { trigger: TRIGGERS.ASSESSMENT_LEAD_STAGE_2, section: SECTIONS.FINAL_CONFIRMATION }
//     ];

//     for (const { trigger, section } of triggers) {
//       if (assessmentData[trigger] !== 'Completed') {
//         setCurrentSection(section);
//         return;
//       }
//     }
//   }, []);

//   const handleInputChange = (e) => {
//     setAssessment({ ...assessment, [e.target.name]: e.target.value });
//   };

//   const areAllFieldsFilled = (section) => {
//     const requiredFields = {
//       [SECTIONS.ASSESSMENT_DETAILS]: ['skills', 'plannedIssueDate', 'courseworkSubmissionDate'],
//       [SECTIONS.INTERNAL_MODERATION]: ['internalModeratorComments'],
//       [SECTIONS.RESPONSE_TO_INTERNAL_MODERATOR]: ['responseToInternalModerator'],
//       [SECTIONS.EXTERNAL_EXAMINER_REVIEW]: ['externalExaminerComments', 'externalExaminerApproval'],
//       [SECTIONS.RESPONSE_TO_EXTERNAL_EXAMINER]: ['responseToExternalExaminer'],
//       [SECTIONS.PROGRAMME_DIRECTOR_CONFIRMATION]: ['programmeDirectorApproval'],
//       [SECTIONS.MODERATION_OF_MARKS]: ['assessmentDeadline', 'markingCompletedDate', 'moderationCompletedDate', 'totalSubmissions', 'failedSubmissions', 'moderatedSubmissions', 'teachingImpactDetails'],
//       [SECTIONS.ASSESSMENT_LEAD_STAGE_2]: ['stage2_assessmentLeadComments'],
//       [SECTIONS.FINAL_CONFIRMATION]: ['programmeDirectorConfirmation_signature_stage2']
//     };

//     return requiredFields[section].every(field => assessment[field]);
//   };

//   const handleSubmit = async (e, section) => {
//     e.preventDefault();
    
//     const roleForSection = {
//       [SECTIONS.ASSESSMENT_DETAILS]: ROLES.MODULE_ASSESSMENT_LEAD,
//       [SECTIONS.INTERNAL_MODERATION]: ROLES.INTERNAL_MODERATOR,
//       [SECTIONS.RESPONSE_TO_INTERNAL_MODERATOR]: ROLES.MODULE_ASSESSMENT_LEAD,
//       [SECTIONS.EXTERNAL_EXAMINER_REVIEW]: ROLES.EXTERNAL_EXAMINER,
//       [SECTIONS.RESPONSE_TO_EXTERNAL_EXAMINER]: ROLES.MODULE_ASSESSMENT_LEAD,
//       [SECTIONS.PROGRAMME_DIRECTOR_CONFIRMATION]: ROLES.PROGRAMME_DIRECTOR,
//       [SECTIONS.MODERATION_OF_MARKS]: ROLES.INTERNAL_MODERATOR,
//       [SECTIONS.ASSESSMENT_LEAD_STAGE_2]: ROLES.MODULE_ASSESSMENT_LEAD,
//       [SECTIONS.FINAL_CONFIRMATION]: ROLES.PROGRAMME_DIRECTOR
//     };
    
//     if (!isUserAllowedToEdit(roleForSection[section])) {
//       setError("You don't have permission to submit this section.");
//       return;
//     }
  
//     if (!areAllFieldsFilled(section)) {
//       setError("Please fill in all required fields before submitting.");
//       return;
//     }
  
//     try {
//       const currentDateTime = new Date().toISOString();
//       const updatedAssessment = {
//         ...assessment,
//         [`${section.toLowerCase()}Signature`]: `Submitted by ${Cookies.get('name')}`,
//         [`${section.toLowerCase()}SignatureDateTime`]: currentDateTime
//       };
  
//       // Update the corresponding trigger
//       const triggerForSection = Object.entries(TRIGGERS).find(([_, value]) => value.includes(section.toLowerCase()));
//       if (triggerForSection) {
//         updatedAssessment[triggerForSection[1]] = 'Completed';
//       }
  
//       const response = await axiosInstance.put(`/api/v1/assessments/${assessmentId}`, updatedAssessment);
//       setAssessment(response.data);
//       setEditModeForSection(section, false);
//       determineCurrentSection(response.data);
//     } catch (err) {
//       console.error("Error updating assessment:", err);
//       setError(`Failed to update assessment: ${err.message}`);
//     }
//   };

//   const renderSection = (sectionName, fields, role) => {
//     const canEdit = isUserAllowedToEdit(role) && editMode[sectionName];
  
//     return (
//       <div>
//         <h2>{sectionName.replace(/_/g, ' ')}</h2>
//         <form onSubmit={(e) => handleSubmit(e, sectionName)}>
//           {fields.map(field => (
//             <div key={field.name}>
//               <label>
//                 {field.label}:
//                 {canEdit ? (
//                   field.type === 'textarea' ? (
//                     <textarea
//                       name={field.name}
//                       value={assessment[field.name] || ''}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   ) : field.type === 'select' ? (
//                     <select
//                       name={field.name}
//                       value={assessment[field.name] || ''}
//                       onChange={handleInputChange}
//                       required
//                     >
//                       <option value="">Select an option</option>
//                       {field.options.map(option => (
//                         <option key={option.value} value={option.value}>{option.label}</option>
//                       ))}
//                     </select>
//                   ) : (
//                     <input
//                       type={field.type}
//                       name={field.name}
//                       value={assessment[field.name] || ''}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   )
//                 ) : (
//                   <p>{assessment[field.name] || 'Not set'}</p>
//                 )}
//               </label>
//             </div>
//           ))}
          
//           {isUserAllowedToEdit(role) && (
//             canEdit ? (
//               <>
//                 <button type="submit">Submit {sectionName.replace(/_/g, ' ')}</button>
//                 <button type="button" onClick={() => setEditModeForSection(sectionName, false)}>
//                   Cancel
//                 </button>
//               </>
//             ) : (
//               <button type="button" onClick={() => setEditModeForSection(sectionName, true)}>
//                 Edit {sectionName.replace(/_/g, ' ')}
//               </button>
//             )
//           )}
//         </form>
//       </div>
//     );
//   };

//   const renderTriggerButton = (triggerName, requiredRole) => {
//     const canAccess = isUserAllowedToEdit(requiredRole);
//     const isCompleted = assessment[triggerName] === 'Completed';
//     const isPreviousCompleted = isPreviousTriggerCompleted(triggerName);

//     return (
//       <button
//         onClick={() => handleTriggerClick(triggerName)}
//         disabled={!canAccess || isCompleted || !isPreviousCompleted}
//       >
//         {isCompleted ? 'Completed' : 'Mark as Completed'}
//       </button>
//     );
//   };

//   const isPreviousTriggerCompleted = (currentTrigger) => {
//     const triggerOrder = Object.values(TRIGGERS);
//     const currentIndex = triggerOrder.indexOf(currentTrigger);
//     if (currentIndex === 0) return true;
//     const previousTrigger = triggerOrder[currentIndex - 1];
//     return assessment[previousTrigger] === 'Completed';
//   };

//   const handleTriggerClick = async (triggerName) => {
//     try {
//       const updatedAssessment = {
//         ...assessment,
//         [triggerName]: 'Completed'
//       };
//       const response = await axiosInstance.put(`/api/v1/assessments/${assessmentId}`, updatedAssessment);
//       setAssessment(response.data);
//       determineCurrentSection(response.data);
//     } catch (err) {
//       console.error("Error updating trigger:", err);
//       setError(`Failed to update trigger: ${err.message}`);
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div className="eps-moderation-form">
//       <h1>EPS Moderation Form</h1>

//       {assessment.moduleCode && <ModuleDetails moduleCode={assessment.moduleCode} />}
      
//       {renderSection(SECTIONS.ASSESSMENT_DETAILS, [
//         { name: 'title', label: 'Title', type: 'text' },
//         { name: 'skills', label: 'Skills', type: 'textarea' },
//         { name: 'assessmentCategory', label: 'Assessment Category', type: 'text' },
//         { name: 'assessmentWeighting', label: 'Assessment Weighting', type: 'number' },
//         { name: 'plannedIssueDate', label: 'Planned Issue Date', type: 'date' },
//         { name: 'courseworkSubmissionDate', label: 'Coursework Submission Date', type: 'date' }
//       ], ROLES.MODULE_ASSESSMENT_LEAD)}
//       {renderTriggerButton(TRIGGERS.ASSESSMENT_DETAILS, ROLES.MODULE_ASSESSMENT_LEAD)}

//       {currentSection !== SECTIONS.ASSESSMENT_DETAILS && (
//         <>
//           {renderSection(SECTIONS.INTERNAL_MODERATION, [
//             { name: 'internalModeratorComments', label: 'Internal Moderator Comments', type: 'textarea' }
//           ], ROLES.INTERNAL_MODERATOR)}
          
//           {renderSection(SECTIONS.RESPONSE_TO_INTERNAL_MODERATOR, [
//             { name: 'responseToInternalModerator', label: 'Response to Internal Moderator', type: 'textarea' }
//           ], ROLES.MODULE_ASSESSMENT_LEAD)}
//           {renderTriggerButton(TRIGGERS.INTERNAL_MODERATOR, ROLES.MODULE_ASSESSMENT_LEAD)}
          
//           {renderSection(SECTIONS.EXTERNAL_EXAMINER_REVIEW, [
//             { name: 'externalExaminerComments', label: 'External Examiner Comments', type: 'textarea' },
//             { name: 'externalExaminerApproval', label: 'External Examiner Approval', type: 'select', options: [
//               { value: 'APPROVED', label: 'Approved' },
//               { value: 'NEEDS_REVISION', label: 'Needs Revision' }
//             ]}
//           ], ROLES.EXTERNAL_EXAMINER)}
          
//           {renderSection(SECTIONS.RESPONSE_TO_EXTERNAL_EXAMINER, [
//             { name: 'responseToExternalExaminer', label: 'Response to External Examiner', type: 'textarea' }
//           ], ROLES.MODULE_ASSESSMENT_LEAD)}
//           {renderTriggerButton(TRIGGERS.EXTERNAL_EXAMINER, ROLES.MODULE_ASSESSMENT_LEAD)}
          
//           {renderSection(SECTIONS.PROGRAMME_DIRECTOR_CONFIRMATION, [
//             { name: 'programmeDirectorApproval', label: 'Programme Director Approval', type: 'select', options: [
//               { value: 'APPROVED', label: 'Approved' },
//               { value: 'NEEDS_REVISION', label: 'Needs Revision' }
//             ]}
//           ], ROLES.PROGRAMME_DIRECTOR)}
//           {renderTriggerButton(TRIGGERS.PROGRAMME_DIRECTOR, ROLES.PROGRAMME_DIRECTOR)}
          
//           {renderSection(SECTIONS.MODERATION_OF_MARKS, [
//             { name: 'assessmentDeadline', label: 'Assessment Deadline', type: 'date' },
//             { name: 'markingCompletedDate', label: 'Marking Completed Date', type: 'date' },
//             { name: 'moderationCompletedDate', label: 'Moderation Completed Date', type: 'date' },
//             { name: 'totalSubmissions', label: 'Total Submissions', type: 'number' },
//             { name: 'failedSubmissions', label: 'Failed Submissions', type: 'number' },
//             { name: 'moderatedSubmissions', label: 'Moderated Submissions', type: 'number' },
//             { name: 'teachingImpactDetails', label: 'Teaching Impact Details', type: 'textarea' },
//             { name: 'stage2_moderatorComments', label: 'Stage 2 Moderator Comments', type: 'textarea' }
//           ], ROLES.INTERNAL_MODERATOR)}
//           {renderTriggerButton(TRIGGERS.MODERATION_OF_MARKS, ROLES.MODULE_ASSESSMENT_LEAD)}
          
//           {renderSection(SECTIONS.ASSESSMENT_LEAD_STAGE_2, [
//             { name: 'stage2_assessmentLeadComments', label: 'Stage 2 Assessment Lead Comments', type: 'textarea' }
//           ], ROLES.MODULE_ASSESSMENT_LEAD)}
//           {renderTriggerButton(TRIGGERS.ASSESSMENT_LEAD_STAGE_2, ROLES.MODULE_ASSESSMENT_LEAD)}
          
//           {renderSection(SECTIONS.FINAL_CONFIRMATION, [
//             { name: 'programmeDirectorConfirmation_signature_stage2', label: 'Programme Director Final Confirmation', type: 'text' }
//           ], ROLES.PROGRAMME_DIRECTOR)}
//         </>
//       )}
//     </div>
//   );
// }



































//v1

// import React, { useState, useEffect, useCallback } from 'react';
// import axiosInstance from '@/utils/axios';
// import ModuleDetails from '../moduleDetails/page';
// import Cookies from 'js-cookie';

// const ROLES = {
//   MODULE_ASSESSMENT_LEAD: 'MODULE_ASSESSMENT_LEAD',
//   INTERNAL_MODERATOR: 'INTERNAL_MODERATOR',
//   EXTERNAL_EXAMINER: 'EXTERNAL_EXAMINER',
//   PROGRAMME_DIRECTOR: 'PROGRAMME_DIRECTOR'
// };

// const SECTIONS = {
//   ASSESSMENT_DETAILS: 'ASSESSMENT_DETAILS',
//   INTERNAL_MODERATION: 'INTERNAL_MODERATION',
//   EXTERNAL_EXAMINER_REVIEW: 'EXTERNAL_EXAMINER_REVIEW',
//   PROGRAMME_DIRECTOR_CONFIRMATION: 'PROGRAMME_DIRECTOR_CONFIRMATION'
// };

// export default function ModerationForm({ assessmentId }) {
//   const [assessment, setAssessment] = useState({
//     id: '',
//     title: '',
//     moduleCode: '',
//     moduleLeader: '',
//     assessmentWeighting: '',
//     assessmentCategory: '',
//     skills: '',
//     plannedIssueDate: '',
//     courseworkSubmissionDate: '',
//     moduleAssessmentLeadSignature: '',
//     moduleAssessmentLeadSignatureDateTime: null,
//     internalModeratorComments: '',
//     internalModeratorSignature: '',
//     internalModeratorSignatureDateTime: null,
//     externalExaminerComments: '',
//     externalExaminerApproval: '',
//     externalExaminer_signature: '',
//     externalExaminerSignatureDateTime: null,
//     programmeDirectorApproval: '',
//     programmeDirectorSignatureDateTime: null,
//     programmeDirectorConfirmation_signature: 'Pending',
//     programmeDirectorConfirmation_signatureDateTime_stage2: null,
//     programmeDirectorConfirmation_signature_stage2: '',
//     userRoles: [],
//     participants: []
//   });

//   const [currentSection, setCurrentSection] = useState(SECTIONS.ASSESSMENT_DETAILS);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [participants, setParticipants] = useState([]);
//   const [editMode, setEditMode] = useState({
//     [SECTIONS.ASSESSMENT_DETAILS]: true,
//     [SECTIONS.INTERNAL_MODERATION]: false,
//     [SECTIONS.EXTERNAL_EXAMINER_REVIEW]: false,
//     [SECTIONS.PROGRAMME_DIRECTOR_CONFIRMATION]: false,
//   });

//   const setEditModeForSection = useCallback((section, isEditing) => {
//     setEditMode(prevEditMode => ({
//       ...prevEditMode,
//       [section]: isEditing
//     }));
//   }, []);

//   useEffect(() => {
//     const fetchAssessment = async () => {
//       setLoading(true);
//       try {
//         const [assessmentResponse, participantsResponse] = await Promise.all([
//           axiosInstance.get(`/api/v1/assessments/${assessmentId}`),
//           axiosInstance.get(`/api/v1/assessments/${assessmentId}/participants`)
//         ]);
        
//         setAssessment({
//           ...assessmentResponse.data,
//           userRoles: assessmentResponse.data.userRoles || []
//         });
        
//         setParticipants(participantsResponse.data);
//         determineCurrentSection(assessmentResponse.data);
//       } catch (err) {
//         console.error("Error fetching assessment:", err);
//         setError(`Failed to fetch assessment data: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     if (assessmentId) {
//       fetchAssessment();
//     }
//   }, [assessmentId]);

//   const getParticipantsByRole = useCallback((role) => {
//     return participants.filter(p => p.roles.includes(role));
//   }, [participants]);

//   const isUserAllowedToEdit = useCallback((requiredRole) => {
//     return assessment.userRoles && assessment.userRoles.includes(requiredRole);
//   }, [assessment.userRoles]);

//   const determineCurrentSection = useCallback((assessmentData) => {
//     if (!assessmentData.moduleAssessmentLeadSignature) {
//       setCurrentSection(SECTIONS.ASSESSMENT_DETAILS);
//     } else if (!assessmentData.internalModeratorSignature) {
//       setCurrentSection(SECTIONS.INTERNAL_MODERATION);
//     } else if (!assessmentData.externalExaminerSignature) {
//       setCurrentSection(SECTIONS.EXTERNAL_EXAMINER_REVIEW);
//     } else if (!assessmentData.programmeDirectorSignature) {
//       setCurrentSection(SECTIONS.PROGRAMME_DIRECTOR_CONFIRMATION);
//     }
//   }, []);

//   const handleInputChange = (e) => {
//     setAssessment({ ...assessment, [e.target.name]: e.target.value });
//   };

//   const areAllFieldsFilled = (section) => {
//     switch (section) {
//       case SECTIONS.ASSESSMENT_DETAILS:
//         return assessment.skills && assessment.plannedIssueDate && assessment.courseworkSubmissionDate;
//       case SECTIONS.INTERNAL_MODERATION:
//         return assessment.internalModeratorComments;
//       case SECTIONS.EXTERNAL_EXAMINER_REVIEW:
//         return assessment.externalExaminerComments && assessment.externalExaminerApproval;
//       case SECTIONS.PROGRAMME_DIRECTOR_CONFIRMATION:
//         return assessment.programmeDirectorComments && assessment.programmeDirectorApproval;
//       default:
//         return false;
//     }
//   };

//   const handleSubmit = async (e, section) => {
//     e.preventDefault();
    
//     const roleForSection = {
//       [SECTIONS.ASSESSMENT_DETAILS]: ROLES.MODULE_ASSESSMENT_LEAD,
//       [SECTIONS.INTERNAL_MODERATION]: ROLES.INTERNAL_MODERATOR,
//       [SECTIONS.EXTERNAL_EXAMINER_REVIEW]: ROLES.EXTERNAL_EXAMINER,
//       [SECTIONS.PROGRAMME_DIRECTOR_CONFIRMATION]: ROLES.PROGRAMME_DIRECTOR,
//     };
    
//     if (!isUserAllowedToEdit(roleForSection[section])) {
//       setError("You don't have permission to submit this section.");
//       return;
//     }
  
//     if (!areAllFieldsFilled(section)) {
//       setError("Please fill in all required fields before submitting.");
//       return;
//     }
  
//     try {
//       const currentDateTime = new Date().toISOString();
//       const updatedAssessment = {
//         ...assessment,
//         [`${section.toLowerCase()}Signature`]: `Submitted by ${Cookies.get('name')}`,
//         [`${section.toLowerCase()}SignatureDate`]: currentDateTime
//       };
  
//       const response = await axiosInstance.put(`/api/v1/assessments/${assessmentId}`, updatedAssessment);
//       setAssessment(response.data);
//       setEditModeForSection(section, false);
//       determineCurrentSection(response.data);
//     } catch (err) {
//       console.error("Error updating assessment:", err);
//       setError(`Failed to update assessment: ${err.message}`);
//     }
//   };

//   const renderAssessmentDetails = () => {
//     const canEdit = isUserAllowedToEdit(ROLES.MODULE_ASSESSMENT_LEAD) && editMode[SECTIONS.ASSESSMENT_DETAILS];
//     const moduleAssessmentLeads = getParticipantsByRole(ROLES.MODULE_ASSESSMENT_LEAD);
//     const assessmentLeadsDisplay = moduleAssessmentLeads.length > 0 
//       ? moduleAssessmentLeads.map(lead => `${lead.firstName} ${lead.lastName}`).join(", ")
//       : 'Not assigned';
  
//     return (
//       <div>
//         <h2>Assessment Details</h2>
//         <form onSubmit={(e) => handleSubmit(e, SECTIONS.ASSESSMENT_DETAILS)}>
//           <p>Title: {assessment.title}</p>
//           <p>Module Code: {assessment.moduleCode}</p>
//           <p>Assessment Lead(s): {assessmentLeadsDisplay}</p>
//           <p>Assessment Weighting: {assessment.assessmentWeighting}%</p>
//           <p>Assessment Category: {assessment.assessmentCategory}</p>
  
//           <label>
//             Skills:
//             {canEdit ? (
//               <textarea
//                 name="skills"
//                 value={assessment.skills}
//                 onChange={handleInputChange}
//                 required
//               />
//             ) : (
//               <p>{assessment.skills || 'No skills specified for this assessment'}</p>
//             )}
//           </label>
          
//           <label>
//             Planned Issue Date:
//             {canEdit ? (
//               <input
//                 type="date"
//                 name="plannedIssueDate"
//                 value={assessment.plannedIssueDate || ''}
//                 onChange={handleInputChange}
//                 required
//               />
//             ) : (
//               <p>{assessment.plannedIssueDate || 'Not set'}</p>
//             )}
//           </label>
  
//           <label>
//             Coursework Submission Date:
//             {canEdit ? (
//               <input
//                 type="date"
//                 name="courseworkSubmissionDate"
//                 value={assessment.courseworkSubmissionDate || ''}
//                 onChange={handleInputChange}
//                 required
//               />
//             ) : (
//               <p>{assessment.courseworkSubmissionDate || 'Not set'}</p>
//             )}
//           </label>
  
//          <p>Module Assessment Lead Signature: {assessment.moduleAssessmentLeadSignature || 'Not signed'}</p>
//         <p>Signature Date: {assessment.moduleAssessmentLeadSignatureDateTime ? new Date(assessment.moduleAssessmentLeadSignatureDateTime).toLocaleString() : 'Not dated'}</p>
  
//           {isUserAllowedToEdit(ROLES.MODULE_ASSESSMENT_LEAD) && (
//             canEdit ? (
//               <>
//                 <button type="submit">Submit Assessment Details</button>
//                 <button 
//                   type="button" 
//                   onClick={() => setEditModeForSection(SECTIONS.ASSESSMENT_DETAILS, false)}>
//                   Cancel
//                 </button>
//               </>
//             ) : (
//               <button 
//                 type="button" 
//                 onClick={() => setEditModeForSection(SECTIONS.ASSESSMENT_DETAILS, true)}>
//                 Edit Assessment Details
//               </button>
//             )
//           )}
//         </form>
//       </div>
//     );
//   };

//   const renderInternalModeration = () => {
//     const canEdit = isUserAllowedToEdit(ROLES.INTERNAL_MODERATOR) && editMode[SECTIONS.INTERNAL_MODERATION];
  
//     return (
//       <div>
//         <h2>Internal Moderation</h2>
//         <form onSubmit={(e) => handleSubmit(e, SECTIONS.INTERNAL_MODERATION)}>
//           <label>
//             Internal Moderator Comments:
//             {canEdit ? (
//               <textarea
//                 name="internalModeratorComments"
//                 value={assessment.internalModeratorComments || ''}
//                 onChange={handleInputChange}
//                 placeholder="Internal Moderator Comments"
//                 required
//               />
//             ) : (
//               <p>{assessment.internalModeratorComments || 'No comments yet.'}</p>
//             )}
//           </label>
          
//           <p>Internal Moderator Signature: {assessment.internalModeratorSignature || 'Not signed'}</p>
//         <p>Signature Date: {assessment.internalModeratorSignatureDateTime ? new Date(assessment.internalModeratorSignatureDateTime).toLocaleString() : 'Not dated'}</p>
          
//           {isUserAllowedToEdit(ROLES.INTERNAL_MODERATOR) && (
//             canEdit ? (
//               <>
//                 <button type="submit">Submit Internal Moderation</button>
//                 <button type="button" onClick={() => setEditModeForSection(SECTIONS.INTERNAL_MODERATION, false)}>
//                   Cancel
//                 </button>
//               </>
//             ) : (
//               <button type="button" onClick={() => setEditModeForSection(SECTIONS.INTERNAL_MODERATION, true)}>
//                 Edit Internal Moderation
//               </button>
//             )
//           )}
//         </form>
//       </div>
//     );
//   };

//   const renderExternalExaminerReview = () => {
//     const canEdit = isUserAllowedToEdit(ROLES.EXTERNAL_EXAMINER) && editMode[SECTIONS.EXTERNAL_EXAMINER_REVIEW];
  
//     return (
//       <div>
//         <h2>External Examiner Review</h2>
//         <form onSubmit={(e) => handleSubmit(e, SECTIONS.EXTERNAL_EXAMINER_REVIEW)}>
//           <label>
//             External Examiner Comments:
//             {canEdit ? (
//               <textarea
//                 name="externalExaminerComments"
//                 value={assessment.externalExaminerComments || ''}
//                 onChange={handleInputChange}
//                 placeholder="External Examiner Comments"
//                 required
//               />
//             ) : (
//               <p>{assessment.externalExaminerComments || 'No comments yet.'}</p>
//             )}
//           </label>
          
//           <label>
//             Approval Status:
//             {canEdit ? (
//               <select
//                 name="externalExaminerApproval"
//                 value={assessment.externalExaminerApproval || ''}
//                 onChange={handleInputChange}
//                 required
//               >
//                 <option value="">Select Approval Status</option>
//                 <option value="APPROVED">Approved</option>
//                 <option value="NEEDS_REVISION">Needs Revision</option>
//                 <option value="REJECTED">Rejected</option>
//               </select>
//             ) : (
//               <p>{assessment.externalExaminerApproval || 'Not reviewed yet.'}</p>
//             )}
//           </label>
          
//           <p>External Examiner Signature: {assessment.externalExaminer_signature || 'Not signed'}</p>
//         <p>Signature Date: {assessment.externalExaminerSignatureDateTime ? new Date(assessment.externalExaminerSignatureDateTime).toLocaleString() : 'Not dated'}</p>
          
//           {isUserAllowedToEdit(ROLES.EXTERNAL_EXAMINER) && (
//             canEdit ? (
//               <>
//                 <button type="submit">Submit External Examiner Review</button>
//                 <button type="button" onClick={() => setEditModeForSection(SECTIONS.EXTERNAL_EXAMINER_REVIEW, false)}>
//                   Cancel
//                 </button>
//               </>
//             ) : (
//               <button type="button" onClick={() => setEditModeForSection(SECTIONS.EXTERNAL_EXAMINER_REVIEW, true)}>
//                 Edit External Examiner Review
//               </button>
//             )
//           )}
//         </form>
//       </div>
//     );
//   };
// // ... (previous code remains the same)

// const renderProgrammeDirectorConfirmation = () => {
//     const canEdit = isUserAllowedToEdit(ROLES.PROGRAMME_DIRECTOR) && editMode[SECTIONS.PROGRAMME_DIRECTOR_CONFIRMATION];
  
//     return (
//       <div>
//         <h2>Programme Director Confirmation</h2>
//         <form onSubmit={(e) => handleSubmit(e, SECTIONS.PROGRAMME_DIRECTOR_CONFIRMATION)}>
//           <label>
//             Programme Director Comments:
//             {canEdit ? (
//               <textarea
//                 name="programmeDirectorComments"
//                 value={assessment.programmeDirectorComments || ''}
//                 onChange={handleInputChange}
//                 placeholder="Programme Director Comments"
//                 required
//               />
//             ) : (
//               <p>{assessment.programmeDirectorComments || 'No comments yet.'}</p>
//             )}
//           </label>
          
//           <label>
//             Approval Status:
//             {canEdit ? (
//               <select
//                 name="programmeDirectorApproval"
//                 value={assessment.programmeDirectorApproval || ''}
//                 onChange={handleInputChange}
//                 required
//               >
//                 <option value="">Select Approval Status</option>
//                 <option value="APPROVED">Approved</option>
//                 <option value="NEEDS_REVISION">Needs Revision</option>
//               </select>
//             ) : (
//               <p>{assessment.programmeDirectorApproval || 'Not reviewed yet.'}</p>
//             )}
//           </label>
          
//           <p>Programme Director Signature: {assessment.programmeDirectorConfirmation_signature || 'Not signed'}</p>
//         <p>Signature Date: {assessment.programmeDirectorSignatureDateTime ? new Date(assessment.programmeDirectorSignatureDateTime).toLocaleString() : 'Not dated'}</p>
//         {/* ... (buttons remain the same) */}
          
//           {isUserAllowedToEdit(ROLES.PROGRAMME_DIRECTOR) && (
//             canEdit ? (
//               <>
//                 <button type="submit">Submit Programme Director Confirmation</button>
//                 <button type="button" onClick={() => setEditModeForSection(SECTIONS.PROGRAMME_DIRECTOR_CONFIRMATION, false)}>
//                   Cancel
//                 </button>
//               </>
//             ) : (
//               <button type="button" onClick={() => setEditModeForSection(SECTIONS.PROGRAMME_DIRECTOR_CONFIRMATION, true)}>
//                 Edit Programme Director Confirmation
//               </button>
//             )
//           )}
//         </form>
//       </div>
//     );
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div className="eps-moderation-form">
//       <h1>EPS Moderation Form</h1>

//       {assessment.moduleCode && <ModuleDetails moduleCode={assessment.moduleCode} />}
      
//       <h2>Assessment Moderation Form</h2>
//       <div>
//         <h3>Debug Information</h3>
//         <p>Current user roles: {JSON.stringify(assessment.userRoles)}</p>
//         <p>Current section: {currentSection}</p>
//         <p>Can edit assessment details: {isUserAllowedToEdit(ROLES.MODULE_ASSESSMENT_LEAD).toString()}</p>
//         <p>All Participants: {JSON.stringify(participants)}</p>
//         <p>Module Assessment Leads: {JSON.stringify(getParticipantsByRole(ROLES.MODULE_ASSESSMENT_LEAD))}</p>
//       </div>
//       {renderAssessmentDetails()}
//       {currentSection !== SECTIONS.ASSESSMENT_DETAILS && renderInternalModeration()}
//       {currentSection !== SECTIONS.ASSESSMENT_DETAILS && currentSection !== SECTIONS.INTERNAL_MODERATION && renderExternalExaminerReview()}
//       {currentSection === SECTIONS.PROGRAMME_DIRECTOR_CONFIRMATION && renderProgrammeDirectorConfirmation()}
//     </div>
//   );
// }
  