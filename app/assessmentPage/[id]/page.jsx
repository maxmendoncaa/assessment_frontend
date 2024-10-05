'use client';

import React from 'react';
import ModerationForm from '@/app/components/ModerationForm';

export default function AssessmentPage({ params }) {
  return <ModerationForm assessmentId={params.id} />;
}

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import axiosInstance from '@/utils/axios';

// export default function AssessmentPage(props) {
//   const [assessment, setAssessment] = useState(null);
//   const [error, setError] = useState('');
//   const [updateData, setUpdateData] = useState({});
//   const  id  = props.params.id;

//   useEffect(() => {
//     const fetchAssessment = async () => {
//       try {
//         const response = await axiosInstance.get(`/api/v1/assessments/${id}`);
//         setAssessment(response.data);
//       } catch (err) {
//         setError('Failed to fetch assessment data');
//       }
//     };

//     fetchAssessment();
//   }, [id]);

//   const handleInputChange = (e) => {
//     setUpdateData({ ...updateData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axiosInstance.put(`/api/v1/assessments/${id}`, updateData);
//       setAssessment(response.data);
//       setUpdateData({});
//     } catch (err) {
//       setError('Failed to update assessment');
//     }
//   };

//   if (error) return <div>Error: {error}</div>;
//   if (!assessment) return <div>Loading...</div>;

//   return (
//     <div>
//       <h1>{assessment.title}</h1>
//       <p>Category: {assessment.assessmentCategory}</p>
//       <p>Weighting: {assessment.assessmentWeighting}%</p>
//       <p>Planned Issue Date: {assessment.plannedIssueDate}</p>
//       <p>Coursework Submission Date: {assessment.courseworkSubmissionDate}</p>

//       <form onSubmit={handleSubmit}>
//         {assessment.userRole === 'MODULE_ASSESSMENT_LEAD' && (
//           <>
//             <label>
//               Total Submissions:
//               <input
//                 type="number"
//                 name="totalSubmissions"
//                 value={updateData.totalSubmissions || assessment.totalSubmissions || ''}
//                 onChange={handleInputChange}
//               />
//             </label>
//             <label>
//               Failed Submissions:
//               <input
//                 type="number"
//                 name="failedSubmissions"
//                 value={updateData.failedSubmissions || assessment.failedSubmissions || ''}
//                 onChange={handleInputChange}
//               />
//             </label>
//           </>
//         )}

//         {assessment.userRole === 'INTERNAL_MODERATOR' && (
//           <label>
//             General Comment:
//             <textarea
//               name="generalComment"
//               value={updateData.generalComment || assessment.generalComment || ''}
//               onChange={handleInputChange}
//             />
//           </label>
//         )}

//         {/* Add more role-specific fields as needed */}

//         <button type="submit">Update Assessment</button>
//       </form>
//     </div>
//   );
// }

