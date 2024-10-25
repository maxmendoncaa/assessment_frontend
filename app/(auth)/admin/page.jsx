"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse"; // To parse CSV
import axios from "axios";
import { Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';
import Cookies from "js-cookie";

export default function Page() {
  const [csvUsers, setCsvUsers] = useState([]);
  const [manualUser, setManualUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "ACADEMIC",
  });
  const [message, setMessage] = useState("");

  useEffect(()=>{
    if(!(Cookies.get('role')==='ADMIN'))
      {
        window.location.href = "/unauthorized";
      }

  },[])

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setCsvUsers(results.data);
      },
    });
  };

  const registerUser = async (user) => {
    try {
      const response = await axios.post("http://localhost:8080/api/v1/auth/register", user);
      setMessage(`User ${user.email} registered successfully!`);
      return response.data;
    } catch (error) {
      console.error(`Error registering user ${user.email}:`, error);
      setMessage(`Error registering user ${user.email}`);
    }
  };

  const handleCsvSubmit = async () => {
    if (csvUsers.length === 0) {
      setMessage("No users found in the CSV file.");
      return;
    }

    for (let user of csvUsers) {
      await registerUser(user);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    await registerUser(manualUser);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setManualUser({ ...manualUser, [name]: value });
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">User Registration</h1>
      <hr />
      <Row className="mb-4">
        <Col>
          <h2>Upload CSV of Users</h2>
          <input type="file" accept=".csv" onChange={handleFileUpload} />
          <Button className="ms-2" variant="primary" onClick={handleCsvSubmit}>Register CSV Users</Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <h2>Manually Enter User Details</h2>
          <Form onSubmit={handleManualSubmit}>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstname"
                value={manualUser.firstname}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastname"
                value={manualUser.lastname}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={manualUser.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={manualUser.password}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Select name="role" value={manualUser.role} onChange={handleInputChange}>
                <option value="ACADEMIC">ACADEMIC</option>
                <option value="ADMIN">ADMIN</option>
              </Form.Select>
            </Form.Group>

            <Button variant="success" type="submit" className="mt-3">Register User</Button>
          </Form>
        </Col>
      </Row>

      {/* Message */}
      {message && <Alert className="mt-4" variant={message.includes('Error') ? 'danger' : 'success'}>{message}</Alert>}
    </Container>
  );
}



// "use client";

// import { useState } from "react";
// import Papa from "papaparse"; // To parse CSV
// import axios from "axios";

// export default function Page() {
//   // State to store CSV users and manual user entry
//   const [csvUsers, setCsvUsers] = useState([]);
//   const [manualUser, setManualUser] = useState({
//     firstname: "",
//     lastname: "",
//     email: "",
//     password: "",
//     role: "ACADEMIC",
//   });
//   const [message, setMessage] = useState("");

//   // Function to handle file input change
//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     Papa.parse(file, {
//       header: true,
//       skipEmptyLines: true,
//       complete: function (results) {
//         setCsvUsers(results.data);
//       },
//     });
//   };

//   // Function to register a single user via API
//   const registerUser = async (user) => {
//     try {
//       const response = await axios.post("http://localhost:8080/api/v1/auth/register", user);
//       setMessage(`User ${user.email} registered successfully!`);
//       return response.data;
//     } catch (error) {
//       console.error(`Error registering user ${user.email}:`, error);
//       setMessage(`Error registering user ${user.email}`);
//     }
//   };

//   // Function to submit users from CSV file
//   const handleCsvSubmit = async () => {
//     if (csvUsers.length === 0) {
//       setMessage("No users found in the CSV file.");
//       return;
//     }

//     for (let user of csvUsers) {
//       await registerUser(user);
//     }
//   };

//   // Function to submit manual user entry
//   const handleManualSubmit = async (e) => {
//     e.preventDefault();
//     await registerUser(manualUser);
//   };

//   // Function to handle input changes for manual user
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setManualUser({ ...manualUser, [name]: value });
//   };

//   return (
//     <div style={{textAlign:'center'}}>
//       <h1>User Registration</h1>

     
//       <hr />
//     <br></br>
//         {/* CSV File Upload */}
//         <div>
//         <h2>Upload CSV of Users</h2>
//         <input type="file" accept=".csv" onChange={handleFileUpload} />
//         <button onClick={handleCsvSubmit}>Register CSV Users</button>
//       </div>
//       <br></br>
//       <br></br>

//       {/* Manual User Entry */}
//       <div style={{textAlign:'center'}}>
//         <h2>Manually Enter User Details</h2>
//         <form onSubmit={handleManualSubmit}>
//           <div>
//             <label>First Name: </label>
//             <input
//               type="text"
//               name="firstname"
//               value={manualUser.firstname}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div>
//             <label>Last Name: </label>
//             <input
//               type="text"
//               name="lastname"
//               value={manualUser.lastname}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div style={{textAlign:'center'}}>
//             <label>Email: </label>
//             <input
//               type="email"
//               name="email"
//               value={manualUser.email}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div>
//             <label>Password: </label>
//             <input
//               type="password"
//               name="password"
//               value={manualUser.password}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div>
//             <label>Role: </label>
//             <select name="role" value={manualUser.role} onChange={handleInputChange}>
//               <option value="ACADEMIC">ACADEMIC</option>
              
//               <option value="ADMIN">ADMIN</option>
//             </select>
//           </div>
//           <button type="submit">Register User</button>
//         </form>
//       </div>
     


//       {/* Message */}
//       {message && <p>{message}</p>}
//     </div>
//   );
// }
