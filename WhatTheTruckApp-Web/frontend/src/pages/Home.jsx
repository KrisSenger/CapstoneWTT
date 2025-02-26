import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import WelcomeMessage from '../components/WelcomeMessage';


function Home() {
    return (
        <div>
            <h1>Home</h1>
            <WelcomeMessage />
        </div>
    );
}
export default Home;