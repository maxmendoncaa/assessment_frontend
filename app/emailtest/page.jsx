import { notifyExternalExaminer, notifyInternalModerator, notifyProgrammeDirector } from 'emailService.js';

// In some function or component method
const handleAssessmentSubmission = async (assessment) => {
  try {
    // Other logic for submitting the assessment

    // Notify relevant parties
    await notifyExternalExaminer(assessment.externalExaminerEmail, {
      title: "assessment.titl",
      module: "assessment.module",
      dueDate: "assessment.dueDate"
    });

    await notifyInternalModerator(assessment.internalModeratorEmail, {
      title: "assessment.title",
      module: "assessment.module",
      dueDate: "assessment.dueDate"
    });

    await notifyProgrammeDirector(assessment.programmeDirectorEmail, {
      title: "assessment.title",
      module: "assessment.module",
      dueDate: "assessment.dueDate"
    });

    console.log('All notifications sent successfully');
  } catch (error) {
    console.error('Error in assessment submission process:', error);
    // Handle the error appropriately
  }
};