'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axios';
import Cookies from 'js-cookie';
import { Form, InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [modules, setModules] = useState([]);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const router = useRouter();

  useEffect(() => {

    if(Cookies.get('role')==='ADMIN')
      {
        window.location.href = "/admin" 
      }
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
        const f = userResponse.data.firstName + ' ';
        const l = userResponse.data.lastName;
        Cookies.set('name', f + l);
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

  const handleModuleClick = (moduleId) => {
    router.push(`/modules/${moduleId}/assessments`);
  };

  const filteredModules = modules.filter((module) => {
    const query = searchQuery.toLowerCase();
    switch (searchBy) {
      case 'name':
        return module.moduleName.toLowerCase().includes(query);
      case 'code':
        return module.moduleCode.toLowerCase().includes(query);
      case 'leader':
        return module.moduleLeader.toLowerCase().includes(query);
      default:
        return true;
    }
  });

  if (error) return <div className="error-message">Error: {error}</div>;
  if (!userData) return <div className="loading-message">Loading...</div>;

  return (
    <div className="dashboard-container">
      {/* Enhanced Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Hi, {userData.firstName} 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome to your module dashboard
            </p>
          </div>
          <button
            onClick={handleCreateModule}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create New Module
          </button>
        </div>
      </div>

      {/* Enhanced Search Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <InputGroup>
              <InputGroup.Text>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder={`Search by ${searchBy}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </InputGroup>
          </div>
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            className="sm:w-48 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="name">Module Name</option>
            <option value="code">Module Code</option>
            <option value="leader">Module Leader</option>
          </select>
        </div>
      </div>

      {/* Original Modules Grid */}
      {filteredModules.length === 0 ? (
        <p>No modules found. Create a new module to get started.</p>
      ) : (
        <div className="modules-grid">
          {filteredModules.map((module) => (
            <div
              key={module.id}
              className="module-card"
              onClick={() => handleModuleClick(module.id)}
            >
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

// 'use client';

// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';
// import axiosInstance from '@/utils/axios';
// import Cookies from 'js-cookie';

// export default function Dashboard() {
//   const [userData, setUserData] = useState(null);
//   const [modules, setModules] = useState([]);
//   const [error, setError] = useState('');
//   const [userRole, setUserRole] = useState('');
//   const [searchQuery, setSearchQuery] = useState(''); // New state for search query
//   const router = useRouter();

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const userEmail = Cookies.get('email');
//         const userResponse = await axiosInstance.get('api/v1/users/by-email', {
//           params: { email: userEmail },
//           withCredentials: true
//         });
//         const modulesResponse = await axiosInstance.get('api/v1/modules/my-modules', { withCredentials: true });
//         const roleResponse = await axiosInstance.get('api/v1/users/role', { withCredentials: true });

//         setUserData(userResponse.data);
//         const f = userResponse.data.firstName + ' ';
//         const l = userResponse.data.lastName;
//         Cookies.set('name', f + l);
//         setModules(modulesResponse.data);
//         setUserRole(roleResponse.data);
//       } catch (err) {
//         console.error('Error fetching dashboard data:', err);
//         setError(`Failed to fetch dashboard data: ${err.message}`);
//         if (err.response && err.response.status === 401) {
//           router.push('/login');
//         }
//       }
//     };

//     fetchDashboardData();
//   }, [router]);

//   const handleCreateModule = () => {
//     router.push('/modules/create');
//   };

//   const handleManageModules = () => {
//     router.push('/modules/manage');
//   };

//   const handleModuleClick = (moduleId) => {
//     router.push(`/modules/${moduleId}/assessments`);
//   };

//   const canManageModules = ['ADMIN', 'ACADEMIC'].includes(userRole);

//   // Filter modules based on the search query
//   const filteredModules = modules.filter((module) =>
//     module.moduleName.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   if (error) return <div className="error-message">Error: {error}</div>;
//   if (!userData) return <div className="loading-message">Loading...</div>;

//   return (
//     <div className="dashboard-container">
//       <h1>Welcome, {userData.firstName} {userData.lastName}</h1>

//       {/* Search bar for filtering modules */}
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Search modules..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)} // Update the search query on input change
//         />
//       </div>

//       <h2>Your Modules</h2>

//       <div className="action-buttons">
//         <button onClick={handleCreateModule} className="create-module-button">Create New Module</button>
//         {/* Uncomment below if you want to show manage button for certain roles */}
//         {/* {canManageModules && (
//           <button onClick={handleManageModules} className="manage-modules-button">Manage Modules</button>
//         )} */}
//       </div>
      
//       {filteredModules.length === 0 ? (
//         <p>No modules found. Create a new module to get started.</p>
//       ) : (
//         <div className="modules-grid">
//           {filteredModules.map(module => (
//             <div key={module.id} className="module-card" onClick={() => handleModuleClick(module.id)}>
//               <h3>{module.moduleName}</h3>
//               <p>Code: {module.moduleCode}</p>
//               <p>Credits: {module.credits}</p>
//               <p>Level: {module.level}</p>
//               <p>Leader: {module.moduleLeader}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


// // 'use client';

// // import { useRouter } from 'next/navigation';
// // import React, { useEffect, useState } from 'react';
// // import axiosInstance from '@/utils/axios';
// // import Cookies from 'js-cookie';

// // export default function Dashboard() {
// //   const [userData, setUserData] = useState(null);
// //   const [modules, setModules] = useState([]);
// //   const [error, setError] = useState('');
// //   const [userRole, setUserRole] = useState('');
// //   const router = useRouter();

// //   useEffect(() => {
// //     const fetchDashboardData = async () => {
// //       try {
// //         const userEmail = Cookies.get('email');
// //         const userResponse = await axiosInstance.get('api/v1/users/by-email', {
// //           params: { email: userEmail },
// //           withCredentials: true
// //         });
// //         const modulesResponse = await axiosInstance.get('api/v1/modules/my-modules', { withCredentials: true });
// //         const roleResponse = await axiosInstance.get('api/v1/users/role', { withCredentials: true });
        
        
// //         setUserData(userResponse.data);
// //         const f=userResponse.data.firstName+' '
// //         const l=userResponse.data.lastName
// //         Cookies.set('name',f+l)
// //         setModules(modulesResponse.data);
// //         setUserRole(roleResponse.data);
// //       } catch (err) {
// //         console.error('Error fetching dashboard data:', err);
// //         setError(`Failed to fetch dashboard data: ${err.message}`);
// //         if (err.response && err.response.status === 401) {
// //           router.push('/login');
// //         }
// //       }
// //     };

// //     fetchDashboardData();
// //   }, [router]);

// //   const handleCreateModule = () => {
// //     router.push('/modules/create');
// //   };

// //   const handleManageModules = () => {
// //     router.push('/modules/manage');
// //   };

// //   const handleModuleClick = (moduleId) => {
// //     router.push(`/modules/${moduleId}/assessments`);
// //   };

// //   const canManageModules = ['ADMIN', 'ACADEMIC'].includes(userRole);

// //   if (error) return <div className="error-message">Error: {error}</div>;
// //   if (!userData) return <div className="loading-message">Loading...</div>;

// //   return (
// //     <div className="dashboard-container">
// //       <h1>Welcome, {userData.firstName} {userData.lastName}</h1>
// //       <h2>Your Modules</h2>

// //       <div className="action-buttons">
// //         <button onClick={handleCreateModule} className="create-module-button">Create New Module</button>
// //         {/* {canManageModules && (
// //           <button onClick={handleManageModules} className="manage-modules-button">Manage Modules</button>
// //         )} */}
// //       </div>
      
// //       {modules.length === 0 ? (
// //         <p>No modules found. Create a new module to get started.</p>
// //       ) : (
// //         <div className="modules-grid">
// //           {modules.map(module => (
// //             <div key={module.id} className="module-card" onClick={() => handleModuleClick(module.id)}>
// //               <h3>{module.moduleName}</h3>
// //               <p>Code: {module.moduleCode}</p>
// //               <p>Credits: {module.credits}</p>
// //               <p>Level: {module.level}</p>
// //               <p>Leader: {module.moduleLeader}</p>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }