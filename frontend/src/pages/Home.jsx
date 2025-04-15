import React, { useState } from 'react';
import WelcomeMessage from '../components/WelcomeMessage';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LogsBarGraph from '../components/LogsBarGraph';
import UserGraph from '../components/UserGraph';
import { Users, Truck, FileText, Archive, ShieldAlert, UploadCloud } from "lucide-react";

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
      <Header 
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        toggleSidebar={toggleSidebar} 
      />

      <Sidebar isSidebarOpen={isSidebarOpen}>
        {/* Welcome Message */}
        <div className="flex justify-center mt-6 mb-4">
          <WelcomeMessage className="text-2xl font-bold text-center" />
        </div>

        {/* 2-column layout */}
        <div className="flex flex-col lg:flex-row px-6 pb-12 gap-8">
          
          {/* Left: Buttons */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
            <a href="/manage-users" className="flex items-center gap-3 p-5 bg-[#F38226] text-white font-semibold rounded-lg shadow hover:bg-orange-600 transition">
              <Users className="w-5 h-5" />
              <span>Manage Users</span>
            </a>

            <a href="/Manage-Equipment" className="flex items-center gap-3 p-5 bg-[#F38226] text-white font-semibold rounded-lg shadow hover:bg-orange-600 transition">
              <Truck className="w-5 h-5" />
              <span>Manage Equipment</span>
            </a>

            <a href="/logs" className="flex items-center gap-3 p-5 bg-[#F38226] text-white font-semibold rounded-lg shadow hover:bg-orange-600 transition">
              <FileText className="w-5 h-5" />
              <span>Logs</span>
            </a>

            <a href="/Archive" className="flex items-center gap-3 p-5 bg-[#F38226] text-white font-semibold rounded-lg shadow hover:bg-orange-600 transition">
              <Archive className="w-5 h-5" />
              <span>Archive</span>
            </a>

            <a href="/Incidents" className="flex items-center gap-3 p-5 bg-[#F38226] text-white font-semibold rounded-lg shadow hover:bg-orange-600 transition">
              <ShieldAlert className="w-5 h-5" />
              <span>Incidents</span>
            </a>

            <a href="/Upload" className="flex items-center gap-3 p-5 bg-[#F38226] text-white font-semibold rounded-lg shadow hover:bg-orange-600 transition">
              <UploadCloud className="w-5 h-5" />
              <span>Upload Logs</span>
            </a>
          </div>

          {/* Right: Graphs centered within right half */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center gap-6">
            <div className="w-full max-w-md bg-white p-4 rounded shadow">
              <LogsBarGraph />
            </div>
            <div className="w-full max-w-md bg-white p-4 rounded shadow">
              <UserGraph />
            </div>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}

export default Home;
