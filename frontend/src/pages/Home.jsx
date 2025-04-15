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
          <a href="/manage-users" className="block p-6 text-center bg-[#F38226] text-white font-bold rounded-lg shadow-md hover:bg-orange-600 hover:shadow-lg transition">
            Manage Users
          </a>
          <a href="/Manage-Equipment" className="block p-6 text-center bg-[#F38226] text-white font-bold rounded-lg shadow-md hover:bg-orange-600 hover:shadow-lg transition">
            Manage Equipment
          </a>
          <a href="/logs" className="block p-6 text-center bg-[#F38226] text-white font-bold rounded-lg shadow-md hover:bg-orange-600 hover:shadow-lg transition">
            Logs
          </a>
          <a href="/Archive" className="block p-6 text-center bg-[#F38226] text-white font-bold rounded-lg shadow-md hover:bg-orange-600 hover:shadow-lg transition">
            Archive
          </a>
          <a href="/Incidents" className="block p-6 text-center bg-[#F38226] text-white font-bold rounded-lg shadow-md hover:bg-orange-600 hover:shadow-lg transition">
            Incidents
          </a>
          <a href="/Upload" className="block p-6 text-center bg-[#F38226] text-white font-bold rounded-lg shadow-md hover:bg-orange-600 hover:shadow-lg transition">
            Upload Logs
          </a>
        </div>
      </Sidebar>
    </div>
  );
}
export default Home;