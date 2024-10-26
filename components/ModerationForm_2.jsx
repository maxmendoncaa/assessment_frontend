


"use client";
import axiosInstance from "@/utils/axios";
import Cookies from 'js-cookie';
import {
  notifyAssessmentLead,
  notifyExternalExaminer,
  notifyInternalModerator,
  notifyProgrammeDirector
} from '@/utils/emailService'; // Adjust the import path as necessary
import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation';
import { PDFDownloadLink } from '@react-pdf/renderer';

const AssessmentRoles = {
  EXTERNAL_EXAMINER: 'EXTERNAL_EXAMINER',
  INTERNAL_MODERATOR: 'INTERNAL_MODERATOR',
  PROGRAMME_DIRECTOR: 'PROGRAMME_DIRECTOR',
  MODULE_ASSESSMENT_LEAD: 'MODULE_ASSESSMENT_LEAD'
};
//import { PDFDownloadLink } from '@react-pdf/renderer';
import PdfDocument from './pdf_generator';



// Helper function to format date-time as "yyyy-MM-dd'T'HH:mm:ss"
const formatDateTime = (date) => {
  return date.toISOString().split('.')[0]; // Removes the milliseconds and timezone part
};

const ModerationForm_2 = (props) => {
  const [modData, setModData] = useState(null);
  const [moduleData, setModuleData] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleId = searchParams.get('moduleId');

  const renderDownloadButton = () => {
    if (!modData || !moduleData) return null;

    return (
      <div className="d-flex justify-content-end mb-4 p-3 bg-light rounded">
        <PDFDownloadLink
          document={<PdfDocument modData={modData} moduleData={moduleData} />}
          fileName={`${moduleData.moduleCode}_${modData.title}_moderation.pdf`}
        >
          
            <Button 
              variant="primary"
              // disabled={loading}
            >
            
                {/* <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Generating PDF...
                </> */}
              
                <>
                  <i className="bi bi-download me-2"></i>
                  Download Moderation Form
                </>
             
            </Button>
       
        </PDFDownloadLink>
      </div>
    );
  };

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch assessment data
        const assessmentResponse = await axiosInstance.get(`/api/v1/assessments/${props.assessmentId}`);
        setModData(assessmentResponse.data);
        
        // Fetch module data if moduleId exists
        if (moduleId) {
          const moduleResponse = await axiosInstance.get(`/api/v1/modules/${moduleId}`);
          setModuleData(moduleResponse.data);
          
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [props.assessmentId, moduleId]);

  
  useEffect(() => {
    if (modData) {
      const userId = parseInt(Cookies.get('userId'));
      const authorizedUser = modData.participants?.find(
        participant => participant.userId === userId
      );

      if (!authorizedUser) {
        // Use the initialized router to redirect
        router.push('/unauthorized');
        return; // Exit early from the effect
      }

      // If authorized, store their roles
      if (!userRoles.length) {
        setUserRoles(authorizedUser.roles);
      }
    }
   
  }, [modData, userRoles, router]);

  console.log(userRoles);

  const formRef = useRef(null);
  const defaultQuestions = [
    {
      questionText: "Does the assessment brief clearly state the learning outcomes being assessed?",
      yesNoAnswer: false,
      comment: ""
    },
    {
      questionText: "Are the assessment criteria clearly linked to the learning outcomes?",
      yesNoAnswer: false,
      comment: ""
    },
    {
      questionText: "Is the assessment brief clear and unambiguous?",
      yesNoAnswer: false,
      comment: ""
    },
    {
      questionText: "Are the instructions for completing the assessment clear?",
      yesNoAnswer: false,
      comment: ""
    },
    {
      questionText: "Is the word count/time limit appropriate for the assessment weighting?",
      yesNoAnswer: false,
      comment: ""
    },
    {
      questionText: "Is the submission format clearly specified?",
      yesNoAnswer: false,
      comment: ""
    }
  ];

  //questions
  const [questions, setQuestions] = useState(modData?.questions?.length ? modData.questions : defaultQuestions);
  //const [questions, setQuestions] = useState(modData?.questions || []);

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
      setQuestions(modData.questions?.length ? modData.questions : defaultQuestions);
      
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

    const userName = Cookies.get('name');
    const signatureText = `Signed by ${userName}`;
    const formData = formRef.current.elements;
    const data = {
      title: formData.title.value,
      moduleLeader: modData?.moduleLeader || '',
      assessmentCategory: formData.assessmentCategory.value,
      skills: formData.skills.value,
      assessmentWeighting: formData.assessmentWeighting.value,
      plannedIssueDate: formData.plannedIssueDate.value,
      courseworkSubmissionDate: formData.courseworkSubmissionDate.value,
      userRoles: modData?.userRoles || [],
      moduleAssessmentLeadSignature:  editAssessment ? signatureText : modData.moduleAssessmentLeadSignature,
      moduleAssessmentLeadSignatureDateTime: editAssessment ? formatDateTime(new Date()) : modData?.moduleAssessmentLeadSignatureDateTime, // Format for backend
      responseToInternalModerator:editResponseToInternalModerator ? formData.responseToInternalModerator?.value:modData.responseToInternalModerator,
      responseToInternalModeratorDateTime: editResponseToInternalModerator ? formatDateTime(new Date()) : modData?.responseToInternalModeratorDateTime, // Format for backend
      responseToExternalExaminer: editResponseToExternalExaminer?formData.responseToExternalExaminer?.value:modData.responseToExternalExaminer,
      responseToExternalExaminerDateTime: editResponseToExternalExaminer ? formatDateTime(new Date()) : modData?.responseToExternalExaminerDateTime, // Format for backend
      stage2_assessmentLeadComments: editStage2ModuleAssessmentLeadComments?formData.stage2_assessmentLeadComments?.value:modData.stage2_assessmentLeadComments,
      internalModeratorComments: formData.internalModeratorComments?.value,
      internalModeratorSignature: editInternalModerator ? signatureText : modData?.internalModeratorSignature,
      internalModeratorSignatureDateTime: editInternalModerator ? formatDateTime(new Date()) : modData?.internalModeratorSignatureDateTime, // Format for backend
      stage2_moderatorComments: editStage2ModeratorComments?formData.stage2_moderatorComments?.value:modData.stage2_moderatorComments,
      externalExaminerComments: editExternalExaminer?formData.externalExaminerComments?.value: modData.externalExaminerComments,
      externalExaminerApproval: formData.externalExaminerApproval?.value,
      externalExaminerSignatureDateTime: editExternalExaminer ? formatDateTime(new Date()) : modData?.externalExaminerSignatureDateTime, // Format for backend
      externalExaminer_signature: editExternalExaminer ? signatureText : modData?.externalExaminer_signature,
      programmeDirectorApproval: formData.programmeDirectorApproval?.value,
      programmeDirectorSignatureDateTime: editProgrammeDirector ? formatDateTime(new Date()) : modData?.programmeDirectorSignatureDateTime, // Format for backend
      programmeDirectorConfirmation_signature: editProgrammeDirector ? signatureText : modData?.programmeDirectorConfirmation_signature,
      programmeDirectorConfirmation_signature_stage2: editProgrammeDirectorConfirmation ? signatureText : modData?.programmeDirectorConfirmation_signature_stage2,
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
      responseToInternalModeratorSignature: editResponseToInternalModerator ? signatureText : modData?.responseToInternalModeratorSignature,
      responseToExternalExaminerSignature: editResponseToExternalExaminer ? signatureText : modData?.responseToExternalExaminerSignature,
      stage2AssessmentLeadSignature: editStage2ModuleAssessmentLeadComments ? signatureText : modData?.stage2AssessmentLeadSignature,
      stage2ModeratorSignature: editStage2ModeratorComments ? signatureText : modData?.stage2ModeratorSignature,
      questions: questions.map(q => ({
        id: q.id,  // Include if it's an existing question
        questionText: q.questionText,
        yesNoAnswer: q.yesNoAnswer,
        comment: q.comment
      })),
      ...updatedTriggers,
    };


    const getEmailsForRole = async (role) => {
      try {
        const response = await axiosInstance.get(`/api/v1/assessments/${props.assessmentId}/emails/${role}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching emails for role ${role}:`, error);
        return [];
      }
    };
    
    try {
      await axiosInstance.put(`/api/v1/assessments/${props.assessmentId}`, data);
           
      // Send notifications based on section
      switch(section) {
        case 'internalModerator':
          const moderatorEmails = await getEmailsForRole('INTERNAL_MODERATOR');
          await Promise.all(moderatorEmails.map(email => 
            notifyInternalModerator(email, {
              title: data.title,
              module:moduleData.moduleName,
              moduleCode: moduleData.moduleCode,
              dueDate: data.courseworkSubmissionDate
            })
          ));
          break;
        case 'externalExaminer':
          const examinerEmails = await getEmailsForRole('EXTERNAL_EXAMINER');
          await Promise.all(examinerEmails.map(email => 
            notifyExternalExaminer(email, {
              title: data.title,
              module:moduleData.moduleName,
              moduleCode: moduleData.moduleCode,
              dueDate: data.courseworkSubmissionDate
            })
          ));
          break;
        case 'programmeDirector':
          const directorEmails = await getEmailsForRole('PROGRAMME_DIRECTOR');
          await Promise.all(directorEmails.map(email => 
            notifyProgrammeDirector(email, {
              title: data.title,
              module:moduleData.moduleName,
              moduleCode: moduleData.moduleCode,
              dueDate: data.courseworkSubmissionDate
            })
          ));
          case 'assessmentLead':
          const leadEmails = await getEmailsForRole('MODULE_ASSESSMENT_LEAD');
          await Promise.all(leadEmails.map(email => 
            notifyAssessmentLead(email, {
              title: data.title,
              module:moduleData.moduleName,
              moduleCode: moduleData.moduleCode,
              dueDate: data.courseworkSubmissionDate
            })
          ));
          break;
      }
    
      alert("Submission successful and notifications sent.");
      window.location.reload();
    } catch (error) {
      console.error("Error in submission or sending notification:", error);
      alert("An error occurred. Please try again.");
    }

};

  return (
    <div>
      <Form ref={formRef} action="">
        {renderDownloadButton()}
        {/* Module Details Section */}
        {moduleData && (
          <div className="mb-6">
            <h1>Module Details</h1>

            <Col>
              <Form.Label>Module Name</Form.Label>
              <Form.Control value={moduleData.moduleName} disabled />
            </Col>
            <Col>
              <Form.Label>Module Code</Form.Label>
              <Form.Control value={moduleData.moduleCode} disabled />
            </Col>

            <Col>
              <Form.Label>Module Leader</Form.Label>
              <Form.Control value={moduleData.moduleLeader} disabled />
            </Col>
            <Col>
              <Form.Label>Credits</Form.Label>
              <Form.Control value={moduleData.credits} disabled />
            </Col>
            <Col>
              <Form.Label>Level</Form.Label>
              <Form.Control value={moduleData.level} disabled />
            </Col>
            <Col>
              <Form.Label>Module Outcomes</Form.Label>
              <Form.Control
                as="textarea"
                rows={7}
                value={moduleData.moduleOutcomes}
                disabled
              />
            </Col>
          </div>
        )}

        {/* Gets participants */}
        {modData && modData.participants && (
          <div className="mb-6">
            <h2>Assessment Roles</h2>

            {/* Current User's Roles */}
            <Row className="mb-3">
              <Col>
                <Form.Label className="fw-bold">Your Role(s):</Form.Label>
                <p>
                  {userRoles.map((role) => role.replace(/_/g, " ")).join(", ")}
                </p>
              </Col>
            </Row>

            {/* Display each role type */}
            {[
              "MODULE_ASSESSMENT_LEAD",
              "INTERNAL_MODERATOR",
              "EXTERNAL_EXAMINER",
              "PROGRAMME_DIRECTOR",
            ].map((roleType) => {
              // Find all participants that have this role
              const participantsWithRole = modData.participants.filter(
                (participant) => participant.roles.includes(roleType)
              );

              // Only render if there are participants with this role
              if (participantsWithRole.length > 0) {
                return (
                  <Row key={roleType} className="mb-3">
                    <Col>
                      <h5>{roleType.replace(/_/g, " ")}(s):</h5>
                      <p>
                        {participantsWithRole.map((participant, index) => (
                          <span key={participant.userId}>
                            {participant.firstName} {participant.lastName}
                            {index < participantsWithRole.length - 1
                              ? ", "
                              : ""}
                          </span>
                        ))}
                      </p>
                    </Col>
                  </Row>
                );
              }
              return null;
            })}
          </div>
        )}

        {/* Assessment Details Section */}
        <h1>Assessment Details</h1>

        <Form.Label htmlFor="title">Assessment Title</Form.Label>
        <Form.Control
          defaultValue={modData?.title}
          disabled={!editAssessment}
          name="title"
          type="text"
        />
        <br></br>

        <Form.Label htmlFor="assessmentCategory">
          Assessment Category
        </Form.Label>
        <Form.Control
          defaultValue={modData?.assessmentCategory}
          disabled={!editAssessment}
          name="assessmentCategory"
          type="text"
        />
        <br></br>

        <Form.Label htmlFor="skills">
          MLOs/ or Knowledge Skills & Behaviours(KSBs) covered in this
          assessment
        </Form.Label>
        <Form.Control
          defaultValue={modData?.skills}
          disabled={!editAssessment}
          name="skills"
          type="text"
        />
        <br></br>

        <Form.Label htmlFor="assessmentWeighting">
          Assessment Weighting
        </Form.Label>
        <Form.Control
          defaultValue={modData?.assessmentWeighting}
          disabled={!editAssessment}
          name="assessmentWeighting"
          type="number"
        />
        <br></br>

        <Form.Label htmlFor="plannedIssueDate">Planned Issue Date</Form.Label>
        <Form.Control
          defaultValue={modData?.plannedIssueDate}
          disabled={!editAssessment}
          name="plannedIssueDate"
          type="date"
        />
        <br></br>

        <Form.Label htmlFor="courseworkSubmissionDate">
          Coursework Submission Date
        </Form.Label>
        <Form.Control
          defaultValue={modData?.courseworkSubmissionDate}
          disabled={!editAssessment}
          name="courseworkSubmissionDate"
          type="date"
        />
        <br></br>

        <Row>
          <Col>
            <Form.Label htmlFor="moduleAssessmentLeadSignature">
              Module Assessment Lead Signature
            </Form.Label>
            <Form.Control
              defaultValue={modData?.moduleAssessmentLeadSignature||"Pending" }
              disabled={true}
              name="moduleAssessmentLeadSignature"
              type="text"
            />
            <br></br>
          </Col>
          <Col>
            <Form.Label htmlFor="moduleAssessmentLeadSignatureDateTime">
              Submitted at :
            </Form.Label>
            <Form.Control
              disabled
              value={modData?.moduleAssessmentLeadSignatureDateTime || ""}
              name="moduleAssessmentLeadSignatureDateTime"
              type="text"
              readOnly
            />
            <br></br>
          </Col>
        </Row>

        {!editAssessment && userRoles.includes("MODULE_ASSESSMENT_LEAD") && (
          <Button
            onClick={(e) => {
              e.preventDefault();
              setEditAssessment(true);
            }}
          >
            Edit
          </Button>
        )}

        {editAssessment && (
          <>
            <Button
              variant="outline-danger"
              onClick={(e) => {
                e.preventDefault();
                setEditAssessment(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(
                  {
                    assessmentDetailsTrigger: "Completed",
                    internalModeratorDetailsTrigger: "Not Complete",
                    externalExaminerDetailsTrigger: "Not Complete",
                    responseToInternalModeratorTrigger: "Not Complete",
                    responseToExternalExaminerTrigger: "Not Complete",
                    programmeDirectorDetailsTrigger: "Not Complete",
                    internalModeratorModerationOfMarksTrigger: "Not Complete",
                    stage2ModuleAssessmentLeadCommentsTrigger: "Not Complete",
                    stage2ModeratorCommentsTrigger: "Not Complete",
                  },
                  [
                    formRef.current.elements.title.value,
                    //formRef.current.elements.moduleCode.value,
                    formRef.current.elements.assessmentCategory.value,
                    formRef.current.elements.skills.value,
                    formRef.current.elements.assessmentWeighting.value,
                    formRef.current.elements.plannedIssueDate.value,
                    formRef.current.elements.courseworkSubmissionDate.value,
                    formRef.current.elements.moduleAssessmentLeadSignature.value,
                  ],
                  "internalModerator"
                );
              }}
            >
              Submit Assessment Details
            </Button>
          </>
        )}

        {/* Internal Moderator Section */}
        {modData?.assessmentDetailsTrigger == "Completed" && (
          <>
            <h1>Internal Moderator Section</h1>
            <h2>Questions</h2>
            {questions.map((question, index) => (
              <Row key={index}>
                <Col style={{ width: "2%" }} xs={1}>
                  <Form.Label htmlFor={`questionText-${index}`}>
                    {index + 1}
                  </Form.Label>
                </Col>
                <Col xs={5}>
                  <Form.Control
                    as="textarea"
                    rows={1}
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
                </Col>
                <Col style={{ width: "5%" }} xs={1}>
                  <Form.Label htmlFor={`yesNoAnswer-${index}`}>
                    Yes/No
                  </Form.Label>
                </Col>
                <Col style={{ width: "5%" }} xs={1}>
                  <select
                    id={`yesNoAnswer-${index}`}
                    value={question.yesNoAnswer}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].yesNoAnswer =
                        e.target.value === "true";
                      setQuestions(newQuestions);
                    }}
                    disabled={!editInternalModerator}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </Col>

                <Col xs={1}>
                  <Form.Label htmlFor={`comment-${index}`}>Comment</Form.Label>
                </Col>
                <Col xs={2}>
                  <Form.Control
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
                </Col>
                <Col xs={2}>
                  <Button
                    variant="outline-danger"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteQuestion(index);
                    }}
                    disabled={!editInternalModerator}
                  >
                    Delete Question
                  </Button>
                </Col>
              </Row>
            ))}

            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                addQuestion();
              }}
              disabled={!editInternalModerator}
            >
              Add Question
            </Button>
            <br></br>
            <br></br>

            <Form.Label htmlFor="internalModeratorComments">
              Internal Moderator Comments
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              defaultValue={modData?.internalModeratorComments}
              disabled={!editInternalModerator}
              name="internalModeratorComments"
              type="text"
            />
            <br></br>

            <Row>
              <Col>
                <Form.Label htmlFor="internalModeratorSignature">
                  Internal Moderator Signature
                </Form.Label>
                <Form.Control
                  defaultValue={
                    modData?.internalModeratorSignature || "Pending"
                  }
                  disabled={true}
                  name="internalModeratorSignature"
                  type="text"
                />
                <br></br>
              </Col>
              <Col>
                <Form.Label htmlFor="internalModeratorSignatureDateTime">
                  Submitted at :
                </Form.Label>
                <Form.Control
                  disabled
                  value={modData?.internalModeratorSignatureDateTime || ""}
                  name="internalModeratorSignatureDateTime"
                  type="text"
                  readOnly
                />
                <br></br>
              </Col>
            </Row>

            {!editInternalModerator &&
              userRoles.includes("INTERNAL_MODERATOR") && (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setEditInternalModerator(true);
                  }}
                >
                  Edit
                </Button>
              )}

            {editInternalModerator && (
              <>
                <Button
                  variant="outline-danger"
                  onClick={(e) => {
                    e.preventDefault();
                    setEditInternalModerator(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(
                      {
                        assessmentDetailsTrigger: "Completed",
                        internalModeratorDetailsTrigger: "Completed",
                        responseToInternalModeratorTrigger: "Not Complete",
                        externalExaminerDetailsTrigger: "Not Complete",
                        responseToExternalExaminerTrigger: "Not Complete",
                        programmeDirectorDetailsTrigger: "Not Complete",
                        internalModeratorModerationOfMarksTrigger:
                          "Not Complete",
                        stage2ModuleAssessmentLeadCommentsTrigger:
                          "Not Complete",
                        stage2ModeratorCommentsTrigger: "Not Complete",
                      },
                      [
                        formRef.current.elements.internalModeratorComments
                          .value,
                        formRef.current.elements.internalModeratorSignature
                          .value,
                        ...questions.flatMap((q) => [
                          q.questionText,
                          q.comment,
                        ]),
                      ],
                      "assessmentLead"
                    );
                  }}
                >
                  Submit
                </Button>
              </>
            )}
          </>
        )}

        {/* Response to Internal Moderator Section */}
        {modData?.internalModeratorDetailsTrigger == "Completed" && (
          <>
            <h1>Response to Internal Moderator</h1>
            <Form.Label htmlFor="responseToInternalModerator">
              Response to Internal Moderator
            </Form.Label>
            <Form.Control
              defaultValue={modData?.responseToInternalModerator}
              disabled={!editResponseToInternalModerator}
              name="responseToInternalModerator"
              type="text"
            />
            <br></br>

            <Row>
              <Col>
                <Form.Label htmlFor="responseToInternalModeratorSignature">
                  Response to Internal Moderator Signature
                </Form.Label>
                <Form.Control
                  defaultValue={
                    modData?.responseToInternalModeratorSignature || "Pending"
                  }
                  disabled={true}
                  name="responseToInternalModeratorSignature"
                  type="text"
                />
                <br></br>
              </Col>
              <Col>
                <Form.Label htmlFor="responseToInternalModeratorDateTime">
                  Submitted at :
                </Form.Label>
                <Form.Control
                  disabled
                  value={modData?.responseToInternalModeratorDateTime || ""}
                  name="responseToInternalModeratorDateTime"
                  type="text"
                  readOnly
                />
                <br></br>
              </Col>
            </Row>

            {!editResponseToInternalModerator &&
              userRoles.includes("MODULE_ASSESSMENT_LEAD") && (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setEditResponseToInternalModerator(true);
                  }}
                >
                  Edit
                </Button>
              )}

            {editResponseToInternalModerator && (
              <>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setEditResponseToInternalModerator(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(
                      {
                        assessmentDetailsTrigger: "Completed",
                        internalModeratorDetailsTrigger: "Completed",
                        responseToInternalModeratorTrigger: "Completed",
                        externalExaminerDetailsTrigger: "Not Complete",
                        responseToExternalExaminerTrigger: "Not Complete",
                        programmeDirectorDetailsTrigger: "Not Complete",
                        internalModeratorModerationOfMarksTrigger:
                          "Not Complete",
                        stage2ModuleAssessmentLeadCommentsTrigger:
                          "Not Complete",
                        stage2ModeratorCommentsTrigger: "Not Complete",
                      },
                      [
                        formRef.current.elements.responseToInternalModerator
                          .value,
                      ],"externalExaminer"
                    );
                  }}
                >
                  Submit
                </Button>
              </>
            )}
          </>
        )}

        {/* External Examiner Section */}
        {modData?.responseToInternalModeratorTrigger == "Completed" && (
          <>
            <h1>External Examiner Section</h1>
            <Form.Label htmlFor="externalExaminerComments">
              External Examiner Comments
            </Form.Label>
            <Form.Control
              defaultValue={modData?.externalExaminerComments}
              disabled={!editExternalExaminer}
              name="externalExaminerComments"
              type="text"
            />
            <br></br>

            <Form.Label htmlFor="externalExaminerApproval">
              External Examiner Approval
            </Form.Label>
            <Form.Control
              defaultValue={modData?.externalExaminerApproval}
              disabled={!editExternalExaminer}
              name="externalExaminerApproval"
              type="text"
            />
            <br></br>

            <Row>
              <Col>
                <Form.Label htmlFor="externalExaminer_signature">
                  External Examiner Signature
                </Form.Label>
                <Form.Control
                  defaultValue={
                    modData?.externalExaminer_signature || "Pending"
                  }
                  disabled={true}
                  name="externalExaminer_signature"
                  type="text"
                />
                <br></br>
              </Col>
              <Col>
                <Form.Label htmlFor="externalExaminerSignatureDateTime">
                  Submitted at :
                </Form.Label>
                <Form.Control
                  disabled
                  value={modData?.externalExaminerSignatureDateTime || ""}
                  name="externalExaminerSignatureDateTime"
                  type="text"
                  readOnly
                />
                <br></br>
              </Col>
            </Row>

            {!editExternalExaminer &&
              userRoles.includes("EXTERNAL_EXAMINER") && (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setEditExternalExaminer(true);
                  }}
                >
                  Edit
                </Button>
              )}

            {editExternalExaminer && (
              <>
                <Button
                  variant="outline-danger"
                  onClick={(e) => {
                    e.preventDefault();
                    setEditExternalExaminer(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(
                      {
                        assessmentDetailsTrigger: "Completed",
                        internalModeratorDetailsTrigger: "Completed",
                        responseToInternalModeratorTrigger: "Completed",
                        externalExaminerDetailsTrigger: "Completed",
                        responseToExternalExaminerTrigger: "Not Complete",
                        programmeDirectorDetailsTrigger: "Not Complete",
                        internalModeratorModerationOfMarksTrigger:
                          "Not Complete",
                        stage2ModuleAssessmentLeadCommentsTrigger:
                          "Not Complete",
                        stage2ModeratorCommentsTrigger: "Not Complete",
                      },
                      [
                        formRef.current.elements.externalExaminerComments.value,
                        formRef.current.elements.externalExaminerApproval.value,
                        formRef.current.elements.externalExaminer_signature
                          .value,
                      ],"assessmentLead"
                    );
                  }}
                >
                  Submit External Examiner Details
                </Button>
              </>
            )}
          </>
        )}

        {/* Response to External Examiner Section */}
        {modData?.externalExaminerDetailsTrigger == "Completed" && (
          <>
            <h1>Response to External Examiner</h1>
            <Form.Label htmlFor="responseToExternalExaminer">
              Response to External Examiner
            </Form.Label>
            <Form.Control
              defaultValue={modData?.responseToExternalExaminer}
              disabled={!editResponseToExternalExaminer}
              name="responseToExternalExaminer"
              type="text"
            />
            <br></br>

            <Row>
              <Col>
                <Form.Label htmlFor="responseToExternalExaminerSignature">
                  Response to External Examiner Signature
                </Form.Label>
                <Form.Control
                  defaultValue={
                    modData?.responseToExternalExaminerSignature || "Pending"
                  }
                  disabled={true}
                  name="responseToExternalExaminerSignature"
                  type="text"
                />
                <br></br>
              </Col>
              <Col>
                <Form.Label htmlFor="responseToExternalExaminerDateTime">
                  Submitted at :
                </Form.Label>
                <Form.Control
                  disabled
                  value={modData?.responseToExternalExaminerDateTime || ""}
                  name="responseToExternalExaminerDateTime"
                  type="text"
                  readOnly
                />
                <br></br>
              </Col>
            </Row>

            {!editResponseToExternalExaminer &&
              userRoles.includes("MODULE_ASSESSMENT_LEAD") && (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setEditResponseToExternalExaminer(true);
                  }}
                >
                  Edit
                </Button>
              )}

            {editResponseToExternalExaminer && (
              <>
                <Button
                  variant="outline-danger"
                  onClick={(e) => {
                    e.preventDefault();
                    setEditResponseToExternalExaminer(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(
                      {
                        assessmentDetailsTrigger: "Completed",
                        internalModeratorDetailsTrigger: "Completed",
                        responseToInternalModeratorTrigger: "Completed",
                        externalExaminerDetailsTrigger: "Completed",
                        responseToExternalExaminerTrigger: "Completed",
                        programmeDirectorDetailsTrigger: "Not Complete",
                        internalModeratorModerationOfMarksTrigger:
                          "Not Complete",
                        stage2ModuleAssessmentLeadCommentsTrigger:
                          "Not Complete",
                        stage2ModeratorCommentsTrigger: "Not Complete",
                      },
                      [
                        formRef.current.elements.responseToExternalExaminer
                          .value,
                      ],"programmeDirector"
                    );
                  }}
                >
                  Submit
                </Button>
              </>
            )}
          </>
        )}

        {/* Programme Director Section */}
        {modData?.responseToExternalExaminerTrigger == "Completed" && (
          <>
            <h1>Programme Director Section</h1>
            <Form.Label htmlFor="programmeDirectorApproval">
              Programme Director Approval
            </Form.Label>
            <Form.Control
              defaultValue={modData?.programmeDirectorApproval}
              disabled={!editProgrammeDirector}
              name="programmeDirectorApproval"
              type="text"
            />
            <br></br>

            <Row>
              <Col>
                <Form.Label htmlFor="programmeDirectorConfirmation_signature">
                  Programme Director Signature
                </Form.Label>
                <Form.Control
                  defaultValue={
                    modData?.programmeDirectorConfirmation_signature ||
                    "Pending"
                  }
                  disabled={true}
                  name="programmeDirectorConfirmation_signature"
                  type="text"
                />
                <br></br>
              </Col>
              <Col>
                <Form.Label htmlFor="programmeDirectorSignatureDateTime">
                  Submitted at :
                </Form.Label>
                <Form.Control
                  disabled
                  value={modData?.programmeDirectorSignatureDateTime || ""}
                  name="programmeDirectorSignatureDateTime"
                  type="text"
                  readOnly
                />
                <br></br>
              </Col>
            </Row>

            {!editProgrammeDirector &&
              userRoles.includes("PROGRAMME_DIRECTOR") && (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setEditProgrammeDirector(true);
                  }}
                >
                  Edit
                </Button>
              )}

            {editProgrammeDirector && (
              <>
                <Button
                  variant="outline-danger"
                  onClick={(e) => {
                    e.preventDefault();
                    setEditProgrammeDirector(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(
                      {
                        assessmentDetailsTrigger: "Completed",
                        internalModeratorDetailsTrigger: "Completed",
                        responseToInternalModeratorTrigger: "Completed",
                        externalExaminerDetailsTrigger: "Completed",
                        responseToExternalExaminerTrigger: "Completed",
                        programmeDirectorDetailsTrigger: "Completed",
                        internalModeratorModerationOfMarksTrigger:
                          "Not Complete",
                        stage2ModuleAssessmentLeadCommentsTrigger:
                          "Not Complete",
                        stage2ModeratorCommentsTrigger: "Not Complete",
                      },
                      [
                        formRef.current.elements.programmeDirectorApproval
                          .value,
                        formRef.current.elements
                          .programmeDirectorConfirmation_signature.value,
                      ],"assessmentLead"
                    );
                  }}
                >
                  Submit
                </Button>
              </>
            )}
          </>
        )}

        <br></br>
        <br></br>
        <br></br>
        <br></br>
        {/* Trigger for stage 2 Section */}
        {modData?.programmeDirectorDetailsTrigger == "Completed" &&
          modData?.internalModeratorModerationOfMarksTrigger ==
            "Not Complete" &&
          userRoles.includes("MODULE_ASSESSMENT_LEAD") && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={() =>
                  handleSubmit(
                    {
                      assessmentDetailsTrigger: "Completed",
                      internalModeratorDetailsTrigger: "Completed",
                      responseToInternalModeratorTrigger: "Completed",
                      externalExaminerDetailsTrigger: "Completed",
                      responseToExternalExaminerTrigger: "Completed",
                      programmeDirectorDetailsTrigger: "Completed",
                      internalModeratorModerationOfMarksTrigger: "Completed",
                      stage2ModuleAssessmentLeadCommentsTrigger: "Not Complete",
                      stage2ModeratorCommentsTrigger: "Not Complete",
                    },
                    [],"internalModerator"
                  )
                }
              >
                Start Stage 2 of Assessment
              </Button>
            </div>
          )}

        {/* Moderator Section */}
        {modData?.internalModeratorModerationOfMarksTrigger == "Completed" && (
          <>
            <h1>Moderator Section</h1>
            <Form.Label htmlFor="assessmentDeadline">
              Assessment Deadline
            </Form.Label>
            <Form.Control
              defaultValue={modData?.assessmentDeadline}
              disabled={!editStage2ModeratorComments}
              name="assessmentDeadline"
              type="date"
            />
            <br></br>

            <Form.Label htmlFor="markingCompletedDate">
              Marking Completed Date
            </Form.Label>
            <Form.Control
              defaultValue={modData?.markingCompletedDate}
              disabled={!editStage2ModeratorComments}
              name="markingCompletedDate"
              type="date"
            />
            <br></br>

            <Form.Label htmlFor="moderationCompletedDate">
              Moderation Completed Date
            </Form.Label>
            <Form.Control
              defaultValue={modData?.moderationCompletedDate}
              disabled={!editStage2ModeratorComments}
              name="moderationCompletedDate"
              type="date"
            />
            <br></br>

            <Form.Label htmlFor="totalSubmissions">
              Total Submissions
            </Form.Label>
            <Form.Control
              defaultValue={modData?.totalSubmissions}
              disabled={!editStage2ModeratorComments}
              name="totalSubmissions"
              type="number"
            />
            <br></br>

            <Form.Label htmlFor="failedSubmissions">
              Failed Submissions
            </Form.Label>
            <Form.Control
              defaultValue={modData?.failedSubmissions}
              disabled={!editStage2ModeratorComments}
              name="failedSubmissions"
              type="number"
            />
            <br></br>

            <Form.Label htmlFor="moderatedSubmissions">
              Moderated Submissions
            </Form.Label>
            <Form.Control
              defaultValue={modData?.moderatedSubmissions}
              disabled={!editStage2ModeratorComments}
              name="moderatedSubmissions"
              type="number"
            />
            <br></br>

            <Form.Label htmlFor="teachingImpactDetails">
              Teaching Impact Details
            </Form.Label>
            <Form.Control
              defaultValue={modData?.teachingImpactDetails}
              disabled={!editStage2ModeratorComments}
              name="teachingImpactDetails"
              type="text"
            />
            <br></br>

            <Form.Label htmlFor="stage2_moderatorComments">
              Stage 2 Moderator Comments
            </Form.Label>
            <Form.Control
              defaultValue={modData?.stage2_moderatorComments}
              disabled={!editStage2ModeratorComments}
              name="stage2_moderatorComments"
              type="text"
            />
            <br></br>

            <Row>
              <Col>
                <Form.Label htmlFor="stage2ModeratorSignature">
                  Stage 2 Moderator Signature
                </Form.Label>
                <Form.Control
                  defaultValue={modData?.stage2ModeratorSignature || "Pending"}
                  disabled={true}
                  name="stage2ModeratorSignature"
                  type="text"
                />
                <br></br>
              </Col>
              <Col>
                <Form.Label htmlFor="moderatorSignatureDateTime">
                  Submitted at :
                </Form.Label>
                <Form.Control
                  disabled
                  value={modData?.moderatorSignatureDateTime || ""}
                  name="moderatorSignatureDateTime"
                  type="text"
                  readOnly
                />
                <br></br>
              </Col>
            </Row>

            {!editStage2ModeratorComments &&
              userRoles.includes("INTERNAL_MODERATOR") && (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setEditStage2ModeratorComments(true);
                  }}
                >
                  Edit
                </Button>
              )}

            {editStage2ModeratorComments && (
              <>
                <Button
                  variant="outline-danger"
                  onClick={(e) => {
                    e.preventDefault();
                    setEditStage2ModeratorComments(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(
                      {
                        assessmentDetailsTrigger: "Completed",
                        internalModeratorDetailsTrigger: "Completed",
                        responseToInternalModeratorTrigger: "Completed",
                        externalExaminerDetailsTrigger: "Completed",
                        responseToExternalExaminerTrigger: "Completed",
                        programmeDirectorDetailsTrigger: "Completed",
                        internalModeratorModerationOfMarksTrigger: "Completed",
                        stage2ModuleAssessmentLeadCommentsTrigger:
                          "Not Complete",
                        stage2ModeratorCommentsTrigger: "Completed",
                      },
                      [
                        formRef.current.elements.assessmentDeadline.value,
                        formRef.current.elements.markingCompletedDate.value,
                        formRef.current.elements.moderationCompletedDate.value,
                        formRef.current.elements.totalSubmissions.value,
                        formRef.current.elements.failedSubmissions.value,
                        formRef.current.elements.moderatedSubmissions.value,
                        formRef.current.elements.teachingImpactDetails.value,
                      ],"assessmentLead"
                    );
                  }}
                >
                  Submit
                </Button>
              </>
            )}
          </>
        )}

        {/* Assessment Lead Stage 2 Section */}
        {modData?.stage2ModeratorCommentsTrigger == "Completed" && (
          <>
            <h1>Assessment Lead Stage 2 Section</h1>
            <Form.Label htmlFor="stage2_assessmentLeadComments">
              Stage 2 Assessment Lead Comments
            </Form.Label>
            <Form.Control
              defaultValue={modData?.stage2_assessmentLeadComments}
              disabled={!editStage2ModuleAssessmentLeadComments}
              name="stage2_assessmentLeadComments"
              type="text"
            />
            <br></br>

            <Row>
              <Col>
                <Form.Label htmlFor="stage2AssessmentLeadSignature">
                  Stage 2 Assessment Lead Signature
                </Form.Label>
                <Form.Control
                  defaultValue={
                    modData?.stage2AssessmentLeadSignature || "Pending"
                  }
                  disabled={true}
                  name="stage2AssessmentLeadSignature"
                  type="text"
                />
                <br></br>
              </Col>
              <Col>
                <Form.Label htmlFor="stage2ModuleAssessmentLeadSignatureDateTime">
                  Submitted at :
                </Form.Label>
                <Form.Control
                  disabled
                  value={
                    modData?.stage2ModuleAssessmentLeadSignatureDateTime || ""
                  }
                  name="stage2ModuleAssessmentLeadSignatureDateTime"
                  type="text"
                  readOnly
                />
                <br></br>
              </Col>
            </Row>

            {!editStage2ModuleAssessmentLeadComments &&
              userRoles.includes("MODULE_ASSESSMENT_LEAD") && (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setEditStage2ModuleAssessmentLeadComments(true);
                  }}
                >
                  Edit
                </Button>
              )}

            {editStage2ModuleAssessmentLeadComments && (
              <>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setEditStage2ModuleAssessmentLeadComments(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(
                      {
                        assessmentDetailsTrigger: "Completed",
                        internalModeratorDetailsTrigger: "Completed",
                        responseToInternalModeratorTrigger: "Completed",
                        externalExaminerDetailsTrigger: "Completed",
                        responseToExternalExaminerTrigger: "Completed",
                        programmeDirectorDetailsTrigger: "Completed",
                        internalModeratorModerationOfMarksTrigger: "Completed",
                        stage2ModuleAssessmentLeadCommentsTrigger: "Completed",
                        stage2ModeratorCommentsTrigger: "Completed",
                      },
                      [
                        formRef.current.elements.stage2_assessmentLeadComments
                          .value,
                      ],"programmeDirector"
                    );
                  }}
                >
                  Submit
                </Button>
              </>
            )}
          </>
        )}

        {/* Final Confirmation by Programme Director Section */}
        {modData?.stage2ModuleAssessmentLeadCommentsTrigger == "Completed" && (
          <>
            <h1>Final Confirmation by Programme Director</h1>

            <Row>
              <Col>
                <Form.Label htmlFor="programmeDirectorConfirmation_signature_stage2">
                  Programme Director Stage 2 Signature
                </Form.Label>
                <Form.Control
                  defaultValue={
                    modData?.programmeDirectorConfirmation_signature_stage2 ||
                    "Pending"
                  }
                  disabled={true}
                  name="programmeDirectorConfirmation_signature_stage2"
                  type="text"
                />
                <br></br>
              </Col>
              <Col>
                <Form.Label htmlFor="programmeDirectorConfirmation_signatureDateTime_stage2">
                  Submitted at :
                </Form.Label>
                <Form.Control
                  disabled
                  value={
                    modData?.programmeDirectorConfirmation_signatureDateTime_stage2 ||
                    ""
                  }
                  name="programmeDirectorConfirmation_signatureDateTime_stage2"
                  type="text"
                  readOnly
                />
                <br></br>
              </Col>
            </Row>

            {!editProgrammeDirectorConfirmation &&
              userRoles.includes("PROGRAMME_DIRECTOR") && (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setEditProgrammeDirectorConfirmation(true);
                  }}
                >
                  Edit
                </Button>
              )}

            {editProgrammeDirectorConfirmation && (
              <>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setEditProgrammeDirectorConfirmation(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(
                      {
                        assessmentDetailsTrigger: "Completed",
                        internalModeratorDetailsTrigger: "Completed",
                        responseToInternalModeratorTrigger: "Completed",
                        externalExaminerDetailsTrigger: "Completed",
                        responseToExternalExaminerTrigger: "Completed",
                        programmeDirectorDetailsTrigger: "Completed",
                        internalModeratorModerationOfMarksTrigger: "Completed",
                        stage2ModuleAssessmentLeadCommentsTrigger: "Completed",
                        stage2ModeratorCommentsTrigger: "Completed",
                      },
                      [
                        formRef.current.elements
                          .programmeDirectorConfirmation_signature.value,
                        formRef.current.elements
                          .programmeDirectorConfirmation_signature_stage2.value,
                      ],"assessmentLead"
                    );
                  }}
                >
                  Submit Final Confirmation
                </Button>
              </>
            )}
          </>
        )}
      </Form>
    </div>
  );
};

