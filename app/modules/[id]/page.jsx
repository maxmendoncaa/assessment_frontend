'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axiosInstance from '@/utils/axios';

export default function ModulePage() {
  const { id } = useParams();
  const [module, setModule] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [users, setUsers] = useState([]);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        const moduleResponse = await axiosInstance.get(`api/v1/modules/${id}`, { withCredentials: true });
        const assignmentsResponse = await axiosInstance.get(`api/v1/modules/${id}/assignments`, { withCredentials: true });
        const usersResponse = await axiosInstance.get('api/v1/users', { withCredentials: true });
        const roleResponse = await axiosInstance.get('api/v1/user/role', { withCredentials: true });

        setModule(moduleResponse.data);
        setAssignments(assignmentsResponse.data);
        setUsers(usersResponse.data);
        setUserRole(roleResponse.data);
      } catch (err) {
        setError(`Failed to fetch module data: ${err.message}`);
      }
    };

    fetchModuleData();
  }, [id]);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`api/v1/modules/${id}/assignments`, newAssignment, { withCredentials: true });
      setAssignments([...assignments, response.data]);
      setNewAssignment({ title: '', description: '' });
    } catch (err) {
      setError(`Failed to create assignment: ${err.message}`);
    }
  };

  const handleAssignRole = async (userId, role) => {
    try {
      await axiosInstance.post(`api/v1/modules/${id}/assign-role`, { userId, role }, { withCredentials: true });
      // Refresh module data to reflect changes
      const moduleResponse = await axiosInstance.get(`api/v1/modules/${id}`, { withCredentials: true });
      setModule(moduleResponse.data);
    } catch (err) {
      setError(`Failed to assign role: ${err.message}`);
    }
  };

  const canEditRoles = ['ADMIN', 'DIRECTOR', 'MODULE_OWNER'].includes(userRole);

  if (error) return <div>Error: {error}</div>;
  if (!module) return <div>Loading...</div>;

  return (
    <div className="module-page">
      <h1>{module.name}</h1>
      <p>Module Code: {module.code}</p>
      <p>Description: {module.description}</p>

      <h2>Assignments</h2>
      <ul>
        {assignments.map(assignment => (
          <li key={assignment.id}>{assignment.title}</li>
        ))}
      </ul>

      {canEditRoles && (
        <form onSubmit={handleCreateAssignment}>
          <input
            type="text"
            value={newAssignment.title}
            onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
            placeholder="Assignment Title"
            required
          />
          <input
            type="text"
            value={newAssignment.description}
            onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
            placeholder="Assignment Description"
            required
          />
          <button type="submit">Create Assignment</button>
        </form>
      )}

      {canEditRoles && (
        <div>
          <h2>Assign Roles</h2>
          {users.map(user => (
            <div key={user.id}>
              <span>{user.name}</span>
              <select onChange={(e) => handleAssignRole(user.id, e.target.value)}>
                <option value="">Select Role</option>
                <option value="MODERATOR">Moderator</option>
                <option value="EXTERNAL_EXAMINER">External Examiner</option>
                <option value="INTERNAL_MODERATOR">Internal Moderator</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}