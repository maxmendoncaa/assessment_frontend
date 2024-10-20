
"use client";
import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "@/utils/axios";
import { 
  notifyExternalExaminer, 
  notifyInternalModerator, 
  notifyProgrammeDirector 
} from '@/utils/emailService';  // Adjust the import path as necessary

// Helper function to format date-time as "yyyy-MM-dd'T'HH:mm:ss"
const formatDateTime = (date) => {
  return date.toISOString().split('.')[0]; // Removes the milliseconds and timezone part
};

const ModerationForm_2 = (props) => {
  const [modData, setModData] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/api/v1/assessments/${props.assessmentId}`)
      .then((data) => {
        setModData(data.data);
      });
  }, [props.assessmentId]);

  const formRef = useRef(null);

  //questions
  const [questions, setQuestions] = useState(modData?.questions || []);

  // Triggers
  const [assessmentDetailsTrigger, setAssessmentDetailsTrigger] = useState();
  const [internalModeratorDetailsTrigger, setInternalModeratorDetailsTrigger] = useState();
  const [externalExaminerDetailsTrigger, setExternalExaminerDetailsTrigger] = useState();
  const [programmeDirectorDetailsTrigger, setProgrammeDirectorDetailsTrigger] = useState();
  const [internalModeratorModerationOfMarksTrigger, setInternalModeratorModerationOfMarksTrigger] = useState();
  const [stage2ModuleAssessmentLeadCommentsTrigger, setStage2ModuleAssessmentLeadCommentsTrigger] = useState();
  const [stage2ModeratorCommentsTrigger, setStage2ModeratorCommentsTrigger] = useState();
  const [responseToInternalModeratorTrigger, setResponseToInternalModeratorTrigger] = useState();
  const [responseToExternalExaminerTrigger, setResponseToExternalExaminerTrigger] = useState();

  // Buttons for toggling edit modes
  const [editAssessment, setEditAssessment] = useState(false);
  const [editInternalModerator, setEditInternalModerator] = useState(false);
  const [editExternalExaminer, setEditExternalExaminer] = useState(false);
  const [editProgrammeDirector, setEditProgrammeDirector] = useState(false);
  const [editInternalModeratorModerationOfMarks, setEditInternalModeratorModerationOfMarks] = useState(false);
  const [editStage2ModuleAssessmentLeadComments, setEditStage2ModuleAssessmentLeadComments] = useState(false);
  const [editStage2ModeratorComments, setEditStage2ModeratorComments] = useState(false);
  const [editResponseToInternalModerator, setEditResponseToInternalModerator] = useState(false);
  const [editResponseToExternalExaminer, setEditResponseToExternalExaminer] = useState(false);
  const [editProgrammeDirectorConfirmation,setEditProgrammeDirectorConfirmation]=useState(false);

  useEffect(() => {
    if (modData) {
      setAssessmentDetailsTrigger(modData.assessmentDetailsTrigger);
      setInternalModeratorDetailsTrigger(modData.internalModeratorDetailsTrigger);
      setResponseToInternalModeratorTrigger(modData.responseToInternalModeratorTrigger);
      setExternalExaminerDetailsTrigger(modData.externalExaminerDetailsTrigger);
      setResponseToExternalExaminerTrigger(modData.responseToExternalExaminerTrigger);
      setProgrammeDirectorDetailsTrigger(modData.programmeDirectorDetailsTrigger);
      setInternalModeratorModerationOfMarksTrigger(modData.internalModeratorModerationOfMarksTrigger);
      setStage2ModuleAssessmentLeadCommentsTrigger(modData.stage2ModuleAssessmentLeadCommentsTrigger);
      setStage2ModeratorCommentsTrigger(modData.stage2ModeratorCommentsTrigger);
      setQuestions(modData.questions || []);
    }
  }, [modData]);

  const validateSectionFields = (requiredFields) => {
    return requiredFields.every((field) => field && field.trim() !== "");
  };

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', yesNoAnswer: false, comment: '' }]);
  };
  
  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const deleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (updatedTriggers, requiredFields, section) => {
    if (!validateSectionFields(requiredFields)) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    const formData = formRef.current.elements;
    const data = {
      title: formData.title.value,
      moduleCode: formData.moduleCode.value,
      moduleLeader: modData?.moduleLeader || '',
      assessmentCategory: formData.assessmentCategory.value,
      skills: formData.skills.value,
      assessmentWeighting: formData.assessmentWeighting.value,
      plannedIssueDate: formData.plannedIssueDate.value,
      courseworkSubmissionDate: formData.courseworkSubmissionDate.value,
      userRoles: modData?.userRoles || [],
      moduleAssessmentLeadSignature: formData.moduleAssessmentLeadSignature.value,
      moduleAssessmentLeadSignatureDateTime: editAssessment ? formatDateTime(new Date()) : modData?.moduleAssessmentLeadSignatureDateTime, // Format for backend
      responseToInternalModerator:editResponseToInternalModerator ? formData.responseToInternalModerator?.value:modData.responseToInternalModerator,
      responseToInternalModeratorDateTime: editResponseToInternalModerator ? formatDateTime(new Date()) : modData?.responseToInternalModeratorDateTime, // Format for backend
      responseToExternalExaminer: editResponseToExternalExaminer?formData.responseToExternalExaminer?.value:modData.responseToExternalExaminer,
      responseToExternalExaminerDateTime: editResponseToExternalExaminer ? formatDateTime(new Date()) : modData?.responseToExternalExaminerDateTime, // Format for backend
      stage2_assessmentLeadComments: editStage2ModuleAssessmentLeadComments?formData.stage2_assessmentLeadComments?.value:modData.stage2_assessmentLeadComments,
      internalModeratorComments: formData.internalModeratorComments?.value,
      internalModeratorSignature: formData.internalModeratorSignature?.value,
      internalModeratorSignatureDateTime: editInternalModerator ? formatDateTime(new Date()) : modData?.internalModeratorSignatureDateTime, // Format for backend
      stage2_moderatorComments: editStage2ModeratorComments?formData.stage2_moderatorComments?.value:modData.stage2_moderatorComments,
      externalExaminerComments: editExternalExaminer?formData.externalExaminerComments?.value: modData.externalExaminerComments,
      externalExaminerApproval: formData.externalExaminerApproval?.value,
      externalExaminerSignatureDateTime: editExternalExaminer ? formatDateTime(new Date()) : modData?.externalExaminerSignatureDateTime, // Format for backend
      externalExaminer_signature: editExternalExaminer?formData.externalExaminer_signature?.value: modData.externalExaminer_signature,
      programmeDirectorApproval: formData.programmeDirectorApproval?.value,
      programmeDirectorSignatureDateTime: editProgrammeDirector ? formatDateTime(new Date()) : modData?.programmeDirectorSignatureDateTime, // Format for backend
      programmeDirectorConfirmation_signature: formData.programmeDirectorConfirmation_signature?.value,
      programmeDirectorConfirmation_signature_stage2: editProgrammeDirectorConfirmation? formData.programmeDirectorConfirmation_signature_stage2?.value:modData.programmeDirectorConfirmation_signature_stage2,
      assessmentDeadline: editStage2ModeratorComments?formData.assessmentDeadline?.value:modData.assessmentDeadline,
      totalSubmissions: editStage2ModeratorComments?formData.totalSubmissions?.value:modData.totalSubmissions,
      failedSubmissions: editStage2ModeratorComments?formData.failedSubmissions?.value:modData.failedSubmissions,
      moderatedSubmissions: editStage2ModeratorComments?formData.moderatedSubmissions?.value:modData.moderatedSubmissions,
      teachingImpactDetails: editStage2ModeratorComments?formData.teachingImpactDetails?.value:modData.teachingImpactDetails,
      markingCompletedDate: editStage2ModeratorComments?formData.markingCompletedDate?.value:modData.markingCompletedDate,
      moderationCompletedDate: editStage2ModeratorComments?formData.moderationCompletedDate?.value:modData.moderationCompletedDate,
      moderatorSignatureDateTime: editStage2ModeratorComments ? formatDateTime(new Date()) : modData?.moderatorSignatureDateTime, // Format for backend
      stage2ModuleAssessmentLeadSignatureDateTime: editStage2ModuleAssessmentLeadComments ? formatDateTime(new Date()) : modData?.stage2ModuleAssessmentLeadSignatureDateTime, // Format for backend
      programmeDirectorConfirmation_signatureDateTime_stage2: editProgrammeDirectorConfirmation ? formatDateTime(new Date()) : modData?.programmeDirectorConfirmation_signatureDateTime_stage2, // Format for backend
      questions: questions.map(q => ({
        id: q.id,  // Include if it's an existing question
        questionText: q.questionText,
        yesNoAnswer: q.yesNoAnswer,
        comment: q.comment
      })),
      ...updatedTriggers,
    };
    try{
        await  axiosInstance.put(`/api/v1/assessments/${props.assessmentId}`, data);
       
    // After successful submission, send the appropriate email
    switch(section) {
      case 'internalModerator':
        await notifyInternalModerator("mendoncamax1234@gmail.com", {
          title: data.title,
          module: data.moduleCode,
          dueDate: data.courseworkSubmissionDate
        });
        break;
      case 'externalExaminer':
        await notifyExternalExaminer("mendoncamax1234@gmail.com", {
          title: data.title,
          module: data.moduleCode,
          dueDate: data.courseworkSubmissionDate
        });
        break;
      case 'programmeDirector':
        await notifyProgrammeDirector("mendoncamax1234@gmail.com", {
          title: data.title,
          module: data.moduleCode,
          dueDate: data.courseworkSubmissionDate
        });
        break;
      // Add other cases as needed
    }

        alert("Submission successful and notification sent.");
    } catch (error) {
      console.error("Error in submission or sending notification:", error);
      alert("An error occurred. Please try again.");
    }
};

  return (
    <div>
      <form ref={formRef} action="">
        {/* Assessment Details Section */}
        <h1>Assessment Details</h1>
        <p>{modData?.id}</p>

        <label htmlFor="title">Title</label>
        <input defaultValue={modData?.title} disabled={!editAssessment} name="title" type="text" /><br></br>

        <label htmlFor="moduleCode">Module Code</label>
        <input defaultValue={modData?.moduleCode} disabled={!editAssessment} name="moduleCode" type="text" /><br></br>

        <label htmlFor="assessmentCategory">Assessment Category</label>
        <input defaultValue={modData?.assessmentCategory} disabled={!editAssessment} name="assessmentCategory" type="text" /><br></br>

        <label htmlFor="skills">Skills</label>
        <input defaultValue={modData?.skills} disabled={!editAssessment} name="skills" type="text" /><br></br>

        <label htmlFor="assessmentWeighting">Assessment Weighting</label>
        <input defaultValue={modData?.assessmentWeighting} disabled={!editAssessment} name="assessmentWeighting" type="number" /><br></br>

        <label htmlFor="plannedIssueDate">Planned Issue Date</label>
        <input defaultValue={modData?.plannedIssueDate} disabled={!editAssessment} name="plannedIssueDate" type="date" /><br></br>

        <label htmlFor="courseworkSubmissionDate">Coursework Submission Date</label>
        <input defaultValue={modData?.courseworkSubmissionDate} disabled={!editAssessment} name="courseworkSubmissionDate" type="date" /><br></br>

        <label htmlFor="moduleAssessmentLeadSignature">Module Assessment Lead Signature</label>
        <input defaultValue={modData?.moduleAssessmentLeadSignature} disabled={!editAssessment} name="moduleAssessmentLeadSignature" type="text" /><br></br>

        <label htmlFor="moduleAssessmentLeadSignatureDateTime">Module Assessment Lead Signature DateTime</label>
        <input disabled value={modData?.moduleAssessmentLeadSignatureDateTime || ''} name="moduleAssessmentLeadSignatureDateTime" type="text" readOnly /><br></br>

        {!editAssessment && (
          <button onClick={(e) => { e.preventDefault(); setEditAssessment(true); }}>Edit</button>
        )}

        {editAssessment && (
          <>
            <button onClick={(e) => { e.preventDefault(); setEditAssessment(false); }}>Cancel</button>
            <button onClick={(e) => { e.preventDefault(); 
              handleSubmit({ 
                assessmentDetailsTrigger: "Completed", 
                internalModeratorDetailsTrigger: "Not Complete", 
                externalExaminerDetailsTrigger: "Not Complete", 
                responseToInternalModeratorTrigger: "Not Complete", 
                responseToExternalExaminerTrigger: "Not Complete", 
                programmeDirectorDetailsTrigger: "Not Complete", 
                internalModeratorModerationOfMarksTrigger: "Not Complete", 
                stage2ModuleAssessmentLeadCommentsTrigger: "Not Complete", 
                stage2ModeratorCommentsTrigger: "Not Complete" 
              }, [
                formRef.current.elements.title.value,
                formRef.current.elements.moduleCode.value,
                formRef.current.elements.assessmentCategory.value,
                formRef.current.elements.skills.value,
                formRef.current.elements.assessmentWeighting.value,
                formRef.current.elements.plannedIssueDate.value,
                formRef.current.elements.courseworkSubmissionDate.value,
                formRef.current.elements.moduleAssessmentLeadSignature.value,
              ],'internalModerator'); }}>Submit Assessment Details</button>
          </>
        )}

        {/* Internal Moderator Section */}
        {modData?.assessmentDetailsTrigger == "Completed" && (
          <>
            <h1>Internal Moderator Section</h1>
            <h2>Questions</h2>
            {questions.map((question, index) => (
              <div key={index}>
                <label htmlFor={`questionText-${index}`}>Question Text</label>
                <input
                  id={`questionText-${index}`}
                  value={question.questionText}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index].questionText = e.target.value;
                    setQuestions(newQuestions);
                  }}
                  disabled={!editInternalModerator}
                  type="text"
                />

                <label htmlFor={`yesNoAnswer-${index}`}>Yes/No Answer</label>
                <select
                  id={`yesNoAnswer-${index}`}
                  value={question.yesNoAnswer}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index].yesNoAnswer = e.target.value === 'true';
                    setQuestions(newQuestions);
                  }}
                  disabled={!editInternalModerator}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>

                <label htmlFor={`comment-${index}`}>Comment</label>
                <input
                  id={`comment-${index}`}
                  value={question.comment}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index].comment = e.target.value;
                    setQuestions(newQuestions);
                  }}
                  disabled={!editInternalModerator}
                  type="text"
                />

                <button 
                  type="button" 
                  onClick={(e) => {
                    e.preventDefault();
                    deleteQuestion(index);
                  }} 
                  disabled={!editInternalModerator}
                >
                  Delete Question
                </button>
              </div>
            ))}

            <button 
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                addQuestion();
              }} 
              disabled={!editInternalModerator}
            >
              Add Question
            </button>

            <label htmlFor="internalModeratorComments">Internal Moderator Comments</label>
            <input defaultValue={modData?.internalModeratorComments} disabled={!editInternalModerator} name="internalModeratorComments" type="text" /><br></br>
            
            <label htmlFor="internalModeratorSignature">Internal Moderator Signature</label>
            <input defaultValue={modData?.internalModeratorSignature} disabled={!editInternalModerator} name="internalModeratorSignature" type="text" /><br></br>

            <label htmlFor="internalModeratorSignatureDateTime">Internal Moderator Signature Date Time</label>
            <input disabled value={modData?.internalModeratorSignatureDateTime || ''} name="internalModeratorSignatureDateTime" type="text" readOnly /><br></br>
            
            {!editInternalModerator && (
              <button onClick={(e) => { e.preventDefault(); setEditInternalModerator(true); }}>Edit</button>
            )}

            {editInternalModerator && (
              <>
                <button onClick={(e) => { e.preventDefault(); setEditInternalModerator(false); }}>Cancel</button>
                <button onClick={(e) => { 
                  e.preventDefault(); 
                  handleSubmit({ 
                    assessmentDetailsTrigger:"Completed",
                    internalModeratorDetailsTrigger: "Completed", 
                    responseToInternalModeratorTrigger: "Not Complete", 
                    externalExaminerDetailsTrigger: "Not Complete", 
                    responseToExternalExaminerTrigger: "Not Complete", 
                    programmeDirectorDetailsTrigger: "Not Complete", 
                    internalModeratorModerationOfMarksTrigger: "Not Complete", 
                    stage2ModuleAssessmentLeadCommentsTrigger: "Not Complete", 
                    stage2ModeratorCommentsTrigger: "Not Complete" 
                  }, [
                    formRef.current.elements.internalModeratorComments.value,
                    formRef.current.elements.internalModeratorSignature.value,
                    ...questions.flatMap(q => [q.questionText, q.comment])
                  ]); 
                }}>Submit</button>
              </>
            )}
          </>
        )}


        {/* Response to Internal Moderator Section */}
        {modData?.internalModeratorDetailsTrigger == "Completed" && (
          <>
            <h1>Response to Internal Moderator</h1>
            <label htmlFor="responseToInternalModerator">Response to Internal Moderator</label>
            <input defaultValue={modData?.responseToInternalModerator} disabled={!editResponseToInternalModerator} name="responseToInternalModerator" type="text" /><br></br>

            <label htmlFor="responseToInternalModeratorDateTime">Response to Internal Moderator Date Time</label>
            <input disabled value={modData?.responseToInternalModeratorDateTime || ''} name="responseToInternalModeratorDateTime" type="text" readOnly /><br></br>

            {!editResponseToInternalModerator && (
              <button onClick={(e) => { e.preventDefault(); setEditResponseToInternalModerator(true); }}>Edit</button>
            )}

            {editResponseToInternalModerator && (
              <>
                <button onClick={(e) => { e.preventDefault(); setEditResponseToInternalModerator(false); }}>Cancel</button>
                <button onClick={(e) => { e.preventDefault(); handleSubmit({ 
                  assessmentDetailsTrigger: "Completed", 
                  internalModeratorDetailsTrigger: "Completed", 
                  responseToInternalModeratorTrigger: "Completed", 
                  externalExaminerDetailsTrigger: "Not Complete", 
                  responseToExternalExaminerTrigger: "Not Complete", 
                  programmeDirectorDetailsTrigger: "Not Complete", 
                  internalModeratorModerationOfMarksTrigger: "Not Complete", 
                  stage2ModuleAssessmentLeadCommentsTrigger: "Not Complete", 
                  stage2ModeratorCommentsTrigger: "Not Complete" 
                }, [
                  formRef.current.elements.responseToInternalModerator.value,
                ]); }}>Submit</button>
              </>
            )}
          </>
        )}

        {/* External Examiner Section */}
        {modData?.responseToInternalModeratorTrigger == "Completed" && (
          <>
            <h1>External Examiner Section</h1>
            <label htmlFor="externalExaminerComments">External Examiner Comments</label>
            <input defaultValue={modData?.externalExaminerComments} disabled={!editExternalExaminer} name="externalExaminerComments" type="text" /><br></br>

            <label htmlFor="externalExaminerApproval">External Examiner Approval</label>
            <input defaultValue={modData?.externalExaminerApproval} disabled={!editExternalExaminer} name="externalExaminerApproval" type="text" /><br></br>

            <label htmlFor="externalExaminer_signature">External Examiner Signature</label>
            <input defaultValue={modData?.externalExaminer_signature} disabled={!editExternalExaminer} name="externalExaminer_signature" type="text" /><br></br>

            <label htmlFor="externalExaminerSignatureDateTime">External Examiner Signature Date Time</label>
            <input disabled value={modData?.externalExaminerSignatureDateTime || ''} name="externalExaminerSignatureDateTime" type="text" readOnly /><br></br>

            {!editExternalExaminer && (
              <button onClick={(e) => { e.preventDefault(); setEditExternalExaminer(true); }}>Edit</button>
            )}

            {editExternalExaminer && (
              <>
                <button onClick={(e) => { e.preventDefault(); setEditExternalExaminer(false); }}>Cancel</button>
                <button onClick={(e) => { e.preventDefault(); handleSubmit({ 
                  assessmentDetailsTrigger: "Completed", 
                  internalModeratorDetailsTrigger: "Completed", 
                  responseToInternalModeratorTrigger: "Completed", 
                  externalExaminerDetailsTrigger: "Completed", 
                  responseToExternalExaminerTrigger: "Not Complete", 
                  programmeDirectorDetailsTrigger: "Not Complete", 
                  internalModeratorModerationOfMarksTrigger: "Not Complete", 
                  stage2ModuleAssessmentLeadCommentsTrigger: "Not Complete", 
                  stage2ModeratorCommentsTrigger: "Not Complete" 
                }, [
                  formRef.current.elements.externalExaminerComments.value,
                  formRef.current.elements.externalExaminerApproval.value,
                  formRef.current.elements.externalExaminer_signature.value
                ]); }}>Submit External Examiner Details</button>
              </>
            )}
          </>
        )}

        {/* Response to External Examiner Section */}
        {modData?.externalExaminerDetailsTrigger == "Completed" && (
          <>
            <h1>Response to External Examiner</h1>
            <label htmlFor="responseToExternalExaminer">Response to External Examiner</label>
            <input defaultValue={modData?.responseToExternalExaminer} disabled={!editResponseToExternalExaminer} name="responseToExternalExaminer" type="text" /><br></br>

            <label htmlFor="responseToExternalExaminerDateTime">Response to External Examiner Date Time</label>
            <input disabled value={modData?.responseToExternalExaminerDateTime || ''} name="responseToExternalExaminerDateTime" type="text" readOnly /><br></br>

            {!editResponseToExternalExaminer && (
              <button onClick={(e) => { e.preventDefault(); setEditResponseToExternalExaminer(true); }}>Edit</button>
            )}

            {editResponseToExternalExaminer && (
              <>
                <button onClick={(e) => { e.preventDefault(); setEditResponseToExternalExaminer(false); }}>Cancel</button>
                <button onClick={(e) => { e.preventDefault(); handleSubmit({ 
                  assessmentDetailsTrigger: "Completed", 
                  internalModeratorDetailsTrigger: "Completed", 
                  responseToInternalModeratorTrigger: "Completed", 
                  externalExaminerDetailsTrigger: "Completed", 
                  responseToExternalExaminerTrigger: "Completed", 
                  programmeDirectorDetailsTrigger: "Not Complete", 
                  internalModeratorModerationOfMarksTrigger: "Not Complete", 
                  stage2ModuleAssessmentLeadCommentsTrigger: "Not Complete", 
                  stage2ModeratorCommentsTrigger: "Not Complete" 
                }, [
                  formRef.current.elements.responseToExternalExaminer.value,
                ]); }}>Submit</button>
              </>
            )}
          </>
        )}

        {/* Programme Director Section */}
        {modData?.responseToExternalExaminerTrigger == "Completed" && (
          <>
            <h1>Programme Director Section</h1>
            <label htmlFor="programmeDirectorApproval">Programme Director Approval</label>
            <input defaultValue={modData?.programmeDirectorApproval} disabled={!editProgrammeDirector} name="programmeDirectorApproval" type="text" /><br></br>

            <label htmlFor="programmeDirectorConfirmation_signature">Programme Director Confirmation Signature</label>
            <input defaultValue={modData?.programmeDirectorConfirmation_signature} disabled={!editProgrammeDirector} name="programmeDirectorConfirmation_signature" type="text" /><br></br>

            <label htmlFor="programmeDirectorSignatureDateTime">Programme Director Signature Date Time</label>
            <input disabled value={modData?.programmeDirectorSignatureDateTime || ''} name="programmeDirectorSignatureDateTime" type="text" readOnly /><br></br>

            {!editProgrammeDirector && (
              <button onClick={(e) => { e.preventDefault(); setEditProgrammeDirector(true); }}>Edit</button>
            )}

            {editProgrammeDirector && (
              <>
                <button onClick={(e) => { e.preventDefault(); setEditProgrammeDirector(false); }}>Cancel</button>
                <button onClick={(e) => { e.preventDefault(); handleSubmit({ 
                  assessmentDetailsTrigger: "Completed", 
                  internalModeratorDetailsTrigger: "Completed", 
                  responseToInternalModeratorTrigger: "Completed", 
                  externalExaminerDetailsTrigger: "Completed", 
                  responseToExternalExaminerTrigger: "Completed", 
                  programmeDirectorDetailsTrigger: "Completed", 
                  internalModeratorModerationOfMarksTrigger: "Not Complete", 
                  stage2ModuleAssessmentLeadCommentsTrigger: "Not Complete", 
                  stage2ModeratorCommentsTrigger: "Not Complete" 
                }, [
                  formRef.current.elements.programmeDirectorApproval.value,
                  formRef.current.elements.programmeDirectorConfirmation_signature.value
                ]); }}>Submit</button>
              </>
            )}
          </>
        )}

        {/* Moderator Section */}
        {modData?.programmeDirectorDetailsTrigger == "Completed" && (
          <>
            <h1>Moderator Section</h1>
            <label htmlFor="assessmentDeadline">Assessment Deadline</label>
            <input defaultValue={modData?.assessmentDeadline} disabled={!editStage2ModeratorComments} name="assessmentDeadline" type="date" /><br></br>

            <label htmlFor="markingCompletedDate">Marking Completed Date</label>
            <input defaultValue={modData?.markingCompletedDate} disabled={!editStage2ModeratorComments} name="markingCompletedDate" type="date" /><br></br>

            <label htmlFor="moderationCompletedDate">Moderation Completed Date</label>
            <input defaultValue={modData?.moderationCompletedDate} disabled={!editStage2ModeratorComments} name="moderationCompletedDate" type="date" /><br></br>

            <label htmlFor="totalSubmissions">Total Submissions</label>
            <input defaultValue={modData?.totalSubmissions} disabled={!editStage2ModeratorComments} name="totalSubmissions" type="number" /><br></br>

            <label htmlFor="failedSubmissions">Failed Submissions</label>
            <input defaultValue={modData?.failedSubmissions} disabled={!editStage2ModeratorComments} name="failedSubmissions" type="number" /><br></br>

            <label htmlFor="moderatedSubmissions">Moderated Submissions</label>
            <input defaultValue={modData?.moderatedSubmissions} disabled={!editStage2ModeratorComments} name="moderatedSubmissions" type="number" /><br></br>

            <label htmlFor="teachingImpactDetails">Teaching Impact Details</label>
            <input defaultValue={modData?.teachingImpactDetails} disabled={!editStage2ModeratorComments} name="teachingImpactDetails" type="text" /><br></br>

            <label htmlFor="stage2_moderatorComments">Stage 2 Moderator Comments</label>
            <input defaultValue={modData?.stage2_moderatorComments} disabled={!editStage2ModeratorComments} name="stage2_moderatorComments" type="text" /><br></br>

            <label htmlFor="moderatorSignatureDateTime">Moderator Signature Date Time</label>
            <input disabled value={modData?.moderatorSignatureDateTime || ''} name="moderatorSignatureDateTime" type="text" readOnly /><br></br>

            {!editStage2ModeratorComments && (
              <button onClick={(e) => { e.preventDefault(); setEditStage2ModeratorComments(true); }}>Edit</button>
            )}

            {editStage2ModeratorComments && (
              <>
                <button onClick={(e) => { e.preventDefault(); setEditStage2ModeratorComments(false); }}>Cancel</button>
                <button onClick={(e) => { e.preventDefault(); handleSubmit({ 
                  assessmentDetailsTrigger: "Completed", 
                  internalModeratorDetailsTrigger: "Completed", 
                  responseToInternalModeratorTrigger: "Completed", 
                  externalExaminerDetailsTrigger: "Completed", 
                  responseToExternalExaminerTrigger: "Completed", 
                  programmeDirectorDetailsTrigger: "Completed", 
                  internalModeratorModerationOfMarksTrigger: "Completed", 
                  stage2ModuleAssessmentLeadCommentsTrigger: "Not Complete", 
                  stage2ModeratorCommentsTrigger: "Completed" 
                }, [
                  formRef.current.elements.assessmentDeadline.value,
                  formRef.current.elements.markingCompletedDate.value,
                  formRef.current.elements.moderationCompletedDate.value,
                  formRef.current.elements.totalSubmissions.value,
                  formRef.current.elements.failedSubmissions.value,
                  formRef.current.elements.moderatedSubmissions.value,
                  formRef.current.elements.teachingImpactDetails.value
                ]); }}>Submit</button>
              </>
            )}
          </>
        )}

        {/* Assessment Lead Stage 2 Section */}
        {modData?.stage2ModeratorCommentsTrigger == "Completed" && (
          <>
            <h1>Assessment Lead Stage 2 Section</h1>
            <label htmlFor="stage2_assessmentLeadComments">Stage 2 Assessment Lead Comments</label>
            <input defaultValue={modData?.stage2_assessmentLeadComments} disabled={!editStage2ModuleAssessmentLeadComments} name="stage2_assessmentLeadComments" type="text" /><br></br>

            <label htmlFor="stage2ModuleAssessmentLeadSignatureDateTime">Stage 2 Module Assessment Lead Signature Date Time</label>
            <input disabled value={modData?.stage2ModuleAssessmentLeadSignatureDateTime || ''} name="stage2ModuleAssessmentLeadSignatureDateTime" type="text" readOnly /><br></br>

            {!editStage2ModuleAssessmentLeadComments && (
              <button onClick={(e) => { e.preventDefault(); setEditStage2ModuleAssessmentLeadComments(true); }}>Edit</button>
            )}

            {editStage2ModuleAssessmentLeadComments && (
              <>
                <button onClick={(e) => { e.preventDefault(); setEditStage2ModuleAssessmentLeadComments(false); }}>Cancel</button>
                <button onClick={(e) => { e.preventDefault(); handleSubmit({ 
                  assessmentDetailsTrigger: "Completed", 
                  internalModeratorDetailsTrigger: "Completed", 
                  responseToInternalModeratorTrigger: "Completed", 
                  externalExaminerDetailsTrigger: "Completed", 
                  responseToExternalExaminerTrigger: "Completed", 
                  programmeDirectorDetailsTrigger: "Completed", 
                  internalModeratorModerationOfMarksTrigger: "Completed", 
                  stage2ModuleAssessmentLeadCommentsTrigger: "Completed", 
                  stage2ModeratorCommentsTrigger: "Completed" 
                }, [
                  formRef.current.elements.stage2_assessmentLeadComments.value
                ]); }}>Submit</button>
              </>
            )}
          </>
        )}

        {/* Final Confirmation by Programme Director Section */}
        {modData?.stage2ModuleAssessmentLeadCommentsTrigger == "Completed" && (
          <>
            <h1>Final Confirmation by Programme Director</h1>
            

            <label htmlFor="programmeDirectorConfirmation_signature_stage2">Stage 2 Confirmation Signature</label>
            <input defaultValue={modData?.programmeDirectorConfirmation_signature_stage2} disabled={!editProgrammeDirectorConfirmation} name="programmeDirectorConfirmation_signature_stage2" type="text" /><br></br>

            <label htmlFor="programmeDirectorConfirmation_signatureDateTime_stage2">Programme Director Confirmation Signature DateTime Stage 2</label>
            <input disabled value={modData?.programmeDirectorConfirmation_signatureDateTime_stage2 || ''} name="programmeDirectorConfirmation_signatureDateTime_stage2" type="text" readOnly /><br></br>

            {!editProgrammeDirectorConfirmation && (
              <button onClick={(e) => { e.preventDefault(); setEditProgrammeDirectorConfirmation(true); }}>Edit</button>
            )}

            {editProgrammeDirectorConfirmation && (
              <>
                <button onClick={(e) => { e.preventDefault(); setEditProgrammeDirectorConfirmation(false); }}>Cancel</button>
                <button onClick={(e) => { e.preventDefault(); handleSubmit({ 
                  assessmentDetailsTrigger: "Completed", 
                  internalModeratorDetailsTrigger: "Completed", 
                  responseToInternalModeratorTrigger: "Completed", 
                  externalExaminerDetailsTrigger: "Completed", 
                  responseToExternalExaminerTrigger: "Completed", 
                  programmeDirectorDetailsTrigger: "Completed", 
                  internalModeratorModerationOfMarksTrigger: "Completed", 
                  stage2ModuleAssessmentLeadCommentsTrigger: "Completed", 
                  stage2ModeratorCommentsTrigger: "Completed",
                  programmeDirectorConfirmation_signature: "Completed", 
                  programmeDirectorConfirmation_signature_stage2: "Completed" 
                }, [
                  formRef.current.elements.programmeDirectorConfirmation_signature.value,
                  formRef.current.elements.programmeDirectorConfirmation_signature_stage2.value
                ]); }}>Submit Final Confirmation</button>
              </>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default ModerationForm_2;



// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import axiosInstance from "@/utils/axios";

// // Helper function to format date-time as "yyyy-MM-dd'T'HH:mm:ss"
// const formatDateTime = (date) => {
//   return date.toISOString().split('.')[0]; // Removes the milliseconds and timezone part
// };

// const ModerationForm_2 = (props) => {
//   const [modData, setModData] = useState(null);

//   useEffect(() => {
//     axiosInstance
//       .get(`/api/v1/assessments/${props.assessmentId}`)
//       .then((data) => {
//         setModData(data.data);
//       });
//   }, [props.assessmentId]);

//   const formRef = useRef(null);

//   //questions
//   const [questions, setQuestions] = useState(modData?.questions || []);

//   // Triggers
//   const [assessmentDetailsTrigger, setAssessmentDetailsTrigger] = useState();
//   const [internalModeratorDetailsTrigger, setInternalModeratorDetailsTrigger] = useState();
//   const [externalExaminerDetailsTrigger, setExternalExaminerDetailsTrigger] = useState();
//   const [programmeDirectorDetailsTrigger, setProgrammeDirectorDetailsTrigger] = useState();
//   const [internalModeratorModerationOfMarksTrigger, setInternalModeratorModerationOfMarksTrigger] = useState();
//   const [stage2ModuleAssessmentLeadCommentsTrigger, setStage2ModuleAssessmentLeadCommentsTrigger] = useState();
//   const [stage2ModeratorCommentsTrigger, setStage2ModeratorCommentsTrigger] = useState();
//   const [responseToInternalModeratorTrigger, setResponseToInternalModeratorTrigger] = useState();
//   const [responseToExternalExaminerTrigger, setResponseToExternalExaminerTrigger] = useState();

//   // Buttons for toggling edit modes
//   const [editAssessment, setEditAssessment] = useState(false);
//   const [editInternalModerator, setEditInternalModerator] = useState(false);
//   const [editExternalExaminer, setEditExternalExaminer] = useState(false);
//   const [editProgrammeDirector, setEditProgrammeDirector] = useState(false);
//   const [editInternalModeratorModerationOfMarks, setEditInternalModeratorModerationOfMarks] = useState(false);
//   const [editStage2ModuleAssessmentLeadComments, setEditStage2ModuleAssessmentLeadComments] = useState(false);
//   const [editStage2ModeratorComments, setEditStage2ModeratorComments] = useState(false);
//   const [editResponseToInternalModerator, setEditResponseToInternalModerator] = useState(false);
//   const [editResponseToExternalExaminer, setEditResponseToExternalExaminer] = useState(false);
//   const [editProgrammeDirectorConfirmation,setEditProgrammeDirectorConfirmation]=useState(false);

//   useEffect(() => {
//     if (modData) {
//       setAssessmentDetailsTrigger(modData.assessmentDetailsTrigger);
//       setInternalModeratorDetailsTrigger(modData.internalModeratorDetailsTrigger);
//       setResponseToInternalModeratorTrigger(modData.responseToInternalModeratorTrigger);
//       setExternalExaminerDetailsTrigger(modData.externalExaminerDetailsTrigger);
//       setResponseToExternalExaminerTrigger(modData.responseToExternalExaminerTrigger);
//       setProgrammeDirectorDetailsTrigger(modData.programmeDirectorDetailsTrigger);
//       setInternalModeratorModerationOfMarksTrigger(modData.internalModeratorModerationOfMarksTrigger);
//       setStage2ModuleAssessmentLeadCommentsTrigger(modData.stage2ModuleAssessmentLeadCommentsTrigger);
//       setStage2ModeratorCommentsTrigger(modData.stage2ModeratorCommentsTrigger);
//       setQuestions(modData.questions || []);
//     }
//   }, [modData]);

//   const validateSectionFields = (requiredFields) => {
//     return requiredFields.every((field) => field && field.trim() !== "");
//   };

//   const addQuestion = () => {
//     setQuestions([...questions, { questionText: '', yesNoAnswer: false, comment: '' }]);
//   };
  
//   const handleQuestionChange = (index, field, value) => {
//     const newQuestions = [...questions];
//     newQuestions[index][field] = value;
//     setQuestions(newQuestions);
//   };

//   const deleteQuestion = (index) => {
//     setQuestions(questions.filter((_, i) => i !== index));
//   };

//   const handleSubmit = (updatedTriggers, requiredFields) => {
//     if (!validateSectionFields(requiredFields)) {
//       alert("Please fill in all fields before submitting.");
//       return;
//     }

//     const formData = formRef.current.elements;
//     const data = {
//       title: formData.title.value,
//       moduleCode: formData.moduleCode.value,
//       moduleLeader: modData?.moduleLeader || '',
//       assessmentCategory: formData.assessmentCategory.value,
//       skills: formData.skills.value,
//       assessmentWeighting: formData.assessmentWeighting.value,
//       plannedIssueDate: formData.plannedIssueDate.value,
//       courseworkSubmissionDate: formData.courseworkSubmissionDate.value,
//       userRoles: modData?.userRoles || [],
//       moduleAssessmentLeadSignature: formData.moduleAssessmentLeadSignature.value,
//       moduleAssessmentLeadSignatureDateTime: editAssessment ? formatDateTime(new Date()) : modData?.moduleAssessmentLeadSignatureDateTime, // Format for backend
//       responseToInternalModerator:editResponseToInternalModerator ? formData.responseToInternalModerator?.value:modData.responseToInternalModerator,
//       responseToInternalModeratorDateTime: editResponseToInternalModerator ? formatDateTime(new Date()) : modData?.responseToInternalModeratorDateTime, // Format for backend
//       responseToExternalExaminer: editResponseToExternalExaminer?formData.responseToExternalExaminer?.value:modData.responseToExternalExaminer,
//       responseToExternalExaminerDateTime: editResponseToExternalExaminer ? formatDateTime(new Date()) : modData?.responseToExternalExaminerDateTime, // Format for backend
//       stage2_assessmentLeadComments: editStage2ModuleAssessmentLeadComments?formData.stage2_assessmentLeadComments?.value:modData.stage2_assessmentLeadComments,
//       internalModeratorComments: formData.internalModeratorComments?.value,
//       internalModeratorSignature: formData.internalModeratorSignature?.value,
//       internalModeratorSignatureDateTime: editInternalModerator ? formatDateTime(new Date()) : modData?.internalModeratorSignatureDateTime, // Format for backend
//       stage2_moderatorComments: editStage2ModeratorComments?formData.stage2_moderatorComments?.value:modData.stage2_moderatorComments,
//       externalExaminerComments: editExternalExaminer?formData.externalExaminerComments?.value: modData.externalExaminerComments,
//       externalExaminerApproval: formData.externalExaminerApproval?.value,
//       externalExaminerSignatureDateTime: editExternalExaminer ? formatDateTime(new Date()) : modData?.externalExaminerSignatureDateTime, // Format for backend
//       externalExaminer_signature: editExternalExaminer?formData.externalExaminer_signature?.value: modData.externalExaminer_signature,
//       programmeDirectorApproval: formData.programmeDirectorApproval?.value,
//       programmeDirectorSignatureDateTime: editProgrammeDirector ? formatDateTime(new Date()) : modData?.programmeDirectorSignatureDateTime, // Format for backend
//       programmeDirectorConfirmation_signature: formData.programmeDirectorConfirmation_signature?.value,
//       programmeDirectorConfirmation_signature_stage2: editProgrammeDirectorConfirmation? formData.programmeDirectorConfirmation_signature_stage2?.value:modData.programmeDirectorConfirmation_signature_stage2,
//       assessmentDeadline: editStage2ModeratorComments?formData.assessmentDeadline?.value:modData.assessmentDeadline,
//       totalSubmissions: editStage2ModeratorComments?formData.totalSubmissions?.value:modData.totalSubmissions,
//       failedSubmissions: editStage2ModeratorComments?formData.failedSubmissions?.value:modData.failedSubmissions,
//       moderatedSubmissions: editStage2ModeratorComments?formData.moderatedSubmissions?.value:modData.moderatedSubmissions,
//       teachingImpactDetails: editStage2ModeratorComments?formData.teachingImpactDetails?.value:modData.teachingImpactDetails,
//       markingCompletedDate: editStage2ModeratorComments?formData.markingCompletedDate?.value:modData.markingCompletedDate,
//       moderationCompletedDate: editStage2ModeratorComments?formData.moderationCompletedDate?.value:modData.moderationCompletedDate,
//       moderatorSignatureDateTime: editStage2ModeratorComments ? formatDateTime(new Date()) : modData?.moderatorSignatureDateTime, // Format for backend
//       stage2ModuleAssessmentLeadSignatureDateTime: editStage2ModuleAssessmentLeadComments ? formatDateTime(new Date()) : modData?.stage2ModuleAssessmentLeadSignatureDateTime, // Format for backend
//       programmeDirectorConfirmation_signatureDateTime_stage2: editProgrammeDirectorConfirmation ? formatDateTime(new Date()) : modData?.programmeDirectorConfirmation_signatureDateTime_stage2, // Format for backend
//       questions: questions.map(q => ({
//         id: q.id,  // Include if it's an existing question
//         questionText: q.questionText,
//         yesNoAnswer: q.yesNoAnswer,
//         comment: q.comment
//       })),
//       ...updatedTriggers,
//     };

//     axiosInstance.put(`/api/v1/assessments/${props.assessmentId}`, data);
//   };

//   return (
//     <div>
//       <form ref={formRef} action="">
//         {/* Assessment Details Section */}
//         <h1>Assessment Details</h1>
//         <p>{modData?.id}</p>

//         <label htmlFor="title">Title</label>
//         <input defaultValue={modData?.title} disabled={!editAssessment} name="title" type="text" /><br></br>

//         <label htmlFor="moduleCode">Module Code</label>
//         <input defaultValue={modData?.moduleCode} disabled={!editAssessment} name="moduleCode" type="text" /><br></br>

//         <label htmlFor="assessmentCategory">Assessment Category</label>
//         <input defaultValue={modData?.assessmentCategory} disabled={!editAssessment} name="assessmentCategory" type="text" /><br></br>

//         <label htmlFor="skills">Skills</label>
//         <input defaultValue={modData?.skills} disabled={!editAssessment} name="skills" type="text" /><br></br>

//         <label htmlFor="assessmentWeighting">Assessment Weighting</label>
//         <input defaultValue={modData?.assessmentWeighting} disabled={!editAssessment} name="assessmentWeighting" type="number" /><br></br>

//         <label htmlFor="plannedIssueDate">Planned Issue Date</label>
//         <input defaultValue={modData?.plannedIssueDate} disabled={!editAssessment} name="plannedIssueDate" type="date" /><br></br>

//         <label htmlFor="courseworkSubmissionDate">Coursework Submission Date</label>
//         <input defaultValue={modData?.courseworkSubmissionDate} disabled={!editAssessment} name="courseworkSubmissionDate" type="date" /><br></br>

//         <label htmlFor="moduleAssessmentLeadSignature">Module Assessment Lead Signature</label>
//         <input defaultValue={modData?.moduleAssessmentLeadSignature} disabled={!editAssessment} name="moduleAssessmentLeadSignature" type="text" /><br></br>

//         <label htmlFor="moduleAssessmentLeadSignatureDateTime">Module Assessment Lead Signature DateTime</label>
//         <input disabled value={modData?.moduleAssessmentLeadSignatureDateTime || ''} name="moduleAssessmentLeadSignatureDateTime" type="text" readOnly /><br></br>

//         {!editAssessment && (
//           <button onClick={(e) => { e.preventDefault(); setEditAssessment(true); }}>Edit</button>
//         )}

//         {editAssessment && (
//           <>
//             <button onClick={(e) => { e.preventDefault(); setEditAssessment(false); }}>Cancel</button>
//             <button onClick={(e) => { e.preventDefault(); 
//               handleSubmit({ 
//                 assessmentDetailsTrigger: "Completed", 
//                 internalModeratorDetailsTrigger: "Not Complete", 
//                 externalExaminerDetailsTrigger: "Not Complete", 
//                 responseToInternalModeratorTrigger: "Not Complete", 
//                 responseToExternalExaminerTrigger: "Not Complete", 
//                 programmeDirectorDetailsTrigger: "Not Complete", 
//                 internalModeratorModerationOfMarksTrigger: "Not Complete", 
//                 stage2ModuleAssessmentLeadCommentsTrigger: "Not Complete", 
//                 stage2ModeratorCommentsTrigger: "Not Complete" 
//               }, [
//                 formRef.current.elements.title.value,
//                 formRef.current.elements.moduleCode.value,
//                 formRef.current.elements.assessmentCategory.value,
//                 formRef.current.elements.skills.value,
//                 formRef.current.elements.assessmentWeighting.value,
//                 formRef.current.elements.plannedIssueDate.value,
//                 formRef.current.elements.courseworkSubmissionDate.value,
//                 formRef.current.elements.moduleAssessmentLeadSignature.value,
//               ]); }}>Submit Assessment Details</button>
//           </>
//         )}

//         {/* Internal Moderator Section */}
// {modData?.assessmentDetailsTrigger == "Completed" && (
//   <>
//     <h1>Internal Moderator Section</h1>
//     <h2>Questions</h2>
//     {questions.map((question, index) => (
//       <div key={index}>
//         <label htmlFor={`questionText-${index}`}>Question Text</label>
//         <input
//           id={`questionText-${index}`}
//           value={question.questionText}
//           onChange={(e) => {
//             const newQuestions = [...questions];
//             newQuestions[index].questionText = e.target.value;
//             setQuestions(newQuestions);
//           }}
//           disabled={!editInternalModerator}
//           type="text"
//         />

//         <label htmlFor={`yesNoAnswer-${index}`}>Yes/No Answer</label>
//         <select
//           id={`yesNoAnswer-${index}`}
//           value={question.yesNoAnswer}
//           onChange={(e) => {
//             const newQuestions = [...questions];
//             newQuestions[index].yesNoAnswer = e.target.value === 'true';
//             setQuestions(newQuestions);
//           }}
//           disabled={!editInternalModerator}
//         >
//           <option value="true">Yes</option>
//           <option value="false">No</option>
//         </select>

//         <label htmlFor={`comment-${index}`}>Comment</label>
//         <input
//           id={`comment-${index}`}
//           value={question.comment}
//           onChange={(e) => {
//             const newQuestions = [...questions];
//             newQuestions[index].comment = e.target.value;
//             setQuestions(newQuestions);
//           }}
//           disabled={!editInternalModerator}
//           type="text"
//         />

//         <button 
//           type="button" 
//           onClick={(e) => {
//             e.preventDefault();
//             deleteQuestion(index);
//           }} 
//           disabled={!editInternalModerator}
//         >
//           Delete Question
//         </button>
//       </div>
//     ))}

//     <button 
//       type="button" 
//       onClick={(e) => {
//         e.preventDefault();
//         addQuestion();
//       }} 
//       disabled={!editInternalModerator}
//     >
//       Add Question
//     </button>

//     <label htmlFor="internalModeratorComments">Internal Moderator Comments</label>
//     <input defaultValue={modData?.internalModeratorComments} disabled={!editInternalModerator} name="internalModeratorComments" type="text" /><br></br>
    
//     <label htmlFor="internalModeratorSignature">Internal Moderator Signature</label>
//     <input defaultValue={modData?.internalModeratorSignature} disabled={!editInternalModerator} name="internalModeratorSignature" type="text" /><br></br>

//     <label htmlFor="internalModeratorSignatureDateTime">Internal Moderator Signature Date Time</label>
//     <input disabled value={modData?.internalModeratorSignatureDateTime || ''} name="internalModeratorSignatureDateTime" type="text" readOnly /><br></br>
    
//     {!editInternalModerator && (
//       <button onClick={(e) => { e.preventDefault(); setEditInternalModerator(true); }}>Edit</button>
//     )}

//     {editInternalModerator && (
//       <>
//         <button onClick={(e) => { e.preventDefault(); setEditInternalModerator(false); }}>Cancel</button>
//         <button onClick={(e) => { 
//           e.preventDefault(); 
//           handleSubmit({ 
//             assessmentDetailsTrigger:"Completed",
//             internalModeratorDetailsTrigger: "Completed", 
//             responseToInternalModeratorTrigger: "Not Complete", 
//             externalExaminerDetailsTrigger: "Not Complete", 
//             responseToExternalExaminerTrigger: "Not Complete", 
//             programmeDirectorDetailsTrigger: "Not Complete", 
//             internalModeratorModerationOfMarksTrigger: "Not Complete", 
//             stage2ModuleAssessmentLeadCommentsTrigger: "Not Complete", 
//             stage2ModeratorCommentsTrigger: "Not Complete" 
//           }, [
//             formRef.current.elements.internalModeratorComments.value,
//             formRef.current.elements.internalModeratorSignature.value,
//             ...questions.flatMap(q => [q.questionText, q.comment])
//           ]); 
//         }}>Submit</button>
//       </>
//     )}
//   </>
// )}

//         {/* Response to Internal Moderator Section */}
//         {modData?.internalModeratorDetailsTrigger == "Completed" && (
//           <>
//             <h1>Response to Internal Moderator</h1>
//             <label htmlFor="responseToInternalModerator">Response to Internal Moderator</label>
//             <input defaultValue={modData?.responseToInternalModerator} disabled={!editResponseToInternalModerator} name="responseToInternalModerator" type="text" /><br></br>

//             <label htmlFor="responseToInternalModeratorDateTime">Response to Internal Moderator Date Time</label>
//             <input disabled value={modData?.responseToInternalModeratorDateTime || ''} name="responseToInternalModeratorDateTime" type="text" readOnly /><br></br>

//             {!editResponseToInternalModerator && (
//               <button onClick={(e) => { e.preventDefault(); setEditResponseToInternalModerator(true); }}>Edit</button>
//             )}

//             {editResponseToInternalModerator && (
//               <>
//                 <button onClick={(e) => { e.preventDefault(); setEditResponseToInternalModerator(false); }}>Cancel</button>
//                 <button onClick={(e) => { e.preventDefault(); handleSubmit({ 
//                   assessmentDetailsTrigger: "Completed", 
//                   internalModeratorDetailsTrigger: "Completed", 
//                   responseToInternalModeratorTrigger: "Completed", 
//                   externalExaminerDetailsTrigger: "Not Complete", 
//                   responseToExternalExaminerTrigger: "Not Complete", 
//                   programmeDirectorDetailsTrigger: "Not Complete", 
//                   internalModeratorModerationOfMarksTrigger: "Not Complete", 
//                   stage2ModuleAssessmentLeadCommentsTrigger: "Not Complete", 
//                   stage2ModeratorCommentsTrigger: "Not Complete" 
//                 }, [
//                   formRef.current.elements.responseToInternalModerator.value,
//                 ]); }}>Submit</button>
//               </>
//             )}
//           </>
//         )}

//         {/* External Examiner Section */}
//         {modData?.responseToInternalModeratorTrigger == "Completed" && (
//           <>
//             <h1>External Examiner Section</h1>
//             <label htmlFor="externalExaminerComments">External Examiner Comments</label>
//             <input defaultValue={modData?.externalExaminerComments} disabled={!editExternalExaminer} name="externalExaminerComments" type="text" /><br></br>

//             <label htmlFor="externalExaminerApproval">External Examiner Approval</label>
//             <input defaultValue={modData?.externalExaminerApproval} disabled={!editExternalExaminer} name="externalExaminerApproval" type="text" /><br></br>

//             <label htmlFor="externalExaminer_signature">External Examiner Signature</label>
//             <input defaultValue={modData?.externalExaminer_signature} disabled={!editExternalExaminer} name="externalExaminer_signature" type="text" /><br></br>

//             <label htmlFor="externalExaminerSignatureDateTime">External Examiner Signature Date Time</label>
//             <input disabled value={modData?.externalExaminerSignatureDateTime || ''} name="externalExaminerSignatureDateTime" type="text" readOnly /><br></br>

//             {!editExternalExaminer && (
//               <button onClick={(e) => { e.preventDefault(); setEditExternalExaminer(true); }}>Edit</button>
//             )}

//             {editExternalExaminer && (
//               <>
//                 <button onClick={(e) => { e.preventDefault(); setEditExternalExaminer(false); }}>Cancel</button>
//                 <button onClick={(e) => { e.preventDefault(); handleSubmit({ 
//                   assessmentDetailsTrigger: "Completed", 
//                   internalModeratorDetailsTrigger: "Completed", 
//                   responseToInternalModeratorTrigger: "Completed", 
//                   externalExaminerDetailsTrigger: "Completed", 
//                   responseToExternalExaminerTrigger: "Not Complete", 
//                   programmeDirectorDetailsTrigger: "Not Complete", 
//                   internalModeratorModerationOfMarksTrigger: "Not Complete", 
//                   stage2ModuleAssessmentLeadCommentsTrigger: "Not Complete", 
//                   stage2ModeratorCommentsTrigger: "Not Complete" 
//                 }, [
//                   formRef.current.elements.externalExaminerComments.value,
//                   formRef.current.elements.externalExaminerApproval.value,
//                   formRef.current.elements.externalExaminer_signature.value
//                 ]); }}>Submit External Examiner Details</button>
//               </>
//             )}
//           </>
//         )}

//         {/* Response to External Examiner Section */}
//         {modData?.externalExaminerDetailsTrigger == "Completed" && (
//           <>
//             <h1>Response to External Examiner</h1>
//             <label htmlFor="responseToExternalExaminer">Response to External Examiner</label>
//             <input defaultValue={modData?.responseToExternalExaminer} disabled={!editResponseToExternalExaminer} name="responseToExternalExaminer" type="text" /><br></br>

//             <label htmlFor="responseToExternalExaminerDateTime">Response to External Examiner Date Time</label>
//             <input disabled value={modData?.responseToExternalExaminerDateTime || ''} name="responseToExternalExaminerDateTime" type="text" readOnly /><br></br>

//             {!editResponseToExternalExaminer && (
//               <button onClick={(e) => { e.preventDefault(); setEditResponseToExternalExaminer(true); }}>Edit</button>
//             )}

//             {editResponseToExternalExaminer && (
//               <>
//                 <button onClick={(e) => { e.preventDefault(); setEditResponseToExternalExaminer(false); }}>Cancel</button>
//                 <button onClick={(e) => { e.preventDefault(); handleSubmit({ 
//                   assessmentDetailsTrigger: "Completed", 
//                   internalModeratorDetailsTrigger: "Completed", 
//                   responseToInternalModeratorTrigger: "Completed", 
//                   externalExaminerDetailsTrigger: "Completed", 
//                   responseToExternalExaminerTrigger: "Completed", 
//                   programmeDirectorDetailsTrigger: "Not Complete", 
//                   internalModeratorModerationOfMarksTrigger: "Not Complete", 
//                   stage2ModuleAssessmentLeadCommentsTrigger: "Not Complete", 
//                   stage2ModeratorCommentsTrigger: "Not Complete" 
//                 }, [
//                   formRef.current.elements.responseToExternalExaminer.value,
//                 ]); }}>Submit</button>
//               </>
//             )}
//           </>
//         )}

//         {/* Programme Director Section */}
//         {modData?.responseToExternalExaminerTrigger == "Completed" && (
//           <>
//             <h1>Programme Director Section</h1>
//             <label htmlFor="programmeDirectorApproval">Programme Director Approval</label>
//             <input defaultValue={modData?.programmeDirectorApproval} disabled={!editProgrammeDirector} name="programmeDirectorApproval" type="text" /><br></br>

//             <label htmlFor="programmeDirectorConfirmation_signature">Programme Director Confirmation Signature</label>
//             <input defaultValue={modData?.programmeDirectorConfirmation_signature} disabled={!editProgrammeDirector} name="programmeDirectorConfirmation_signature" type="text" /><br></br>

//             <label htmlFor="programmeDirectorSignatureDateTime">Programme Director Signature Date Time</label>
//             <input disabled value={modData?.programmeDirectorSignatureDateTime || ''} name="programmeDirectorSignatureDateTime" type="text" readOnly /><br></br>

//             {!editProgrammeDirector && (
//               <button onClick={(e) => { e.preventDefault(); setEditProgrammeDirector(true); }}>Edit</button>
//             )}

//             {editProgrammeDirector && (
//               <>
//                 <button onClick={(e) => { e.preventDefault(); setEditProgrammeDirector(false); }}>Cancel</button>
//                 <button onClick={(e) => { e.preventDefault(); handleSubmit({ 
//                   assessmentDetailsTrigger: "Completed", 
//                   internalModeratorDetailsTrigger: "Completed", 
//                   responseToInternalModeratorTrigger: "Completed", 
//                   externalExaminerDetailsTrigger: "Completed", 
//                   responseToExternalExaminerTrigger: "Completed", 
//                   programmeDirectorDetailsTrigger: "Completed", 
//                   internalModeratorModerationOfMarksTrigger: "Not Complete", 
//                   stage2ModuleAssessmentLeadCommentsTrigger: "Not Complete", 
//                   stage2ModeratorCommentsTrigger: "Not Complete" 
//                 }, [
//                   formRef.current.elements.programmeDirectorApproval.value,
//                   formRef.current.elements.programmeDirectorConfirmation_signature.value
//                 ]); }}>Submit</button>
//               </>
//             )}
//           </>
//         )}

//         {/* Moderator Section */}
//         {modData?.programmeDirectorDetailsTrigger == "Completed" && (
//           <>
//             <h1>Moderator Section</h1>
//             <label htmlFor="assessmentDeadline">Assessment Deadline</label>
//             <input defaultValue={modData?.assessmentDeadline} disabled={!editStage2ModeratorComments} name="assessmentDeadline" type="date" /><br></br>

//             <label htmlFor="markingCompletedDate">Marking Completed Date</label>
//             <input defaultValue={modData?.markingCompletedDate} disabled={!editStage2ModeratorComments} name="markingCompletedDate" type="date" /><br></br>

//             <label htmlFor="moderationCompletedDate">Moderation Completed Date</label>
//             <input defaultValue={modData?.moderationCompletedDate} disabled={!editStage2ModeratorComments} name="moderationCompletedDate" type="date" /><br></br>

//             <label htmlFor="totalSubmissions">Total Submissions</label>
//             <input defaultValue={modData?.totalSubmissions} disabled={!editStage2ModeratorComments} name="totalSubmissions" type="number" /><br></br>

//             <label htmlFor="failedSubmissions">Failed Submissions</label>
//             <input defaultValue={modData?.failedSubmissions} disabled={!editStage2ModeratorComments} name="failedSubmissions" type="number" /><br></br>

//             <label htmlFor="moderatedSubmissions">Moderated Submissions</label>
//             <input defaultValue={modData?.moderatedSubmissions} disabled={!editStage2ModeratorComments} name="moderatedSubmissions" type="number" /><br></br>

//             <label htmlFor="teachingImpactDetails">Teaching Impact Details</label>
//             <input defaultValue={modData?.teachingImpactDetails} disabled={!editStage2ModeratorComments} name="teachingImpactDetails" type="text" /><br></br>

//             <label htmlFor="stage2_moderatorComments">Stage 2 Moderator Comments</label>
//             <input defaultValue={modData?.stage2_moderatorComments} disabled={!editStage2ModeratorComments} name="stage2_moderatorComments" type="text" /><br></br>

//             <label htmlFor="moderatorSignatureDateTime">Moderator Signature Date Time</label>
//             <input disabled value={modData?.moderatorSignatureDateTime || ''} name="moderatorSignatureDateTime" type="text" readOnly /><br></br>

//             {!editStage2ModeratorComments && (
//               <button onClick={(e) => { e.preventDefault(); setEditStage2ModeratorComments(true); }}>Edit</button>
//             )}

//             {editStage2ModeratorComments && (
//               <>
//                 <button onClick={(e) => { e.preventDefault(); setEditStage2ModeratorComments(false); }}>Cancel</button>
//                 <button onClick={(e) => { e.preventDefault(); handleSubmit({ 
//                   assessmentDetailsTrigger: "Completed", 
//                   internalModeratorDetailsTrigger: "Completed", 
//                   responseToInternalModeratorTrigger: "Completed", 
//                   externalExaminerDetailsTrigger: "Completed", 
//                   responseToExternalExaminerTrigger: "Completed", 
//                   programmeDirectorDetailsTrigger: "Completed", 
//                   internalModeratorModerationOfMarksTrigger: "Completed", 
//                   stage2ModuleAssessmentLeadCommentsTrigger: "Not Complete", 
//                   stage2ModeratorCommentsTrigger: "Completed" 
//                 }, [
//                   formRef.current.elements.assessmentDeadline.value,
//                   formRef.current.elements.markingCompletedDate.value,
//                   formRef.current.elements.moderationCompletedDate.value,
//                   formRef.current.elements.totalSubmissions.value,
//                   formRef.current.elements.failedSubmissions.value,
//                   formRef.current.elements.moderatedSubmissions.value,
//                   formRef.current.elements.teachingImpactDetails.value
//                 ]); }}>Submit</button>
//               </>
//             )}
//           </>
//         )}

//         {/* Assessment Lead Stage 2 Section */}
//         {modData?.stage2ModeratorCommentsTrigger == "Completed" && (
//           <>
//             <h1>Assessment Lead Stage 2 Section</h1>
//             <label htmlFor="stage2_assessmentLeadComments">Stage 2 Assessment Lead Comments</label>
//             <input defaultValue={modData?.stage2_assessmentLeadComments} disabled={!editStage2ModuleAssessmentLeadComments} name="stage2_assessmentLeadComments" type="text" /><br></br>

//             <label htmlFor="stage2ModuleAssessmentLeadSignatureDateTime">Stage 2 Module Assessment Lead Signature Date Time</label>
//             <input disabled value={modData?.stage2ModuleAssessmentLeadSignatureDateTime || ''} name="stage2ModuleAssessmentLeadSignatureDateTime" type="text" readOnly /><br></br>

//             {!editStage2ModuleAssessmentLeadComments && (
//               <button onClick={(e) => { e.preventDefault(); setEditStage2ModuleAssessmentLeadComments(true); }}>Edit</button>
//             )}

//             {editStage2ModuleAssessmentLeadComments && (
//               <>
//                 <button onClick={(e) => { e.preventDefault(); setEditStage2ModuleAssessmentLeadComments(false); }}>Cancel</button>
//                 <button onClick={(e) => { e.preventDefault(); handleSubmit({ 
//                   assessmentDetailsTrigger: "Completed", 
//                   internalModeratorDetailsTrigger: "Completed", 
//                   responseToInternalModeratorTrigger: "Completed", 
//                   externalExaminerDetailsTrigger: "Completed", 
//                   responseToExternalExaminerTrigger: "Completed", 
//                   programmeDirectorDetailsTrigger: "Completed", 
//                   internalModeratorModerationOfMarksTrigger: "Completed", 
//                   stage2ModuleAssessmentLeadCommentsTrigger: "Completed", 
//                   stage2ModeratorCommentsTrigger: "Completed" 
//                 }, [
//                   formRef.current.elements.stage2_assessmentLeadComments.value
//                 ]); }}>Submit</button>
//               </>
//             )}
//           </>
//         )}

//         {/* Final Confirmation by Programme Director Section */}
//         {modData?.stage2ModuleAssessmentLeadCommentsTrigger == "Completed" && (
//           <>
//             <h1>Final Confirmation by Programme Director</h1>
            

//             <label htmlFor="programmeDirectorConfirmation_signature_stage2">Stage 2 Confirmation Signature</label>
//             <input defaultValue={modData?.programmeDirectorConfirmation_signature_stage2} disabled={!editProgrammeDirectorConfirmation} name="programmeDirectorConfirmation_signature_stage2" type="text" /><br></br>

//             <label htmlFor="programmeDirectorConfirmation_signatureDateTime_stage2">Programme Director Confirmation Signature DateTime Stage 2</label>
//             <input disabled value={modData?.programmeDirectorConfirmation_signatureDateTime_stage2 || ''} name="programmeDirectorConfirmation_signatureDateTime_stage2" type="text" readOnly /><br></br>

//             {!editProgrammeDirectorConfirmation && (
//               <button onClick={(e) => { e.preventDefault(); setEditProgrammeDirectorConfirmation(true); }}>Edit</button>
//             )}

//             {editProgrammeDirectorConfirmation && (
//               <>
//                 <button onClick={(e) => { e.preventDefault(); setEditProgrammeDirectorConfirmation(false); }}>Cancel</button>
//                 <button onClick={(e) => { e.preventDefault(); handleSubmit({ 
//                   assessmentDetailsTrigger: "Completed", 
//                   internalModeratorDetailsTrigger: "Completed", 
//                   responseToInternalModeratorTrigger: "Completed", 
//                   externalExaminerDetailsTrigger: "Completed", 
//                   responseToExternalExaminerTrigger: "Completed", 
//                   programmeDirectorDetailsTrigger: "Completed", 
//                   internalModeratorModerationOfMarksTrigger: "Completed", 
//                   stage2ModuleAssessmentLeadCommentsTrigger: "Completed", 
//                   stage2ModeratorCommentsTrigger: "Completed",
//                   programmeDirectorConfirmation_signature: "Completed", 
//                   programmeDirectorConfirmation_signature_stage2: "Completed" 
//                 }, [
//                   formRef.current.elements.programmeDirectorConfirmation_signature.value,
//                   formRef.current.elements.programmeDirectorConfirmation_signature_stage2.value
//                 ]); }}>Submit Final Confirmation</button>
//               </>
//             )}
//           </>
//         )}
//       </form>
//     </div>
//   );
// };

// export default ModerationForm_2;


