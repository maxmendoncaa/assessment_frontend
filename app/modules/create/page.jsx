'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axios';

const AssessmentRoles = {
  EXTERNAL_EXAMINER: 'EXTERNAL_EXAMINER',
  INTERNAL_MODERATOR: 'INTERNAL_MODERATOR',
  PROGRAMME_DIRECTOR: 'PROGRAMME_DIRECTOR',
  MODULE_ASSESSMENT_LEAD: 'MODULE_ASSESSMENT_LEAD'
};

export default function CreateModule() {
  const [moduleData, setModuleData] = useState({
    name: '',
    code: '',
    credits: '',
    level: '',
    moduleOutcomes: '',
    skills: ''
  });
  const [assessments, setAssessments] = useState([]);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('api/v1/users/all');
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setModuleData({ ...moduleData, [e.target.name]: e.target.value });
  };

  const addAssessment = () => {
    setAssessments([...assessments, { 
      assessmentCategory: '',
      title: '',
      assessmentWeighting: 0,
      plannedIssueDate: '',
      courseworkSubmissionDate: '',
      participants: Object.values(AssessmentRoles).map(role => ({ role, users: [] }))
    }]);
  };
  
  const removeAssessment = (index) => {
    setAssessments(assessments.filter((_, i) => i !== index));
  };

  const addParticipant = (assessmentIndex, roleIndex) => {
    const newAssessments = [...assessments];
    newAssessments[assessmentIndex].participants[roleIndex].users.push({ email: '', userId: null });
    setAssessments(newAssessments);
  };

  const removeParticipant = (assessmentIndex, roleIndex, userIndex) => {
    const newAssessments = [...assessments];
    newAssessments[assessmentIndex].participants[roleIndex].users.splice(userIndex, 1);
    setAssessments(newAssessments);
  };

  // const handleParticipantChange = (assessmentIndex, roleIndex, userIndex, id) => {
  //   const newAssessments = [...assessments];
  //   const user = users.find(u => u.id === id);
  //   newAssessments[assessmentIndex].participants[roleIndex].users[userIndex] = {
  //     id,
  //     userId: user ? user.id : null
  //   };
  //   setAssessments(newAssessments);
  // };
  const handleParticipantChange = (assessmentIndex, roleIndex, userIndex, email) => {
    const newAssessments = [...assessments];
    const user = users.find(u => u.email === email); // Match by email
    newAssessments[assessmentIndex].participants[roleIndex].users[userIndex] = {
      email,
      userId: user ? user.userId : null // Assign userId if found, otherwise null
     
    };
    console.log("GGG",user)
    setAssessments(newAssessments);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!moduleData.name || !moduleData.code || !moduleData.credits || !moduleData.level) {
      setError('All required fields must be filled');
      return;
    }
  
    if (assessments.length === 0) {
      setError('At least one assessment must be added');
      return;
    }
  
    // for (let assessment of assessments) {
    //   if (!assessment.assessmentCategory || !assessment.title || !assessment.assessmentWeighting || 
    //       !assessment.plannedIssueDate || !assessment.courseworkSubmissionDate) {
    //     setError('All assessment fields must be filled');
    //     return;
    //   }

    //   for (let participant of assessment.participants) {
    //     if (participant.users.length === 0 || participant.users.some(user => !user.userId)) {
    //       setError(`Each role must have at least one valid user for all assessments`);
    //       return;
    //     }
    //   }
    // }
  
    try {
      const response = await axiosInstance.post('api/v1/modules/create', {
        moduleName: moduleData.name,
        moduleCode: moduleData.code,
        credits: parseInt(moduleData.credits),
        level: parseInt(moduleData.level),
        moduleOutcomes: moduleData.moduleOutcomes,
        skills: moduleData.skills,
        assessments: assessments.map(assessment => ({
          assessmentCategory: assessment.assessmentCategory,
          title: assessment.title,
          assessmentWeighting: parseInt(assessment.assessmentWeighting),
          plannedIssueDate: assessment.plannedIssueDate,
          courseworkSubmissionDate: assessment.courseworkSubmissionDate,
          participants: assessment.participants.flatMap(participant => 
            participant.users.map(user => ({
              userId: user.userId,
              role: participant.role
            }))
          )
        }))
      }, { withCredentials: true });
  
      router.push('/dashboard');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data);
      } else {
        setError(`Failed to create module: ${err.message}`);
      }
    }
  };

  return (
    <div className="create-module-container">
      <h1>Create New Module</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Module Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={moduleData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="code">Module Code:</label>
          <input
            type="text"
            id="code"
            name="code"
            value={moduleData.code}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="credits">Credits:</label>
          <input
            type="number"
            id="credits"
            name="credits"
            value={moduleData.credits}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="level">Level:</label>
          <input
            type="number"
            id="level"
            name="level"
            value={moduleData.level}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="moduleOutcomes">Module Outcomes:</label>
          <textarea
            id="moduleOutcomes"
            name="moduleOutcomes"
            value={moduleData.moduleOutcomes}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="skills">Skills:</label>
          <textarea
            id="skills"
            name="skills"
            value={moduleData.skills}
            onChange={handleChange}
            required
          />
        </div>
        
        <h3>Assessments</h3>
        {assessments.map((assessment, assessmentIndex) => (
          <div key={assessmentIndex}>
            <input
              type="text"
              value={assessment.assessmentCategory}
              onChange={(e) => {
                const newAssessments = [...assessments];
                newAssessments[assessmentIndex].assessmentCategory = e.target.value;
                setAssessments(newAssessments);
              }}
              placeholder="Assessment Category"
              required
            />
            <input
              type="text"
              value={assessment.title}
              onChange={(e) => {
                const newAssessments = [...assessments];
                newAssessments[assessmentIndex].title = e.target.value;
                setAssessments(newAssessments);
              }}
              placeholder="Title"
              required
            />
            <input
              type="number"
              value={assessment.assessmentWeighting}
              onChange={(e) => {
                const newAssessments = [...assessments];
                newAssessments[assessmentIndex].assessmentWeighting = e.target.value;
                setAssessments(newAssessments);
              }}
              placeholder="Assessment Weighting"
              required
            />
            <input
              type="date"
              value={assessment.plannedIssueDate}
              onChange={(e) => {
                const newAssessments = [...assessments];
                newAssessments[assessmentIndex].plannedIssueDate = e.target.value;
                setAssessments(newAssessments);
              }}
              placeholder="Planned Issue Date"
              required
            />
            <input
              type="date"
              value={assessment.courseworkSubmissionDate}
              onChange={(e) => {
                const newAssessments = [...assessments];
                newAssessments[assessmentIndex].courseworkSubmissionDate = e.target.value;
                setAssessments(newAssessments);
              }}
              placeholder="Coursework Submission Date"
              required
            />
            
            <h4>Participants</h4>
            {assessment.participants.map((participant, roleIndex) => (
              <div key={roleIndex}>
                <h5>{participant.role}</h5>
                {participant.users.map((user, userIndex) => (
                  <div key={userIndex}>
                    <input
                      value={user.email}
                      onChange={(e) => handleParticipantChange(assessmentIndex, roleIndex, userIndex, e.target.value)}
                      placeholder={`${participant.role} Email`}
                      list={`users-${assessmentIndex}-${roleIndex}-${userIndex}`}
                      required
                    />
                    <datalist id={`users-${assessmentIndex}-${roleIndex}-${userIndex}`}>
                      {users.map((u) => (
                        <option key={u.id} value={u.email} >{u.email}</option>
                      ))}
                    </datalist>
                    <button type="button" onClick={() => removeParticipant(assessmentIndex, roleIndex, userIndex)}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addParticipant(assessmentIndex, roleIndex)}>
                  Add {participant.role}
                </button>
              </div>
            ))}
            <button type="button" onClick={() => removeAssessment(assessmentIndex)}>Remove Assessment</button>
          </div>
        ))}
        <button type="button" onClick={addAssessment}>Add Assessment</button>
        <button type="submit">Create Module</button>
      </form>
    </div>
  );
}