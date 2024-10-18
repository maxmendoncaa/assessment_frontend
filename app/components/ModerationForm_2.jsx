
//Manas's self constructed working function.

"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import axiosInstance from "@/utils/axios";

const ModerationForm_2 = (props, initialData) => {
  const [modData, setModData] = useState(null);
  useEffect(() => {
    axiosInstance
      .get(`/api/v1/assessments/${props.assessmentId}`)
      .then((data) => {
        setModData(data.data);
      });
  }, []);
  console.log("Mod Data", modData);

  const formRef = useRef(null);
  //Triggers
  const [assessmentDetailsTrigger, setAssessmentDetailsTrigger] = useState();
  const [internalModeratorDetailsTrigger, setInternalModeratorDetailsTrigger] =useState();
  const [externalExaminerDetailsTrigger, setExternalExaminerDetailsTrigger] =useState();
  const [programmeDirectorDetailsTrigger, setProgrammeDirectorDetailsTrigger] =useState();
  const [internalModeratorModerationOfMarksTrigger,setInternalModeratorModerationOfMarksTrigger] = useState();
  const [stage2ModuleAssessmentLeadCommentsTrigger,setStage2ModuleAssessmentLeadCommentsTrigger] = useState();
  const [stage2ModeratorCommentsTrigger, setStage2ModeratorCommentsTrigger] =useState();
  const [responseToInternalModeratorTrigger, setResponseToInternalModeratorTrigger] = useState();
  const [responseToExternalExaminerTrigger, setResponseToExternalExaminerTrigger] = useState();


  //Buttons
  const [editAssessment, setEditAssessment] = useState(false);
  const [editInternalModerator, setEditInternalModerator] = useState(false);
  const [editExternalExaminer, setEditExternalExaminer] = useState(false);
  const [editProgrammeDirector, setEditProgrammeDirector] = useState(false);
  const [editInternalModeratorModerationOfMarks, setEditInternalModeratorModerationOfMarks]=useState(false);
  const [editStage2ModuleAssessmentLeadComments, setEditStage2ModuleAssessmentLeadComments]=useState(false);
  const [editStage2ModeratorComments, setEditStage2ModeratorComments]=useState(false);
  const [editResponseToInternalModerator, setEditResponseToInternalModerator]=useState(false);
  const [editResponseToExternalExaminer, setEditResponseToExternalExaminer]=useState(false);
  

  //Fields
  // const [title, setTitle] = useState(modData?.title);
  // const [moduleCode, setModuleCode] = useState();
  // const [skills, setSkills] = useState();
  // const [assessmentCategory, setAssessmentCategory] = useState();
  // const [assessmentWeighting, setAssessmentWeighting] = useState();
  // const [plannedIssueDate, setPlannedIssueDate] = useState();
  // const [courseworkSubmissionDate, setCourseworkSubmissionDate] = useState();
  // const [moduleAssessmentLeadSignature, setModuleAssessmentLeadSignature] = useState();
  // const [moduleAssessmentLeadSignatureDateTime, setModuleAssessmentLeadSignatureDateTime] = useState();
  // const [internalModeratorComments, setInternalModeratorComments] = useState();
  // const [internalModeratorSignature, setInternalModeratorSignature] = useState();
  // const [internalModeratorSignatureDateTime, setInternalModeratorSignatureDateTime] = useState();
  // const [responseToInternalModerator, setResponseToInternalModerator] = useState();
  // const [externalExaminerComments, setExternalExaminerComments] = useState();
  // const [externalExaminerApproval, setExternalExaminerApproval] = useState();
  // const [externalExaminerSignature, setExternalExaminerSignature] = useState();
  // const [externalExaminerSignatureDateTime, setExternalExaminerSignatureDateTime] = useState();
  // const [responseToExternalExaminer, setResponseToExternalExaminer] = useState();
  // const [programmeDirectorApproval, setProgrammeDirectorApproval] = useState();
  // const [programmeDirectorSignature, setProgrammeDirectorSignature] = useState();
  // const [programmeDirectorSignatureDateTime, setProgrammeDirectorSignatureDateTime] = useState();
  // const [assessmentDeadline, setAssessmentDeadline] = useState();
  // const [markingCompletedDate, setMarkingCompletedDate] = useState();
  // const [moderationCompletedDate, setModerationCompletedDate] = useState();
  // const [totalSubmissions, setTotalSubmissions] = useState();
  // const [failedSubmissions, setFailedSubmissions] = useState();
  // const [moderatedSubmissions, setModeratedSubmissions] = useState();
  // const [teachingImpactDetails, setTeachingImpactDetails] = useState();
  // const [stage2ModeratorComments, setStage2ModeratorComments] = useState();
  // const [moderatorSignatureDateTime, setModeratorSignatureDateTime] = useState();
  // const [stage2AssessmentLeadComments, setStage2AssessmentLeadComments] = useState();
  // const [stage2ModuleAssessmentLeadSignatureDateTime, setStage2ModuleAssessmentLeadSignatureDateTime] = useState();
  // const [programmeDirectorConfirmationSignature, setProgrammeDirectorConfirmationSignature] = useState();
  // const [programmeDirectorConfirmationSignatureStage2, setProgrammeDirectorConfirmationSignatureStage2] = useState();

  
  console.log(props);
  // const data = {
  //   id: 30,
  //   title: title,
  //   moduleCode: "sadasd",
  //   moduleLeader: "Sylvia Wong",
  //   assessmentCategory: "Coursework",
  //   skills: "Programming, Problem Solving, Algorithm Design",
  //   assessmentWeighting: 30,
  //   plannedIssueDate: "2024-03-01",
  //   courseworkSubmissionDate: "2024-04-15",
  //   userRoles: [
  //     "PROGRAMME_DIRECTOR",
  //     "EXTERNAL_EXAMINER",
  //     "INTERNAL_MODERATOR",
  //     "MODULE_ASSESSMENT_LEAD",
  //   ],
  //   moduleAssessmentLeadSignature: "Signed by John Doe",
  //   moduleAssessmentLeadSignatureDateTime: "2024-02-15T10:30:00",
  //   responseToInternalModerator: "XX",
  //   responseToInternalModeratorDateTime: null,
  //   responseToExternalExaminer: "EXTErnaincorporated your suggestions.",
  //   responseToExternalExaminerDateTime: null,
  //   stage2_assessmentLeadComments: "yrdy",
  //   internalModeratorComments:
  //     "The assessment aligns well with thdsfefsdf module outcomes. Suggest minor clarification on question 3.",
  //   internalModeratorSignature: "Signed by Sarah Johnson",
  //   internalModeratorSignatureDateTime: "2024-02-18T14:45:00",
  //   stage2_moderatorComments: "fdfsf",
  //   externalExaminerComments: "yf",
  //   externalExaminerApproval: "APPROVED",
  //   externalExaminerSignatureDateTime: null,
  //   externalExaminer_signature: null,
  //   programmeDirectorApproval: "APPROVED",
  //   programmeDirectorSignatureDateTime: null,
  //   programmeDirectorConfirmation_signature: "Pending",
  //   programmeDirectorConfirmation_signature_stage2: "Lcug",
  //   assessmentDeadline: "2024-10-03",
  //   totalSubmissions: 2,
  //   failedSubmissions: 3,
  //   moderatedSubmissions: 3,
  //   teachingImpactDetails: "8fiyfl",
  //   markingCompletedDate: "2024-10-21",
  //   moderationCompletedDate: "2024-10-30",
  //   moderatorSignatureDateTime: null,
  //   programmeDirectorConfirmation_signatureDateTime_stage2: null,
  //   stage2ModuleAssessmentLeadSignatureDateTime: null,
  //   assessmentDetailsTrigger: assessmentDetailsTrigger,
  //   internalModeratorDetailsTrigger: internalModeratorDetailsTrigger,
  //   responseToInternalModeratorTrigger:responseToInternalModeratorTrigger,// new trigger
  //   externalExaminerDetailsTrigger: externalExaminerDetailsTrigger,
  //   responseToExternalExaminerTrigger: responseToExternalExaminerTrigger,//new trigger
  //   programmeDirectorDetailsTrigger: programmeDirectorDetailsTrigger,
  //   internalModeratorModerationOfMarksTrigger: internalModeratorDetailsTrigger,
  //   stage2ModuleAssessmentLeadCommentsTrigger:
  //   stage2ModuleAssessmentLeadCommentsTrigger,
  //   stage2ModeratorCommentsTrigger: stage2ModeratorCommentsTrigger,
  //   participants: [
  //     {
  //       userId: 8,
  //       firstName: "Sylvia",
  //       lastName: "Wong",
  //       roles: [
  //         "PROGRAMME_DIRECTOR",
  //         "INTERNAL_MODERATOR",
  //         "MODULE_ASSESSMENT_LEAD",
  //         "EXTERNAL_EXAMINER",
  //       ],
  //     },
  //   ],
  //   undefined: "Not Completed",
  // };

  //   const response = axiosInstance.put(
  //     `/api/v1/assessments/${assessmentId}`,
  //     data
  //   );
  useEffect(() => {
    if (modData) {
      setAssessmentDetailsTrigger(modData.assessmentDetailsTrigger);
      setExternalExaminerDetailsTrigger(modData.externalExaminerDetailsTrigger);
      setInternalModeratorDetailsTrigger(
        modData.internalModeratorDetailsTrigger
      );
      setResponseToInternalModeratorTrigger( modData.responseToInternalModeratorTrigger );
      setResponseToExternalExaminerTrigger( modData.responseToExternalExaminerTrigger );
      setInternalModeratorModerationOfMarksTrigger(
        modData.internalModeratorModerationOfMarksTrigger
      );
      setProgrammeDirectorDetailsTrigger(
        modData.programmeDirectorDetailsTrigger
      );
      setStage2ModeratorCommentsTrigger(modData.stage2ModeratorCommentsTrigger);
      setStage2ModuleAssessmentLeadCommentsTrigger(
        modData.stage2ModuleAssessmentLeadCommentsTrigger
      );
    }
  }, [modData]);

  console.log("Triggers", {
    assessmentDetailsTrigger: assessmentDetailsTrigger,
    internalModeratorDetailsTrigger: internalModeratorDetailsTrigger,
    externalExaminerDetailsTrigger: externalExaminerDetailsTrigger,
    programmeDirectorDetailsTrigger: programmeDirectorDetailsTrigger,
    internalModeratorModerationOfMarksTrigger: internalModeratorDetailsTrigger,
    stage2ModuleAssessmentLeadCommentsTrigger:
      stage2ModuleAssessmentLeadCommentsTrigger,
    stage2ModeratorCommentsTrigger: stage2ModeratorCommentsTrigger,
  });

  const handleSubmit = (updatedTriggers) => {
    const formData = formRef.current.elements;
    const data = {
      title: formData.title.value,
      moduleCode: formData.moduleCode.value,
      moduleLeader: modData?.moduleLeader,
      assessmentCategory: formData.assessmentCategory.value,
      skills: formData.skills.value,
      assessmentWeighting: formData.assessmentWeighting.value,
      plannedIssueDate: formData.plannedIssueDate.value,
      courseworkSubmissionDate: formData.courseworkSubmissionDate.value,
      userRoles: modData?.userRoles,
      moduleAssessmentLeadSignature: formData.moduleAssessmentLeadSignature.value,
      moduleAssessmentLeadSignatureDateTime: formData.moduleAssessmentLeadSignatureDateTime.value,
      responseToInternalModerator: formData.responseToInternalModerator?.value,
      responseToInternalModeratorDateTime: formData.responseToInternalModeratorDateTime?.value,
      responseToExternalExaminer: formData.responseToExternalExaminer?.value,
      responseToExternalExaminerDateTime: formData.responseToExternalExaminerDateTime?.value,
      stage2_assessmentLeadComments: formData.stage2_assessmentLeadComments?.value,
      internalModeratorComments:formData.internalModeratorComments?.value,
      internalModeratorSignature: formData.internalModeratorSignature?.value,
      internalModeratorSignatureDateTime: formData.internalModeratorSignatureDateTime?.value,
      stage2_moderatorComments: formData.stage2_moderatorComments?.value,
      externalExaminerComments: formData.externalExaminerComments?.value,
      externalExaminerApproval: formData.externalExaminerApproval?.value,
      externalExaminerSignatureDateTime: formData.externalExaminerSignatureDateTime?.value,
      externalExaminer_signature: formData.externalExaminer_signature?.value,
      programmeDirectorApproval: formData.programmeDirectorApproval?.value,
      programmeDirectorSignatureDateTime: formData.programmeDirectorSignatureDateTime?.value,
      programmeDirectorConfirmation_signature: formData.programmeDirectorConfirmation_signature?.value,
      programmeDirectorConfirmation_signature_stage2: formData.programmeDirectorConfirmation_signature_stage2?.value,
      assessmentDeadline: formData.assessmentDeadline?.value,
      totalSubmissions: formData.totalSubmissions?.value,
      failedSubmissions: formData.failedSubmissions?.value,
      moderatedSubmissions: formData.moderatedSubmissions?.value,
      teachingImpactDetails: formData.teachingImpactDetails?.value,
      markingCompletedDate: formData.markingCompletedDate?.value,
      moderationCompletedDate: formData.moderationCompletedDate?.value,
      moderatorSignatureDateTime: formData.moderatorSignatureDateTime?.value,
      programmeDirectorConfirmation_signatureDateTime_stage2: formData.programmeDirectorConfirmation_signatureDateTime_stage2?.value,
      stage2ModuleAssessmentLeadSignatureDateTime: formData.stage2ModuleAssessmentLeadSignatureDateTime?.value,
      //Triggers
      assessmentDetailsTrigger: assessmentDetailsTrigger,
      internalModeratorDetailsTrigger: internalModeratorDetailsTrigger,
      responseToInternalModeratorTrigger:responseToInternalModeratorTrigger,// new trigger
      externalExaminerDetailsTrigger: externalExaminerDetailsTrigger,
      responseToExternalExaminerTrigger: responseToExternalExaminerTrigger,//new trigger
      programmeDirectorDetailsTrigger: programmeDirectorDetailsTrigger,
      internalModeratorModerationOfMarksTrigger: internalModeratorDetailsTrigger,
      stage2ModuleAssessmentLeadCommentsTrigger:
      stage2ModuleAssessmentLeadCommentsTrigger,
      stage2ModeratorCommentsTrigger: stage2ModeratorCommentsTrigger,
      ...updatedTriggers
    };
    axiosInstance.put(`/api/v1/assessments/${props.assessmentId}`, data);
  };

  const handleEditIntModDetails = () => {
    axiosInstance.put(`/api/v1/assessments/${props.assessmentId}`, data);
  };

  const handleIntModSubmit = () => {
    axiosInstance.put(`/api/v1/assessments/${props.assessmentId}`, {
      ...data,
      internalModeratorDetailsTrigger: "Completed",
    });
  };
  return (
    <>
      <div>
      <form ref={formRef} action="">
          <h1>Assessment Details</h1>
          <p>{modData?.id}</p>
          
          <label htmlFor="title">Title</label>
          <input
            defaultValue={modData?.title}
            disabled={!editAssessment}
            name="title"
            type="text"
          /><br></br>
          
          <label htmlFor="moduleCode">Module Code</label>
          <input
            defaultValue={modData?.moduleCode}
            disabled={!editAssessment}
            name="moduleCode"
            type="text"
          /><br></br>
          
          <label htmlFor="assessmentCategory">Assessment Category</label>
          <input
            defaultValue={modData?.assessmentCategory}
            disabled={!editAssessment}
            name="assessmentCategory"
            type="text"
          /><br></br>
          
          <label htmlFor="skills">Skills</label>
          <input
            defaultValue={modData?.skills}
            disabled={!editAssessment}
            name="skills"
            type="text"
          /><br></br>
          
          <label htmlFor="assessmentWeighting">Assessment Weighting</label>
          <input
            defaultValue={modData?.assessmentWeighting}
            disabled={!editAssessment}
            name="assessmentWeighting"
            type="text"
          /><br></br>
          
          <label htmlFor="plannedIssueDate">Planned Issue Date</label>
          <input
            defaultValue={modData?.plannedIssueDate}
            disabled={!editAssessment}
            name="plannedIssueDate"
            type="text"
          /><br></br>
          
          <label htmlFor="courseworkSubmissionDate">Coursework Submission Date</label>
          <input
            defaultValue={modData?.courseworkSubmissionDate}
            disabled={!editAssessment}
            name="courseworkSubmissionDate"
            type="text"
          /><br></br>
          
          <label htmlFor="moduleAssessmentLeadSignature">Module Assessment Lead Signature</label>
          <input
            defaultValue={modData?.moduleAssessmentLeadSignature}
            disabled={!editAssessment}
            name="moduleAssessmentLeadSignature"
            type="text"
          /><br></br>
          
          <label htmlFor="moduleAssessmentLeadSignatureDateTime">Module Assessment Lead Signature DateTime</label>
          <input
            defaultValue={modData?.moduleAssessmentLeadSignatureDateTime}
            disabled={!editAssessment}
            name="moduleAssessmentLeadSignatureDateTime"
            type="text"
          /><br></br>


          {/* Show Edit button initially when the input is not editable */}
          {!editAssessment && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setEditAssessment(true); // Enable editing mode
              }}
            >
              Edit
            </button>
          )}

          {/* Show Cancel and Submit buttons only when the input is editable (editAss is true) */}
          {editAssessment && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setEditAssessment(false); // Disable editing, return to view mode
                }}
              >
                Cancel
              </button>
              <button
              onClick={(e)=>{
                e.preventDefault();
                handleSubmit({
                assessmentDetailsTrigger: "Completed",
                internalModeratorDetailsTrigger: "Not Complete",
                responseToInternalModeratorTrigger: "Not Complete", // new trigger
                externalExaminerDetailsTrigger: "Not Complete",
                responseToExternalExaminerTrigger: "Not Complete", //new trigger
                programmeDirectorDetailsTrigger: "Not Complete",
                internalModeratorModerationOfMarksTrigger: "Not Complete",
                stage2ModuleAssessmentLeadCommentsTrigger: "Not Complete",
                stage2ModeratorCommentsTrigger: "Not Complete",
              })}}
            >
              Submit Assessment Details
            </button>
            </>
          )}

          

          {modData?.assessmentDetailsTrigger == "Completed" && (
            <>
              <h1>Internal Moderator Section</h1>
              
                <label htmlFor="InternalModeratorComments">Internal Moderator Comments</label>
                <input
                  defaultValue={modData?.internalModeratorComments}
                  disabled={!editInternalModerator}
                  name="internalModeratorComments"
                  type="text"
                /><br></br>
                
                <label htmlFor="internalModeratorSignature">Internal Moderator Signature</label>
                <input
                  defaultValue={modData?.internalModeratorSignature}
                  disabled={!editInternalModerator}
                  name="internalModeratorSignature"
                  type="text"
                /><br></br>

                <label htmlFor="internalModeratorSignatureDateTime">Date Time</label>
                <input
                  defaultValue={modData?.internalModeratorSignatureDateTime}
                  disabled={!editInternalModerator}
                  name="internalModeratorSignatureDateTime"
                  type="text"
                /><br></br> 

          {!editInternalModerator && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setEditInternalModerator(true); // Enable editing mode
              }}
            >
              Edit
            </button>
          )}

          {/* Show Cancel and Submit buttons only when the input is editable (editAss is true) */}
          {editInternalModerator && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setEditInternalModerator(false); // Disable editing, return to view mode
                }}
              >
                Cancel
              </button>
              <button
              onClick={(e)=>{
                e.preventDefault();
                handleSubmit({
                assessmentDetailsTrigger: "Completed",
                internalModeratorDetailsTrigger: "Completed",
                responseToInternalModeratorTrigger: "Not Complete", // new trigger
                externalExaminerDetailsTrigger: "Not Complete",
                responseToExternalExaminerTrigger: "Not Complete", //new trigger
                programmeDirectorDetailsTrigger: "Not Complete",
                internalModeratorModerationOfMarksTrigger: "Not Complete",
                stage2ModuleAssessmentLeadCommentsTrigger: "Not Complete",
                stage2ModeratorCommentsTrigger: "Not Complete",
              })}}
            >
              Submit
            </button>
            </>
          )}
             
            </>
          )}
          {modData?.assessmentDetailsTrigger == "Completed" &&
            modData?.internalModeratorDetailsTrigger == "Completed"&& (
              <>
                <h1>Response to Internal Moderator</h1>

                <label htmlFor="responseToInternalModerator">Response to Internal Moderator</label>
                <input
                  defaultValue={modData?.responseToInternalModerator}
                  disabled={!editResponseToInternalModerator}
                  name="responseToInternalModerator"
                  type="text"
                /><br></br>

                <label htmlFor="responseToInternalModeratorDateTime">Response to Internal Moderator Date Time</label>
                <input
                  defaultValue={modData?.responseToInternalModeratorDateTime}
                  disabled={!editResponseToInternalModerator}
                  name="responseToInternalModeratorDateTime"
                  type="text"
                /><br></br> 

                

                  {!editResponseToInternalModerator && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditResponseToInternalModerator(true); // Enable editing mode
                      }}
                    >
                      Edit
                    </button>
                  )}

                  {/* Show Cancel and Submit buttons only when the input is editable (editAss is true) */}
                  {editResponseToInternalModerator && (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setEditResponseToInternalModerator(false); // Disable editing, return to view mode
                        }}
                      >
                        Cancel
                      </button>
                      <button
                      onClick={(e)=>{
                        e.preventDefault();
                        handleSubmit({
                        assessmentDetailsTrigger: "Completed",
                        internalModeratorDetailsTrigger: "Completed",
                        responseToInternalModeratorTrigger: "Completed", // new trigger
                        externalExaminerDetailsTrigger: "Not Complete",
                        responseToExternalExaminerTrigger: "Not Complete", //new trigger
                        programmeDirectorDetailsTrigger: "Not Complete",
                        internalModeratorModerationOfMarksTrigger: "Not Complete",
                        stage2ModuleAssessmentLeadCommentsTrigger: "Not Complete",
                        stage2ModeratorCommentsTrigger: "Not Complete",
                      })}}
                    >
                      Submit
                    </button>
            </>
          )}
              </>
            )}




            {/* External Examiner Section */}
                {modData?.assessmentDetailsTrigger == "Completed" &&
                  modData?.internalModeratorDetailsTrigger == "Completed" &&
                   modData?.responseToInternalModeratorTrigger == "Completed" && (
              <>
                <h1>External Examiner Section</h1>
                
                <label htmlFor="externalExaminerComments">External Examiner Comments</label>
                <input
                  defaultValue={modData?.externalExaminerComments}
                  disabled={!editExternalExaminer}
                  name="externalExaminerComments"
                  type="text"
                /><br></br>
                
                <label htmlFor="externalExaminerApproval">External Examiner Approval</label>
                <input
                  defaultValue={modData?.externalExaminerApproval}
                  disabled={!editExternalExaminer}
                  name="externalExaminerApproval"
                  type="text"
                /><br></br>
                
                <label htmlFor="externalExaminer_signature">External Examiner Signature</label>
                <input
                  defaultValue={modData?.externalExaminer_signature}
                  disabled={!editExternalExaminer}
                  name="externalExaminer_signature"
                  type="text"
                /><br></br>
                
                <label htmlFor="externalExaminerSignatureDateTime">Signature Date Time</label>
                <input
                  defaultValue={modData?.externalExaminerSignatureDateTime}
                  disabled={!editExternalExaminer}
                  name="externalExaminerSignatureDateTime"
                  type="text"
                /><br></br>

                {!editExternalExaminer && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setEditExternalExaminer(true); // Enable editing mode
                    }}
                  >
                    Edit
                  </button>
                )}

                        {editExternalExaminer && (
                          <>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setEditExternalExaminer(false); // Disable editing, return to view mode
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleSubmit({
                                  assessmentDetailsTrigger: "Completed",
                                  internalModeratorDetailsTrigger: "Completed",
                                  responseToInternalModeratorTrigger: "Completed",
                                  externalExaminerDetailsTrigger: "Completed",
                                  responseToExternalExaminerTrigger: "Not Complete",
                                });
                              }}
                            >
                              Submit External Examiner Details
                            </button>
                          </>
                        )}
                      </>
                  )}

                  {modData?.assessmentDetailsTrigger == "Completed" &&
                    modData?.internalModeratorDetailsTrigger == "Completed" &&
                    modData?.responseToInternalModeratorTrigger == "Completed" &&
                    modData?.externalExaminerDetailsTrigger == "Completed" && (
                      <>
                        <h1>Response to External Examiner</h1>
                        
                        <label htmlFor="responseToExternalExaminer">Response to External Examiner</label>
                        <input
                          defaultValue={modData?.responseToExternalExaminer}
                          disabled={!editResponseToExternalExaminer}
                          name="responseToExternalExaminer"
                          type="text"
                        /><br></br>

                        {!editResponseToExternalExaminer && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setEditResponseToExternalExaminer(true); // Enable editing mode
                            }}
                          >
                            Edit
                          </button>
                        )}

                        {editResponseToExternalExaminer && (
                          <>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setEditResponseToExternalExaminer(false); // Disable editing, return to view mode
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleSubmit({
                                  assessmentDetailsTrigger: "Completed",
                                  internalModeratorDetailsTrigger: "Completed",
                                  responseToInternalModeratorTrigger: "Completed",
                                  externalExaminerDetailsTrigger: "Completed",
                                  responseToExternalExaminerTrigger: "Completed",
                                });
                              }}
                            >
                              Submit Response to External Examiner
                            </button>
                          </>
                        )}
                      </>
                  )}



              {modData?.assessmentDetailsTrigger == "Completed" &&
                modData?.internalModeratorDetailsTrigger == "Completed" &&
                modData?.responseToInternalModeratorTrigger == "Completed" &&
                modData?.externalExaminerDetailsTrigger == "Completed" &&
                modData?.responseToExternalExaminerTrigger == "Completed" && (
                  <>
                    <h1>Programme Director Section</h1>
                    
                    <label htmlFor="programmeDirectorApproval">Programme Director Approval</label>
                    <input
                      defaultValue={modData?.programmeDirectorApproval}
                      disabled={!editProgrammeDirector}
                      name="programmeDirectorApproval"
                      type="text"
                    /><br></br>

                    <label htmlFor="programmeDirectorSignature">Programme Director Signature</label>
                    <input
                      defaultValue={modData?.programmeDirectorSignature}
                      disabled={!editProgrammeDirector}
                      name="programmeDirectorSignature"
                      type="text"
                    /><br></br>

                    <label htmlFor="programmeDirectorSignatureDateTime">Signature Date Time</label>
                    <input
                      defaultValue={modData?.programmeDirectorSignatureDateTime}
                      disabled={!editProgrammeDirector}
                      name="programmeDirectorSignatureDateTime"
                      type="text"
                    /><br></br>

                    {!editProgrammeDirector && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setEditProgrammeDirector(true); // Enable editing mode
                        }}
                      >
                        Edit
                      </button>
                    )}

                    {editProgrammeDirector && (
                      <>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setEditProgrammeDirector(false); // Disable editing, return to view mode
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleSubmit({
                              programmeDirectorDetailsTrigger: "Completed",
                            });
                          }}
                        >
                          Submit Programme Director Details
                        </button>
                      </>
                    )}
                  </>
              )}



               {/* moderator section  */}
              {modData?.assessmentDetailsTrigger == "Completed" &&
                modData?.internalModeratorDetailsTrigger == "Completed" &&
                modData?.responseToInternalModeratorTrigger == "Completed" &&
                modData?.externalExaminerDetailsTrigger == "Completed" &&
                modData?.responseToExternalExaminerTrigger == "Completed" &&
                modData?.programmeDirectorDetailsTrigger == "Completed" && (
                  <>
                    <h1>Moderator Section</h1>

                    <label htmlFor="assessmentDeadline">Assessment Deadline</label>
                    <input
                      defaultValue={modData?.assessmentDeadline}
                      disabled={!editInternalModeratorModerationOfMarks}
                      name="assessmentDeadline"
                      type="text"
                    /><br></br>
                    
                    <label htmlFor="markingCompletedDate">Marking Completed Date</label>
                    <input
                      defaultValue={modData?.markingCompletedDate}
                      disabled={!editInternalModeratorModerationOfMarks}
                      name="markingCompletedDate"
                      type="text"
                    /><br></br>
                    
                    <label htmlFor="moderationCompletedDate">Moderation Completed Date</label>
                    <input
                      defaultValue={modData?.moderationCompletedDate}
                      disabled={!editInternalModeratorModerationOfMarks}
                      name="moderationCompletedDate"
                      type="text"
                    /><br></br>

                    <label htmlFor="totalSubmissions">Total Submissions</label>
                    <input
                      defaultValue={modData?.totalSubmissions}
                      disabled={!editInternalModeratorModerationOfMarks}
                      name="totalSubmissions"
                      type="text"
                    /><br></br>
                    
                    <label htmlFor="failedSubmissions">Failed Submissions</label>
                    <input
                      defaultValue={modData?.failedSubmissions}
                      disabled={!editInternalModeratorModerationOfMarks}
                      name="failedSubmissions"
                      type="text"
                    /><br></br>
                    
                    <label htmlFor="moderatedSubmissions">Moderated Submissions</label>
                    <input
                      defaultValue={modData?.moderatedSubmissions}
                      disabled={!editInternalModeratorModerationOfMarks}
                      name="moderatedSubmissions"
                      type="text"
                    /><br></br>

                    <label htmlFor="teachingImpactDetails">Teaching Impact Details</label>
                    <input
                      defaultValue={modData?.teachingImpactDetails}
                      disabled={!editInternalModeratorModerationOfMarks}
                      name="teachingImpactDetails"
                      type="text"
                    /><br></br>

                    <label htmlFor="stage2_moderatorComments">Stage 2 Moderator Comments</label>
                    <input
                      defaultValue={modData?.stage2_moderatorComments}
                      disabled={!editInternalModeratorModerationOfMarks}
                      name="stage2_moderatorComments"
                      type="text"
                    /><br></br>

                    <label htmlFor="moderatorSignatureDateTime">Moderator Signature Date Time</label>
                    <input
                      defaultValue={modData?.moderatorSignatureDateTime}
                      disabled={!editInternalModeratorModerationOfMarks}
                      name="moderatorSignatureDateTime"
                      type="text"
                    /><br></br>

                    {!editInternalModeratorModerationOfMarks && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setEditInternalModeratorModerationOfMarks(true); // Enable editing mode
                        }}
                      >
                        Edit
                      </button>
                    )}

                    {editInternalModeratorModerationOfMarks && (
                      <>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setEditInternalModeratorModerationOfMarks(false); // Disable editing, return to view mode
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleSubmit({
                              stage2ModeratorCommentsTrigger: "Completed",
                            });
                          }}
                        >
                          Submit Moderator Details
                        </button>
                      </>
                    )}
                  </>
              )}

              {/* Stage 2 Assessment Lead Section */}
              {modData?.stage2ModeratorCommentsTrigger == "Completed" && (
                <>
                  <h1>Assessment Lead Stage 2 Section</h1>
                  
                  <label htmlFor="stage2_assessmentLeadComments">Stage 2 Assessment Lead Comments</label>
                  <input
                    defaultValue={modData?.stage2_assessmentLeadComments}
                    disabled={!editStage2ModuleAssessmentLeadComments}
                    name="stage2_assessmentLeadComments"
                    type="text"
                  /><br></br>
                  
                  <label htmlFor="stage2ModuleAssessmentLeadSignatureDateTime">Stage 2 Assessment Lead Signature Date Time</label>
                  <input
                    defaultValue={modData?.stage2ModuleAssessmentLeadSignatureDateTime}
                    disabled={!editStage2ModuleAssessmentLeadComments}
                    name="stage2ModuleAssessmentLeadSignatureDateTime"
                    type="text"
                  /><br></br>

                  {!editStage2ModuleAssessmentLeadComments && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditStage2ModuleAssessmentLeadComments(true); // Enable editing mode
                      }}
                    >
                      Edit
                    </button>
                  )}

                  {editStage2ModuleAssessmentLeadComments && (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setEditStage2ModuleAssessmentLeadComments(false); // Disable editing, return to view mode
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleSubmit({
                            stage2ModuleAssessmentLeadCommentsTrigger: "Completed",
                          });
                        }}
                      >
                        Submit Assessment Lead Stage 2 Comments
                      </button>
                    </>
                  )}
                </>
              )}


               {/* Final Confirmation from Programme Director Section  */}
              {modData?.stage2ModuleAssessmentLeadCommentsTrigger == "Completed" && (
                <>
                  <h1>Final Confirmation By Programme Director</h1>
                  
                  <label htmlFor="programmeDirectorConfirmation_signature">Programme Director Confirmation Signature</label>
                  <input
                    defaultValue={modData?.programmeDirectorConfirmation_signature}
                    disabled={!editProgrammeDirector}
                    name="programmeDirectorConfirmation_signature"
                    type="text"
                  /><br></br>

                  <label htmlFor="programmeDirectorConfirmation_signature_stage2">Stage 2 Confirmation Signature</label>
                  <input
                    defaultValue={modData?.programmeDirectorConfirmation_signature_stage2}
                    disabled={!editProgrammeDirector}
                    name="programmeDirectorConfirmation_signature_stage2"
                    type="text"
                  /><br></br>

                  {!editProgrammeDirector && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditProgrammeDirector(true); // Enable editing mode
                      }}
                    >
                      Edit
                    </button>
                  )}

                  {editProgrammeDirector && (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setEditProgrammeDirector(false); // Disable editing, return to view mode
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleSubmit({
                            programmeDirectorConfirmation_signature: "Completed",
                            programmeDirectorConfirmation_signature_stage2: "Completed",
                          });
                        }}
                      >
                        Submit Final Confirmation
                      </button>
                    </>
                  )}
                </>
              )}

        </form>
      </div>
    </>
  );
};

export default ModerationForm_2;
