import Sidebar from '../components/Sidebar';
import React, { useState } from 'react';
import Header from '../components/Header';
import ReturnHome from '../components/ReturnHome';

function NotFound() {
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
                <h1 className="text-6xl font-extrabold text-gray-800 text-center mt-20">
                    404 Page Not Found
                </h1>
                <ReturnHome />
            </Sidebar>
        </div>
    );
}
export default NotFound;