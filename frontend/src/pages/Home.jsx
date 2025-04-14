import React, { useState } from 'react';
import WelcomeMessage from '../components/WelcomeMessage';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';



function Home() {
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
      <Header darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen}>
        <WelcomeMessage className="font-bold text-xl " />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 max-w-md sm:max-w-lg mx-auto">
          <a href="/manage-users" className="block p-6 text-center bg-white rounded-lg shadow-md hover:bg-gray-100 transition">
            Manage Users
          </a>
          <a href="/Manage-Equipment" className="block p-6 text-center bg-white rounded-lg shadow-md hover:bg-gray-100 transition">
            Manage Equipment
          </a>
          <a href="/logs" className="block p-6 text-center bg-white rounded-lg shadow-md hover:bg-gray-100 transition">
            Logs
          </a>
          <a href="/Incidents" className="block p-6 text-center bg-white rounded-lg shadow-md hover:bg-gray-100 transition">
            Incidents
          </a>
          <a href="/upload" className="block p-6 text-center bg-white rounded-lg shadow-md hover:bg-gray-100 transition">
            Upload Logs
          </a>
        </div>
      </Sidebar>
    </div>
  );
}
export default Home;