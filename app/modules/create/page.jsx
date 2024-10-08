"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axios";
import { Form } from "react-bootstrap";

const AssessmentRoles = {
  EXTERNAL_EXAMINER: "EXTERNAL_EXAMINER",
  INTERNAL_MODERATOR: "INTERNAL_MODERATOR",
  PROGRAMME_DIRECTOR: "PROGRAMME_DIRECTOR",
  MODULE_ASSESSMENT_LEAD: "MODULE_ASSESSMENT_LEAD",
};

export default function CreateModule() {
  const [moduleData, setModuleData] = useState({
    name: "",
    code: "",
    credits: "",
    level: "",
    moduleOutcomes: `1.(LOI) e.g., "Critically reflect on and assess key conceptual and theoretical
values and principles relating too."
2.(L02)e.g., "Assess and evaluate a given context of current issues and propose
mitigating solutions to...."
3.(L03) e.g., "Develop a critical awareness of approaches to..."
4.(L04) e.g., "Exhibit practical skills in the application and communication"`,

    moduleLeader: "",
  });
  const [assessments, setAssessments] = useState([]);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("api/v1/users/all");
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setModuleData({ ...moduleData, [e.target.name]: e.target.value });
  };

  const updateModuleLeader = (assessments) => {
    const assessmentLeads = assessments
      .flatMap((assessment) =>
        assessment.participants.filter((participant) =>
          participant.roles.includes(AssessmentRoles.MODULE_ASSESSMENT_LEAD)
        )
      )
      .map((participant) => {
        const user = users.find((u) => u.userId === participant.userId);
        return user ? `${user.firstName} ${user.lastName}` : "";
      })
      .filter((name, index, self) => name && self.indexOf(name) === index); // Remove duplicates and empty names

    setModuleData((prevData) => ({
      ...prevData,
      moduleLeader: assessmentLeads.join(", "),
    }));
  };

  const addAssessment = () => {
    const newAssessment = {
      assessmentCategory: "",
      title: "",
      assessmentWeighting: 0,
      plannedIssueDate: "",
      courseworkSubmissionDate: "",
      skills: "",
      participants: [],
    };
    setAssessments([...assessments, newAssessment]);
  };

  const removeAssessment = (index) => {
    const newAssessments = assessments.filter((_, i) => i !== index);
    setAssessments(newAssessments);
    updateModuleLeader(newAssessments);
  };

  const addParticipant = (assessmentIndex) => {
    const newAssessments = [...assessments];
    newAssessments[assessmentIndex].participants.push({
      userId: null,
      roles: [],
      email: "",
    });
    setAssessments(newAssessments);
  };

  const removeParticipant = (assessmentIndex, participantIndex) => {
    const newAssessments = [...assessments];
    newAssessments[assessmentIndex].participants.splice(participantIndex, 1);
    setAssessments(newAssessments);
    updateModuleLeader(newAssessments);
  };

  const handleParticipantChange = (
    assessmentIndex,
    participantIndex,
    email
  ) => {
    const newAssessments = [...assessments];
    const user = users.find((u) => u.email === email);
    newAssessments[assessmentIndex].participants[participantIndex] = {
      ...newAssessments[assessmentIndex].participants[participantIndex],
      userId: user ? user.userId : null,
      email: email,
      roles: [], // Initialize with an empty array of roles
    };
    setAssessments(newAssessments);
    updateModuleLeader(newAssessments);
  };

  const handleRoleChange = (assessmentIndex, participantIndex, role) => {
    const newAssessments = [...assessments];
    const participant =
      newAssessments[assessmentIndex].participants[participantIndex];

    const roleIndex = participant.roles.indexOf(role);
    if (roleIndex > -1) {
      participant.roles.splice(roleIndex, 1);
    } else {
      if (role === AssessmentRoles.PROGRAMME_DIRECTOR) {
        const isProgrammeDirectorAssigned = newAssessments[
          assessmentIndex
        ].participants.some(
          (p, idx) =>
            idx !== participantIndex &&
            p.roles.includes(AssessmentRoles.PROGRAMME_DIRECTOR)
        );
        if (isProgrammeDirectorAssigned) {
          setError(
            "Programme Director role can only be assigned to one participant per assessment."
          );
          return;
        }
      }
      participant.roles.push(role);
    }

    setAssessments(newAssessments);
    updateModuleLeader(newAssessments);
    setError("");
  };

  const handleAssessmentChange = (assessmentIndex, field, value) => {
    const newAssessments = [...assessments];
    newAssessments[assessmentIndex][field] = value;
    setAssessments(newAssessments);
  };

  const validateAssessments = () => {
    for (let i = 0; i < assessments.length; i++) {
      const assessment = assessments[i];
      const usedRoles = new Set();
      let programmeDirectorCount = 0;
      let assessmentLeadCount = 0;
      let internalModeratorCount = 0;

      for (const participant of assessment.participants) {
        participant.roles.forEach((role) => {
          usedRoles.add(role);
          if (role === AssessmentRoles.PROGRAMME_DIRECTOR) {
            programmeDirectorCount++;
          }
          if (role === AssessmentRoles.MODULE_ASSESSMENT_LEAD) {
            assessmentLeadCount++;
          }
          if (role === AssessmentRoles.INTERNAL_MODERATOR) {
            internalModeratorCount++;
          }
        });
      }

      const requiredRoles = [
        AssessmentRoles.MODULE_ASSESSMENT_LEAD,
        AssessmentRoles.INTERNAL_MODERATOR,
        AssessmentRoles.PROGRAMME_DIRECTOR,
      ];

      const missingRoles = requiredRoles.filter((role) => !usedRoles.has(role));

      if (missingRoles.length > 0) {
        setError(
          `Assessment ${
            i + 1
          }: The following roles must be assigned: ${missingRoles.join(", ")}`
        );
        return false;
      }

      if (programmeDirectorCount > 1) {
        setError(
          `Assessment ${
            i + 1
          }: Programme Director role can only be assigned to one participant.`
        );
        return false;
      }

      if (assessmentLeadCount === 0) {
        setError(
          `Assessment ${
            i + 1
          }: At least one Module Assessment Lead must be assigned.`
        );
        return false;
      }

      if (internalModeratorCount === 0) {
        setError(
          `Assessment ${i + 1}: An Internal Moderator must be assigned.`
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !moduleData.name ||
      !moduleData.code ||
      !moduleData.credits ||
      !moduleData.level ||
      !moduleData.moduleLeader
    ) {
      setError(
        "All required fields must be filled, including the Module Leader"
      );
      return;
    }

    if (assessments.length === 0) {
      setError("At least one assessment must be added");
      return;
    }

    if (!validateAssessments()) {
      return;
    }

    try {
      const response = await axiosInstance.post(
        "api/v1/modules/create",
        {
          moduleName: moduleData.name,
          moduleCode: moduleData.code,
          credits: parseInt(moduleData.credits),
          level: parseInt(moduleData.level),
          moduleOutcomes: moduleData.moduleOutcomes,
          skills: moduleData.skills,
          moduleLeader: moduleData.moduleLeader,
          assessments: assessments.map((assessment) => ({
            assessmentCategory: assessment.assessmentCategory,
            title: assessment.title,
            assessmentWeighting: parseInt(assessment.assessmentWeighting),
            plannedIssueDate: assessment.plannedIssueDate,
            courseworkSubmissionDate: assessment.courseworkSubmissionDate,
            skills: assessment.skills,
            participants: assessment.participants.map((participant) => ({
              userId: participant.userId,
              roles: participant.roles,
            })),
          })),
        },
        { withCredentials: true }
      );

      router.push("/dashboard");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data);
      } else {
        setError(`Failed to create module: ${err.message}`);
      }
    }
  };
  return (
    <div style={{ textAlign: "center" }} className="create-module-container">
      <h1>Create New Module</h1>
      {error && <p className="error">{error}</p>}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          textAlign: "left",
        }}
      >
        <Form onSubmit={handleSubmit}>
          {/* Module Name */}
          <Form.Group className="mb-3">
            <Form.Label htmlFor="name">Module Name:</Form.Label>
            <Form.Control
              type="text"
              id="name"
              name="name"
              value={moduleData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Module Code */}
          <Form.Group className="mb-3">
            <Form.Label htmlFor="code">Module Code:</Form.Label>
            <Form.Control
              type="text"
              id="code"
              name="code"
              value={moduleData.code}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Credits */}
          <Form.Group className="mb-3">
            <Form.Label htmlFor="credits">Credits:</Form.Label>
            <Form.Select
              id="credits"
              name="credits"
              value={moduleData.credits}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Choose an item
              </option>
              {[...Array(100).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Level */}
          <Form.Group className="mb-3">
            <Form.Label htmlFor="level">Level:</Form.Label>
            <Form.Select
              id="level"
              name="level"
              value={moduleData.level}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Choose an item
              </option>
              {[...Array(10).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Module Leader */}
          <Form.Group className="mb-3">
            <Form.Label htmlFor="moduleLeader">Module Leader(s):</Form.Label>
            <Form.Control
              type="text"
              id="moduleLeader"
              name="moduleLeader"
              value={moduleData.moduleLeader}
              readOnly
            />
          </Form.Group>

          {/* Module Outcomes */}
          <Form.Group className="mb-3">
            <Form.Label htmlFor="moduleOutcomes">Module Outcomes:</Form.Label>
            <Form.Control
              id="moduleOutcomes"
              as="textarea"
              name="moduleOutcomes"
              value={moduleData.moduleOutcomes}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Skills or Knowledge */}
          {/* <Form.Group>
          <Form.Label htmlFor="skills">
            MLOs and/or Knowledge, Skills, & Behaviours(KSBs) covered by this assessment:
          </Form.Label>
          <Form.Control
            id="skills"
            as="textarea"
            name="skills"
            value={moduleData.skills}
            placeholder="e.g LO1, LO3, and LO4"
            onChange={handleChange}
            required
          />
          </Form.Group> */}

          {/* Assessments */}
          <h3>Assessments</h3>
          {assessments.map((assessment, assessmentIndex) => (
            <div key={assessmentIndex} className="assessment-container">
              {/* Assessment Category */}
              <Form.Group>
              <Form.Label htmlFor={`assessmentCategory-${assessmentIndex}`}>
                Assessment Category
              </Form.Label>
              <Form.Control
                type="text"
                id={`assessmentCategory-${assessmentIndex}`}
                value={assessment.assessmentCategory}
                onChange={(e) =>
                  handleAssessmentChange(
                    assessmentIndex,
                    "assessmentCategory",
                    e.target.value
                  )
                }
                placeholder="Assessment Category"
                required
              />
              </Form.Group>
              <br />

              {/* Title */}
              <Form.Label htmlFor={`title-${assessmentIndex}`}>
                Title
              </Form.Label>
              <Form.Control
                type="text"
                id={`title-${assessmentIndex}`}
                value={assessment.title}
                onChange={(e) =>
                  handleAssessmentChange(
                    assessmentIndex,
                    "title",
                    e.target.value
                  )
                }
                placeholder="Title"
                required
              />
              <br />

              {/* Assessment Weighting */}
              <Form.Label htmlFor={`assessmentWeighting-${assessmentIndex}`}>
                Assessment Weighting
              </Form.Label>
              <Form.Control
                type="number"
                id={`assessmentWeighting-${assessmentIndex}`}
                value={assessment.assessmentWeighting}
                onChange={(e) =>
                  handleAssessmentChange(
                    assessmentIndex,
                    "assessmentWeighting",
                    e.target.value
                  )
                }
                placeholder="Assessment Weighting"
                min="1"
                max="100"
                required
              />
              <br />

              <Form.Group>
                <Form.Label htmlFor={`skills-${assessmentIndex}`}>
                  MLOs 
                  and/or Knowledge, Skills, & Behaviours(KSBs) covered by
                  this assessment:
                </Form.Label>
                <Form.Control
                  id={`skills-${assessmentIndex}`}
                  as="textarea"
                  name="skills"
                  value={assessment.skills}
                  placeholder="e.g LO1, LO3, and LO4"
                  onChange={(e) =>
                    handleAssessmentChange(
                      assessmentIndex,
                      "skills",
                      e.target.value
                    )
                  }
                  required
                />
              </Form.Group>

              {/* Planned Issue Date */}
              <Form.Label htmlFor={`plannedIssueDate-${assessmentIndex}`}>
                Planned Issue Date
              </Form.Label>
              <Form.Control
                type="date"
                id={`plannedIssueDate-${assessmentIndex}`}
                value={assessment.plannedIssueDate}
                onChange={(e) =>
                  handleAssessmentChange(
                    assessmentIndex,
                    "plannedIssueDate",
                    e.target.value
                  )
                }
                placeholder="Planned Issue Date"
                required
              />
              <br />

              {/* Coursework Submission Date */}
              <Form.Label
                htmlFor={`courseworkSubmissionDate-${assessmentIndex}`}
              >
                Coursework Submission Date
              </Form.Label>
              <Form.Control
                type="date"
                id={`courseworkSubmissionDate-${assessmentIndex}`}
                value={assessment.courseworkSubmissionDate}
                onChange={(e) =>
                  handleAssessmentChange(
                    assessmentIndex,
                    "courseworkSubmissionDate",
                    e.target.value
                  )
                }
                placeholder="Coursework Submission Date"
                required
              />
              <br />

              {/* Participants */}
              <h4>Participants</h4>
              {assessment.participants.map((participant, participantIndex) => (
                <Form.Group
                  key={participantIndex}
                  className="participant-container"
                >
                  <Form.Control
                    value={participant.email}
                    onChange={(e) =>
                      handleParticipantChange(
                        assessmentIndex,
                        participantIndex,
                        e.target.value
                      )
                    }
                    placeholder="Participant Email"
                    list={`users-${assessmentIndex}-${participantIndex}`}
                    required
                  />
                  <datalist id={`users-${assessmentIndex}-${participantIndex}`}>
                    {users.map((u) => (
                      <option key={u.userId} value={u.email}>
                        {u.email}
                      </option>
                    ))}
                  </datalist>
                  <Form.Group className="roles-container">
                    {Object.entries(AssessmentRoles).map(([key, value]) => (
                      <Form.Label key={key} className="role-checkbox">
                        <Form.Check
                          type="checkbox"
                          checked={participant.roles.includes(value)}
                          onChange={() =>
                            handleRoleChange(
                              assessmentIndex,
                              participantIndex,
                              value
                            )
                          }
                        />
                        {key}
                      </Form.Label>
                    ))}
                  </Form.Group>
                  <button
                    type="button"
                    onClick={() =>
                      removeParticipant(assessmentIndex, participantIndex)
                    }
                  >
                    Remove Participant
                  </button>
                </Form.Group>
              ))}
              <button
                type="button"
                onClick={() => addParticipant(assessmentIndex)}
              >
                Add Participant
              </button>
              <button
                type="button"
                onClick={() => removeAssessment(assessmentIndex)}
              >
                Remove Assessment
              </button>
            </div>
          ))}
          <button type="button" onClick={addAssessment}>
            Add Assessment
          </button>
          <button type="submit">Create Module</button>
        </Form>
      </div>
    </div>
  );
}
