import React, { useState, useEffect } from 'react';
import api from '../api';


export default function AddUser() {
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
        employeeID: '',
        address: '',
        driver_license: '',
        is_superuser: false,
        is_staff: false,
        is_active: true,
    });
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };
    
    const addUser = async () => {
        if (!window.confirm("Are you sure you want to add this user?")) {
          return;
        }
        try {
          await api.post('/api/user/add/', formData);
          alert("User successfully added!");
          setFormData({
            username: '',
            password: '',
            email: '',
            first_name: '',
            last_name: '',
            employeeID: '',
            address: '',
            driver_license: '',
            is_superuser: false,
            is_staff: true,
            is_active: true,
          });
        } catch (error) {
          const errorData = error.response?.data;
          let errorMsg = "Error adding user.";
          if (errorData) {
            if (errorData.employeeID) {
              errorMsg = errorData.employeeID.join(" ");
            } else if (errorData.email) {
              errorMsg = errorData.email.join(" ");
            } else if (errorData.username) {
              errorMsg = errorData.username.join(" ");
            } else if (errorData.detail) {
              errorMsg = errorData.detail;
            }
          }
          alert(errorMsg);
          console.error('Error adding user:', error);
        }
      };      

      const getUser = async () => {
        api.get(`/api/user/data/me/`)
          .then((res) => res.data)
          .then((data) => {
            setCurrentUser(data);
            console.log(data);
          })
          .catch((error) => console.error(error));
      };
      
    useEffect(() => {
        getUser();
    }, []); 

    return (
        <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 text-center">Add User</h2>

            <div className="grid grid-cols-1 gap-4">
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                    type="text"
                    name="employeeID"
                    placeholder="Employee ID"
                    value={formData.employeeID}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                    type="text"
                    name="driver_license"
                    placeholder="Driver License"
                    value={formData.driver_license}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {/* Checkbox Fields */}
            <div className="grid grid-cols-1 gap-3">
                {currentUser?.is_superuser && (
              
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="is_superuser"
                        checked={formData.is_superuser}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Super Admin</span>
                </label>
                )}

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="is_staff"
                        checked={formData.is_staff}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Supervisor</span>
                </label>

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Active</span>
                </label>
            </div>

            {/* Submit Button */}
            <button
                onClick={addUser}
                className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-200"
            >
                Add User
            </button>
        </div>


    );
}