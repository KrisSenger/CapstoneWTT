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
        <h1>Home</h1>
        <WelcomeMessage />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 max-w-md sm:max-w-lg mx-auto">
          <a href="/manage-users" className="block p-6 text-center bg-white rounded-lg shadow-md hover:bg-gray-100 transition">
            Manage Users
          </a>
          <a href="/manage-equipment" className="block p-6 text-center bg-white rounded-lg shadow-md hover:bg-gray-100 transition">
            Manage Equipment
          </a>
          <a href="/logs" className="block p-6 text-center bg-white rounded-lg shadow-md hover:bg-gray-100 transition">
            Logs
          </a>
          <a href="/incidents" className="block p-6 text-center bg-white rounded-lg shadow-md hover:bg-gray-100 transition">
            Incidents
          </a>
        </div>
        <div>
          <a href="/logout">Logout</a>
        </div>
      </Sidebar>
    </div>
  );
}
export default Home;