import SideBar2 from '@/components/SideBar2'
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const layout = ({children}) => {
  return (
    <div>
        <Container fluid>
          <Row>
            <Col className="sidebar-container" xs={3}>
              <SideBar2 />
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