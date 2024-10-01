'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axios';

export default function ManageModules() {
  const [modules, setModules] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axiosInstance.get('api/v1/modules', { withCredentials: true });
        setModules(response.data);
      } catch (err) {
        setError(`Failed to fetch modules: ${err.message}`);
      }
    };

    fetchModules();
  }, []);

  const handleModuleClick = (moduleId) => {
    router.push(`/modules/${moduleId}`);
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="manage-modules-container">
      <h1>Manage Modules</h1>
      <div className="modules-list">
        {modules.map(module => (
          <div key={module.id} className="module-item" onClick={() => handleModuleClick(module.id)}>
            <h3>{module.name}</h3>
            <p>Code: {module.code}</p>
            <p>Status: {module.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}