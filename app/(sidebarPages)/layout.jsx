import React from 'react'
import SideBar from '@/components/SideBar'
import { Container, Row, Col } from 'react-bootstrap'

const layout = ({children}) => {
  return (
    <div>
        <Container fluid>
          <Row>
            <Col className="sidebar-container" xs={3}>
              <SideBar />
            </Col>
            <Col className="main-content" xs={9}>
              <main>{children}</main>
            </Col>
          </Row>
        </Container>
    </div>
  )
}

export default layout