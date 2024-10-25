import { useState } from 'react';

const AssessmentForm = () => {
    // Initial data
    const initialData = {
        assessment: {
            title: "Introduction to Computer Science",
            skills: "Programming, Problem Solving, Algorithm Design",
            assessmentCategory: "Coursework",
            assessmentWeighting: 30,
            plannedIssueDate: "2024-03-01",
            courseworkSubmissionDate: "2024-04-15",
            moduleAssessmentLeadSignature: "Signed by John Doe",
            moduleAssessmentLeadSignatureDateTime: "2024-02-15T10:30:00"
        },
        internalModerator: {
            comments: "The assessment aligns well with the module outcomes. Suggest minor clarification on question 3.",
            signature: "Signed by Sarah Johnson",
            signatureDateTime: "2024-02-18T14:45:00"
        },
        responseToInternalModerator: {
            response: "Thank you for your feedback. Question 3 has been revised for clarity."
        },
        externalExaminer: {
            comments: null,
            approval: "APPROVED",
            signature: null,
            signatureDateTime: null
        },
        responseToExternalExaminer: {
            response: "Thank you for your approval. We've incorporated your suggestions."
        },
        programmeDirector: {
            approval: "APPROVED",
            signature: null,
            signatureDateTime: null
        },
        moderator: {
            assessmentDeadline: null,
            markingCompletedDate: null,
            moderationCompletedDate: null,
            totalSubmissions: null,
            failedSubmissions: null,
            moderatedSubmissions: null,
            teachingImpactDetails: null,
            stage2ModeratorComments: null,
            moderatorSignatureDateTime: null
        },
        assessmentLeadStage2: {
            comments: null,
            signatureDateTime: null
        },
        finalConfirmation: {
            signature: "Pending",
            signatureStage2: "L"
        }
    };

    const [tempFormData, setTempFormData] = useState({});

    // State to manage form data and completion status
    const [formData, setFormData] = useState(initialData);
    const [completedSections, setCompletedSections] = useState({
        assessment: false,
        internalModerator: false,
        responseToInternalModerator: false,
        externalExaminer: false,
        responseToExternalExaminer: false,
        programmeDirector: false,
        moderator: false,
        assessmentLeadStage2: false,
        finalConfirmation: false
    });

    const [isEditMode, setIsEditMode] = useState({
        assessment: true, // The first section should be editable by default for submission
        internalModerator: false,
        responseToInternalModerator: false,
        externalExaminer: false,
        responseToExternalExaminer: false,
        programmeDirector: false,
        moderator: false,
        assessmentLeadStage2: false,
        finalConfirmation: false
    });

    // Handler for input changes
    const handleInputChange = (section, field, value) => {
        setFormData({
            ...formData,
            [section]: {
                ...formData[section],
                [field]: value
            }
        });
    };

    const handleAssessmentChange = () => {
        setCompletedSections({
            ...completedSections,
            ["assessment"]: true
        });
    }
    const handlesection2Change = () => {
        setCompletedSections({
            ...completedSections,
            ["internalModerator"]: true
        });
    }
    console.log("Completed Sections", completedSections)

    // // Function to reset subsequent sections after an edit
    // const resetSectionsAfter = (editedSection) => {
    //     const sectionsOrder = [
    //         'assessment',
    //         'internalModerator',
    //         'responseToInternalModerator',
    //         'externalExaminer',
    //         'responseToExternalExaminer',
    //         'programmeDirector',
    //         'moderator',
    //         'assessmentLeadStage2',
    //         'finalConfirmation'
    //     ];
    //     setCompletedSections(prevState => {
    //         const updatedCompletion = { ...prevState };
    //         let shouldReset = false;
    //         sectionsOrder.forEach((section) => {
    //             if (shouldReset) {
    //                 updatedCompletion[section] = false;
    //             }
    //             if (section === editedSection) {
    //                 shouldReset = true;
    //             }
    //         });
    //         return updatedCompletion;
    //     });
    // };
    const resetSectionsAfter = (editedSection) => {
        const sectionsOrder = [
                     'assessment',
            'internalModerator',
            'responseToInternalModerator',
            'externalExaminer',
            'responseToExternalExaminer',
            'programmeDirector',
            'moderator',
            'assessmentLeadStage2',
            'finalConfirmation'
        ];
        setCompletedSections(prevState => {
            const updatedCompletion = { ...prevState };
            let shouldReset = false;
            sectionsOrder.forEach((section) => {
                if (shouldReset) {
                    updatedCompletion[section] = false;
                }
                if (section === editedSection) {
                    shouldReset = true;
                }
            });
            return updatedCompletion;
        });
    };

    // // Handler for submitting a section
    // const handleSubmit = (section) => {
    //     console.log("section", section)
    //     // Mark the section as completed
    //     setCompletedSections({
    //         ...completedSections,
    //         [section.toString()]: true
    //     });

    //     // Switch the section to view-only mode (disable editing)
    //     setIsEditMode({
    //         ...isEditMode,
    //         [section]: false
    //     });

    //     // Mark the following sections as incomplete
    //     resetSectionsAfter(section);

    // };
    const handleSubmit = (section) => {
        setCompletedSections(prevState => ({
            ...prevState,
            [section]: true
        }));
    
        setIsEditMode(prevState => ({
            ...prevState,
            [section]: false
        }));
        setTempFormData(prevState => {
            const newState = { ...prevState };
            delete newState[section];
            return newState;
        });
    
        // Enable editing for the next section
        const sections = Object.keys(isEditMode);
        const currentIndex = sections.indexOf(section);
        if (currentIndex < sections.length - 1) {
            const nextSection = sections[currentIndex + 1];
            setIsEditMode(prevState => ({
                ...prevState,
                [nextSection]: true
            }));
        }
    
        resetSectionsAfter(section);
    };
    

    // // Handler for editing a section
    // const handleEdit = (section) => {
    //     // Enable editing for the section
    //     setIsEditMode({
    //         ...isEditMode,
    //         [section]: true
    //     });
    // };
    const handleEdit = (section) => {
        setTempFormData({
            ...tempFormData,
            [section]: { ...formData[section] }
        });
    
        setIsEditMode(prevState => ({
            ...prevState,
            [section]: true
        }));
    };

    const handleCancelEdit = (section) => {
        setFormData(prevState => ({
            ...prevState,
            [section]: { ...tempFormData[section] }
        }));
    
        setIsEditMode(prevState => ({
            ...prevState,
            [section]: false
        }));
    
        setTempFormData(prevState => {
            const newState = { ...prevState };
            delete newState[section];
            return newState;
        });
    };

    return (
        <div>
            <h1>Assessment Form</h1>
            {/* Assessment Section */}
            <button onClick={handleAssessmentChange}>
                Change State
            </button>
            <button onClick={handlesection2Change}>
                Change Int Mod
            </button>
            <section>
                <h2>Assessment Section</h2>
                <input
                    type="text"
                    value={formData.assessment.title}
                    onChange={(e) => handleInputChange('assessment', 'title', e.target.value)}
                    placeholder="Title"
                    disabled={!isEditMode.assessment}
                />
                <input
                    type="text"
                    value={formData.assessment.skills}
                    onChange={(e) => handleInputChange('assessment', 'skills', e.target.value)}
                    placeholder="Skills"
                    disabled={!isEditMode.assessment}
                />
                <input
                    type="text"
                    value={formData.assessment.assessmentCategory}
                    onChange={(e) => handleInputChange('assessment', 'assessmentCategory', e.target.value)}
                    placeholder="Assessment Category"
                    disabled={!isEditMode.assessment}
                />
                <input
                    type="number"
                    value={formData.assessment.assessmentWeighting}
                    onChange={(e) => handleInputChange('assessment', 'assessmentWeighting', e.target.value)}
                    placeholder="Assessment Weighting"
                    disabled={!isEditMode.assessment}
                />
                <input
                    type="date"
                    value={formData.assessment.plannedIssueDate}
                    onChange={(e) => handleInputChange('assessment', 'plannedIssueDate', e.target.value)}
                    placeholder="Planned Issue Date"
                    disabled={!isEditMode.assessment}
                />
                <input
                    type="date"
                    value={formData.assessment.courseworkSubmissionDate}
                    onChange={(e) => handleInputChange('assessment', 'courseworkSubmissionDate', e.target.value)}
                    placeholder="Coursework Submission Date"
                    disabled={!isEditMode.assessment}
                />
                <input
                    type="text"
                    value={formData.assessment.moduleAssessmentLeadSignature}
                    onChange={(e) => handleInputChange('assessment', 'moduleAssessmentLeadSignature', e.target.value)}
                    placeholder="Module Assessment Lead Signature"
                    disabled={!isEditMode.assessment}
                />
                <input
                    type="datetime-local"
                    value={formData.assessment.moduleAssessmentLeadSignatureDateTime}
                    onChange={(e) => handleInputChange('assessment', 'moduleAssessmentLeadSignatureDateTime', e.target.value)}
                    placeholder="Signature Date Time"
                    disabled={!isEditMode.assessment}
                />
                {completedSections.assessment ? (
                    isEditMode.assessment ? (
                        <>
                        <button onClick={() => handleSubmit('assessment')}>Submit Assessment Section</button>
                        <button onClick={() => handleCancelEdit('assessment')}>Cancel Edit</button>
                        </>
                    ) : (
                        <button onClick={() => handleEdit('assessment')}>Edit Assessment Section</button>
                    )
                ) : (
                    <button onClick={() => handleSubmit('assessment')}>Submit Assessment Section</button>
                )}
            </section>

            {/* Internal Moderator Section */}
            {completedSections.assessment && (
                
                <section>
                    <h2>Internal Moderator Section</h2>
                    <textarea
                        value={formData.internalModerator.comments}
                        onChange={(e) => handleInputChange('internalModerator', 'comments', e.target.value)}
                        placeholder="Internal Moderator Comments"
                        disabled={!isEditMode.internalModerator}
                    />
                    <input
                        type="text"
                        value={formData.internalModerator.signature}
                        onChange={(e) => handleInputChange('internalModerator', 'signature', e.target.value)}
                        placeholder="Internal Moderator Signature"
                        disabled={!isEditMode.internalModerator}
                    />
                    <input
                        type="datetime-local"
                        value={formData.internalModerator.signatureDateTime}
                        onChange={(e) => handleInputChange('internalModerator', 'signatureDateTime', e.target.value)}
                        placeholder="Signature Date Time"
                        disabled={!isEditMode.internalModerator}
                    />
                    {completedSections.internalModerator ? (
                        isEditMode.internalModerator ? (
                            <>
                            <button onClick={() => handleSubmit('internalModerator')}>Submit Internal Moderator Section</button>
                            <button onClick={() => handleCancelEdit('internalModerator')}>Cancel Edit</button>
                            </>
                        ) : (
                            <button onClick={() => handleEdit('internalModerator')}>Edit Internal Moderator Section</button>
                        )
                    ) : (
                        <button onClick={() => handleSubmit('internalModerator')}>Submit Internal Moderator Section</button>
                    )}
                </section>
            )}

            {/* Response to Internal Moderator Section */}
            {completedSections.internalModerator && (
                <section>
                    <h2>Response to Internal Moderator Section</h2>
                    <textarea
                        value={formData.responseToInternalModerator.response}
                        onChange={(e) => handleInputChange('responseToInternalModerator', 'response', e.target.value)}
                        placeholder="Response to Internal Moderator"
                        disabled={!isEditMode.responseToInternalModerator}
                    />
                    {completedSections.responseToInternalModerator ? (
                        isEditMode.responseToInternalModerator ? (
                            <>
                            <button onClick={() => handleSubmit('responseToInternalModerator')}>Submit Response to Internal Moderator Section</button>
                            <button onClick={() => handleCancelEdit('internaresponseToInternalModerator')}>Cancel Edit</button>
                            </>
                        ) : (
                            <button onClick={() => handleEdit('responseToInternalModerator')}>Edit Response to Internal Moderator Section</button>
                        )
                    ) : (
                        <button onClick={() => handleSubmit('responseToInternalModerator')}>Submit Response to Internal Moderator Section</button>
                    )}
                </section>
            )}

            {/* External Examiner Section */}
            {completedSections.responseToInternalModerator && (
                <section>
                    <h2>External Examiner Section</h2>
                    <textarea
                        value={formData.externalExaminer.comments}
                        onChange={(e) => handleInputChange('externalExaminer', 'comments', e.target.value)}
                        placeholder="External Examiner Comments"
                        disabled={!isEditMode.externalExaminer}
                    />
                    <input
                        type="text"
                        value={formData.externalExaminer.approval}
                        onChange={(e) => handleInputChange('externalExaminer', 'approval', e.target.value)}
                        placeholder="External Examiner Approval"
                        disabled={!isEditMode.externalExaminer}
                    />
                    <input
                        type="datetime-local"
                        value={formData.externalExaminer.signatureDateTime}
                        onChange={(e) => handleInputChange('externalExaminer', 'signatureDateTime', e.target.value)}
                        placeholder="Signature Date Time"
                        disabled={!isEditMode.externalExaminer}
                    />
                    {completedSections.externalExaminer ? (
                        isEditMode.externalExaminer ? (
                            <>
                            <button onClick={() => handleSubmit('externalExaminer')}>Submit External Examiner Section</button>
                            <button onClick={() => handleCancelEdit('externalExaminer')}>Cancel Edit</button>
                            </>
                        ) : (
                            <button onClick={() => handleEdit('externalExaminer')}>Edit External Examiner Section</button>
                        )
                    ) : (
                        <button onClick={() => handleSubmit('externalExaminer')}>Submit External Examiner Section</button>
                    )}
                </section>
            )}

            {/* Response to External Examiner Section */}
            {completedSections.externalExaminer && (
                <section>
                    <h2>Response to External Examiner Section</h2>
                    <textarea
                        value={formData.responseToExternalExaminer.response}
                        onChange={(e) => handleInputChange('responseToExternalExaminer', 'response', e.target.value)}
                        placeholder="Response to External Examiner"
                        disabled={!isEditMode.responseToExternalExaminer}
                    />
                    {completedSections.responseToExternalExaminer ? (
                        isEditMode.responseToExternalExaminer ? (
                            <>
                            <button onClick={() => handleSubmit('responseToExternalExaminer')}>Submit Response to External Examiner Section</button>
                            <button onClick={() => handleCancelEdit('responseToExternalExaminer')}>Cancel Edit</button>
                            </>
                        ) : (
                            <button onClick={() => handleEdit('responseToExternalExaminer')}>Edit Response to External Examiner Section</button>
                        )
                    ) : (
                        <button onClick={() => handleSubmit('responseToExternalExaminer')}>Submit Response to External Examiner Section</button>
                    )}
                </section>
            )}

            {/* Programme Director Section */}
            {completedSections.responseToExternalExaminer && (
                <section>
                    <h2>Programme Director Section</h2>
                    <input
                        type="text"
                        value={formData.programmeDirector.approval}
                        onChange={(e) => handleInputChange('programmeDirector', 'approval', e.target.value)}
                        placeholder="Programme Director Approval"
                        disabled={!isEditMode.programmeDirector}
                    />
                    <input
                        type="text"
                        value={formData.programmeDirector.signature}
                        onChange={(e) => handleInputChange('programmeDirector', 'signature', e.target.value)}
                        placeholder="Programme Director Signature"
                        disabled={!isEditMode.programmeDirector}
                    />
                    <input
                        type="datetime-local"
                        value={formData.programmeDirector.signatureDateTime}
                        onChange={(e) => handleInputChange('programmeDirector', 'signatureDateTime', e.target.value)}
                        placeholder="Signature Date Time"
                        disabled={!isEditMode.programmeDirector}
                    />
                    {completedSections.programmeDirector ? (
                        isEditMode.programmeDirector ? (
                            <>
                            <button onClick={() => handleSubmit('programmeDirector')}>Submit Programme Director Section</button>
                            <button onClick={() => handleCancelEdit('programmeDirector')}>Cancel Edit</button>
                            </>
                        ) : (
                            <button onClick={() => handleEdit('programmeDirector')}>Edit Programme Director Section</button>
                        )
                    ) : (
                        <button onClick={() => handleSubmit('programmeDirector')}>Submit Programme Director Section</button>
                    )}
                </section>
            )}

            {/* Moderator Section */}
            {completedSections.programmeDirector && (
                <section>
                    <h2>Moderator Section</h2>
                    <input
                        type="date"
                        value={formData.moderator.markingCompletedDate}
                        onChange={(e) => handleInputChange('moderator', 'markingCompletedDate', e.target.value)}
                        placeholder="Marking Completed Date"
                        disabled={!isEditMode.moderator}
                    />
                    <input
                        type="date"
                        value={formData.moderator.moderationCompletedDate}
                        onChange={(e) => handleInputChange('moderator', 'moderationCompletedDate', e.target.value)}
                        placeholder="Moderation Completed Date"
                        disabled={!isEditMode.moderator}
                    />
                    <input
                        type="number"
                        value={formData.moderator.totalSubmissions}
                        onChange={(e) => handleInputChange('moderator', 'totalSubmissions', e.target.value)}
                        placeholder="Total Submissions"
                        disabled={!isEditMode.moderator}
                    />
                    <input
                        type="number"
                        value={formData.moderator.failedSubmissions}
                        onChange={(e) => handleInputChange('moderator', 'failedSubmissions', e.target.value)}
                        placeholder="Failed Submissions"
                        disabled={!isEditMode.moderator}
                    />
                    {completedSections.moderator ? (
                        isEditMode.moderator ? (
                            <>
                            <button onClick={() => handleSubmit('moderator')}>Submit Moderator Section</button>
                            <button onClick={() => handleCancelEdit('moderator')}>Cancel Edit</button>
                            </>
                        ) : (
                            <button onClick={() => handleEdit('moderator')}>Edit Moderator Section</button>
                        )
                    ) : (
                        <button onClick={() => handleSubmit('moderator')}>Submit Moderator Section</button>
                    )}
                </section>
            )}

            {/* Assessment Lead Stage 2 Section */}
            {completedSections.moderator && (
                <section>
                    <h2>Assessment Lead Stage 2 Section</h2>
                    <textarea
                        value={formData.assessmentLeadStage2.comments}
                        onChange={(e) => handleInputChange('assessmentLeadStage2', 'comments', e.target.value)}
                        placeholder="Stage 2 Assessment Lead Comments"
                        disabled={!isEditMode.assessmentLeadStage2}
                    />
                    <input
                        type="datetime-local"
                        value={formData.assessmentLeadStage2.signatureDateTime}
                        onChange={(e) => handleInputChange('assessmentLeadStage2', 'signatureDateTime', e.target.value)}
                        placeholder="Signature Date Time"
                        disabled={!isEditMode.assessmentLeadStage2}
                    />
                    {completedSections.assessmentLeadStage2 ? (
                        isEditMode.assessmentLeadStage2 ? (
                            <>
                            <button onClick={() => handleSubmit('assessmentLeadStage2')}>Submit Assessment Lead Stage 2 Section</button>
                            <button onClick={() => handleCancelEdit('assessmentLeadStage2')}>Cancel Edit</button>
                            </>
                        ) : (
                            <button onClick={() => handleEdit('assessmentLeadStage2')}>Edit Assessment Lead Stage 2 Section</button>
                        )
                    ) : (
                        <button onClick={() => handleSubmit('assessmentLeadStage2')}>Submit Assessment Lead Stage 2 Section</button>
                    )}
                </section>
            )}

            {/* Final Confirmation by Programme Director Section */}
            {completedSections.assessmentLeadStage2 && (
                <section>
                    <h2>Final Confirmation by Programme Director Section</h2>
                    <input
                        type="text"
                        value={formData.finalConfirmation.signature}
                        onChange={(e) => handleInputChange('finalConfirmation', 'signature', e.target.value)}
                        placeholder="Final Confirmation Signature"
                        disabled={!isEditMode.finalConfirmation}
                    />
                    <input
                        type="text"
                        value={formData.finalConfirmation.signatureStage2}
                        onChange={(e) => handleInputChange('finalConfirmation', 'signatureStage2', e.target.value)}
                        placeholder="Stage 2 Signature"
                        disabled={!isEditMode.finalConfirmation}
                    />
                    {completedSections.finalConfirmation ? (
                        isEditMode.finalConfirmation ? (
                            <>
                            <button onClick={() => handleSubmit('finalConfirmation')}>Submit Final Confirmation Section</button>
                            <button onClick={() => handleCancelEdit('finalConfirmation')}>Cancel Edit</button>
                            </>
                        ) : (
                            <button onClick={() => handleEdit('finalConfirmation')}>Edit Final Confirmation Section</button>
                        )
                    ) : (
                        <button onClick={() => handleSubmit('finalConfirmation')}>Submit Final Confirmation Section</button>
                    )}
                </section>
            )}
        </div>
    );
};

export default AssessmentForm;

