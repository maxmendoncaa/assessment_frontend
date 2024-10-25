

"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axiosInstance from '@/utils/axios';
import { Button, Form, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import Select from 'react-select';

const AssessmentRoles = {
  EXTERNAL_EXAMINER: "EXTERNAL_EXAMINER",
  INTERNAL_MODERATOR: "INTERNAL_MODERATOR",
  PROGRAMME_DIRECTOR: "PROGRAMME_DIRECTOR",
  MODULE_ASSESSMENT_LEAD: "MODULE_ASSESSMENT_LEAD",
};

export default function ManageModule() {
  const params = useParams();
  const [moduleData, setModuleData] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [users, setUsers] = useState([]);
  const [newParticipants, setNewParticipants] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [changedRoles, setChangedRoles] = useState({});
  const [currentAssessmentId, setCurrentAssessmentId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moduleId = params.id;
        const [moduleResponse, assessmentsResponse, usersResponse] = await Promise.all([
          axiosInstance.get(`/api/v1/modules/${moduleId}`),
          axiosInstance.get(`/api/v1/modules/${moduleId}/assessments/user`),
          axiosInstance.get('/api/v1/users/all'),
        ]);

        setModuleData(moduleResponse.data);
        setAssessments(assessmentsResponse.data);
        setUsers(usersResponse.data);
      } catch (err) {
        setError('Failed to fetch data: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleRoleChange = (assessmentId, participantId, role) => {
    setChangedRoles(prevChangedRoles => {
      const key = `${assessmentId}-${participantId}`;
      const currentRoles = prevChangedRoles[key] ||
        assessments.find(a => a.id === assessmentId)
          .participants.find(p => p.userId === participantId)?.roles || [];

      const newRoles = new Set(currentRoles);
      if (newRoles.has(role)) {
        newRoles.delete(role);
      } else {
        newRoles.add(role);
      }

      return { ...prevChangedRoles, [key]: Array.from(newRoles) };
    });
  };

  const handleNewParticipantRoleChange = (index, role) => {
    setNewParticipants(prev => {
      const newRoles = new Set(prev[index].roles);
      if (newRoles.has(role)) {
        newRoles.delete(role);
      } else {
        newRoles.add(role);
      }
      const updatedParticipants = [...prev];
      updatedParticipants[index] = { ...updatedParticipants[index], roles: Array.from(newRoles) };
      return updatedParticipants;
    });
  };

  const addNewParticipantContainer = () => {
    setNewParticipants(prev => [...prev, { userId: null, roles: [] }]);
  };

  const handleSelectUser = (index, selectedOption) => {
    setNewParticipants(prev => {
      const updatedParticipants = [...prev];
      updatedParticipants[index] = { ...updatedParticipants[index], userId: selectedOption.value };
      return updatedParticipants;
    });
  };

  const handleSubmitChanges = async (assessmentId) => {
    const assessment = assessments.find(a => a.id === assessmentId);

    // Save changes for existing participants
    for (const participant of assessment.participants) {
      const key = `${assessmentId}-${participant.userId}`;
      const roles = changedRoles[key] || participant.roles;

      try {
        await axiosInstance.put(`/api/v1/modules/${moduleData.id}/assessments/${assessmentId}/participants/${participant.userId}`, roles);
      } catch (err) {
        setError(`Failed to update roles for ${participant.firstName} ${participant.lastName}: ${err.response?.data || err.message}`);
        return;
      }
    }

    // Save new participants
    for (const newParticipant of newParticipants) {
      if (!newParticipant.userId || newParticipant.roles.length === 0) {
        setError('Each new participant must have a user and at least one role.');
        return;
      }

      try {
        await axiosInstance.post(`/api/v1/modules/${moduleData.id}/assessments/${assessmentId}/participants`, newParticipant);
      } catch (err) {
        setError('Failed to add new participant: ' + err.response?.data || err.message);
        return;
      }
    }

    setNewParticipants([]); // Clear new participants after submission
    setSuccess('Changes submitted successfully.');
  };

  if (isLoading) return <Container><Row><Col><p>Loading...</p></Col></Row></Container>;
  if (!moduleData) return <Container><Row><Col><Alert variant="danger">{error || 'Failed to load module data.'}</Alert></Col></Row></Container>;

  return (
    <Container className="manage-module-container">
      <Row>
        <Col>
          <h1>Manage Module: {moduleData.name}</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Assessments</Card.Title>
              {assessments.map((assessment) => (
                <Card key={assessment.id} className="mb-3">
                  <Card.Body>
                    <h4>{assessment.title}</h4>
                    <Card className="mb-3">
                      <Card.Body>
                        <Card.Title>Participants</Card.Title>
                        {assessment.participants.map((participant) => (
                          <Card key={participant.userId} className="mb-3">
                            <Card.Body>
                              <p><strong>Name:</strong> {participant.firstName} {participant.lastName}</p>
                              <p><strong>Roles:</strong></p>
                              {Object.entries(AssessmentRoles).map(([key, value]) => (
                                <Form.Check
                                  key={key}
                                  type="checkbox"
                                  label={key}
                                  checked={changedRoles[`${assessment.id}-${participant.userId}`]
                                    ? changedRoles[`${assessment.id}-${participant.userId}`].includes(value)
                                    : participant.roles.includes(value)}
                                  onChange={() => handleRoleChange(assessment.id, participant.userId, value)}
                                />
                              ))}
                            </Card.Body>
                          </Card>
                        ))}

                        {/* Render new participant containers */}
                        {newParticipants.map((participant, index) => (
                          <Card key={index} className="mb-3">
                            <Card.Body>
                              <Form.Group>
                                <Form.Label>Select User (by email)</Form.Label>
                                <Select
                                  options={users.filter(user =>
                                    !assessment.participants.some(p => p.userId === user.userId) &&
                                    !newParticipants.some((np, i) => i !== index && np.userId === user.userId) // Filter out already added users
                                  ).map(user => ({ value: user.userId, label: user.email }))}
                                  onChange={(selectedOption) => handleSelectUser(index, selectedOption)}
                                />
                              </Form.Group>
                              <Form.Group>
                                <Form.Label>Select Roles</Form.Label>
                                {Object.entries(AssessmentRoles).map(([key, value]) => (
                                  <Form.Check
                                    key={key}
                                    type="checkbox"
                                    label={key}
                                    checked={participant.roles.includes(value)}
                                    onChange={() => handleNewParticipantRoleChange(index, value)}
                                  />
                                ))}
                              </Form.Group>
                            </Card.Body>
                          </Card>
                        ))}

                        <Button onClick={addNewParticipantContainer}>Add Participant</Button>
                      </Card.Body>
                    </Card>
                    <Button onClick={() => handleSubmitChanges(assessment.id)}>Submit Changes</Button>
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}




//working good with some api issue
// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import axiosInstance from '@/utils/axios';
// import { Button, Form, Alert, Container, Row, Col, Card } from 'react-bootstrap';
// import Select from 'react-select';

// const AssessmentRoles = {
//   EXTERNAL_EXAMINER: "EXTERNAL_EXAMINER",
//   INTERNAL_MODERATOR: "INTERNAL_MODERATOR",
//   PROGRAMME_DIRECTOR: "PROGRAMME_DIRECTOR",
//   MODULE_ASSESSMENT_LEAD: "MODULE_ASSESSMENT_LEAD",
// };

// export default function ManageModule() {
//   const params = useParams();
//   const router = useRouter();
//   const [moduleData, setModuleData] = useState(null);
//   const [assessments, setAssessments] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [isAssessmentLead, setIsAssessmentLead] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [changedRoles, setChangedRoles] = useState({});
//   const [newParticipant, setNewParticipant] = useState({ userId: null, roles: [] });
//   const [currentAssessmentId, setCurrentAssessmentId] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const moduleId = params.id;
//         const [moduleResponse, assessmentsResponse, isLeadResponse, usersResponse] = await Promise.all([
//           axiosInstance.get(`/api/v1/modules/${moduleId}`),
//           axiosInstance.get(`/api/v1/modules/${moduleId}/assessments/user`),
//           axiosInstance.get(`/api/v1/modules/${moduleId}/is-assessment-lead`),
//           axiosInstance.get('/api/v1/users/all')
//         ]);
        
//         setModuleData(moduleResponse.data);
//         setAssessments(assessmentsResponse.data);
//         setIsAssessmentLead(isLeadResponse.data);
//         setUsers(usersResponse.data);

//         if (!isLeadResponse.data) {
//           setError('You do not have permission to manage this module.');
//         }
//       } catch (err) {
//         setError('Failed to fetch data: ' + err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [params.id]);

//   const handleRoleChange = (assessmentId, participantId, role) => {
//     setChangedRoles(prevChangedRoles => {
//       const key = `${assessmentId}-${participantId}`;
//       const currentRoles = prevChangedRoles[key] || 
//         assessments.find(a => a.id === assessmentId)
//           .participants.find(p => p.userId === participantId).roles;
      
//       const newRoles = new Set(currentRoles);
//       if (newRoles.has(role)) {
//         newRoles.delete(role);
//       } else {
//         newRoles.add(role);
//       }
      
//       return { ...prevChangedRoles, [key]: Array.from(newRoles) };
//     });
//   };

//   const handleNewParticipantRoleChange = (role) => {
//     setNewParticipant(prev => {
//       const newRoles = new Set(prev.roles);
//       if (newRoles.has(role)) {
//         newRoles.delete(role);
//       } else {
//         newRoles.add(role);
//       }
//       return { ...prev, roles: Array.from(newRoles) };
//     });
//   };

//   const hasAssessmentLead = (assessment) => {
//     return assessment.participants.some(participant => {
//       const key = `${assessment.id}-${participant.userId}`;
//       const roles = changedRoles[key] || participant.roles;
//       return roles.includes(AssessmentRoles.MODULE_ASSESSMENT_LEAD);
//     });
//   };

//   const saveChanges = async (assessmentId) => {
//     const assessment = assessments.find(a => a.id === assessmentId);
    
//     if (!hasAssessmentLead(assessment)) {
//       setError('Each assessment must have at least one Module Assessment Lead.');
//       return;
//     }

//     for (const participant of assessment.participants) {
//       const key = `${assessmentId}-${participant.userId}`;
//       const roles = changedRoles[key] || participant.roles;
      
//       try {
//         await axiosInstance.put(`/api/v1/modules/${moduleData.id}/assessments/${assessmentId}/participants/${participant.userId}`, roles);
//       } catch (err) {
//         setError(`Failed to update roles for ${participant.firstName} ${participant.lastName}: ${err.response?.data || err.message}`);
//         return;
//       }
//     }

//     setChangedRoles(prevChangedRoles => {
//       const newChangedRoles = { ...prevChangedRoles };
//       Object.keys(newChangedRoles).forEach(key => {
//         if (key.startsWith(`${assessmentId}-`)) {
//           delete newChangedRoles[key];
//         }
//       });
//       return newChangedRoles;
//     });

//     try {
//       const response = await axiosInstance.get(`/api/v1/assessments/${assessmentId}/participants`);
//       setAssessments(prevAssessments => prevAssessments.map(a => 
//         a.id === assessmentId ? { ...a, participants: response.data } : a
//       ));
//       setSuccess('Roles updated successfully');
//     } catch (err) {
//       setError('Failed to refresh participant data');
//     }
//   };

//   const addParticipant = async () => {
//     if (!newParticipant.userId || newParticipant.roles.length === 0) {
//       setError('Please select a user and at least one role');
//       return;
//     }

//     try {
//       const response = await axiosInstance.post(`/api/v1/modules/${moduleData.id}/assessments/${currentAssessmentId}/participants`, newParticipant);
//       setAssessments(prevAssessments => prevAssessments.map(a => 
//         a.id === currentAssessmentId ? { ...a, participants: [...a.participants, response.data] } : a
//       ));
//       setSuccess('Participant added successfully');
//       setNewParticipant({ userId: null, roles: [] });
//     } catch (err) {
//       setError('Failed to add participant: ' + err.response?.data || err.message);
//     }
//   };

//   const deleteParticipant = async (assessmentId, participantId) => {
//     try {
//       await axiosInstance.delete(`/api/v1/modules/${moduleData.id}/assessments/${assessmentId}/participants/${participantId}`);
//       setAssessments(prevAssessments => prevAssessments.map(assessment =>
//         assessment.id === assessmentId
//           ? { ...assessment, participants: assessment.participants.filter(p => p.userId !== participantId) }
//           : assessment
//       ));
//       setSuccess('Participant deleted successfully');
//     } catch (err) {
//       setError('Failed to delete participant: ' + err.response?.data || err.message);
//     }
//   };

//   const deleteAssessment = async (assessmentId) => {
//     if (window.confirm('Are you sure you want to delete this assessment?')) {
//       try {
//         await axiosInstance.delete(`/api/v1/modules/${moduleData.id}/assessments/${assessmentId}`);
//         setAssessments(prevAssessments => prevAssessments.filter(a => a.id !== assessmentId));
//         setSuccess('Assessment deleted successfully');
//       } catch (err) {
//         setError('Failed to delete assessment: ' + err.response?.data || err.message);
//       }
//     }
//   };

//   const deleteModule = async () => {
//     if (window.confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
//       try {
//         await axiosInstance.delete(`/api/v1/modules/${moduleData.id}`);
//         router.push('/dashboard');
//       } catch (err) {
//         setError('Failed to delete module: ' + err.response?.data || err.message);
//       }
//     }
//   };

//   if (isLoading) return <Container><Row><Col><p>Loading...</p></Col></Row></Container>;
//   if (!isAssessmentLead) return <Container><Row><Col><Alert variant="danger">{error || 'You do not have permission to view this page.'}</Alert></Col></Row></Container>;
//   if (!moduleData) return <Container><Row><Col><Alert variant="danger">{error || 'Failed to load module data.'}</Alert></Col></Row></Container>;

//   return (
//     <Container className="manage-module-container">
//       <Row>
//         <Col>
//           <h1>Manage Module: {moduleData.name}</h1>
//           {error && <Alert variant="danger">{error}</Alert>}
//           {success && <Alert variant="success">{success}</Alert>}
//           <Card className="mb-3">
//             <Card.Body>
//               <Card.Title>Module Details</Card.Title>
//               <p><strong>Module Name:</strong> {moduleData.name}</p>
//               <p><strong>Module Code:</strong> {moduleData.moduleCode}</p>
//               <p><strong>Credits:</strong> {moduleData.credits}</p>
//               <p><strong>Level:</strong> {moduleData.level}</p>
//               <p><strong>Module Leader:</strong> {moduleData.moduleLeader}</p>
//               <p><strong>Module Outcomes:</strong> {moduleData.moduleOutcomes}</p>
//             </Card.Body>
//           </Card>
          
//           <Card className="mb-3">
//             <Card.Body>
//               <Card.Title>Assessments</Card.Title>
//               {assessments.map((assessment) => (
//                 <Card key={assessment.id} className="mb-3">
//                   <Card.Body>
//                     <h4>{assessment.title}</h4>
//                     <p><strong>Category:</strong> {assessment.assessmentCategory}</p>
//                     <p><strong>Weighting:</strong> {assessment.assessmentWeighting}%</p>
//                     <p><strong>Planned Issue Date:</strong> {assessment.plannedIssueDate}</p>
//                     <p><strong>Coursework Submission Date:</strong> {assessment.courseworkSubmissionDate}</p>
//                     <p><strong>Skills:</strong> {assessment.skills}</p>
                    
//                     <Card className="mb-3">
//                       <Card.Body>
//                         <Card.Title>Participants</Card.Title>
//                         {assessment.participants.map((participant) => (
//                           <Card key={participant.userId} className="mb-3">
//                             <Card.Body>
//                               <p><strong>Name:</strong> {participant.firstName} {participant.lastName}</p>
//                               <p><strong>Roles:</strong></p>
//                               {Object.entries(AssessmentRoles).map(([key, value]) => (
//                                 <Form.Check
//                                   key={key}
//                                   type="checkbox"
//                                   label={key}
//                                   checked={changedRoles[`${assessment.id}-${participant.userId}`]
//                                     ? changedRoles[`${assessment.id}-${participant.userId}`].includes(value)
//                                     : participant.roles.includes(value)}
//                                   onChange={() => handleRoleChange(assessment.id, participant.userId, value)}
//                                 />
//                               ))}
//                               <Button variant="danger" onClick={() => deleteParticipant(assessment.id, participant.userId)}>
//                                 Remove Participant
//                               </Button>
//                             </Card.Body>
//                           </Card>
//                         ))}
//                         <Card className="mb-3">
//             <Card.Body>
//               <h4>Add Participant</h4>
//               <Form.Group>
//                 <Form.Label>Select User (by email)</Form.Label>
//                 <Select
//                   options={users.map(user => ({ value: user.userId, label: user.email }))}
//                   onChange={(selectedOption) => setNewParticipant(prev => ({ ...prev, userId: selectedOption.value }))}
//                 />
//               </Form.Group>
//               <Form.Group>
//                 <Form.Label>Select Roles</Form.Label>
//                 {Object.entries(AssessmentRoles).map(([key, value]) => (
//                   <Form.Check
//                     key={key}
//                     type="checkbox"
//                     label={key}
//                     checked={newParticipant.roles.includes(value)}
//                     onChange={() => handleNewParticipantRoleChange(value)}
//                   />
//                 ))}
//               </Form.Group>
//               <Button onClick={addParticipant}>Add Participant</Button>
//             </Card.Body>
//           </Card>
//                       </Card.Body>
//                     </Card>
//                     <Button onClick={() => saveChanges(assessment.id)} disabled={!hasAssessmentLead(assessment)}>
//                       Save Changes
//                     </Button>
//                     <Button variant="danger" onClick={() => deleteAssessment(assessment.id)} className="ml-2">
//                       Delete Assessment
//                     </Button>
//                   </Card.Body>
//                 </Card>
//               ))}
//             </Card.Body>
//           </Card>
//           <Button variant="danger" onClick={deleteModule}>Delete Module</Button>
//         </Col>
//       </Row>
//     </Container>
//   );
// }


//best so far
// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import axiosInstance from '@/utils/axios';
// import { Button, Form, Alert, Container, Row, Col, Card, Modal } from 'react-bootstrap';
// import Select from 'react-select';

// const AssessmentRoles = {
//   EXTERNAL_EXAMINER: "EXTERNAL_EXAMINER",
//   INTERNAL_MODERATOR: "INTERNAL_MODERATOR",
//   PROGRAMME_DIRECTOR: "PROGRAMME_DIRECTOR",
//   MODULE_ASSESSMENT_LEAD: "MODULE_ASSESSMENT_LEAD",
// };

// export default function ManageModule() {
//   const params = useParams();
//   const router = useRouter();
//   const [moduleData, setModuleData] = useState(null);
//   const [assessments, setAssessments] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [isAssessmentLead, setIsAssessmentLead] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [changedRoles, setChangedRoles] = useState({});
//   const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
//   const [currentAssessmentId, setCurrentAssessmentId] = useState(null);
//   const [newParticipant, setNewParticipant] = useState({ userId: null, roles: [] });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const moduleId = params.id;
//         const [moduleResponse, assessmentsResponse, isLeadResponse, usersResponse] = await Promise.all([
//           axiosInstance.get(`/api/v1/modules/${moduleId}`),
//           axiosInstance.get(`/api/v1/modules/${moduleId}/assessments/user`),
//           axiosInstance.get(`/api/v1/modules/${moduleId}/is-assessment-lead`),
//           axiosInstance.get('/api/v1/users/all')
//         ]);
        
//         setModuleData(moduleResponse.data);
//         setAssessments(assessmentsResponse.data);
//         setIsAssessmentLead(isLeadResponse.data);
//         setUsers(usersResponse.data);

//         if (!isLeadResponse.data) {
//           setError('You do not have permission to manage this module.');
//         }
//       } catch (err) {
//         setError('Failed to fetch data: ' + err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [params.id]);

//   const handleRoleChange = (assessmentId, participantId, role) => {
//     setChangedRoles(prevChangedRoles => {
//       const key = `${assessmentId}-${participantId}`;
//       const currentRoles = prevChangedRoles[key] || 
//         assessments.find(a => a.id === assessmentId)
//           .participants.find(p => p.userId === participantId).roles;
      
//       const newRoles = new Set(currentRoles);
//       if (newRoles.has(role)) {
//         newRoles.delete(role);
//       } else {
//         newRoles.add(role);
//       }
      
//       return { ...prevChangedRoles, [key]: Array.from(newRoles) };
//     });
//   };

//   const handleNewParticipantRoleChange = (role) => {
//     setNewParticipant(prev => {
//       const newRoles = new Set(prev.roles);
//       if (newRoles.has(role)) {
//         newRoles.delete(role);
//       } else {
//         newRoles.add(role);
//       }
//       return { ...prev, roles: Array.from(newRoles) };
//     });
//   };

//   const hasAssessmentLead = (assessment) => {
//     return assessment.participants.some(participant => {
//       const key = `${assessment.id}-${participant.userId}`;
//       const roles = changedRoles[key] || participant.roles;
//       return roles.includes(AssessmentRoles.MODULE_ASSESSMENT_LEAD);
//     });
//   };

//   const saveChanges = async (assessmentId) => {
//     const assessment = assessments.find(a => a.id === assessmentId);
    
//     if (!hasAssessmentLead(assessment)) {
//       setError('Each assessment must have at least one Module Assessment Lead.');
//       return;
//     }

//     for (const participant of assessment.participants) {
//       const key = `${assessmentId}-${participant.userId}`;
//       const roles = changedRoles[key] || participant.roles;
      
//       try {
//         await axiosInstance.put(`/api/v1/modules/${moduleData.id}/assessments/${assessmentId}/participants/${participant.userId}`, roles);
//       } catch (err) {
//         setError(`Failed to update roles for ${participant.firstName} ${participant.lastName}: ${err.response?.data || err.message}`);
//         return;
//       }
//     }

//     // Clear changed roles for this assessment
//     setChangedRoles(prevChangedRoles => {
//       const newChangedRoles = { ...prevChangedRoles };
//       Object.keys(newChangedRoles).forEach(key => {
//         if (key.startsWith(`${assessmentId}-`)) {
//           delete newChangedRoles[key];
//         }
//       });
//       return newChangedRoles;
//     });

//     // Refresh assessment data
//     try {
//       const response = await axiosInstance.get(`/api/v1/assessments/${assessmentId}/participants`);
//       setAssessments(prevAssessments => prevAssessments.map(a => 
//         a.id === assessmentId ? { ...a, participants: response.data } : a
//       ));
//       setSuccess('Roles updated successfully');
//     } catch (err) {
//       setError('Failed to refresh participant data');
//     }
//   };

//   const addParticipant = async () => {
//     if (!newParticipant.userId || newParticipant.roles.length === 0) {
//       setError('Please select a user and at least one role');
//       return;
//     }

//     try {
//       const response = await axiosInstance.post(`/api/v1/modules/${moduleData.id}/assessments/${currentAssessmentId}/participants`, newParticipant);
//       setAssessments(prevAssessments => prevAssessments.map(a => 
//         a.id === currentAssessmentId ? { ...a, participants: [...a.participants, response.data] } : a
//       ));
//       setSuccess('Participant added successfully');
//       setShowAddParticipantModal(false);
//       setNewParticipant({ userId: null, roles: [] });
//     } catch (err) {
//       setError('Failed to add participant: ' + err.response?.data || err.message);
//     }
//   };

//   const deleteModule = async () => {
//     if (window.confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
//       try {
//         await axiosInstance.delete(`/api/v1/modules/${moduleData.id}`);
//         router.push('/dashboard');
//       } catch (err) {
//         setError('Failed to delete module: ' + err.response?.data || err.message);
//       }
//     }
//   };

//   if (isLoading) return <Container><Row><Col><p>Loading...</p></Col></Row></Container>;
//   if (!isAssessmentLead) return <Container><Row><Col><Alert variant="danger">{error || 'You do not have permission to view this page.'}</Alert></Col></Row></Container>;
//   if (!moduleData) return <Container><Row><Col><Alert variant="danger">{error || 'Failed to load module data.'}</Alert></Col></Row></Container>;

//   return (
//     <Container className="manage-module-container">
//       <Row>
//         <Col>
//           <h1>Manage Module: {moduleData.name}</h1>
//           {error && <Alert variant="danger">{error}</Alert>}
//           {success && <Alert variant="success">{success}</Alert>}
//           <Card className="mb-3">
//             <Card.Body>
//               <Card.Title>Module Details</Card.Title>
//               <p><strong>Module Name:</strong> {moduleData.name}</p>
//               <p><strong>Module Code:</strong> {moduleData.moduleCode}</p>
//               <p><strong>Credits:</strong> {moduleData.credits}</p>
//               <p><strong>Level:</strong> {moduleData.level}</p>
//               <p><strong>Module Leader:</strong> {moduleData.moduleLeader}</p>
//               <p><strong>Module Outcomes:</strong> {moduleData.moduleOutcomes}</p>
//             </Card.Body>
//           </Card>
          
//           <Card className="mb-3">
//             <Card.Body>
//               <Card.Title>Assessments</Card.Title>
//               {assessments.map((assessment) => (
//                 <Card key={assessment.id} className="mb-3">
//                   <Card.Body>
//                     <h4>{assessment.title}</h4>
//                     <p><strong>Category:</strong> {assessment.assessmentCategory}</p>
//                     <p><strong>Weighting:</strong> {assessment.assessmentWeighting}%</p>
//                     <p><strong>Planned Issue Date:</strong> {assessment.plannedIssueDate}</p>
//                     <p><strong>Coursework Submission Date:</strong> {assessment.courseworkSubmissionDate}</p>
//                     <p><strong>Skills:</strong> {assessment.skills}</p>
                    
//                     <Card className="mb-3">
//                       <Card.Body>
//                         <Card.Title>Participants</Card.Title>
//                         {assessment.participants.map((participant) => (
//                           <Card key={participant.userId} className="mb-3">
//                             <Card.Body>
//                               <p><strong>Name:</strong> {participant.firstName} {participant.lastName}</p>
//                               <p><strong>Roles:</strong></p>
//                               {Object.entries(AssessmentRoles).map(([key, value]) => (
//                                 <Form.Check
//                                   key={key}
//                                   type="checkbox"
//                                   label={key}
//                                   checked={changedRoles[`${assessment.id}-${participant.userId}`]
//                                     ? changedRoles[`${assessment.id}-${participant.userId}`].includes(value)
//                                     : participant.roles.includes(value)}
//                                   onChange={() => handleRoleChange(assessment.id, participant.userId, value)}
//                                 />
//                               ))}
//                             </Card.Body>
//                           </Card>
//                         ))}
//                         <Button onClick={() => {
//                           setCurrentAssessmentId(assessment.id);
//                           setShowAddParticipantModal(true);
//                         }}>Add Participant</Button>
//                       </Card.Body>
//                     </Card>
//                     <Button onClick={() => saveChanges(assessment.id)} disabled={!hasAssessmentLead(assessment)}>
//                       Save Changes
//                     </Button>
//                   </Card.Body>
//                 </Card>
//               ))}
//             </Card.Body>
//           </Card>
//           <Button variant="danger" onClick={deleteModule}>Delete Module</Button>
//         </Col>
//       </Row>

//       <Modal show={showAddParticipantModal} onHide={() => setShowAddParticipantModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Add Participant</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group>
//               <Form.Label>Select User</Form.Label>
//               <Select
//                 options={users.map(user => ({ value: user.userId, label: `${user.firstName} ${user.lastName}` }))}
//                 onChange={(selectedOption) => setNewParticipant(prev => ({ ...prev, userId: selectedOption.value }))}
//               />
//             </Form.Group>
//             <Form.Group>
//               <Form.Label>Select Roles</Form.Label>
//               {Object.entries(AssessmentRoles).map(([key, value]) => (
//                 <Form.Check
//                   key={key}
//                   type="checkbox"
//                   label={key}
//                   checked={newParticipant.roles.includes(value)}
//                   onChange={() => handleNewParticipantRoleChange(value)}
//                 />
//               ))}
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowAddParticipantModal(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={addParticipant}>
//             Add Participant
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// }

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import axiosInstance from '@/utils/axios';
// import { Button, Form, Alert, Container, Row, Col, Card } from 'react-bootstrap';

// const AssessmentRoles = {
//   EXTERNAL_EXAMINER: "EXTERNAL_EXAMINER",
//   INTERNAL_MODERATOR: "INTERNAL_MODERATOR",
//   PROGRAMME_DIRECTOR: "PROGRAMME_DIRECTOR",
//   MODULE_ASSESSMENT_LEAD: "MODULE_ASSESSMENT_LEAD",
// };

// export default function ManageModule() {
//   const params = useParams();
//   const [moduleData, setModuleData] = useState(null);
//   const [assessments, setAssessments] = useState([]);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [isAssessmentLead, setIsAssessmentLead] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [changedRoles, setChangedRoles] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const moduleId = params.id;
//         const [moduleResponse, assessmentsResponse, isLeadResponse] = await Promise.all([
//           axiosInstance.get(`/api/v1/modules/${moduleId}`),
//           axiosInstance.get(`/api/v1/modules/${moduleId}/assessments/user`),
//           axiosInstance.get(`/api/v1/modules/${moduleId}/is-assessment-lead`)
//         ]);
        
//         setModuleData(moduleResponse.data);
//         setAssessments(assessmentsResponse.data);
//         setIsAssessmentLead(isLeadResponse.data);

//         if (!isLeadResponse.data) {
//           setError('You do not have permission to manage this module.');
//         }
//       } catch (err) {
//         setError('Failed to fetch data: ' + err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [params.id]);

//   const handleRoleChange = (assessmentId, participantId, role) => {
//     setChangedRoles(prevChangedRoles => {
//       const key = `${assessmentId}-${participantId}`;
//       const currentRoles = prevChangedRoles[key] || 
//         assessments.find(a => a.id === assessmentId)
//           .participants.find(p => p.userId === participantId).roles;
      
//       const newRoles = new Set(currentRoles);
//       if (newRoles.has(role)) {
//         newRoles.delete(role);
//       } else {
//         newRoles.add(role);
//       }
      
//       return { ...prevChangedRoles, [key]: Array.from(newRoles) };
//     });
//   };

//   const saveChanges = async (assessmentId) => {
//     const assessment = assessments.find(a => a.id === assessmentId);
//     let hasAssessmentLead = false;

//     for (const participant of assessment.participants) {
//       const key = `${assessmentId}-${participant.userId}`;
//       const roles = changedRoles[key] || participant.roles;
      
//       if (roles.includes(AssessmentRoles.MODULE_ASSESSMENT_LEAD)) {
//         hasAssessmentLead = true;
//       }

//       try {
//         await axiosInstance.put(`/api/v1/modules/${moduleData.id}/assessments/${assessmentId}/participants/${participant.userId}`, roles);
//       } catch (err) {
//         setError(`Failed to update roles for ${participant.firstName} ${participant.lastName}: ${err.message}`);
//         return;
//       }
//     }

//     if (!hasAssessmentLead) {
//       setError('Each assessment must have at least one Module Assessment Lead.');
//       return;
//     }

//     // Clear changed roles for this assessment
//     setChangedRoles(prevChangedRoles => {
//       const newChangedRoles = { ...prevChangedRoles };
//       Object.keys(newChangedRoles).forEach(key => {
//         if (key.startsWith(`${assessmentId}-`)) {
//           delete newChangedRoles[key];
//         }
//       });
//       return newChangedRoles;
//     });

//     setSuccess('Roles updated successfully');
//   };

//   const deleteAssessment = async (assessmentId) => {
//     if (window.confirm('Are you sure you want to delete this assessment?')) {
//       try {
//         await axiosInstance.delete(`/api/v1/modules/${moduleData.id}/assessments/${assessmentId}`);
//         setAssessments(assessments.filter(a => a.id !== assessmentId));
//         setSuccess('Assessment deleted successfully');
//       } catch (err) {
//         setError('Failed to delete assessment: ' + err.message);
//       }
//     }
//   };

//   const deleteParticipant = async (assessmentId, participantId) => {
//     if (window.confirm('Are you sure you want to remove this participant?')) {
//       try {
//         await axiosInstance.delete(`/api/v1/modules/${moduleData.id}/assessments/${assessmentId}/participants/${participantId}`);
//         setAssessments(assessments.map(a => {
//           if (a.id === assessmentId) {
//             return {
//               ...a,
//               participants: a.participants.filter(p => p.userId !== participantId)
//             };
//           }
//           return a;
//         }));
//         setSuccess('Participant removed successfully');
//       } catch (err) {
//         setError('Failed to remove participant: ' + err.message);
//       }
//     }
//   };

//   if (isLoading) return <Container><Row><Col><p>Loading...</p></Col></Row></Container>;
//   if (!isAssessmentLead) return <Container><Row><Col><Alert variant="danger">{error || 'You do not have permission to view this page.'}</Alert></Col></Row></Container>;
//   if (!moduleData) return <Container><Row><Col><Alert variant="danger">{error || 'Failed to load module data.'}</Alert></Col></Row></Container>;

//   return (
//     <Container className="manage-module-container">
//       <Row>
//         <Col>
//           <h1>Manage Module: {moduleData.name}</h1>
//           {error && <Alert variant="danger">{error}</Alert>}
//           {success && <Alert variant="success">{success}</Alert>}
//           <Card className="mb-3">
//             <Card.Body>
//               <Card.Title>Module Details</Card.Title>
//               <p><strong>Module Name:</strong> {moduleData.name}</p>
//               <p><strong>Module Code:</strong> {moduleData.moduleCode}</p>
//               <p><strong>Credits:</strong> {moduleData.credits}</p>
//               <p><strong>Level:</strong> {moduleData.level}</p>
//               <p><strong>Module Leader:</strong> {moduleData.moduleLeader}</p>
//               <p><strong>Module Outcomes:</strong> {moduleData.moduleOutcomes}</p>
//             </Card.Body>
//           </Card>
          
//           <Card className="mb-3">
//             <Card.Body>
//               <Card.Title>Assessments</Card.Title>
//               {assessments.map((assessment) => (
//                 <Card key={assessment.id} className="mb-3">
//                   <Card.Body>
//                     <h4>{assessment.title}</h4>
//                     <p><strong>Category:</strong> {assessment.assessmentCategory}</p>
//                     <p><strong>Weighting:</strong> {assessment.assessmentWeighting}%</p>
//                     <p><strong>Planned Issue Date:</strong> {assessment.plannedIssueDate}</p>
//                     <p><strong>Coursework Submission Date:</strong> {assessment.courseworkSubmissionDate}</p>
//                     <p><strong>Skills:</strong> {assessment.skills}</p>
                    
//                     <Card className="mb-3">
//                       <Card.Body>
//                         <Card.Title>Participants</Card.Title>
//                         {assessment.participants.map((participant) => (
//                           <Card key={participant.userId} className="mb-3">
//                             <Card.Body>
//                               <p><strong>Name:</strong> {participant.firstName} {participant.lastName}</p>
//                               <p><strong>Roles:</strong></p>
//                               {Object.entries(AssessmentRoles).map(([key, value]) => (
//                                 <Form.Check
//                                   key={key}
//                                   type="checkbox"
//                                   label={key}
//                                   checked={changedRoles[`${assessment.id}-${participant.userId}`]
//                                     ? changedRoles[`${assessment.id}-${participant.userId}`].includes(value)
//                                     : participant.roles.includes(value)}
//                                   onChange={() => handleRoleChange(assessment.id, participant.userId, value)}
//                                 />
//                               ))}
//                               <Button variant="danger" onClick={() => deleteParticipant(assessment.id, participant.userId)}>
//                                 Remove Participant
//                               </Button>
//                             </Card.Body>
//                           </Card>
//                         ))}
//                       </Card.Body>
//                     </Card>
//                     <Button variant="primary" onClick={() => saveChanges(assessment.id)}>Save Changes</Button>
//                     <Button variant="danger" className="ml-2" onClick={() => deleteAssessment(assessment.id)}>Delete Assessment</Button>
//                   </Card.Body>
//                 </Card>
//               ))}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import axiosInstance from '@/utils/axios';
// import { Button, Form, Alert, Container, Row, Col, Card } from 'react-bootstrap';
// import Select from 'react-select';

// const AssessmentRoles = {
//   EXTERNAL_EXAMINER: "EXTERNAL_EXAMINER",
//   INTERNAL_MODERATOR: "INTERNAL_MODERATOR",
//   PROGRAMME_DIRECTOR: "PROGRAMME_DIRECTOR",
//   MODULE_ASSESSMENT_LEAD: "MODULE_ASSESSMENT_LEAD",
// };

// export default function ManageModule() {
//   const params = useParams();
//   const [moduleData, setModuleData] = useState(null);
//   const [assessments, setAssessments] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [isAssessmentLead, setIsAssessmentLead] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const moduleId = params.id;
//         const [moduleResponse, assessmentsResponse, isLeadResponse, usersResponse] = await Promise.all([
//           axiosInstance.get(`/api/v1/modules/${moduleId}`),
//           axiosInstance.get(`/api/v1/modules/${moduleId}/assessments/user`),
//           axiosInstance.get(`/api/v1/modules/${moduleId}/is-assessment-lead`),
//           axiosInstance.get('/api/v1/users/all')
//         ]);
        
//         setModuleData(moduleResponse.data);
//         setAssessments(assessmentsResponse.data);
//         setIsAssessmentLead(isLeadResponse.data);
//         setUsers(usersResponse.data);

//         if (!isLeadResponse.data) {
//           setError('You do not have permission to manage this module.');
//         }
//       } catch (err) {
//         setError('Failed to fetch data: ' + err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [params.id]);

//   const handleModuleChange = (e) => {
//     setModuleData({ ...moduleData, [e.target.name]: e.target.value });
//   };

//   const handleAssessmentChange = (assessmentIndex, field, value) => {
//     const newAssessments = [...assessments];
//     newAssessments[assessmentIndex] = {
//       ...newAssessments[assessmentIndex],
//       [field]: value
//     };
//     setAssessments(newAssessments);
//   };

//   const handleParticipantChange = (assessmentIndex, participantIndex, field, value) => {
//     const newAssessments = [...assessments];
//     const newParticipants = [...newAssessments[assessmentIndex].participants];
//     newParticipants[participantIndex] = {
//       ...newParticipants[participantIndex],
//       [field]: value
//     };
//     newAssessments[assessmentIndex] = {
//       ...newAssessments[assessmentIndex],
//       participants: newParticipants
//     };
//     setAssessments(newAssessments);
//   };

//   const handleRoleChange = async (assessmentIndex, participantIndex, role) => {
//     const assessment = assessments[assessmentIndex];
//     const participant = assessment.participants[participantIndex];
//     const newRoles = new Set(participant.roles);
//     if (newRoles.has(role)) {
//       newRoles.delete(role);
//     } else {
//       newRoles.add(role);
//     }
    
//     try {
//       await axiosInstance.put(`/api/v1/modules/${moduleData.id}/assessments/${assessment.id}/participants/${participant.id}`, Array.from(newRoles));
      
//       const newAssessments = [...assessments];
//       newAssessments[assessmentIndex].participants[participantIndex].roles = Array.from(newRoles);
//       setAssessments(newAssessments);
//       setSuccess('Participant roles updated successfully');
//     } catch (err) {
//       setError('Failed to update participant roles: ' + err.message);
//     }
//   };

//   const addParticipant = (assessmentIndex) => {
//     const newAssessments = [...assessments];
//     newAssessments[assessmentIndex].participants.push({ email: '', roles: [] });
//     setAssessments(newAssessments);
//   };

//   const removeParticipant = async (assessmentIndex, participantIndex) => {
//     const assessment = assessments[assessmentIndex];
//     const participant = assessment.participants[participantIndex];
    
//     try {
//       await axiosInstance.delete(`/api/v1/modules/${moduleData.id}/assessments/${assessment.id}/participants/${participant.id}`);
      
//       const newAssessments = [...assessments];
//       newAssessments[assessmentIndex].participants.splice(participantIndex, 1);
//       setAssessments(newAssessments);
//       setSuccess('Participant removed successfully');
//     } catch (err) {
//       setError('Failed to remove participant: ' + err.message);
//     }
//   };

//   const addAssessment = () => {
//     const newAssessment = {
//       assessmentCategory: '',
//       title: '',
//       assessmentWeighting: 0,
//       plannedIssueDate: '',
//       courseworkSubmissionDate: '',
//       skills: '',
//       participants: []
//     };
//     setAssessments([...assessments, newAssessment]);
//   };

//   const removeAssessment = async (assessmentIndex) => {
//     const assessment = assessments[assessmentIndex];
    
//     try {
//       await axiosInstance.delete(`/api/v1/modules/${moduleData.id}/assessments/${assessment.id}`);
      
//       const newAssessments = assessments.filter((_, i) => i !== assessmentIndex);
//       setAssessments(newAssessments);
//       setSuccess('Assessment removed successfully');
//     } catch (err) {
//       setError('Failed to remove assessment: ' + err.message);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const updatedModule = { ...moduleData, assessments };
//       await axiosInstance.put(`/api/v1/modules/${moduleData.id}`, updatedModule);
//       setSuccess('Module updated successfully');
//     } catch (err) {
//       setError('Failed to update module: ' + err.message);
//     }
//   };

//   const deleteModule = async () => {
//     if (window.confirm('Are you sure you want to delete this module?')) {
//       try {
//         await axiosInstance.delete(`/api/v1/modules/${moduleData.id}`);
//         window.location.href = '/dashboard';
//       } catch (err) {
//         setError('Failed to delete module: ' + err.message);
//       }
//     }
//   };

//   if (isLoading) return <Container><Row><Col><p>Loading...</p></Col></Row></Container>;
//   if (!isAssessmentLead) return <Container><Row><Col><Alert variant="danger">{error || 'You do not have permission to view this page.'}</Alert></Col></Row></Container>;
//   if (!moduleData) return <Container><Row><Col><Alert variant="danger">{error || 'Failed to load module data.'}</Alert></Col></Row></Container>;

//   return (
//     <Container className="manage-module-container">
//       <Row>
//         <Col>
//           <h1>Manage Module: {moduleData.name}</h1>
//           {error && <Alert variant="danger">{error}</Alert>}
//           {success && <Alert variant="success">{success}</Alert>}
//           <Form onSubmit={handleSubmit}>
//             <Card className="mb-3">
//               <Card.Body>
//                 <Card.Title>Module Details</Card.Title>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Module Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="name"
//                     value={moduleData.name}
//                     onChange={handleModuleChange}
//                     required
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Module Code</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="moduleCode"
//                     value={moduleData.moduleCode}
//                     onChange={handleModuleChange}
//                     required
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Credits</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="credits"
//                     value={moduleData.credits}
//                     onChange={handleModuleChange}
//                     required
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Level</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="level"
//                     value={moduleData.level}
//                     onChange={handleModuleChange}
//                     required
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Module Leader</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="moduleLeader"
//                     value={moduleData.moduleLeader}
//                     onChange={handleModuleChange}
//                     required
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Module Outcomes</Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={3}
//                     name="moduleOutcomes"
//                     value={moduleData.moduleOutcomes}
//                     onChange={handleModuleChange}
//                     required
//                   />
//                 </Form.Group>
//               </Card.Body>
//             </Card>
            
//             <Card className="mb-3">
//               <Card.Body>
//                 <Card.Title>Assessments</Card.Title>
//                 {assessments.map((assessment, assessmentIndex) => (
//                   <Card key={assessmentIndex} className="mb-3">
//                     <Card.Body>
//                       <Form.Group className="mb-3">
//                         <Form.Label>Assessment Category</Form.Label>
//                         <Form.Control
//                           type="text"
//                           value={assessment.assessmentCategory}
//                           onChange={(e) => handleAssessmentChange(assessmentIndex, 'assessmentCategory', e.target.value)}
//                           required
//                         />
//                       </Form.Group>
//                       <Form.Group className="mb-3">
//                         <Form.Label>Title</Form.Label>
//                         <Form.Control
//                           type="text"
//                           value={assessment.title}
//                           onChange={(e) => handleAssessmentChange(assessmentIndex, 'title', e.target.value)}
//                           required
//                         />
//                       </Form.Group>
//                       <Form.Group className="mb-3">
//                         <Form.Label>Assessment Weighting</Form.Label>
//                         <Form.Control
//                           type="number"
//                           value={assessment.assessmentWeighting}
//                           onChange={(e) => handleAssessmentChange(assessmentIndex, 'assessmentWeighting', e.target.value)}
//                           required
//                         />
//                       </Form.Group>
//                       <Form.Group className="mb-3">
//                         <Form.Label>Planned Issue Date</Form.Label>
//                         <Form.Control
//                           type="date"
//                           value={assessment.plannedIssueDate}
//                           onChange={(e) => handleAssessmentChange(assessmentIndex, 'plannedIssueDate', e.target.value)}
//                           required
//                         />
//                       </Form.Group>
//                       <Form.Group className="mb-3">
//                         <Form.Label>Coursework Submission Date</Form.Label>
//                         <Form.Control
//                           type="date"
//                           value={assessment.courseworkSubmissionDate}
//                           onChange={(e) => handleAssessmentChange(assessmentIndex, 'courseworkSubmissionDate', e.target.value)}
//                           required
//                         />
//                       </Form.Group>
//                       <Form.Group className="mb-3">
//                         <Form.Label>Skills</Form.Label>
//                         <Form.Control
//                           as="textarea"
//                           rows={3}
//                           value={assessment.skills}
//                           onChange={(e) => handleAssessmentChange(assessmentIndex, 'skills', e.target.value)}
//                           required
//                         />
//                       </Form.Group>
                      
//                       <Card className="mb-3">
//                         <Card.Body>
//                           <Card.Title>Participants</Card.Title>
//                           {assessment.participants.map((participant, participantIndex) => (
//                             <Card key={participantIndex} className="mb-3">
//                               <Card.Body>
//                                 <Select
//                                   value={{ value: participant.email, label: participant.email }}
//                                   onChange={(selectedOption) => handleParticipantChange(assessmentIndex, participantIndex, 'email', selectedOption.value)}
//                                   options={users.map(user => ({ value: user.email, label: user.email }))}
//                                 />
//                                 {Object.entries(AssessmentRoles).map(([key, value]) => (
//                                   <Form.Check
//                                     key={key}
//                                     type="checkbox"
//                                     label={key}
//                                     checked={participant.roles.includes(value)}
//                                     onChange={() => handleRoleChange(assessmentIndex, participantIndex, value)}
//                                   />
//                                 ))}
//                                 <Button variant="danger" onClick={() => removeParticipant(assessmentIndex, participantIndex)}>
//                                   Remove Participant
//                                 </Button>
//                               </Card.Body>
//                             </Card>
//                           ))}
//                           <Button onClick={() => addParticipant(assessmentIndex)}>Add Participant</Button>
//                         </Card.Body>
//                       </Card>
//                       <Button variant="danger" onClick={() => removeAssessment(assessmentIndex)}>Remove Assessment</Button>
//                     </Card.Body>
//                   </Card>
//                 ))}
//                 <Button onClick={addAssessment}>Add Assessment</Button>
//               </Card.Body>
//             </Card>
//             <Button type="submit" variant="primary" className="me-2">Save Changes</Button>
//             <Button variant="danger" onClick={deleteModule}>Delete Module</Button>
//           </Form>
//         </Col>
//       </Row>
//     </Container>
//   );
// }





// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axiosInstance from '@/utils/axios';

// export default function ManageModules() {
//   const [modules, setModules] = useState([]);
//   const [error, setError] = useState('');
//   const router = useRouter();

//   useEffect(() => {
//     const fetchModules = async () => {
//       try {
//         const response = await axiosInstance.get('api/v1/modules', { withCredentials: true });
//         setModules(response.data);
//       } catch (err) {
//         setError(`Failed to fetch modules: ${err.message}`);
//       }
//     };

//     fetchModules();
//   }, []);

//   const handleModuleClick = (moduleId) => {
//     router.push(`/modules/${moduleId}`);
//   };

//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="manage-modules-container">
//       <h1>Manage Modules</h1>
//       <div className="modules-list">
//         {modules.map(module => (
//           <div key={module.id} className="module-item" onClick={() => handleModuleClick(module.id)}>
//             <h3>{module.name}</h3>
//             <p>Code: {module.code}</p>
//             <p>Status: {module.status}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }