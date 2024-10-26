import axiosInstance from '@/utils/axios';

/**
 * Sends an email using the backend API.
 * @param {string} to - Recipient's email address
 * @param {string} subject - Email subject
 * @param {string} body - Email body content
 * @returns {Promise} - Resolves with the API response, rejects with an error
 */
export const sendEmail = async (to, subject, body) => {
  try {
    const response = await axiosInstance.post('/api/v1/email/send', {
      to,
      subject,
      body
    });
    console.log('Email sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Sends a notification email to an external examiner.
 * @param {string} examinerEmail - External examiner's email address
 * @param {object} assessmentDetails - Details of the assessment
 * @returns {Promise}
 */
export const notifyExternalExaminer = async (examinerEmail, assessmentDetails) => {
  const subject = 'Assessment Review Request';
  const body = `
    Dear External Examiner,

    You are requested to review the following assessment:

    Assessment Title: ${assessmentDetails.title}
    Module: ${assessmentDetails.module}
    Module Code:${assessmentDetails.moduleCode}
    Due Date: ${assessmentDetails.dueDate}

    Please log in to the system to provide your feedback.

    Best regards,
    Assessment Team
  `;

  return sendEmail(examinerEmail, subject, body);
};

/**
 * Sends a notification email to an internal moderator.
 * @param {string} moderatorEmail - Internal moderator's email address
 * @param {object} assessmentDetails - Details of the assessment
 * @returns {Promise}
 */
export const notifyAssessmentLead = async (moderatorEmail, assessmentDetails) => {
  const subject = 'Assessment Lead Attention required for Assessment';
  const body = `
    Dear Assessment Lead,

    An assessment requires your moderation:

    Assessment Title: ${assessmentDetails.title}
    Module: ${assessmentDetails.module}
    Module Code:${assessmentDetails.moduleCode}
    Due Date: ${assessmentDetails.dueDate}

    Please log in to the system to complete the moderation process.

    Best regards,
    Assessment Team
  `;

  return sendEmail(moderatorEmail, subject, body);
};


/**
 * Sends a notification email to an internal moderator.
 * @param {string} moderatorEmail - Internal moderator's email address
 * @param {object} assessmentDetails - Details of the assessment
 * @returns {Promise}
 */
export const notifyInternalModerator = async (moderatorEmail, assessmentDetails) => {
  const subject = 'Internal Moderation Request';
  const body = `
    Dear Internal Moderator,

    An assessment requires your moderation:

    Assessment Title: ${assessmentDetails.title}
    Module: ${assessmentDetails.module}
    Module Code:${assessmentDetails.moduleCode}
    Due Date: ${assessmentDetails.dueDate}

    Please log in to the system to complete the moderation process.

    Best regards,
    Assessment Team
  `;

  return sendEmail(moderatorEmail, subject, body);
};

/**
 * Sends a notification email to the programme director.
 * @param {string} directorEmail - Programme director's email address
 * @param {object} assessmentDetails - Details of the assessment
 * @returns {Promise}
 */
export const notifyProgrammeDirector = async (directorEmail, assessmentDetails) => {
  const subject = 'Assessment Approval Required';
  const body = `
    Dear Programme Director,

    An assessment requires your approval:

    Assessment Title: ${assessmentDetails.title}
    Module: ${assessmentDetails.module}
    Module Code:${assessmentDetails.moduleCode}
    Due Date: ${assessmentDetails.dueDate}

    Please log in to the system to review and approve the assessment.

    Best regards,
    Assessment Team
  `;

  return sendEmail(directorEmail, subject, body);
};