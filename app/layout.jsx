import { Inter } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Cookies from 'js-cookie';
import SideBar from './components/SideBar'
import { Container, Row, Col } from 'react-bootstrap';
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Aston Assessment Moderation",
  
};

const RootLayout=({ children })=> {
  return (
    <html>
      <head>
        <link rel="icon"  href="https://www.aston.ac.uk/themes/custom/aston_university/favicons/favicon-16x16.png"></link>
      </head>
      <body>

      <div className="header-bar">
        <div className="header-image">
          <a href="/dashboard">
          <img src="data:image/png;base64,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"/>
          </a>
          <h6>{Cookies.get('name')}</h6>
        </div>
      </div>
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
      </body>
    
    </html>
  );
}


export default RootLayout;