export default ModerationForm_2;

// "use client";
// import axiosInstance from "@/utils/axios";
// import Cookies from 'js-cookie';
// import {
//   notifyExternalExaminer,
//   notifyInternalModerator,
//   notifyProgrammeDirector
// } from '@/utils/emailService'; // Adjust the import path as necessary
// import { useEffect, useRef, useState } from "react";
// import { Button, Col, Form, Row } from "react-bootstrap";
// import { redirect } from "next/dist/server/api-utils";
// import { useRouter } from "next/navigation";
// import { useSearchParams } from 'next/navigation';
// import { PDFDownloadLink } from '@react-pdf/renderer';

// const AssessmentRoles = {
//   EXTERNAL_EXAMINER: 'EXTERNAL_EXAMINER',
//   INTERNAL_MODERATOR: 'INTERNAL_MODERATOR',
//   PROGRAMME_DIRECTOR: 'PROGRAMME_DIRECTOR',
//   MODULE_ASSESSMENT_LEAD: 'MODULE_ASSESSMENT_LEAD'
// };
// //import { PDFDownloadLink } from '@react-pdf/renderer';
// import PdfDocument from './pdf_generator';



// // Helper function to format date-time as "yyyy-MM-dd'T'HH:mm:ss"
// const formatDateTime = (date) => {
//   return date.toISOString().split('.')[0]; // Removes the milliseconds and timezone part
// };

