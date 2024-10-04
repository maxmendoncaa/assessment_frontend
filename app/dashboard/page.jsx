'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axios';
import Cookies from 'js-cookie';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [modules, setModules] = useState([]);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userEmail = Cookies.get('email');
        const userResponse = await axiosInstance.get('api/v1/users/by-email', {
          params: { email: userEmail },
          withCredentials: true
        });
        const modulesResponse = await axiosInstance.get('api/v1/modules/my-modules', { withCredentials: true });
        const roleResponse = await axiosInstance.get('api/v1/users/role', { withCredentials: true });
    
        setUserData(userResponse.data);
        setModules(modulesResponse.data);
        setUserRole(roleResponse.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(`Failed to fetch dashboard data: ${err.message}`);
        if (err.response && err.response.status === 401) {
          router.push('/login');
        }
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleCreateModule = () => {
    router.push('/modules/create');
  };

  const handleManageModules = () => {
    router.push('/modules/manage');
  };

  const handleModuleClick = (moduleId) => {
    router.push(`/modules/${moduleId}/assessments`);
  };

  const canManageModules = ['ADMIN', 'ACADEMIC'].includes(userRole);

  if (error) return <div className="error-message">Error: {error}</div>;
  if (!userData) return <div className="loading-message">Loading...</div>;

  return (
    <div className="dashboard-container">
      <h1>Welcome, {userData.firstName} {userData.lastName}</h1>
      <h2>Your Modules</h2>

      <div className="action-buttons">
        <button onClick={handleCreateModule} className="create-module-button">Create New Module</button>
        {canManageModules && (
          <button onClick={handleManageModules} className="manage-modules-button">Manage Modules</button>
        )}
      </div>
      
      {modules.length === 0 ? (
        <p>No modules found. Create a new module to get started.</p>
      ) : (
        <div className="modules-grid">
          {modules.map(module => (
            <div key={module.id} className="module-card" onClick={() => handleModuleClick(module.id)}>
              <h3>{module.moduleName}</h3>
              <p>Code: {module.moduleCode}</p>
              <p>Credits: {module.credits}</p>
              <p>Level: {module.level}</p>
              <p>Leader: {module.moduleLeader}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}