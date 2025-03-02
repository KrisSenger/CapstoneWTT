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
            <div className='flex flex-col justify-evenly'>
              <div >
                <a href="/manage-users">Manage Users</a>
              </div>
              <div>
                <a href="/manage-equipment">Manage Equipment</a>
              </div>
              <div>
                <a href="/logout">Logout</a>
              </div>
            </div>
        </div>
    );
}
export default Home;