// ModuleDetails.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axios';

export default function ModuleDetails({ moduleCode }) {
  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/modules/${moduleCode}/with-assessments`);
        setModuleData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch module data');
        setLoading(false);
      }
    };

    fetchModuleData();
  }, [moduleCode]);

  if (loading) return <div>Loading module details...</div>;
  if (error) return <div>Error loading module details: {error}</div>;
  if (!moduleData) return <div>No module data found</div>;

  return (
    <div className="module-details">
      <h2>Module Details</h2>
      <table>
        <tbody>
          <tr>
            <th>Module Title:</th>
            <td>{moduleData.moduleName}</td>
          </tr>
          <tr>
            <th>Module Code:</th>
            <td>{moduleData.moduleCode}</td>
          </tr>
          <tr>
            <th>Module Leader(s):</th>
            <td>{moduleData.moduleLeader}</td>
          </tr>
          <tr>
            <th>Level:</th>
            <td>{moduleData.level}</td>
          </tr>
          <tr>
            <th>Credits:</th>
            <td>{moduleData.credits}</td>
          </tr>
        </tbody>
      </table>
      <h3>Module Outcomes:</h3>
      <p>{moduleData.moduleOutcomes}</p>
    </div>
  );
}