// const ModerationForm_2 = (props) => {
//   const [modData, setModData] = useState(null);
//   const [moduleData, setModuleData] = useState(null);
//   const [userRoles, setUserRoles] = useState([]);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const moduleId = searchParams.get('moduleId');

//   const renderDownloadButton = () => {
//     if (!modData || !moduleData) return null;

//     return (
//       <div className="d-flex justify-content-end mb-4 p-3 bg-light rounded">
//         <PDFDownloadLink
//           document={<PdfDocument modData={modData} moduleData={moduleData} />}
//           fileName={`${moduleData.moduleCode}_${modData.title}_moderation.pdf`}
//         >
          
//             <Button 
//               variant="primary"
//               // disabled={loading}
//             >
            
//                 {/* <>
//                   <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                   Generating PDF...
//                 </> */}
              
//                 <>
//                   <i className="bi bi-download me-2"></i>
//                   Download Moderation Form
//                 </>
             
//             </Button>
       
//         </PDFDownloadLink>
//       </div>
//     );
//   };

  
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch assessment data
//         const assessmentResponse = await axiosInstance.get(`/api/v1/assessments/${props.assessmentId}`);
//         setModData(assessmentResponse.data);
        
//         // Fetch module data if moduleId exists
//         if (moduleId) {
//           const moduleResponse = await axiosInstance.get(`/api/v1/modules/${moduleId}`);
//           setModuleData(moduleResponse.data);
          
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, [props.assessmentId, moduleId]);

  
//   useEffect(() => {
//     if (modData) {
//       const userId = parseInt(Cookies.get('userId'));
//       const authorizedUser = modData.participants?.find(
//         participant => participant.userId === userId
//       );

//       if (!authorizedUser) {
//         // Use the initialized router to redirect
//         router.push('/unauthorized');
//         return; // Exit early from the effect
//       }

