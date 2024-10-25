"use client"
import AssessmentForm from '../components/AssesmentForm'

const data = {
    "id": 30,
    "title": "Introduction to Computer Science",
    "moduleCode": "sadasd",
    "moduleLeader": "Sylvia Wong",
    "assessmentCategory": "Coursework",
    "skills": "Programming, Problem Solving, Algorithm Design",
    "assessmentWeighting": 30,
    "plannedIssueDate": "2024-03-01",
    "courseworkSubmissionDate": "2024-04-15",
    "userRoles": [
        "PROGRAMME_DIRECTOR",
        "EXTERNAL_EXAMINER",
        "INTERNAL_MODERATOR",
        "MODULE_ASSESSMENT_LEAD"
    ],
    "moduleAssessmentLeadSignature": "Signed by John Doe",
    "moduleAssessmentLeadSignatureDateTime": "2024-02-15T10:30:00",
    "responseToInternalModerator": "Thank you for your feedback. Question 3 has been revised for clarity.",
    "responseToInternalModeratorDateTime": null,
    "responseToExternalExaminer": "Thank you for your approval. We've incorporated your suggestions.",
    "responseToExternalExaminerDateTime": null,
    "stage2_assessmentLeadComments": null,
    "internalModeratorComments": "The assessment aligns well with the module outcomes. Suggest minor clarification on question 3.",
    "internalModeratorSignature": "Signed by Sarah Johnson",
    "internalModeratorSignatureDateTime": "2024-02-18T14:45:00",
    "stage2_moderatorComments": null,
    "externalExaminerComments": null,
    "externalExaminerApproval": "APPROVED",
    "externalExaminerSignatureDateTime": null,
    "externalExaminer_signature": null,
    "programmeDirectorApproval": "APPROVED",
    "programmeDirectorSignatureDateTime": null,
    "programmeDirectorConfirmation_signature": "Pending",
    "programmeDirectorConfirmation_signature_stage2": "L",
    "assessmentDeadline": null,
    "totalSubmissions": null,
    "failedSubmissions": null,
    "moderatedSubmissions": null,
    "teachingImpactDetails": null,
    "markingCompletedDate": null,
    "moderationCompletedDate": null,
    "moderatorSignatureDateTime": null,
    "programmeDirectorConfirmation_signatureDateTime_stage2": null,
    "stage2ModuleAssessmentLeadSignatureDateTime": null,
    "assessmentDetailsTrigger": "Not Completed",
    "internalModeratorDetailsTrigger": "Not Completed",
    "externalExaminerDetailsTrigger": "Not Completed",
    "programmeDirectorDetailsTrigger": "Not Completed",
    "internalModeratorModerationOfMarksTrigger": "Not Completed",
    "stage2ModuleAssessmentLeadCommentsTrigger": "Not Completed",
    "stage2ModeratorCommentsTrigger": "Not Completed",
    "participants": [
        {
            "userId": 8,
            "firstName": "Sylvia",
            "lastName": "Wong",
            "roles": [
                "PROGRAMME_DIRECTOR",
                "INTERNAL_MODERATOR",
                "MODULE_ASSESSMENT_LEAD",
                "EXTERNAL_EXAMINER"
            ]
        }
    ]
}

const page = () => {
  return (
    <div>
        <AssessmentForm/>
    </div>
  )
}

export default page