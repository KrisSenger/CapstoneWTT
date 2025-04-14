import React, { useState } from 'react';
import DocumentUpload from '../components/DocumentUpload';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function Upload() {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <Header 
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        toggleSidebar={toggleSidebar}
      />
      <Sidebar isSidebarOpen={isSidebarOpen}>
        <div className="p-4">
          <DocumentUpload />
        </div>
      </Sidebar>
    </div>
  );
}

export default Upload;