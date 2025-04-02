import React, { useState, useEffect } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Popup from '../components/Popup';
import AddUser from '../components/AddUser';
import { useNavigate } from 'react-router-dom';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [editing, setEditing] = useState(false);
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
  const [editingUserId, setEditingUserId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const getUser = async () => {
    api.get(`/api/user/data/me/`)
      .then((res) => res.data)
      .then((data) => {
        setCurrentUser(data);
        console.log(data);
      })
      .catch((error) => console.error(error));
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/api/user/data/');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    getUser();
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditingUserId(null);
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
  };

  const updateUser = async (id) => {
    // Show confirmation dialog before updating the user
    if (!window.confirm("Are you sure you want to update this user?")) {
      return; // Cancel update if not confirmed
    }
    
    const payload = { ...formData };
    if (payload.password === "") {
      delete payload.password;
    }
    try {
      await api.put(`/api/user/update/${id}/`, payload);
      alert("User updated successfully!");
      fetchUsers();
      cancelEdit();
    } catch (error) {
      const errorMsg = error.response?.data?.employeeID
        ? error.response.data.employeeID.join(" ")
        : "Error updating user.";
      alert(errorMsg);
      console.error('Error updating user:', error);
    }
  };
  
  const deactivateUser = async (user) => {
    // Ask for confirmation before deactivating the user
    if (!window.confirm(`Are you sure you want to deactivate user ${user.username}?`)) {
      return; // Cancel deactivation if not confirmed
    }
    
    try {
      const payload = {
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        employeeID: user.employeeID,
        address: user.address,
        driver_license: user.driver_license,
        is_superuser: user.is_superuser,
        is_staff: user.is_staff,
        is_active: false
      };
      await api.put(`/api/user/update/${user.id}/`, payload);
      alert("User deactivated successfully!");
      fetchUsers();
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  };
  
  const activateUser = async (user) => {
    // Ask for confirmation before reactivating the user
    if (!window.confirm(`Are you sure you want to reactivate user ${user.username}?`)) {
      return; // Cancel activation if not confirmed
    }
    
    try {
      const payload = {
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        employeeID: user.employeeID,
        address: user.address,
        driver_license: user.driver_license,
        is_superuser: user.is_superuser,
        is_staff: user.is_staff,
        is_active: true
      };
      await api.put(`/api/user/update/${user.id}/`, payload);
      alert("User activated successfully!");
      fetchUsers();
    } catch (error) {
      console.error('Error activating user:', error);
    }
  };  

  const handleCloseAddPopup = () => {
    setShowAddPopup(false);
    fetchUsers();
  };

  const startEditing = (user) => {
    setEditing(true);
    setEditingUserId(user.id);
    setFormData({
      username: user.username || '',
      password: '',
      email: user.email || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      employeeID: user.employeeID || '',
      address: user.address || '',
      driver_license: user.driver_license || '',
      is_superuser: user.is_superuser ?? false,
      is_staff: user.is_staff ?? true,
      is_active: user.is_active ?? true,
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen}>
        <div className="flex items-center justify-between mb-4">
          <button 
            className="px-4 py-2 ml-4 mt-3 bg-orange-500 text-white rounded-md hover:bg-orange-700 transition duration-200" 
            onClick={() => navigate("/")}
          > 
            Home 
          </button>
          <h3 className="text-2xl font-semibold">User Management</h3>
          {/* Button to add a new user */}
          <button
            className="px-4 py-2 mr-4 mt-3 bg-blue-600 text-white rounded-md hover:bg-blue-800 transition duration-200"
            onClick={() => setShowAddPopup(true)}
          >
            Add User
          </button>

        </div>
        {/* Popup for editing a user */}
        {editing && (
          <Popup onClose={cancelEdit}>
            <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 text-center">Edit User</h2>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {/* The password field is visible in the popup edit form */}
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
              {currentUser?.is_superuser && (
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="is_superuser"
                    checked={formData.is_superuser}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Super Admin
                </label>
              </div>
              )}
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="is_staff"
                    checked={formData.is_staff}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Supervisor
                </label>
              </div>
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Active
                </label>
              </div>
              <button
                onClick={() => updateUser(editingUserId)}
                className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-200"
              >
                Update User
              </button>
              <button
                onClick={cancelEdit}
                className="w-full py-3 mt-2 bg-gray-600 text-white font-semibold rounded-md shadow-md hover:bg-gray-700 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </Popup>
        )}
        {showAddPopup && (
          <Popup onClose={handleCloseAddPopup}>
            <AddUser />
          </Popup>
        )}
        <div className="mx-auto border border-gray-300 shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-hidden overflow-y-auto max-h-[80vh]">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-800 text-white sticky top-0 z-10">
                <tr>
                  <th className="p-3 border border-gray-700">ID</th>
                  <th className="p-3 border border-gray-700">Employee ID</th>
                  <th className="p-3 border border-gray-700">Username</th>
                  <th className="p-3 border border-gray-700">Email</th>
                  <th className="p-3 border border-gray-700">First Name</th>
                  <th className="p-3 border border-gray-700">Last Name</th>
                  <th className="p-3 border border-gray-700">Address</th>
                  <th className="p-3 border border-gray-700">Driver License</th>
                  <th className="p-3 border border-gray-700">Super Admin</th>
                  <th className="p-3 border border-gray-700">Supervisor</th>
                  <th className="p-3 border border-gray-700">Active</th>
                  <th className="p-3 border border-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="cursor-pointer hover:bg-gray-100 even:bg-gray-50 transition duration-200"
                    >
                      <td className="p-3 border border-gray-300">{user.id}</td>
                      <td className="p-3 border border-gray-300">{user.employeeID}</td>
                      <td className="p-3 border border-gray-300">{user.username}</td>
                      <td className="p-3 border border-gray-300">{user.email}</td>
                      <td className="p-3 border border-gray-300">{user.first_name}</td>
                      <td className="p-3 border border-gray-300">{user.last_name}</td>
                      <td className="p-3 border border-gray-300">{user.address}</td>
                      <td className="p-3 border border-gray-300">{user.driver_license}</td>
                      <td className="p-3 border border-gray-300">{user.is_superuser ? 'Yes' : 'No'}</td>
                      <td className="p-3 border border-gray-300">{user.is_staff ? 'Yes' : 'No'}</td>
                      <td className="p-3 border border-gray-300">{user.is_active ? 'Yes' : 'No'}</td>
                      <td className="p-3 border border-gray-300">
                        <div className="flex flex-wrap items-center gap-1">
                          <button
                            onClick={() => startEditing(user)}
                            className="px-2 py-1 bg-yellow-500 text-white text-sm font-semibold rounded-md hover:bg-yellow-600 transition duration-200"
                          >
                            Edit
                          </button>
                          {user.is_active && !((user.is_superuser && !currentUser?.is_superuser) || (user.id === currentUser?.id)) && (
                            <button onClick={() => deactivateUser(user)} className="px-2 py-1 bg-red-500 text-white text-sm font-semibold rounded-md hover:bg-red-600 transition duration-200">
                              Deactivate
                            </button>
                          )}
                          {!user.is_active && (
                            <button onClick={() => activateUser(user)} className="px-2 py-1 bg-green-500 text-white text-sm font-semibold rounded-md hover:bg-green-600 transition duration-200">
                              Activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center p-6 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default ManageUsers;
