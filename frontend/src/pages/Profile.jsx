import React, { useState, useEffect } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function Profile() {
    const [user, setUser] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    useEffect(() => {
        getUser();
    }, []);
    const getUser = async () => {
        api.get(`/api/user/data/me/`)
            .then((res) => res.data)
            .then((data) => { setUser(data); console.log(data) })
            .catch((error) => console.error(error));
    }
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
                <h1>Profile</h1>
            </Sidebar>
        </div>
    );
}
export default Profile;