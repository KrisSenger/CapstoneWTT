import React, { useState, useEffect} from 'react';
import api from '../api';
import ReturnHome from "../components/ReturnHome";

function Profile() {
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
    return (
        <div>
            <ReturnHome />
            <h1>Profile</h1>
        </div>
    );
}
export default Profile;