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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 max-w-md sm:max-w-lg mx-auto">
        <a href="/manage-users" className="block p-6 text-center bg-white rounded-lg shadow-md hover:bg-gray-100 transition">
          Manage Users
        </a>
        <a href="/manage-equipment" className="block p-6 text-center bg-white rounded-lg shadow-md hover:bg-gray-100 transition">
          Manage Equipment
        </a>
        <a href="/logs" className="block p-6 text-center bg-white rounded-lg shadow-md hover:bg-gray-100 transition">
          Logs
        </a>
        <a href="/incidents" className="block p-6 text-center bg-white rounded-lg shadow-md hover:bg-gray-100 transition">
          Incidents
        </a>
      </div>
      <div>
        <a href="/logout">Logout</a>
      </div>
    </div>
  );
}
export default Home;