//       // If authorized, store their roles
//       if (!userRoles.length) {
//         setUserRoles(authorizedUser.roles);
//       }
//     }
   
//   }, [modData, userRoles, router]);

//   console.log(userRoles);

//   const formRef = useRef(null);
//   const defaultQuestions = [
//     {
//       questionText: "Does the assessment brief clearly state the learning outcomes being assessed?",
//       yesNoAnswer: false,
//       comment: ""
//     },
//     {
//       questionText: "Are the assessment criteria clearly linked to the learning outcomes?",
//       yesNoAnswer: false,
//       comment: ""
//     },
//     {
//       questionText: "Is the assessment brief clear and unambiguous?",
//       yesNoAnswer: false,
//       comment: ""
//     },
//     {
//       questionText: "Are the instructions for completing the assessment clear?",
//       yesNoAnswer: false,
//       comment: ""
//     },
//     {
//       questionText: "Is the word count/time limit appropriate for the assessment weighting?",
//       yesNoAnswer: false,
//       comment: ""
//     },
//     {
//       questionText: "Is the submission format clearly specified?",
//       yesNoAnswer: false,
//       comment: ""
//     }
//   ];

//   //questions
//   const [questions, setQuestions] = useState(modData?.questions?.length ? modData.questions : defaultQuestions);
//   //const [questions, setQuestions] = useState(modData?.questions || []);

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
//       setQuestions(modData.questions?.length ? modData.questions : defaultQuestions);
      
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

//   const handleSubmit = async (updatedTriggers, requiredFields, section) => {
//     if (!validateSectionFields(requiredFields)) {
//       alert("Please fill in all fields before submitting.");
//       return;
//     }

//     const userName = Cookies.get('name');
//     const signatureText = `Signed by ${userName}`;
//     const formData = formRef.current.elements;
//     const data = {
//       title: formData.title.value,
//       // moduleCode: formData.moduleCode.value,
//       moduleLeader: modData?.moduleLeader || '',
//       assessmentCategory: formData.assessmentCategory.value,
//       skills: formData.skills.value,
//       assessmentWeighting: formData.assessmentWeighting.value,
//       plannedIssueDate: formData.plannedIssueDate.value,
//       courseworkSubmissionDate: formData.courseworkSubmissionDate.value,
//       userRoles: modData?.userRoles || [],
//       moduleAssessmentLeadSignature:  editAssessment ? signatureText : modData.moduleAssessmentLeadSignature,
//       moduleAssessmentLeadSignatureDateTime: editAssessment ? formatDateTime(new Date()) : modData?.moduleAssessmentLeadSignatureDateTime, // Format for backend
//       responseToInternalModerator:editResponseToInternalModerator ? formData.responseToInternalModerator?.value:modData.responseToInternalModerator,
//       responseToInternalModeratorDateTime: editResponseToInternalModerator ? formatDateTime(new Date()) : modData?.responseToInternalModeratorDateTime, // Format for backend
//       responseToExternalExaminer: editResponseToExternalExaminer?formData.responseToExternalExaminer?.value:modData.responseToExternalExaminer,
//       responseToExternalExaminerDateTime: editResponseToExternalExaminer ? formatDateTime(new Date()) : modData?.responseToExternalExaminerDateTime, // Format for backend
//       stage2_assessmentLeadComments: editStage2ModuleAssessmentLeadComments?formData.stage2_assessmentLeadComments?.value:modData.stage2_assessmentLeadComments,
//       internalModeratorComments: formData.internalModeratorComments?.value,
//       internalModeratorSignature: editInternalModerator ? signatureText : modData?.internalModeratorSignature,
//       internalModeratorSignatureDateTime: editInternalModerator ? formatDateTime(new Date()) : modData?.internalModeratorSignatureDateTime, // Format for backend
//       stage2_moderatorComments: editStage2ModeratorComments?formData.stage2_moderatorComments?.value:modData.stage2_moderatorComments,
//       externalExaminerComments: editExternalExaminer?formData.externalExaminerComments?.value: modData.externalExaminerComments,
//       externalExaminerApproval: formData.externalExaminerApproval?.value,
//       externalExaminerSignatureDateTime: editExternalExaminer ? formatDateTime(new Date()) : modData?.externalExaminerSignatureDateTime, // Format for backend
//       externalExaminer_signature: editExternalExaminer ? signatureText : modData?.externalExaminer_signature,
//       programmeDirectorApproval: formData.programmeDirectorApproval?.value,
//       programmeDirectorSignatureDateTime: editProgrammeDirector ? formatDateTime(new Date()) : modData?.programmeDirectorSignatureDateTime, // Format for backend
//       programmeDirectorConfirmation_signature: editProgrammeDirector ? signatureText : modData?.programmeDirectorConfirmation_signature,
//       programmeDirectorConfirmation_signature_stage2: editProgrammeDirectorConfirmation ? signatureText : modData?.programmeDirectorConfirmation_signature_stage2,
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
//       responseToInternalModeratorSignature: editResponseToInternalModerator ? signatureText : modData?.responseToInternalModeratorSignature,
//       responseToExternalExaminerSignature: editResponseToExternalExaminer ? signatureText : modData?.responseToExternalExaminerSignature,
//       stage2AssessmentLeadSignature: editStage2ModuleAssessmentLeadComments ? signatureText : modData?.stage2AssessmentLeadSignature,
//       stage2ModeratorSignature: editStage2ModeratorComments ? signatureText : modData?.stage2ModeratorSignature,
//       questions: questions.map(q => ({
//         id: q.id,  // Include if it's an existing question
//         questionText: q.questionText,
//         yesNoAnswer: q.yesNoAnswer,
//         comment: q.comment
//       })),
//       ...updatedTriggers,
//     };
//     try{
//         await  axiosInstance.put(`/api/v1/assessments/${props.assessmentId}`, data);
       
//     // After successful submission, send the appropriate email
//     switch(section) {
//       case 'internalModerator':
//         await notifyInternalModerator("mendoncamax1234@gmail.com", {
//           title: data.title,
//           module:moduleData.moduleName,
//           moduleCode: moduleData.moduleCode,
//           dueDate: data.courseworkSubmissionDate
//         });
//         break;
//       case 'externalExaminer':
//         await notifyExternalExaminer("mendoncamax1234@gmail.com", {
//           title: data.title,
//           module:moduleData.moduleName,
//           moduleCode: moduleData.moduleCode,
//           dueDate: data.courseworkSubmissionDate
//         });
//         break;
//       case 'programmeDirector':
//         await notifyProgrammeDirector("mendoncamax1234@gmail.com", {
//           title: data.title,
//           module: data.moduleCode,
//           dueDate: data.courseworkSubmissionDate
//         });
//         break;
//       // Add other cases as needed
//     }

//         alert("Submission successful and notification sent.");
//         window.location.reload();
//     } catch (error) {
//       console.error("Error in submission or sending notification:", error);
//       alert("An error occurred. Please try again.");
//     }

// };

//   return (
//     <div>
//       <Form ref={formRef} action="">
//         {renderDownloadButton()}
//         {/* Module Details Section */}
//         {moduleData && (
//           <div className="mb-6">
//             <h1>Module Details</h1>

//             <Col>
//               <Form.Label>Module Name</Form.Label>
//               <Form.Control value={moduleData.moduleName} disabled />
//             </Col>
//             <Col>
//               <Form.Label>Module Code</Form.Label>
//               <Form.Control value={moduleData.moduleCode} disabled />
//             </Col>

//             <Col>
//               <Form.Label>Module Leader</Form.Label>
//               <Form.Control value={moduleData.moduleLeader} disabled />
//             </Col>
//             <Col>
//               <Form.Label>Credits</Form.Label>
//               <Form.Control value={moduleData.credits} disabled />
//             </Col>
//             <Col>
//               <Form.Label>Level</Form.Label>
//               <Form.Control value={moduleData.level} disabled />
//             </Col>
//             <Col>
//               <Form.Label>Module Outcomes</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={7}
//                 value={moduleData.moduleOutcomes}
//                 disabled
//               />
//             </Col>
//           </div>
//         )}

//         {/* Gets participants */}
//         {modData && modData.participants && (
//           <div className="mb-6">
//             <h2>Assessment Roles</h2>

//             {/* Current User's Roles */}
//             <Row className="mb-3">
//               <Col>
//                 <Form.Label className="fw-bold">Your Role(s):</Form.Label>
//                 <p>
//                   {userRoles.map((role) => role.replace(/_/g, " ")).join(", ")}
//                 </p>
//               </Col>
//             </Row>

//             {/* Display each role type */}
//             {[
//               "MODULE_ASSESSMENT_LEAD",
//               "INTERNAL_MODERATOR",
//               "EXTERNAL_EXAMINER",
//               "PROGRAMME_DIRECTOR",
//             ].map((roleType) => {
//               // Find all participants that have this role
//               const participantsWithRole = modData.participants.filter(
//                 (participant) => participant.roles.includes(roleType)
//               );

//               // Only render if there are participants with this role
//               if (participantsWithRole.length > 0) {
//                 return (
//                   <Row key={roleType} className="mb-3">
//                     <Col>
//                       <h5>{roleType.replace(/_/g, " ")}(s):</h5>
//                       <p>
//                         {participantsWithRole.map((participant, index) => (
//                           <span key={participant.userId}>
//                             {participant.firstName} {participant.lastName}
//                             {index < participantsWithRole.length - 1
//                               ? ", "
//                               : ""}
//                           </span>
//                         ))}
//                       </p>
//                     </Col>
//                   </Row>
//                 );
//               }
//               return null;
//             })}
//           </div>
//         )}

//         {/* Assessment Details Section */}
//         <h1>Assessment Details</h1>

//         <Form.Label htmlFor="title">Assessment Title</Form.Label>
//         <Form.Control
//           defaultValue={modData?.title}
//           disabled={!editAssessment}
//           name="title"
//           type="text"
//         />
//         <br></br>

//         <Form.Label htmlFor="assessmentCategory">
//           Assessment Category
//         </Form.Label>
//         <Form.Control
//           defaultValue={modData?.assessmentCategory}
//           disabled={!editAssessment}
//           name="assessmentCategory"
//           type="text"
//         />
//         <br></br>

//         <Form.Label htmlFor="skills">
//           MLOs/ or Knowledge Skills & Behaviours(KSBs) covered in this
//           assessment
//         </Form.Label>
//         <Form.Control
//           defaultValue={modData?.skills}
//           disabled={!editAssessment}
//           name="skills"
//           type="text"
//         />
//         <br></br>

//         <Form.Label htmlFor="assessmentWeighting">
//           Assessment Weighting
//         </Form.Label>
//         <Form.Control
//           defaultValue={modData?.assessmentWeighting}
//           disabled={!editAssessment}
//           name="assessmentWeighting"
//           type="number"
//         />
//         <br></br>

//         <Form.Label htmlFor="plannedIssueDate">Planned Issue Date</Form.Label>
//         <Form.Control
//           defaultValue={modData?.plannedIssueDate}
//           disabled={!editAssessment}
//           name="plannedIssueDate"
//           type="date"
//         />
//         <br></br>

//         <Form.Label htmlFor="courseworkSubmissionDate">
//           Coursework Submission Date
//         </Form.Label>
//         <Form.Control
//           defaultValue={modData?.courseworkSubmissionDate}
//           disabled={!editAssessment}
//           name="courseworkSubmissionDate"
//           type="date"
//         />
//         <br></br>

//         <Row>
//           <Col>
//             <Form.Label htmlFor="moduleAssessmentLeadSignature">
//               Module Assessment Lead Signature
//             </Form.Label>
//             <Form.Control
//               defaultValue={modData?.moduleAssessmentLeadSignature }
//               disabled={true}
//               name="moduleAssessmentLeadSignature"
//               type="text"
//             />
//             <br></br>
//           </Col>
//           <Col>
//             <Form.Label htmlFor="moduleAssessmentLeadSignatureDateTime">
//               Submitted at :
//             </Form.Label>
//             <Form.Control
//               disabled
//               value={modData?.moduleAssessmentLeadSignatureDateTime || ""}
//               name="moduleAssessmentLeadSignatureDateTime"
//               type="text"
//               readOnly
//             />
//             <br></br>
//           </Col>
//         </Row>

//         {!editAssessment && userRoles.includes("MODULE_ASSESSMENT_LEAD") && (
//           <Button
//             onClick={(e) => {
//               e.preventDefault();
//               setEditAssessment(true);
//             }}
//           >
//             Edit
//           </Button>
//         )}

