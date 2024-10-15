"use client"
import React from 'react'
import { Nav } from 'react-bootstrap'

const SideBar = () => {
  return (
    <div className="sidebar">
      <Nav className="flex-column">
        <Nav.Link style={{fontSize:"1.1rem"}} href="/dashboard">Dashboard</Nav.Link>
        <Nav.Link style={{fontSize:"1.1rem"}} href="/assessments">Assessments</Nav.Link>
        <Nav.Link style={{fontSize:"1.1rem"}} href="/moderation">Moderation</Nav.Link>
        <Nav.Link style={{fontSize:"1.1rem"}} href="/settings">Settings</Nav.Link>
      </Nav>
    </div>
  )
}

export default SideBar