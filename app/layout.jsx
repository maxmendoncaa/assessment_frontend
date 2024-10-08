import { Inter } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';

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
          
          <img src="https://www.aston.ac.uk/themes/custom/aston_university/logo.svg"/>
        </div>
      </div>
      <main>{children}</main>
      </body>
    
    </html>
  );
}


export default RootLayout;