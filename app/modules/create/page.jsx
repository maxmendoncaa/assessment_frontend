'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axios';

const AssessmentRoles = {
  MODERATOR: 'MODERATOR',
  EXTERNAL_EXAMINER: 'EXTERNAL_EXAMINER',
  INTERNAL_MODERATOR: 'INTERNAL_MODERATOR',
  PROGRAMME_DIRECTOR: 'PROGRAMME_DIRECTOR',
  MODULE_ASSESSMENT_LEAD: 'MODULE_ASSESSMENT_LEAD',
  MODULE_LEADER: 'MODULE_LEADER'
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
  const router = useRouter();

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
      participants: []
    }]);
  };
  
  const addParticipant = (assessmentIndex) => {
    const newAssessments = [...assessments];
    newAssessments[assessmentIndex].participants.push({ userId: '', role: '' });
    setAssessments(newAssessments);
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!moduleData.name || !moduleData.code || !moduleData.credits || !moduleData.level) {
  //     setError('All required fields must be filled');
  //     return;
  //   }
  //   try {
  //     const response = await axiosInstance.post('api/v1/modules/create', {
  //       moduleName: moduleData.name,
  //       moduleCode: moduleData.code,
  //       credits: parseInt(moduleData.credits),
  //       level: parseInt(moduleData.level),
  //       moduleOutcomes: moduleData.moduleOutcomes,
  //       skills: moduleData.skills
  //     }, { withCredentials: true });
  //     router.push('/dashboard');
  //   } catch (err) {
  //     if (err.response && err.response.status === 400) {
  //       setError(err.response.data);
  //     } else {
  //       setError(`Failed to create module: ${err.message}`);
  //     }
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!moduleData.name || !moduleData.code || !moduleData.credits || !moduleData.level) {
      setError('All required fields must be filled');
      return;
    }
  
    // Validate assessments
    if (assessments.length === 0) {
      setError('At least one assessment must be added');
      return;
    }
  
    for (let assessment of assessments) {
      if (!assessment.assessmentCategory || !assessment.title || !assessment.assessmentWeighting || 
          !assessment.plannedIssueDate || !assessment.courseworkSubmissionDate) {
        setError('All assessment fields must be filled');
        return;
      }
      if (assessment.participants.length === 0) {
        setError('Each assessment must have at least one participant');
        return;
      }
      for (let participant of assessment.participants) {
        if (!participant.userId || !participant.role) {
          setError('All participant fields must be filled');
          return;
        }
      }
    }
  
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
          participants: assessment.participants.map(participant => ({
            userId: parseInt(participant.userId),
            role: participant.role
          }))
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
        <button type="submit">Create Module</button>
      {/* </form> */}
      <h3>Assessments</h3>
        {assessments.map((assessment, index) => (
          <div key={index}>
            <input
              type="text"
              value={assessment.assessmentCategory}
              onChange={(e) => {
                const newAssessments = [...assessments];
                newAssessments[index].assessmentCategory = e.target.value;
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
                newAssessments[index].title = e.target.value;
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
                newAssessments[index].assessmentWeighting = e.target.value;
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
                newAssessments[index].plannedIssueDate = e.target.value;
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
                newAssessments[index].courseworkSubmissionDate = e.target.value;
                setAssessments(newAssessments);
              }}
              placeholder="Coursework Submission Date"
              required
            />
            
            <h4>Participants</h4>
            {assessment.participants.map((participant, pIndex) => (
              <div key={pIndex}>
                <input
                  type="text"
                  value={participant.userId}
                  onChange={(e) => {
                    const newAssessments = [...assessments];
                    newAssessments[index].participants[pIndex].userId = e.target.value;
                    setAssessments(newAssessments);
                  }}
                  placeholder="User ID"
                  required
                />
                <select
                  value={participant.role}
                  onChange={(e) => {
                    const newAssessments = [...assessments];
                    newAssessments[index].participants[pIndex].role = e.target.value;
                    setAssessments(newAssessments);
                  }}
                  required
                >
                  <option value="">Select a role</option>
                  {Object.values(AssessmentRoles).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            ))}
            <button type="button" onClick={() => addParticipant(index)}>Add Participant</button>
          </div>
        ))}
        <button type="button" onClick={addAssessment}>Add Assessment</button>

        <button type="submit">Create Module</button>
      </form>
    </div>
    
  );
}