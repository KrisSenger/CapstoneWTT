import Sidebar from '../components/Sidebar';
import React, { useState } from 'react';
import Header from '../components/Header';
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
                <h1>404 Page Not Found</h1>
            </Sidebar>
        </div>
    );
}
export default NotFound;