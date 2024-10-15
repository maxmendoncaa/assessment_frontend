"use client";

import { useState } from "react";
import Papa from "papaparse"; // To parse CSV
import axios from "axios";

export default function Page() {
  // State to store CSV users and manual user entry
  const [csvUsers, setCsvUsers] = useState([]);
  const [manualUser, setManualUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "ACADEMIC",
  });
  const [message, setMessage] = useState("");

  // Function to handle file input change
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

  // Function to register a single user via API
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

  // Function to submit users from CSV file
  const handleCsvSubmit = async () => {
    if (csvUsers.length === 0) {
      setMessage("No users found in the CSV file.");
      return;
    }

    for (let user of csvUsers) {
      await registerUser(user);
    }
  };

  // Function to submit manual user entry
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    await registerUser(manualUser);
  };

  // Function to handle input changes for manual user
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setManualUser({ ...manualUser, [name]: value });
  };

  return (
    <div>
      <h1>User Registration</h1>

      {/* CSV File Upload */}
      <div>
        <h2>Upload CSV of Users</h2>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        <button onClick={handleCsvSubmit}>Register CSV Users</button>
      </div>

      <hr />

      {/* Manual User Entry */}
      <div>
        <h2>Manually Enter User Details</h2>
        <form onSubmit={handleManualSubmit}>
          <div>
            <label>First Name: </label>
            <input
              type="text"
              name="firstname"
              value={manualUser.firstname}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Last Name: </label>
            <input
              type="text"
              name="lastname"
              value={manualUser.lastname}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Email: </label>
            <input
              type="email"
              name="email"
              value={manualUser.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Password: </label>
            <input
              type="password"
              name="password"
              value={manualUser.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Role: </label>
            <select name="role" value={manualUser.role} onChange={handleInputChange}>
              <option value="ACADEMIC">ACADEMIC</option>
              
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <button type="submit">Register User</button>
        </form>
      </div>

      {/* Message */}
      {message && <p>{message}</p>}
    </div>
  );
}
