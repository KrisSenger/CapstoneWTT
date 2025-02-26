import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import api from '../api';



const WelcomeMessage = () => {
    const [user, setUser] = useState([]);
    const id = 5;
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
            <h1>Welcome,  {user ? user.username : 'Guest'}!</h1>
        </div>
    );
};

export default WelcomeMessage;