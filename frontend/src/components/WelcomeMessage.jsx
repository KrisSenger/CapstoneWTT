import React, { useState, useEffect} from 'react';
import api from '../api';



const WelcomeMessage = () => {
    const [user, setUser] = useState([]);
    useEffect(() => {
        getUser();
    }, []);
    const getUser = async () => {
        api.get(`/api/user/data/me/`)
            .then((res) => res.data)
            .then((data) => { setUser(data); console.log(data) })
            .catch((error) => console.error(error));
    }

    // Display a welcome message with the logged-in user's name
    return (
        <div>
            <span style={{ fontFamily: 'Lato, Helvetica, sans-serif' }} className="text-2xl font-semibold ml-12 mt-4">
                Welcome, {user ? user.first_name : 'Guest'}!
            </span>

        </div>
    );
};

export default WelcomeMessage;