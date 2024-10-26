import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#fff',
  },
  pageTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    textDecoration: 'underline',
    color: '#610064', // Aston University  color
  },
  section: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#610064',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: '#a626aa', //  background
    color: '#ffffff',
    padding: 5,
    borderRadius: 3,
    textAlign: 'center',
  },
  field: {
    marginBottom: 8,
    padding: 2,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
    justifyContent: 'space-between',
  },
  label: {
    width: '40%',
    fontWeight: 'bold',
    color: '#004b87',
  },
  value: {
    width: '60%',
    fontStyle: 'italic',
  },
  signature: {
    marginTop: 20,
    borderTop: 1,
    paddingTop: 5,
  },
  signatureDate: {
    fontSize: 10,
    marginTop: 3,
    fontStyle: 'italic',
  },
  questionSection: {
    marginTop: 10,
    marginBottom: 10,
  },
  question: {
    marginBottom: 8,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#666',
  },
  roleSection: {
    marginBottom: 10,
  },
  fieldSet: {
    border: 1,
    padding: 10,
    marginTop: 10,
    borderColor: '#d3d3d3',
    borderRadius: 5,
  },
});

const PdfDocument = ({ modData, moduleData }) => (
  <Document>
    {/* Page 1: Module and Assessment Details */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.pageTitle}>Assessment Moderation Form</Text>

      {/* Module Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Module Details</Text>
        <View style={styles.field}>
          <View style={styles.row}>
            <Text style={styles.label}>Module Name:</Text>
            <Text style={styles.value}>{moduleData?.moduleName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Module Code:</Text>
            <Text style={styles.value}>{moduleData?.moduleCode}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Credits:</Text>
            <Text style={styles.value}>{moduleData?.credits}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Level:</Text>
            <Text style={styles.value}>{moduleData?.level}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Module Leader:</Text>
            <Text style={styles.value}>{moduleData?.moduleLeader}</Text>
          </View>
        </View>
      </View>

      {/* Assessment Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Assessment Details</Text>
        <View style={styles.field}>
          <View style={styles.row}>
            <Text style={styles.label}>Title:</Text>
            <Text style={styles.value}>{modData?.title}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.value}>{modData?.assessmentCategory}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>MLOs/Skills Covered:</Text>
            <Text style={styles.value}>{modData?.skills}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Assessment Weighting:</Text>
            <Text style={styles.value}>{modData?.assessmentWeighting}%</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Planned Issue Date:</Text>
            <Text style={styles.value}>{modData?.plannedIssueDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Submission Date:</Text>
            <Text style={styles.value}>{modData?.courseworkSubmissionDate}</Text>
          </View>
        </View>
      </View>

      {/* Role Assignments */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Role Assignments</Text>
        {['MODULE_ASSESSMENT_LEAD', 'INTERNAL_MODERATOR', 'EXTERNAL_EXAMINER', 'PROGRAMME_DIRECTOR'].map(roleType => {
          const participantsWithRole = modData?.participants?.filter(p =>
            p.roles.includes(roleType)
          ) || [];

          if (participantsWithRole.length > 0) {
            return (
              <View key={roleType} style={styles.roleSection}>
                <View style={styles.row}>
                  <Text style={styles.label}>{roleType.replace(/_/g, ' ')}:</Text>
                  <Text style={styles.value}>
                    {participantsWithRole.map(p =>
                      `${p.firstName} ${p.lastName}`
                    ).join(', ')}
                  </Text>
                </View>
              </View>
            );
          }
          return null;
        })}
      </View>

      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `Page ${pageNumber} of ${totalPages}`
      )} fixed />
    </Page>

    {/* Page 2: Internal Moderator Section */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Internal Moderator Section</Text>
      
      {/* Questions Section */}
      <View style={styles.questionSection}>
        {modData?.questions?.map((question, index) => (
          <View key={index} style={styles.question}>
            <Text>{index + 1}. {question.questionText}</Text>
            <Text style={{ marginLeft: 20 }}>
              Answer: {question.yesNoAnswer ? 'Yes' : 'No'}
            </Text>
            {question.comment && (
              <Text style={{ marginLeft: 20, fontSize: 10, fontStyle: 'italic' }}>
                Comment: {question.comment}
              </Text>
            )}
          </View>
        ))}
      </View>

      {/* Comments and Signature */}
      <View style={styles.field}>
        <Text style={styles.label}>Comments:</Text>
        <Text style={styles.value}>{modData?.internalModeratorComments}</Text>
      </View>

      <View style={styles.signature}>
        <Text style={styles.label}>Signature:</Text>
        <Text>{modData?.internalModeratorSignature}</Text>
        <Text style={styles.signatureDate}>
          Signed on: {modData?.internalModeratorSignatureDateTime}
        </Text>
      </View>

      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `Page ${pageNumber} of ${totalPages}`
      )} fixed />
    </Page>

    {/* Page 3: Response and External Examiner */}
    <Page size="A4" style={styles.page}>
      {/* Response to Internal Moderator */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Response to Internal Moderator</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Response:</Text>
          <Text style={styles.value}>{modData?.responseToInternalModerator}</Text>
        </View>
        <View style={styles.signature}>
          <Text style={styles.label}>Signature:</Text>
          <Text>{modData?.responseToInternalModeratorSignature}</Text>
          <Text style={styles.signatureDate}>
            Signed on: {modData?.responseToInternalModeratorDateTime}
          </Text>
        </View>
      </View>

      {/* External Examiner Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>External Examiner Section</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Comments:</Text>
          <Text style={styles.value}>{modData?.externalExaminerComments}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Approval:</Text>
          <Text style={styles.value}>{modData?.externalExaminerApproval}</Text>
        </View>
        <View style={styles.signature}>
          <Text style={styles.label}>Signature:</Text>
          <Text>{modData?.externalExaminer_signature}</Text>
          <Text style={styles.signatureDate}>
            Signed on: {modData?.externalExaminerSignatureDateTime}
          </Text>
        </View>
      </View>

      {/* Response to External Examiner */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Response to External Examiner</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Response:</Text>
          <Text style={styles.value}>{modData?.responseToExternalExaminer}</Text>
        </View>
        <View style={styles.signature}>
          <Text style={styles.label}>Signature:</Text>
          <Text>{modData?.responseToExternalExaminerSignature}</Text>
          <Text style={styles.signatureDate}>
            Signed on: {modData?.responseToExternalExaminerDateTime}
          </Text>
        </View>
      </View>

      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `Page ${pageNumber} of ${totalPages}`
      )} fixed />
    </Page>

    {/* Page 4: Programme Director and Stage 2 */}
    <Page size="A4" style={styles.page}>
      {/* Programme Director Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Programme Director Section</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Approval:</Text>
          <Text style={styles.value}>{modData?.programmeDirectorApproval}</Text>
        </View>
        <View style={styles.signature}>
          <Text style={styles.label}>Signature:</Text>
          <Text>{modData?.programmeDirectorConfirmation_signature || 'Pending'}</Text>
          <Text style={styles.signatureDate}>
            Signed on: {modData?.programmeDirectorSignatureDateTime}
          </Text>
        </View>
      </View>

      {/* Stage 2 Section - Only if applicable */}
      {modData?.internalModeratorModerationOfMarksTrigger === "Completed" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stage 2 Assessment Details</Text>
          <View style={styles.field}>
            <View style={styles.row}>
              <Text style={styles.label}>Assessment Deadline:</Text>
              <Text style={styles.value}>{modData?.assessmentDeadline}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Total Submissions:</Text>
              <Text style={styles.value}>{modData?.totalSubmissions}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Failed Submissions:</Text>
              <Text style={styles.value}>{modData?.failedSubmissions}</Text>
            </View>
          </View>

          <View style={styles.signature}>
            <Text style={styles.label}>Stage 2 Moderator Comments:</Text>
            <Text style={styles.value}>{modData?.stage2_moderatorComments}</Text>
            <Text style={styles.label}>Signature:</Text>
            <Text>{modData?.stage2ModeratorSignature}</Text>
            <Text style={styles.signatureDate}>
              Signed on: {modData?.moderatorSignatureDateTime}
            </Text>
          </View>

          <View style={styles.signature}>
            <Text style={styles.label}>Programme Director Final Signature:</Text>
            <Text>{modData?.programmeDirectorConfirmation_signature_stage2}</Text>
            <Text style={styles.signatureDate}>
              Signed on: {modData?.programmeDirectorConfirmation_signatureDateTime_stage2}
            </Text>
          </View>
        </View>
      )}

      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `Page ${pageNumber} of ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);

export default PdfDocument;



// import React from 'react';
// import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// const styles = StyleSheet.create({
//   page: {
//     padding: 40,
//     fontSize: 11,
//     fontFamily: 'Helvetica',
//   },
//   pageTitle: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginBottom: 20,
//     fontWeight: 'bold',
//   },
//   section: {  // Added the missing section style
//     marginBottom: 20,
//     paddingBottom: 10,
//   },
//   sectionTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     backgroundColor: '#f0f0f0',
//     padding: 5,
//   },
//   field: {
//     marginBottom: 8,
//   },
//   row: {
//     flexDirection: 'row',
//     marginBottom: 5,
//   },
//   label: {
//     width: '30%',
//     fontWeight: 'bold',
//   },
//   value: {
//     width: '70%',
//   },
//   signature: {
//     marginTop: 10,
//     borderTop: 1,
//     paddingTop: 5,
//   },
//   signatureDate: {
//     fontSize: 10,
//     marginTop: 3,
//   },
//   questionSection: {
//     marginTop: 10,
//     marginBottom: 10,
//   },
//   question: {
//     marginBottom: 8,
//   },
//   pageNumber: {
//     position: 'absolute',
//     fontSize: 10,
//     bottom: 30,
//     left: 0,
//     right: 0,
//     textAlign: 'center',
//     color: '#666',
//   },
//   roleSection: {
//     marginBottom: 10,
//   }
// });

// const PdfDocument = ({ modData, moduleData }) => (
//   <Document>
//     {/* Page 1: Module and Assessment Details */}
//     <Page size="A4" style={styles.page}>
//       <Text style={styles.pageTitle}>Assessment Moderation Form</Text>

//       {/* Module Details */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Module Details</Text>
//         <View style={styles.field}>
//           <View style={styles.row}>
//             <Text style={styles.label}>Module Name:</Text>
//             <Text style={styles.value}>{moduleData?.moduleName}</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.label}>Module Code:</Text>
//             <Text style={styles.value}>{moduleData?.moduleCode}</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.label}>Credits:</Text>
//             <Text style={styles.value}>{moduleData?.credits}</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.label}>Level:</Text>
//             <Text style={styles.value}>{moduleData?.level}</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.label}>Module Leader:</Text>
//             <Text style={styles.value}>{moduleData?.moduleLeader}</Text>
//           </View>
//         </View>
//       </View>

//       {/* Assessment Details */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Assessment Details</Text>
//         <View style={styles.field}>
//           <View style={styles.row}>
//             <Text style={styles.label}>Title:</Text>
//             <Text style={styles.value}>{modData?.title}</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.label}>Category:</Text>
//             <Text style={styles.value}>{modData?.assessmentCategory}</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.label}>MLOs/Skills Covered:</Text>
//             <Text style={styles.value}>{modData?.skills}</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.label}>Assessment Weighting:</Text>
//             <Text style={styles.value}>{modData?.assessmentWeighting}%</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.label}>Planned Issue Date:</Text>
//             <Text style={styles.value}>{modData?.plannedIssueDate}</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.label}>Submission Date:</Text>
//             <Text style={styles.value}>{modData?.courseworkSubmissionDate}</Text>
//           </View>
//         </View>
//       </View>

//       {/* Role Assignments */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Role Assignments</Text>
//         {['MODULE_ASSESSMENT_LEAD', 'INTERNAL_MODERATOR', 'EXTERNAL_EXAMINER', 'PROGRAMME_DIRECTOR'].map(roleType => {
//           const participantsWithRole = modData?.participants?.filter(p => 
//             p.roles.includes(roleType)
//           ) || [];

//           if (participantsWithRole.length > 0) {
//             return (
//               <View key={roleType} style={styles.roleSection}>
//                 <View style={styles.row}>
//                   <Text style={styles.label}>{roleType.replace(/_/g, ' ')}:</Text>
//                   <Text style={styles.value}>
//                     {participantsWithRole.map(p => 
//                       `${p.firstName} ${p.lastName}`
//                     ).join(', ')}
//                   </Text>
//                 </View>
//               </View>
//             );
//           }
//           return null;
//         })}
//       </View>

//       <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
//         `Page ${pageNumber} of ${totalPages}`
//       )} fixed />
//     </Page>

//     {/* Page 2: Internal Moderator Section */}
//     <Page size="A4" style={styles.page}>
//       <Text style={styles.sectionTitle}>Internal Moderator Section</Text>
      
//       {/* Questions Section */}
//       <View style={styles.questionSection}>
//         {modData?.questions?.map((question, index) => (
//           <View key={index} style={styles.question}>
//             <Text>{index + 1}. {question.questionText}</Text>
//             <Text style={{ marginLeft: 20 }}>
//               Answer: {question.yesNoAnswer ? 'Yes' : 'No'}
//             </Text>
//             {question.comment && (
//               <Text style={{ marginLeft: 20, fontSize: 10, fontStyle: 'italic' }}>
//                 Comment: {question.comment}
//               </Text>
//             )}
//           </View>
//         ))}
//       </View>

//       {/* Comments and Signature */}
//       <View style={styles.field}>
//         <Text style={styles.label}>Comments:</Text>
//         <Text style={styles.value}>{modData?.internalModeratorComments}</Text>
//       </View>

//       <View style={styles.signature}>
//         <Text style={styles.label}>Signature:</Text>
//         <Text>{modData?.internalModeratorSignature}</Text>
//         <Text style={styles.signatureDate}>
//           Signed on: {modData?.internalModeratorSignatureDateTime}
//         </Text>
//       </View>

//       <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
//         `Page ${pageNumber} of ${totalPages}`
//       )} fixed />
//     </Page>

//     {/* Page 3: Responses and External Examiner */}
//     <Page size="A4" style={styles.page}>
//       {/* Response to Internal Moderator */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Response to Internal Moderator</Text>
//         <View style={styles.field}>
//           <Text style={styles.label}>Response:</Text>
//           <Text style={styles.value}>{modData?.responseToInternalModerator}</Text>
//         </View>
//         <View style={styles.signature}>
//           <Text style={styles.label}>Signature:</Text>
//           <Text>{modData?.responseToInternalModeratorSignature}</Text>
//           <Text style={styles.signatureDate}>
//             Signed on: {modData?.responseToInternalModeratorDateTime}
//           </Text>
//         </View>
//       </View>

//       {/* External Examiner Section */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>External Examiner Section</Text>
//         <View style={styles.field}>
//           <Text style={styles.label}>Comments:</Text>
//           <Text style={styles.value}>{modData?.externalExaminerComments}</Text>
//         </View>
//         <View style={styles.field}>
//           <Text style={styles.label}>Approval:</Text>
//           <Text style={styles.value}>{modData?.externalExaminerApproval}</Text>
//         </View>
//         <View style={styles.signature}>
//           <Text style={styles.label}>Signature:</Text>
//           <Text>{modData?.externalExaminer_signature}</Text>
//           <Text style={styles.signatureDate}>
//             Signed on: {modData?.externalExaminerSignatureDateTime}
//           </Text>
//         </View>
//       </View>

//       {/* Response to External Examiner */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Response to External Examiner</Text>
//         <View style={styles.field}>
//           <Text style={styles.label}>Response:</Text>
//           <Text style={styles.value}>{modData?.responseToExternalExaminer}</Text>
//         </View>
//         <View style={styles.signature}>
//           <Text style={styles.label}>Signature:</Text>
//           <Text>{modData?.responseToExternalExaminerSignature}</Text>
//           <Text style={styles.signatureDate}>
//             Signed on: {modData?.responseToExternalExaminerDateTime}
//           </Text>
//         </View>
//       </View>

//       <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
//         `Page ${pageNumber} of ${totalPages}`
//       )} fixed />
//     </Page>

//     {/* Page 4: Programme Director and Stage 2 */}
//     <Page size="A4" style={styles.page}>
//       {/* Programme Director Section */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Programme Director Section</Text>
//         <View style={styles.field}>
//           <Text style={styles.label}>Approval:</Text>
//           <Text style={styles.value}>{modData?.programmeDirectorApproval}</Text>
//         </View>
//         <View style={styles.signature}>
//           <Text style={styles.label}>Signature:</Text>
//           <Text>{modData?.programmeDirectorConfirmation_signature || 'Pending'}</Text>
//           <Text style={styles.signatureDate}>
//             Signed on: {modData?.programmeDirectorSignatureDateTime}
//           </Text>
//         </View>
//       </View>

//       {/* Stage 2 Section - Only if applicable */}
//       {modData?.internalModeratorModerationOfMarksTrigger === "Completed" && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Stage 2 Assessment Details</Text>
//           <View style={styles.field}>
//             <View style={styles.row}>
//               <Text style={styles.label}>Assessment Deadline:</Text>
//               <Text style={styles.value}>{modData?.assessmentDeadline}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>Total Submissions:</Text>
//               <Text style={styles.value}>{modData?.totalSubmissions}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>Failed Submissions:</Text>
//               <Text style={styles.value}>{modData?.failedSubmissions}</Text>
//             </View>
//           </View>

//           <View style={styles.signature}>
//             <Text style={styles.label}>Stage 2 Moderator Comments:</Text>
//             <Text style={styles.value}>{modData?.stage2_moderatorComments}</Text>
//             <Text style={styles.label}>Signature:</Text>
//             <Text>{modData?.stage2ModeratorSignature}</Text>
//             <Text style={styles.signatureDate}>
//               Signed on: {modData?.moderatorSignatureDateTime}
//             </Text>
//           </View>

//           <View style={styles.signature}>
//             <Text style={styles.label}>Programme Director Final Signature:</Text>
//             <Text>{modData?.programmeDirectorConfirmation_signature_stage2}</Text>
//             <Text style={styles.signatureDate}>
//               Signed on: {modData?.programmeDirectorConfirmation_signatureDateTime_stage2}
//             </Text>
//           </View>
//         </View>
//       )}

//       <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
//         `Page ${pageNumber} of ${totalPages}`
//       )} fixed />
//     </Page>
//   </Document>
// );

// export default PdfDocument;