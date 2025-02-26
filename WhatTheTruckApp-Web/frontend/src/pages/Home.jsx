import {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";


function Home() {
    return (
        <div>
            <h1>Home</h1>
        </div>
    );
}
export default Home;