//         {editAssessment && (
//           <>
//             <Button
//               variant="outline-danger"
//               onClick={(e) => {
//                 e.preventDefault();
//                 setEditAssessment(false);
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={(e) => {
//                 e.preventDefault();
//                 handleSubmit(
//                   {
//                     assessmentDetailsTrigger: "Completed",
//                     internalModeratorDetailsTrigger: "Not Complete",
//                     externalExaminerDetailsTrigger: "Not Complete",
//                     responseToInternalModeratorTrigger: "Not Complete",
//                     responseToExternalExaminerTrigger: "Not Complete",
//                     programmeDirectorDetailsTrigger: "Not Complete",
//                     internalModeratorModerationOfMarksTrigger: "Not Complete",
//                     stage2ModuleAssessmentLeadCommentsTrigger: "Not Complete",
//                     stage2ModeratorCommentsTrigger: "Not Complete",
//                   },
//                   [
//                     formRef.current.elements.title.value,
//                     //formRef.current.elements.moduleCode.value,
//                     formRef.current.elements.assessmentCategory.value,
//                     formRef.current.elements.skills.value,
//                     formRef.current.elements.assessmentWeighting.value,
//                     formRef.current.elements.plannedIssueDate.value,
//                     formRef.current.elements.courseworkSubmissionDate.value,
//                     formRef.current.elements.moduleAssessmentLeadSignature.value,
//                   ],
//                   "internalModerator"
//                 );
//               }}
//             >
//               Submit Assessment Details
//             </Button>
//           </>
//         )}

//         {/* Internal Moderator Section */}
//         {modData?.assessmentDetailsTrigger == "Completed" && (
//           <>
//             <h1>Internal Moderator Section</h1>
//             <h2>Questions</h2>
//             {questions.map((question, index) => (
//               <Row key={index}>
//                 <Col style={{ width: "2%" }} xs={1}>
//                   <Form.Label htmlFor={`questionText-${index}`}>
//                     {index + 1}
//                   </Form.Label>
//                 </Col>
//                 <Col xs={5}>
//                   <Form.Control
//                     as="textarea"
//                     rows={1}
//                     id={`questionText-${index}`}
//                     value={question.questionText}
//                     onChange={(e) => {
//                       const newQuestions = [...questions];
//                       newQuestions[index].questionText = e.target.value;
//                       setQuestions(newQuestions);
//                     }}
//                     disabled={!editInternalModerator}
//                     type="text"
//                   />
//                 </Col>
//                 <Col style={{ width: "5%" }} xs={1}>
//                   <Form.Label htmlFor={`yesNoAnswer-${index}`}>
//                     Yes/No
//                   </Form.Label>
//                 </Col>
//                 <Col style={{ width: "5%" }} xs={1}>
//                   <select
//                     id={`yesNoAnswer-${index}`}
//                     value={question.yesNoAnswer}
//                     onChange={(e) => {
//                       const newQuestions = [...questions];
//                       newQuestions[index].yesNoAnswer =
//                         e.target.value === "true";
//                       setQuestions(newQuestions);
//                     }}
//                     disabled={!editInternalModerator}
//                   >
//                     <option value="true">Yes</option>
//                     <option value="false">No</option>
//                   </select>
//                 </Col>

//                 <Col xs={1}>
//                   <Form.Label htmlFor={`comment-${index}`}>Comment</Form.Label>
//                 </Col>
//                 <Col xs={2}>
//                   <Form.Control
//                     id={`comment-${index}`}
//                     value={question.comment}
//                     onChange={(e) => {
//                       const newQuestions = [...questions];
//                       newQuestions[index].comment = e.target.value;
//                       setQuestions(newQuestions);
//                     }}
//                     disabled={!editInternalModerator}
//                     type="text"
//                   />
//                 </Col>
//                 <Col xs={2}>
//                   <Button
//                     variant="outline-danger"
//                     type="button"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       deleteQuestion(index);
//                     }}
//                     disabled={!editInternalModerator}
//                   >
//                     Delete Question
//                   </Button>
//                 </Col>
//               </Row>
//             ))}

//             <Button
//               type="button"
//               onClick={(e) => {
//                 e.preventDefault();
//                 addQuestion();
//               }}
//               disabled={!editInternalModerator}
//             >
//               Add Question
//             </Button>
//             <br></br>
//             <br></br>

//             <Form.Label htmlFor="internalModeratorComments">
//               Internal Moderator Comments
//             </Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={3}
//               defaultValue={modData?.internalModeratorComments}
//               disabled={!editInternalModerator}
//               name="internalModeratorComments"
//               type="text"
//             />
//             <br></br>

//             <Row>
//               <Col>
//                 <Form.Label htmlFor="internalModeratorSignature">
//                   Internal Moderator Signature
//                 </Form.Label>
//                 <Form.Control
//                   defaultValue={
//                     modData?.internalModeratorSignature || "Pending"
//                   }
//                   disabled={true}
//                   name="internalModeratorSignature"
//                   type="text"
//                 />
//                 <br></br>
//               </Col>
//               <Col>
//                 <Form.Label htmlFor="internalModeratorSignatureDateTime">
//                   Submitted at :
//                 </Form.Label>
//                 <Form.Control
//                   disabled
//                   value={modData?.internalModeratorSignatureDateTime || ""}
//                   name="internalModeratorSignatureDateTime"
//                   type="text"
//                   readOnly
//                 />
//                 <br></br>
//               </Col>
//             </Row>

//             {!editInternalModerator &&
//               userRoles.includes("INTERNAL_MODERATOR") && (
//                 <Button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setEditInternalModerator(true);
//                   }}
//                 >
//                   Edit
//                 </Button>
//               )}

//             {editInternalModerator && (
//               <>
//                 <Button
//                   variant="outline-danger"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setEditInternalModerator(false);
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleSubmit(
//                       {
//                         assessmentDetailsTrigger: "Completed",
//                         internalModeratorDetailsTrigger: "Completed",
//                         responseToInternalModeratorTrigger: "Not Complete",
//                         externalExaminerDetailsTrigger: "Not Complete",
//                         responseToExternalExaminerTrigger: "Not Complete",
//                         programmeDirectorDetailsTrigger: "Not Complete",
//                         internalModeratorModerationOfMarksTrigger:
//                           "Not Complete",
//                         stage2ModuleAssessmentLeadCommentsTrigger:
//                           "Not Complete",
//                         stage2ModeratorCommentsTrigger: "Not Complete",
//                       },
//                       [
//                         formRef.current.elements.internalModeratorComments
//                           .value,
//                         formRef.current.elements.internalModeratorSignature
//                           .value,
//                         ...questions.flatMap((q) => [
//                           q.questionText,
//                           q.comment,
//                         ]),
//                       ],
//                       "internalModerator"
//                     );
//                   }}
//                 >
//                   Submit
//                 </Button>
//               </>
//             )}
//           </>
//         )}

//         {/* Response to Internal Moderator Section */}
//         {modData?.internalModeratorDetailsTrigger == "Completed" && (
//           <>
//             <h1>Response to Internal Moderator</h1>
//             <Form.Label htmlFor="responseToInternalModerator">
//               Response to Internal Moderator
//             </Form.Label>
//             <Form.Control
//               defaultValue={modData?.responseToInternalModerator}
//               disabled={!editResponseToInternalModerator}
//               name="responseToInternalModerator"
//               type="text"
//             />
//             <br></br>

//             <Row>
//               <Col>
//                 <Form.Label htmlFor="responseToInternalModeratorSignature">
//                   Response to Internal Moderator Signature
//                 </Form.Label>
//                 <Form.Control
//                   defaultValue={
//                     modData?.responseToInternalModeratorSignature || "Pending"
//                   }
//                   disabled={true}
//                   name="responseToInternalModeratorSignature"
//                   type="text"
//                 />
//                 <br></br>
//               </Col>
//               <Col>
//                 <Form.Label htmlFor="responseToInternalModeratorDateTime">
//                   Submitted at :
//                 </Form.Label>
//                 <Form.Control
//                   disabled
//                   value={modData?.responseToInternalModeratorDateTime || ""}
//                   name="responseToInternalModeratorDateTime"
//                   type="text"
//                   readOnly
//                 />
//                 <br></br>
//               </Col>
//             </Row>

//             {!editResponseToInternalModerator &&
//               userRoles.includes("MODULE_ASSESSMENT_LEAD") && (
//                 <Button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setEditResponseToInternalModerator(true);
//                   }}
//                 >
//                   Edit
//                 </Button>
//               )}

//             {editResponseToInternalModerator && (
//               <>
//                 <Button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setEditResponseToInternalModerator(false);
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleSubmit(
//                       {
//                         assessmentDetailsTrigger: "Completed",
//                         internalModeratorDetailsTrigger: "Completed",
//                         responseToInternalModeratorTrigger: "Completed",
//                         externalExaminerDetailsTrigger: "Not Complete",
//                         responseToExternalExaminerTrigger: "Not Complete",
//                         programmeDirectorDetailsTrigger: "Not Complete",
//                         internalModeratorModerationOfMarksTrigger:
//                           "Not Complete",
//                         stage2ModuleAssessmentLeadCommentsTrigger:
//                           "Not Complete",
//                         stage2ModeratorCommentsTrigger: "Not Complete",
//                       },
//                       [
//                         formRef.current.elements.responseToInternalModerator
//                           .value,
//                       ]
//                     );
//                   }}
//                 >
//                   Submit
//                 </Button>
//               </>
//             )}
//           </>
//         )}

//         {/* External Examiner Section */}
//         {modData?.responseToInternalModeratorTrigger == "Completed" && (
//           <>
//             <h1>External Examiner Section</h1>
//             <Form.Label htmlFor="externalExaminerComments">
//               External Examiner Comments
//             </Form.Label>
//             <Form.Control
//               defaultValue={modData?.externalExaminerComments}
//               disabled={!editExternalExaminer}
//               name="externalExaminerComments"
//               type="text"
//             />
//             <br></br>

//             <Form.Label htmlFor="externalExaminerApproval">
//               External Examiner Approval
//             </Form.Label>
//             <Form.Control
//               defaultValue={modData?.externalExaminerApproval}
//               disabled={!editExternalExaminer}
//               name="externalExaminerApproval"
//               type="text"
//             />
//             <br></br>

//             <Row>
//               <Col>
//                 <Form.Label htmlFor="externalExaminer_signature">
//                   External Examiner Signature
//                 </Form.Label>
//                 <Form.Control
//                   defaultValue={
//                     modData?.externalExaminer_signature || "Pending"
//                   }
//                   disabled={true}
//                   name="externalExaminer_signature"
//                   type="text"
//                 />
//                 <br></br>
//               </Col>
//               <Col>
//                 <Form.Label htmlFor="externalExaminerSignatureDateTime">
//                   Submitted at :
//                 </Form.Label>
//                 <Form.Control
//                   disabled
//                   value={modData?.externalExaminerSignatureDateTime || ""}
//                   name="externalExaminerSignatureDateTime"
//                   type="text"
//                   readOnly
//                 />
//                 <br></br>
//               </Col>
//             </Row>

//             {!editExternalExaminer &&
//               userRoles.includes("EXTERNAL_EXAMINER") && (
//                 <Button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setEditExternalExaminer(true);
//                   }}
//                 >
//                   Edit
//                 </Button>
//               )}

//             {editExternalExaminer && (
//               <>
//                 <Button
//                   variant="outline-danger"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setEditExternalExaminer(false);
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleSubmit(
//                       {
//                         assessmentDetailsTrigger: "Completed",
//                         internalModeratorDetailsTrigger: "Completed",
//                         responseToInternalModeratorTrigger: "Completed",
//                         externalExaminerDetailsTrigger: "Completed",
//                         responseToExternalExaminerTrigger: "Not Complete",
//                         programmeDirectorDetailsTrigger: "Not Complete",
//                         internalModeratorModerationOfMarksTrigger:
//                           "Not Complete",
//                         stage2ModuleAssessmentLeadCommentsTrigger:
//                           "Not Complete",
//                         stage2ModeratorCommentsTrigger: "Not Complete",
//                       },
//                       [
//                         formRef.current.elements.externalExaminerComments.value,
//                         formRef.current.elements.externalExaminerApproval.value,
//                         formRef.current.elements.externalExaminer_signature
//                           .value,
//                       ]
//                     );
//                   }}
//                 >
//                   Submit External Examiner Details
//                 </Button>
//               </>
//             )}
//           </>
//         )}

//         {/* Response to External Examiner Section */}
//         {modData?.externalExaminerDetailsTrigger == "Completed" && (
//           <>
//             <h1>Response to External Examiner</h1>
//             <Form.Label htmlFor="responseToExternalExaminer">
//               Response to External Examiner
//             </Form.Label>
//             <Form.Control
//               defaultValue={modData?.responseToExternalExaminer}
//               disabled={!editResponseToExternalExaminer}
//               name="responseToExternalExaminer"
//               type="text"
//             />
//             <br></br>

//             <Row>
//               <Col>
//                 <Form.Label htmlFor="responseToExternalExaminerSignature">
//                   Response to External Examiner Signature
//                 </Form.Label>
//                 <Form.Control
//                   defaultValue={
//                     modData?.responseToExternalExaminerSignature || "Pending"
//                   }
//                   disabled={true}
//                   name="responseToExternalExaminerSignature"
//                   type="text"
//                 />
//                 <br></br>
//               </Col>
//               <Col>
//                 <Form.Label htmlFor="responseToExternalExaminerDateTime">
//                   Submitted at :
//                 </Form.Label>
//                 <Form.Control
//                   disabled
//                   value={modData?.responseToExternalExaminerDateTime || ""}
//                   name="responseToExternalExaminerDateTime"
//                   type="text"
//                   readOnly
//                 />
//                 <br></br>
//               </Col>
//             </Row>

//             {!editResponseToExternalExaminer &&
//               userRoles.includes("MODULE_ASSESSMENT_LEAD") && (
//                 <Button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setEditResponseToExternalExaminer(true);
//                   }}
//                 >
//                   Edit
//                 </Button>
//               )}

//             {editResponseToExternalExaminer && (
//               <>
//                 <Button
//                   variant="outline-danger"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setEditResponseToExternalExaminer(false);
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleSubmit(
//                       {
//                         assessmentDetailsTrigger: "Completed",
//                         internalModeratorDetailsTrigger: "Completed",
//                         responseToInternalModeratorTrigger: "Completed",
//                         externalExaminerDetailsTrigger: "Completed",
//                         responseToExternalExaminerTrigger: "Completed",
//                         programmeDirectorDetailsTrigger: "Not Complete",
//                         internalModeratorModerationOfMarksTrigger:
//                           "Not Complete",
//                         stage2ModuleAssessmentLeadCommentsTrigger:
//                           "Not Complete",
//                         stage2ModeratorCommentsTrigger: "Not Complete",
//                       },
//                       [
//                         formRef.current.elements.responseToExternalExaminer
//                           .value,
//                       ]
//                     );
//                   }}
//                 >
//                   Submit
//                 </Button>
//               </>
//             )}
//           </>
//         )}

//         {/* Programme Director Section */}
//         {modData?.responseToExternalExaminerTrigger == "Completed" && (
//           <>
//             <h1>Programme Director Section</h1>
//             <Form.Label htmlFor="programmeDirectorApproval">
//               Programme Director Approval
//             </Form.Label>
//             <Form.Control
//               defaultValue={modData?.programmeDirectorApproval}
//               disabled={!editProgrammeDirector}
//               name="programmeDirectorApproval"
//               type="text"
//             />
//             <br></br>

//             <Row>
//               <Col>
//                 <Form.Label htmlFor="programmeDirectorConfirmation_signature">
//                   Programme Director Signature
//                 </Form.Label>
//                 <Form.Control
//                   defaultValue={
//                     modData?.programmeDirectorConfirmation_signature ||
//                     "Pending"
//                   }
//                   disabled={true}
//                   name="programmeDirectorConfirmation_signature"
//                   type="text"
//                 />
//                 <br></br>
//               </Col>
//               <Col>
//                 <Form.Label htmlFor="programmeDirectorSignatureDateTime">
//                   Submitted at :
//                 </Form.Label>
//                 <Form.Control
//                   disabled
//                   value={modData?.programmeDirectorSignatureDateTime || ""}
//                   name="programmeDirectorSignatureDateTime"
//                   type="text"
//                   readOnly
//                 />
//                 <br></br>
//               </Col>
//             </Row>

//             {!editProgrammeDirector &&
//               userRoles.includes("PROGRAMME_DIRECTOR") && (
//                 <Button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setEditProgrammeDirector(true);
//                   }}
//                 >
//                   Edit
//                 </Button>
//               )}

//             {editProgrammeDirector && (
//               <>
//                 <Button
//                   variant="outline-danger"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setEditProgrammeDirector(false);
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleSubmit(
//                       {
//                         assessmentDetailsTrigger: "Completed",
//                         internalModeratorDetailsTrigger: "Completed",
//                         responseToInternalModeratorTrigger: "Completed",
//                         externalExaminerDetailsTrigger: "Completed",
//                         responseToExternalExaminerTrigger: "Completed",
//                         programmeDirectorDetailsTrigger: "Completed",
//                         internalModeratorModerationOfMarksTrigger:
//                           "Not Complete",
//                         stage2ModuleAssessmentLeadCommentsTrigger:
//                           "Not Complete",
//                         stage2ModeratorCommentsTrigger: "Not Complete",
//                       },
//                       [
//                         formRef.current.elements.programmeDirectorApproval
//                           .value,
//                         formRef.current.elements
//                           .programmeDirectorConfirmation_signature.value,
//                       ]
//                     );
//                   }}
//                 >
//                   Submit
//                 </Button>
//               </>
//             )}
//           </>
//         )}

//         <br></br>
//         <br></br>
//         <br></br>
//         <br></br>
//         {/* Trigger for stage 2 Section */}
//         {modData?.programmeDirectorDetailsTrigger == "Completed" &&
//           modData?.internalModeratorModerationOfMarksTrigger ==
//             "Not Complete" &&
//           userRoles.includes("MODULE_ASSESSMENT_LEAD") && (
//             <div style={{ display: "flex", justifyContent: "center" }}>
//               <Button
//                 onClick={() =>
//                   handleSubmit(
//                     {
//                       assessmentDetailsTrigger: "Completed",
//                       internalModeratorDetailsTrigger: "Completed",
//                       responseToInternalModeratorTrigger: "Completed",
//                       externalExaminerDetailsTrigger: "Completed",
//                       responseToExternalExaminerTrigger: "Completed",
//                       programmeDirectorDetailsTrigger: "Completed",
//                       internalModeratorModerationOfMarksTrigger: "Completed",
//                       stage2ModuleAssessmentLeadCommentsTrigger: "Not Complete",
//                       stage2ModeratorCommentsTrigger: "Not Complete",
//                     },
//                     []
//                   )
//                 }
//               >
//                 Start Stage 2 of Assessment
//               </Button>
//             </div>
//           )}

//         {/* Moderator Section */}
//         {modData?.internalModeratorModerationOfMarksTrigger == "Completed" && (
//           <>
//             <h1>Moderator Section</h1>
//             <Form.Label htmlFor="assessmentDeadline">
//               Assessment Deadline
//             </Form.Label>
//             <Form.Control
//               defaultValue={modData?.assessmentDeadline}
//               disabled={!editStage2ModeratorComments}
//               name="assessmentDeadline"
//               type="date"
//             />
//             <br></br>

//             <Form.Label htmlFor="markingCompletedDate">
//               Marking Completed Date
//             </Form.Label>
//             <Form.Control
//               defaultValue={modData?.markingCompletedDate}
//               disabled={!editStage2ModeratorComments}
//               name="markingCompletedDate"
//               type="date"
//             />
//             <br></br>

//             <Form.Label htmlFor="moderationCompletedDate">
//               Moderation Completed Date
//             </Form.Label>
//             <Form.Control
//               defaultValue={modData?.moderationCompletedDate}
//               disabled={!editStage2ModeratorComments}
//               name="moderationCompletedDate"
//               type="date"
//             />
//             <br></br>

//             <Form.Label htmlFor="totalSubmissions">
//               Total Submissions
//             </Form.Label>
//             <Form.Control
//               defaultValue={modData?.totalSubmissions}
//               disabled={!editStage2ModeratorComments}
//               name="totalSubmissions"
//               type="number"
//             />
//             <br></br>

//             <Form.Label htmlFor="failedSubmissions">
//               Failed Submissions
//             </Form.Label>
//             <Form.Control
//               defaultValue={modData?.failedSubmissions}
//               disabled={!editStage2ModeratorComments}
//               name="failedSubmissions"
//               type="number"
//             />
//             <br></br>

//             <Form.Label htmlFor="moderatedSubmissions">
//               Moderated Submissions
//             </Form.Label>
//             <Form.Control
//               defaultValue={modData?.moderatedSubmissions}
//               disabled={!editStage2ModeratorComments}
//               name="moderatedSubmissions"
//               type="number"
//             />
//             <br></br>

//             <Form.Label htmlFor="teachingImpactDetails">
//               Teaching Impact Details
//             </Form.Label>
//             <Form.Control
//               defaultValue={modData?.teachingImpactDetails}
//               disabled={!editStage2ModeratorComments}
//               name="teachingImpactDetails"
//               type="text"
//             />
//             <br></br>

//             <Form.Label htmlFor="stage2_moderatorComments">
//               Stage 2 Moderator Comments
//             </Form.Label>
//             <Form.Control
//               defaultValue={modData?.stage2_moderatorComments}
//               disabled={!editStage2ModeratorComments}
//               name="stage2_moderatorComments"
//               type="text"
//             />
//             <br></br>

//             <Row>
//               <Col>
//                 <Form.Label htmlFor="stage2ModeratorSignature">
//                   Stage 2 Moderator Signature
//                 </Form.Label>
//                 <Form.Control
//                   defaultValue={modData?.stage2ModeratorSignature || "Pending"}
//                   disabled={true}
//                   name="stage2ModeratorSignature"
//                   type="text"
//                 />
//                 <br></br>
//               </Col>
//               <Col>
//                 <Form.Label htmlFor="moderatorSignatureDateTime">
//                   Submitted at :
//                 </Form.Label>
//                 <Form.Control
//                   disabled
//                   value={modData?.moderatorSignatureDateTime || ""}
//                   name="moderatorSignatureDateTime"
//                   type="text"
//                   readOnly
//                 />
//                 <br></br>
//               </Col>
//             </Row>

//             {!editStage2ModeratorComments &&
//               userRoles.includes("INTERNAL_MODERATOR") && (
//                 <Button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setEditStage2ModeratorComments(true);
//                   }}
//                 >
//                   Edit
//                 </Button>
//               )}

//             {editStage2ModeratorComments && (
//               <>
//                 <Button
//                   variant="outline-danger"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setEditStage2ModeratorComments(false);
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleSubmit(
//                       {
//                         assessmentDetailsTrigger: "Completed",
//                         internalModeratorDetailsTrigger: "Completed",
//                         responseToInternalModeratorTrigger: "Completed",
//                         externalExaminerDetailsTrigger: "Completed",
//                         responseToExternalExaminerTrigger: "Completed",
//                         programmeDirectorDetailsTrigger: "Completed",
//                         internalModeratorModerationOfMarksTrigger: "Completed",
//                         stage2ModuleAssessmentLeadCommentsTrigger:
//                           "Not Complete",
//                         stage2ModeratorCommentsTrigger: "Completed",
//                       },
//                       [
//                         formRef.current.elements.assessmentDeadline.value,
//                         formRef.current.elements.markingCompletedDate.value,
//                         formRef.current.elements.moderationCompletedDate.value,
//                         formRef.current.elements.totalSubmissions.value,
//                         formRef.current.elements.failedSubmissions.value,
//                         formRef.current.elements.moderatedSubmissions.value,
//                         formRef.current.elements.teachingImpactDetails.value,
//                       ]
//                     );
//                   }}
//                 >
//                   Submit
//                 </Button>
//               </>
//             )}
//           </>
//         )}

//         {/* Assessment Lead Stage 2 Section */}
//         {modData?.stage2ModeratorCommentsTrigger == "Completed" && (
//           <>
//             <h1>Assessment Lead Stage 2 Section</h1>
//             <Form.Label htmlFor="stage2_assessmentLeadComments">
//               Stage 2 Assessment Lead Comments
//             </Form.Label>
//             <Form.Control
//               defaultValue={modData?.stage2_assessmentLeadComments}
//               disabled={!editStage2ModuleAssessmentLeadComments}
//               name="stage2_assessmentLeadComments"
//               type="text"
//             />
//             <br></br>

//             <Row>
//               <Col>
//                 <Form.Label htmlFor="stage2AssessmentLeadSignature">
//                   Stage 2 Assessment Lead Signature
//                 </Form.Label>
//                 <Form.Control
//                   defaultValue={
//                     modData?.stage2AssessmentLeadSignature || "Pending"
//                   }
//                   disabled={true}
//                   name="stage2AssessmentLeadSignature"
//                   type="text"
//                 />
//                 <br></br>
//               </Col>
//               <Col>
//                 <Form.Label htmlFor="stage2ModuleAssessmentLeadSignatureDateTime">
//                   Submitted at :
//                 </Form.Label>
//                 <Form.Control
//                   disabled
//                   value={
//                     modData?.stage2ModuleAssessmentLeadSignatureDateTime || ""
//                   }
//                   name="stage2ModuleAssessmentLeadSignatureDateTime"
//                   type="text"
//                   readOnly
//                 />
//                 <br></br>
//               </Col>
//             </Row>

//             {!editStage2ModuleAssessmentLeadComments &&
//               userRoles.includes("MODULE_ASSESSMENT_LEAD") && (
//                 <Button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setEditStage2ModuleAssessmentLeadComments(true);
//                   }}
//                 >
//                   Edit
//                 </Button>
//               )}

//             {editStage2ModuleAssessmentLeadComments && (
//               <>
//                 <Button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setEditStage2ModuleAssessmentLeadComments(false);
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleSubmit(
//                       {
//                         assessmentDetailsTrigger: "Completed",
//                         internalModeratorDetailsTrigger: "Completed",
//                         responseToInternalModeratorTrigger: "Completed",
//                         externalExaminerDetailsTrigger: "Completed",
//                         responseToExternalExaminerTrigger: "Completed",
//                         programmeDirectorDetailsTrigger: "Completed",
//                         internalModeratorModerationOfMarksTrigger: "Completed",
//                         stage2ModuleAssessmentLeadCommentsTrigger: "Completed",
//                         stage2ModeratorCommentsTrigger: "Completed",
//                       },
//                       [
//                         formRef.current.elements.stage2_assessmentLeadComments
//                           .value,
//                       ]
//                     );
//                   }}
//                 >
//                   Submit
//                 </Button>
//               </>
//             )}
//           </>
//         )}

//         {/* Final Confirmation by Programme Director Section */}
//         {modData?.stage2ModuleAssessmentLeadCommentsTrigger == "Completed" && (
//           <>
//             <h1>Final Confirmation by Programme Director</h1>

//             <Row>
//               <Col>
//                 <Form.Label htmlFor="programmeDirectorConfirmation_signature_stage2">
//                   Programme Director Stage 2 Signature
//                 </Form.Label>
//                 <Form.Control
//                   defaultValue={
//                     modData?.programmeDirectorConfirmation_signature_stage2 ||
//                     "Pending"
//                   }
//                   disabled={true}
//                   name="programmeDirectorConfirmation_signature_stage2"
//                   type="text"
//                 />
//                 <br></br>
//               </Col>
//               <Col>
//                 <Form.Label htmlFor="programmeDirectorConfirmation_signatureDateTime_stage2">
//                   Submitted at :
//                 </Form.Label>
//                 <Form.Control
//                   disabled
//                   value={
//                     modData?.programmeDirectorConfirmation_signatureDateTime_stage2 ||
//                     ""
//                   }
//                   name="programmeDirectorConfirmation_signatureDateTime_stage2"
//                   type="text"
//                   readOnly
//                 />
//                 <br></br>
//               </Col>
//             </Row>

//             {!editProgrammeDirectorConfirmation &&
//               userRoles.includes("PROGRAMME_DIRECTOR") && (
//                 <Button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setEditProgrammeDirectorConfirmation(true);
//                   }}
//                 >
//                   Edit
//                 </Button>
//               )}

//             {editProgrammeDirectorConfirmation && (
//               <>
//                 <Button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setEditProgrammeDirectorConfirmation(false);
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleSubmit(
//                       {
//                         assessmentDetailsTrigger: "Completed",
//                         internalModeratorDetailsTrigger: "Completed",
//                         responseToInternalModeratorTrigger: "Completed",
//                         externalExaminerDetailsTrigger: "Completed",
//                         responseToExternalExaminerTrigger: "Completed",
//                         programmeDirectorDetailsTrigger: "Completed",
//                         internalModeratorModerationOfMarksTrigger: "Completed",
//                         stage2ModuleAssessmentLeadCommentsTrigger: "Completed",
//                         stage2ModeratorCommentsTrigger: "Completed",
//                       },
//                       [
//                         formRef.current.elements
//                           .programmeDirectorConfirmation_signature.value,
//                         formRef.current.elements
//                           .programmeDirectorConfirmation_signature_stage2.value,
//                       ]
//                     );
//                   }}
//                 >
//                   Submit Final Confirmation
//                 </Button>
//               </>
//             )}
//           </>
//         )}
//       </Form>
//     </div>
//   );
// };

// export default ModerationForm_2;




// "use client";
// import axiosInstance from "@/utils/axios";
// import Cookies from 'js-cookie';
// import {
//   notifyExternalExaminer,
//   notifyInternalModerator,
//   notifyProgrammeDirector
// } from '@/utils/emailService'; // Adjust the import path as necessary
// import { useEffect, useRef, useState } from "react";
// import { Button, Col, Form, Row } from "react-bootstrap";
// import { redirect } from "next/dist/server/api-utils";
// import { useRouter } from "next/navigation";



// // Helper function to format date-time as "yyyy-MM-dd'T'HH:mm:ss"
// const formatDateTime = (date) => {
//   return date.toISOString().split('.')[0]; // Removes the milliseconds and timezone part
// };

// const ModerationForm_2 = (props) => {
//   const [modData, setModData] = useState(null);
//   const [userRoles, setUserRoles] = useState([]);
//   const router=useRouter();

  
  

//   useEffect(() => {
//     axiosInstance
//       .get(`/api/v1/assessments/${props.assessmentId}`)
//       .then((data) => {
//         setModData(data.data);
//       });
//   }, [props.assessmentId]);

  
//   useEffect(() => {
//     if (modData) {
//       const userId = parseInt(Cookies.get('userId'));
//       const authorizedUser = modData.participants?.find(
//         participant => participant.userId === userId
//       );

//       if (!authorizedUser) {
//         // Use the initialized router to redirect
//         router.push('/unauthorized');
//         return; // Exit early from the effect
//       }

//       // If authorized, store their roles
//       if (!userRoles.length) {
//         setUserRoles(authorizedUser.roles);
//       }
//     }
//   }, [modData, userRoles, router]);

//   console.log(userRoles);

//   const formRef = useRef(null);
//   const defaultQuestions = [
//     {
//       questionText: "Does the assessment brief clearly state the learning outcomes being assessed?",
//       yesNoAnswer: false,
//       comment: ""
//     },
//     {
//       questionText: "Are the assessment criteria clearly linked to the learning outcomes?",
//       yesNoAnswer: false,
//       comment: ""
//     },
//     {
//       questionText: "Is the assessment brief clear and unambiguous?",
//       yesNoAnswer: false,
//       comment: ""
//     },
//     {
//       questionText: "Are the instructions for completing the assessment clear?",
//       yesNoAnswer: false,
//       comment: ""
//     },
//     {
//       questionText: "Is the word count/time limit appropriate for the assessment weighting?",
//       yesNoAnswer: false,
//       comment: ""
//     },
//     {
//       questionText: "Is the submission format clearly specified?",
//       yesNoAnswer: false,
//       comment: ""
//     }
//   ];

//   //questions
//   const [questions, setQuestions] = useState(modData?.questions?.length ? modData.questions : defaultQuestions);
//   //const [questions, setQuestions] = useState(modData?.questions || []);

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
//       setQuestions(modData.questions?.length ? modData.questions : defaultQuestions);
      
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

//   const handleSubmit = async (updatedTriggers, requiredFields, section) => {
//     if (!validateSectionFields(requiredFields)) {
//       alert("Please fill in all fields before submitting.");
//       return;
//     }

//     const userName = Cookies.get('name');
//     const signatureText = `Signed by ${userName}`;
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
//       moduleAssessmentLeadSignature:  editAssessment ? signatureText : modData?.moduleAssessmentLeadSignature,
//       moduleAssessmentLeadSignatureDateTime: editAssessment ? formatDateTime(new Date()) : modData?.moduleAssessmentLeadSignatureDateTime, // Format for backend
//       responseToInternalModerator:editResponseToInternalModerator ? formData.responseToInternalModerator?.value:modData.responseToInternalModerator,
//       responseToInternalModeratorDateTime: editResponseToInternalModerator ? formatDateTime(new Date()) : modData?.responseToInternalModeratorDateTime, // Format for backend
//       responseToExternalExaminer: editResponseToExternalExaminer?formData.responseToExternalExaminer?.value:modData.responseToExternalExaminer,
//       responseToExternalExaminerDateTime: editResponseToExternalExaminer ? formatDateTime(new Date()) : modData?.responseToExternalExaminerDateTime, // Format for backend
//       stage2_assessmentLeadComments: editStage2ModuleAssessmentLeadComments?formData.stage2_assessmentLeadComments?.value:modData.stage2_assessmentLeadComments,
//       internalModeratorComments: formData.internalModeratorComments?.value,
//       internalModeratorSignature: editInternalModerator ? signatureText : modData?.internalModeratorSignature,
//       internalModeratorSignatureDateTime: editInternalModerator ? formatDateTime(new Date()) : modData?.internalModeratorSignatureDateTime, // Format for backend
//       stage2_moderatorComments: editStage2ModeratorComments?formData.stage2_moderatorComments?.value:modData.stage2_moderatorComments,
//       externalExaminerComments: editExternalExaminer?formData.externalExaminerComments?.value: modData.externalExaminerComments,
//       externalExaminerApproval: formData.externalExaminerApproval?.value,
//       externalExaminerSignatureDateTime: editExternalExaminer ? formatDateTime(new Date()) : modData?.externalExaminerSignatureDateTime, // Format for backend
//       externalExaminer_signature: editExternalExaminer ? signatureText : modData?.externalExaminer_signature,
//       programmeDirectorApproval: formData.programmeDirectorApproval?.value,
//       programmeDirectorSignatureDateTime: editProgrammeDirector ? formatDateTime(new Date()) : modData?.programmeDirectorSignatureDateTime, // Format for backend
//       programmeDirectorConfirmation_signature: editProgrammeDirector ? signatureText : modData?.programmeDirectorConfirmation_signature,
//       programmeDirectorConfirmation_signature_stage2: editProgrammeDirectorConfirmation ? signatureText : modData?.programmeDirectorConfirmation_signature_stage2,
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
//       responseToInternalModeratorSignature: editResponseToInternalModerator ? signatureText : modData?.responseToInternalModeratorSignature,
//       responseToExternalExaminerSignature: editResponseToExternalExaminer ? signatureText : modData?.responseToExternalExaminerSignature,
//       stage2AssessmentLeadSignature: editStage2ModuleAssessmentLeadComments ? signatureText : modData?.stage2AssessmentLeadSignature,
//       stage2ModeratorSignature: editStage2ModeratorComments ? signatureText : modData?.stage2ModeratorSignature,
//       questions: questions.map(q => ({
//         id: q.id,  // Include if it's an existing question
//         questionText: q.questionText,
//         yesNoAnswer: q.yesNoAnswer,
//         comment: q.comment
//       })),
//       ...updatedTriggers,
//     };
//     try{
//         await  axiosInstance.put(`/api/v1/assessments/${props.assessmentId}`, data);
       
//     // After successful submission, send the appropriate email
//     switch(section) {
//       case 'internalModerator':
//         await notifyInternalModerator("mendoncamax1234@gmail.com", {
//           title: data.title,
//           module: data.moduleCode,
//           dueDate: data.courseworkSubmissionDate
//         });
//         break;
//       case 'externalExaminer':
//         await notifyExternalExaminer("mendoncamax1234@gmail.com", {
//           title: data.title,
//           module: data.moduleCode,
//           dueDate: data.courseworkSubmissionDate
//         });
//         break;
//       case 'programmeDirector':
//         await notifyProgrammeDirector("mendoncamax1234@gmail.com", {
//           title: data.title,
//           module: data.moduleCode,
//           dueDate: data.courseworkSubmissionDate
//         });
//         break;
//       // Add other cases as needed
//     }

//         alert("Submission successful and notification sent.");
//         window.location.reload();
//     } catch (error) {
//       console.error("Error in submission or sending notification:", error);
//       alert("An error occurred. Please try again.");
//     }

// };

//   return (
//     //if(Cookies.get('userId')===)
//     <div>
//       <Form ref={formRef} action="">
//         {/* Assessment Details Section */}
//         <h1>Assessment Details</h1>
//         <p>{modData?.id}</p>

//         <Form.Label htmlFor="title">Title</Form.Label>
//         <Form.Control defaultValue={modData?.title} disabled={!editAssessment} name="title" type="text" /><br></br>

//         <Form.Label htmlFor="moduleCode">Module Code</Form.Label>
//         <Form.Control defaultValue={modData?.moduleCode} disabled={!editAssessment} name="moduleCode" type="text" /><br></br>

//         <Form.Label htmlFor="assessmentCategory">Assessment Category</Form.Label>
//         <Form.Control defaultValue={modData?.assessmentCategory} disabled={!editAssessment} name="assessmentCategory" type="text"/><br></br>

//         <Form.Label htmlFor="skills">MLOs/ or Knowledge Skills & Behaviours(KSBs) covered in this assessment</Form.Label>
//         <Form.Control defaultValue={modData?.skills} disabled={!editAssessment} name="skills" type="text" /><br></br>

//         <Form.Label htmlFor="assessmentWeighting">Assessment Weighting</Form.Label>
//         <Form.Control defaultValue={modData?.assessmentWeighting} disabled={!editAssessment} name="assessmentWeighting" type="number" /><br></br>

//         <Form.Label htmlFor="plannedIssueDate">Planned Issue Date</Form.Label>
//         <Form.Control defaultValue={modData?.plannedIssueDate} disabled={!editAssessment} name="plannedIssueDate" type="date" /><br></br>

//         <Form.Label htmlFor="courseworkSubmissionDate">Coursework Submission Date</Form.Label>
//         <Form.Control defaultValue={modData?.courseworkSubmissionDate} disabled={!editAssessment} name="courseworkSubmissionDate" type="date" /><br></br>
        
//         <Row>
//           <Col>
//           <Form.Label htmlFor="moduleAssessmentLeadSignature">Module Assessment Lead Signature</Form.Label>
//           <Form.Control defaultValue={modData?.moduleAssessmentLeadSignature || 'Pending'} disabled={true} name="moduleAssessmentLeadSignature" type="text"/><br></br>
//           </Col>
//           <Col>
//             <Form.Label htmlFor="moduleAssessmentLeadSignatureDateTime">Submitted at :</Form.Label>
//             <Form.Control disabled value={modData?.moduleAssessmentLeadSignatureDateTime || ''} name="moduleAssessmentLeadSignatureDateTime" type="text" readOnly /><br></br>
//           </Col>
//         </Row>



//         {!editAssessment && (
//           userRoles.includes("MODULE_ASSESSMENT_LEAD") && (
//           <Button onClick={(e) => { e.preventDefault(); setEditAssessment(true); }}>Edit</Button>
//           )
//         )}

//         {editAssessment && (
//           <>
//             <Button variant="outline-danger" onClick={(e) => { e.preventDefault(); setEditAssessment(false); }}>Cancel</Button>
//             <Button onClick={(e) => { e.preventDefault(); 
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
//               ],'internalModerator'); }}>Submit Assessment Details</Button>
//           </>
//         )}

//         {/* Internal Moderator Section */}
//         {modData?.assessmentDetailsTrigger == "Completed" && (
//           <>
//             <h1>Internal Moderator Section</h1>
//             <h2>Questions</h2>
//             {questions.map((question, index) => (
//               <Row key={index}>
//                 <Col style={{width:'2%'}} xs={1}>
//                 <Form.Label htmlFor={`questionText-${index}`}>{index + 1}</Form.Label>
//                 </Col>
//                 <Col xs={5}>
//                 <Form.Control
//                   as="textarea"
//                   rows={1}
//                   id={`questionText-${index}`}
//                   value={question.questionText}
//                   onChange={(e) => {
//                     const newQuestions = [...questions];
//                     newQuestions[index].questionText = e.target.value;
//                     setQuestions(newQuestions);
//                   }}
//                   disabled={!editInternalModerator}
//                   type="text"
//                 />
//                 </Col>
//                 <Col style={{width:'5%'}} xs={1}>
//                 <Form.Label htmlFor={`yesNoAnswer-${index}`}>Yes/No</Form.Label>
//                 </Col>
//                 <Col style={{width:'5%'}} xs={1}>
//                 <select
//                   id={`yesNoAnswer-${index}`}
//                   value={question.yesNoAnswer}
//                   onChange={(e) => {
//                     const newQuestions = [...questions];
//                     newQuestions[index].yesNoAnswer = e.target.value === 'true';
//                     setQuestions(newQuestions);
//                   }}
//                   disabled={!editInternalModerator}
//                 >
//                   <option value="true">Yes</option>
//                   <option value="false">No</option>
//                 </select>
//                 </Col>

//                 <Col xs={1}>
//                 <Form.Label htmlFor={`comment-${index}`}>Comment</Form.Label>
//                 </Col>
//                 <Col xs={2}>
//                 <Form.Control
//                   id={`comment-${index}`}
//                   value={question.comment}
//                   onChange={(e) => {
//                     const newQuestions = [...questions];
//                     newQuestions[index].comment = e.target.value;
//                     setQuestions(newQuestions);
//                   }}
//                   disabled={!editInternalModerator}
//                   type="text"
//                 />
//                 </Col>
//                 <Col xs={2}>
//                 <Button 
//                   variant="outline-danger"
//                   type="button" 
//                   onClick={(e) => {
//                     e.preventDefault();
//                     deleteQuestion(index);
//                   }} 
//                   disabled={!editInternalModerator}
//                 >
//                   Delete Question
//                 </Button>
//                 </Col>
//               </Row>
//             ))}

//             <Button 
//               type="button" 
//               onClick={(e) => {
//                 e.preventDefault();
//                 addQuestion();
//               }} 
//               disabled={!editInternalModerator}
//             >
//               Add Question
//             </Button><br></br><br></br>

//             <Form.Label htmlFor="internalModeratorComments">Internal Moderator Comments</Form.Label>
//             <Form.Control as="textarea" rows={3} defaultValue={modData?.internalModeratorComments} disabled={!editInternalModerator} name="internalModeratorComments" type="text" /><br></br>
            
//             <Row>
//             <Col>
//               <Form.Label htmlFor="internalModeratorSignature">Internal Moderator Signature</Form.Label>
//               <Form.Control defaultValue={modData?.internalModeratorSignature || 'Pending'} disabled={true} name="internalModeratorSignature" type="text"/><br></br>
//             </Col>
//             <Col>
//               <Form.Label htmlFor="internalModeratorSignatureDateTime">Submitted at :</Form.Label>
//               <Form.Control disabled value={modData?.internalModeratorSignatureDateTime || ''} name="internalModeratorSignatureDateTime" type="text" readOnly /><br></br>
//             </Col>
//           </Row>
            
//             {!editInternalModerator && (
//               userRoles.includes("INTERNAL_MODERATOR") && (
//               <Button onClick={(e) => { e.preventDefault(); setEditInternalModerator(true); }}>Edit</Button>
//              )
//             )}

//             {editInternalModerator && (
//               <>
//                 <Button variant="outline-danger" onClick={(e) => { e.preventDefault(); setEditInternalModerator(false); }}>Cancel</Button>
//                 <Button onClick={(e) => { 
//                   e.preventDefault(); 
//                   handleSubmit({ 
//                     assessmentDetailsTrigger:"Completed",
//                     internalModeratorDetailsTrigger: "Completed", 
//                     responseToInternalModeratorTrigger: "Not Complete", 
//                     externalExaminerDetailsTrigger: "Not Complete", 
//                     responseToExternalExaminerTrigger: "Not Complete", 
//                     programmeDirectorDetailsTrigger: "Not Complete", 
//                     internalModeratorModerationOfMarksTrigger: "Not Complete", 
//                     stage2ModuleAssessmentLeadCommentsTrigger: "Not Complete", 
//                     stage2ModeratorCommentsTrigger: "Not Complete" 
//                   }, [
//                     formRef.current.elements.internalModeratorComments.value,
//                     formRef.current.elements.internalModeratorSignature.value,
//                     ...questions.flatMap(q => [q.questionText, q.comment])
//                   ]); 
//                 }}>Submit</Button>
//               </>
//             )}
//           </>
//         )}


//         {/* Response to Internal Moderator Section */}
//         {modData?.internalModeratorDetailsTrigger == "Completed" && (
//           <>
//             <h1>Response to Internal Moderator</h1>
//             <Form.Label htmlFor="responseToInternalModerator">Response to Internal Moderator</Form.Label>
//             <Form.Control defaultValue={modData?.responseToInternalModerator} disabled={!editResponseToInternalModerator} name="responseToInternalModerator" type="text" /><br></br>

//             <Row>
//             <Col>
//               <Form.Label htmlFor="responseToInternalModeratorSignature">Response to Internal Moderator Signature</Form.Label>
//               <Form.Control defaultValue={modData?.responseToInternalModeratorSignature || 'Pending'} disabled={true} name="responseToInternalModeratorSignature" type="text"/><br></br>
//             </Col>
//             <Col>
//               <Form.Label htmlFor="responseToInternalModeratorDateTime">Submitted at :</Form.Label>
//               <Form.Control disabled value={modData?.responseToInternalModeratorDateTime || ''} name="responseToInternalModeratorDateTime" type="text" readOnly /><br></br>
//             </Col>
//             </Row>

//             {!editResponseToInternalModerator && (
//               userRoles.includes("MODULE_ASSESSMENT_LEAD") && (
//               <Button onClick={(e) => { e.preventDefault(); setEditResponseToInternalModerator(true); }}>Edit</Button>
           
//            ))}

//             {editResponseToInternalModerator && (
//               <>
//                 <Button onClick={(e) => { e.preventDefault(); setEditResponseToInternalModerator(false); }}>Cancel</Button>
//                 <Button onClick={(e) => { e.preventDefault(); handleSubmit({ 
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
//                 ]); }}>Submit</Button>
//               </>
//             )}
//           </>
//         )}

//         {/* External Examiner Section */}
//         {modData?.responseToInternalModeratorTrigger == "Completed" && (
//           <>
//             <h1>External Examiner Section</h1>
//             <Form.Label htmlFor="externalExaminerComments">External Examiner Comments</Form.Label>
//             <Form.Control defaultValue={modData?.externalExaminerComments} disabled={!editExternalExaminer} name="externalExaminerComments" type="text" /><br></br>

//             <Form.Label htmlFor="externalExaminerApproval">External Examiner Approval</Form.Label>
//             <Form.Control defaultValue={modData?.externalExaminerApproval} disabled={!editExternalExaminer} name="externalExaminerApproval" type="text" /><br></br>

//             <Row>
//             <Col>
//               <Form.Label htmlFor="externalExaminer_signature">External Examiner Signature</Form.Label>
//               <Form.Control defaultValue={modData?.externalExaminer_signature || 'Pending'} disabled={true} name="externalExaminer_signature" type="text"/><br></br>
//             </Col>
//             <Col>
//               <Form.Label htmlFor="externalExaminerSignatureDateTime">Submitted at :</Form.Label>
//               <Form.Control disabled value={modData?.externalExaminerSignatureDateTime || ''} name="externalExaminerSignatureDateTime" type="text" readOnly /><br></br>
//             </Col>
//           </Row>

//             {!editExternalExaminer && (
//               userRoles.includes("EXTERNAL_EXAMINER") && (
//               <Button onClick={(e) => { e.preventDefault(); setEditExternalExaminer(true); }}>Edit</Button>
//             ))}

//             {editExternalExaminer && (
//               <>
//                 <Button variant="outline-danger" onClick={(e) => { e.preventDefault(); setEditExternalExaminer(false); }}>Cancel</Button>
//                 <Button onClick={(e) => { e.preventDefault(); handleSubmit({ 
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
//                 ]); }}>Submit External Examiner Details</Button>
//               </>
//             )}
//           </>
//         )}

//         {/* Response to External Examiner Section */}
//         {modData?.externalExaminerDetailsTrigger == "Completed" && (
//           <>
//             <h1>Response to External Examiner</h1>
//             <Form.Label htmlFor="responseToExternalExaminer">Response to External Examiner</Form.Label>
//             <Form.Control defaultValue={modData?.responseToExternalExaminer} disabled={!editResponseToExternalExaminer} name="responseToExternalExaminer" type="text" /><br></br>


//             <Row>
//             <Col>
//               <Form.Label htmlFor="responseToExternalExaminerSignature">Response to External Examiner Signature</Form.Label>
//               <Form.Control defaultValue={modData?.responseToExternalExaminerSignature || 'Pending'} disabled={true} name="responseToExternalExaminerSignature" type="text"/><br></br>
//             </Col>
//             <Col>
//               <Form.Label htmlFor="responseToExternalExaminerDateTime">Submitted at :</Form.Label>
//               <Form.Control disabled value={modData?.responseToExternalExaminerDateTime || ''} name="responseToExternalExaminerDateTime" type="text" readOnly /><br></br>
//             </Col>
//             </Row>

//             {!editResponseToExternalExaminer && (
//                userRoles.includes("MODULE_ASSESSMENT_LEAD") && (
//               <Button onClick={(e) => { e.preventDefault(); setEditResponseToExternalExaminer(true); }}>Edit</Button>
//             ))}

//             {editResponseToExternalExaminer && (
//               <>
//                 <Button variant="outline-danger" onClick={(e) => { e.preventDefault(); setEditResponseToExternalExaminer(false); }}>Cancel</Button>
//                 <Button onClick={(e) => { e.preventDefault(); handleSubmit({ 
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
//                 ]); }}>Submit</Button>
//               </>
//             )}
//           </>
//         )}

//         {/* Programme Director Section */}
//         {modData?.responseToExternalExaminerTrigger == "Completed" && (
//           <>
//             <h1>Programme Director Section</h1>
//             <Form.Label htmlFor="programmeDirectorApproval">Programme Director Approval</Form.Label>
//             <Form.Control defaultValue={modData?.programmeDirectorApproval} disabled={!editProgrammeDirector} name="programmeDirectorApproval" type="text" /><br></br>

//             <Row>
//             <Col>
//               <Form.Label htmlFor="programmeDirectorConfirmation_signature">Programme Director Signature</Form.Label>
//               <Form.Control defaultValue={modData?.programmeDirectorConfirmation_signature || 'Pending'} disabled={true} name="programmeDirectorConfirmation_signature" type="text"/><br></br>
//             </Col>
//             <Col>
//               <Form.Label htmlFor="programmeDirectorSignatureDateTime">Submitted at :</Form.Label>
//               <Form.Control disabled value={modData?.programmeDirectorSignatureDateTime || ''} name="programmeDirectorSignatureDateTime" type="text" readOnly /><br></br>
//             </Col>
//             </Row>

//             {!editProgrammeDirector && (
//                userRoles.includes("PROGRAMME_DIRECTOR") && (
//               <Button onClick={(e) => { e.preventDefault(); setEditProgrammeDirector(true); }}>Edit</Button>
//             ))}

//             {editProgrammeDirector && (
//               <>
//                 <Button variant="outline-danger" onClick={(e) => { e.preventDefault(); setEditProgrammeDirector(false); }}>Cancel</Button>
//                 <Button onClick={(e) => { e.preventDefault(); handleSubmit({ 
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
//                 ]); }}>Submit</Button>
//               </>
//             )}
//           </>
//         )}

//         <br></br><br></br><br></br><br></br>
//         {/* Trigger for stage 2 Section */}
//         {modData?.programmeDirectorDetailsTrigger == "Completed" && 
//         modData?.internalModeratorModerationOfMarksTrigger=="Not Complete" &&
//         userRoles.includes("MODULE_ASSESSMENT_LEAD") &&(
//           <div style={{display:'flex', justifyContent:'center'}}>
//           <Button onClick={()=>handleSubmit({ 
//             assessmentDetailsTrigger: "Completed", 
//             internalModeratorDetailsTrigger: "Completed", 
//             responseToInternalModeratorTrigger: "Completed", 
//             externalExaminerDetailsTrigger: "Completed", 
//             responseToExternalExaminerTrigger: "Completed", 
//             programmeDirectorDetailsTrigger: "Completed", 
//             internalModeratorModerationOfMarksTrigger: "Completed", 
//             stage2ModuleAssessmentLeadCommentsTrigger: "Not Complete", 
//             stage2ModeratorCommentsTrigger: "Not Complete" 
//           },[])}>
//             Start Stage 2 of Assessment
//           </Button>
//           </div>
//         )}


//         {/* Moderator Section */}
//         {modData?.internalModeratorModerationOfMarksTrigger == "Completed" && (
//           <>
//             <h1>Moderator Section</h1>
//             <Form.Label htmlFor="assessmentDeadline">Assessment Deadline</Form.Label>
//             <Form.Control defaultValue={modData?.assessmentDeadline} disabled={!editStage2ModeratorComments} name="assessmentDeadline" type="date" /><br></br>

//             <Form.Label htmlFor="markingCompletedDate">Marking Completed Date</Form.Label>
//             <Form.Control defaultValue={modData?.markingCompletedDate} disabled={!editStage2ModeratorComments} name="markingCompletedDate" type="date" /><br></br>

//             <Form.Label htmlFor="moderationCompletedDate">Moderation Completed Date</Form.Label>
//             <Form.Control defaultValue={modData?.moderationCompletedDate} disabled={!editStage2ModeratorComments} name="moderationCompletedDate" type="date" /><br></br>

//             <Form.Label htmlFor="totalSubmissions">Total Submissions</Form.Label>
//             <Form.Control defaultValue={modData?.totalSubmissions} disabled={!editStage2ModeratorComments} name="totalSubmissions" type="number" /><br></br>

//             <Form.Label htmlFor="failedSubmissions">Failed Submissions</Form.Label>
//             <Form.Control defaultValue={modData?.failedSubmissions} disabled={!editStage2ModeratorComments} name="failedSubmissions" type="number" /><br></br>

//             <Form.Label htmlFor="moderatedSubmissions">Moderated Submissions</Form.Label>
//             <Form.Control defaultValue={modData?.moderatedSubmissions} disabled={!editStage2ModeratorComments} name="moderatedSubmissions" type="number" /><br></br>

//             <Form.Label htmlFor="teachingImpactDetails">Teaching Impact Details</Form.Label>
//             <Form.Control defaultValue={modData?.teachingImpactDetails} disabled={!editStage2ModeratorComments} name="teachingImpactDetails" type="text" /><br></br>

//             <Form.Label htmlFor="stage2_moderatorComments">Stage 2 Moderator Comments</Form.Label>
//             <Form.Control defaultValue={modData?.stage2_moderatorComments} disabled={!editStage2ModeratorComments} name="stage2_moderatorComments" type="text" /><br></br>


//             <Row>
//             <Col>
//               <Form.Label htmlFor="stage2ModeratorSignature">Stage 2 Moderator Signature</Form.Label>
//               <Form.Control defaultValue={modData?.stage2ModeratorSignature || 'Pending'} disabled={true} name="stage2ModeratorSignature" type="text"/><br></br>
//             </Col>
//             <Col>
//               <Form.Label htmlFor="moderatorSignatureDateTime">Submitted at :</Form.Label>
//               <Form.Control disabled value={modData?.moderatorSignatureDateTime || ''} name="moderatorSignatureDateTime" type="text" readOnly /><br></br>
//             </Col>
//             </Row>

//             {!editStage2ModeratorComments && (
//               userRoles.includes("INTERNAL_MODERATOR") && (
//               <Button onClick={(e) => { e.preventDefault(); setEditStage2ModeratorComments(true); }}>Edit</Button>
//             ))}

//             {editStage2ModeratorComments && (
//               <>
//                 <Button variant="outline-danger" onClick={(e) => { e.preventDefault(); setEditStage2ModeratorComments(false); }}>Cancel</Button>
//                 <Button onClick={(e) => { e.preventDefault(); handleSubmit({ 
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
//                 ]); }}>Submit</Button>
//               </>
//             )}
//           </>
//         )}

//         {/* Assessment Lead Stage 2 Section */}
//         {modData?.stage2ModeratorCommentsTrigger == "Completed" && (
//           <>
//             <h1>Assessment Lead Stage 2 Section</h1>
//             <Form.Label htmlFor="stage2_assessmentLeadComments">Stage 2 Assessment Lead Comments</Form.Label>
//             <Form.Control defaultValue={modData?.stage2_assessmentLeadComments} disabled={!editStage2ModuleAssessmentLeadComments} name="stage2_assessmentLeadComments" type="text" /><br></br>

//             <Row>
//             <Col>
//               <Form.Label htmlFor="stage2AssessmentLeadSignature">Stage 2 Assessment Lead Signature</Form.Label>
//               <Form.Control defaultValue={modData?.stage2AssessmentLeadSignature || 'Pending'} disabled={true} name="stage2AssessmentLeadSignature" type="text"/><br></br>
//             </Col>
//             <Col>
//               <Form.Label htmlFor="stage2ModuleAssessmentLeadSignatureDateTime">Submitted at :</Form.Label>
//               <Form.Control disabled value={modData?.stage2ModuleAssessmentLeadSignatureDateTime || ''} name="stage2ModuleAssessmentLeadSignatureDateTime" type="text" readOnly /><br></br>
//             </Col>
//             </Row>

//             {!editStage2ModuleAssessmentLeadComments && (
//                userRoles.includes("MODULE_ASSESSMENT_LEAD") && (
//               <Button onClick={(e) => { e.preventDefault(); setEditStage2ModuleAssessmentLeadComments(true); }}>Edit</Button>
//             ))}

//             {editStage2ModuleAssessmentLeadComments && (
//               <>
//                 <Button onClick={(e) => { e.preventDefault(); setEditStage2ModuleAssessmentLeadComments(false); }}>Cancel</Button>
//                 <Button onClick={(e) => { e.preventDefault(); handleSubmit({ 
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
//                 ]); }}>Submit</Button>
//               </>
//             )}
//           </>
//         )}

//         {/* Final Confirmation by Programme Director Section */}
//         {modData?.stage2ModuleAssessmentLeadCommentsTrigger == "Completed" && (
//           <>
//             <h1>Final Confirmation by Programme Director</h1>
            

//             <Row>
//              <Col>
//                 <Form.Label htmlFor="programmeDirectorConfirmation_signature_stage2">Programme Director Stage 2 Signature</Form.Label>
//                <Form.Control defaultValue={modData?.programmeDirectorConfirmation_signature_stage2 || 'Pending'} disabled={true} name="programmeDirectorConfirmation_signature_stage2" type="text"/><br></br>
//              </Col>
//               <Col>
//                <Form.Label htmlFor="programmeDirectorConfirmation_signatureDateTime_stage2">Submitted at :</Form.Label>
//                <Form.Control disabled value={modData?.programmeDirectorConfirmation_signatureDateTime_stage2 || ''} name="programmeDirectorConfirmation_signatureDateTime_stage2" type="text" readOnly /><br></br>
//              </Col>
//             </Row>

//             {!editProgrammeDirectorConfirmation && (
//               userRoles.includes("PROGRAMME_DIRECTOR") && (
//               <Button onClick={(e) => { e.preventDefault(); setEditProgrammeDirectorConfirmation(true); }}>Edit</Button>
//             ))}

//             {editProgrammeDirectorConfirmation && (
//               <>
//                 <Button onClick={(e) => { e.preventDefault(); setEditProgrammeDirectorConfirmation(false); }}>Cancel</Button>
//                 <Button onClick={(e) => { e.preventDefault(); handleSubmit({ 
//                   assessmentDetailsTrigger: "Completed", 
//                   internalModeratorDetailsTrigger: "Completed", 
//                   responseToInternalModeratorTrigger: "Completed", 
//                   externalExaminerDetailsTrigger: "Completed", 
//                   responseToExternalExaminerTrigger: "Completed", 
//                   programmeDirectorDetailsTrigger: "Completed", 
//                   internalModeratorModerationOfMarksTrigger: "Completed", 
//                   stage2ModuleAssessmentLeadCommentsTrigger: "Completed", 
//                   stage2ModeratorCommentsTrigger: "Completed",
//                   }, [
//                   formRef.current.elements.programmeDirectorConfirmation_signature.value,
//                   formRef.current.elements.programmeDirectorConfirmation_signature_stage2.value
//                 ]); }}>Submit Final Confirmation</Button>
//               </>
//             )}
//           </>
//         )}
//       </Form>
//     </div>
//   );
// };

// export default ModerationForm_2;



