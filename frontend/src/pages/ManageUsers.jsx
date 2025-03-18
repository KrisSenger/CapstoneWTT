import React, { useState, useEffect } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Popup from './../components/Popup';
import AddUser from '../components/AddUser';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
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

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/api/user/data/');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const cancel = () => {
    setEditingUserId(null);
    setEditingUserId(null);
    setEditing(false);
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
    // Create a complete payload
    const payload = { ...formData };
    // If password is empty, remove it from the payload
    if (payload.password === "") {
      delete payload.password;
    }
    try {
      await api.put(`/api/user/update/${id}/`, payload);
      fetchUsers();
      setEditingUserId(null);
      setEditing(false);
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
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/api/user/delete/${id}/`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  const handleClose = () => {
    setShowPopup(false);
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
      <Header darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen}>
        <h2 className="text-xl font-semibold text-gray-800 text-center py-4">User Manager</h2>
        <div>
          {editing && <div>
            <h2>Edit User</h2>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="employeeID"
              placeholder="Employee ID"
              value={formData.employeeID}
              onChange={handleChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />
            <input
              type="text"
              name="driver_license"
              placeholder="Driver License"
              value={formData.driver_license}
              onChange={handleChange}
            />
            <div>
              <label>
                <input
                  type="checkbox"
                  name="is_superuser"
                  checked={formData.is_superuser}
                  onChange={handleChange}
                />
                Super Admin
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="is_staff"
                  checked={formData.is_staff}
                  onChange={handleChange}
                />
                Supervisor
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                Active
              </label>
            </div>

            <button
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
              onClick={() => updateUser(editingUserId)}>Update User</button>
            <button
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
              onClick={() => cancel()}>Cancel</button>
          </div>}
          <button
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
            onClick={() => setShowPopup(true)}>Add User</button>
          {showPopup && <Popup
            title="Add User"
            onClose={() => handleClose()}
          >
            <AddUser />
          </Popup>
          }


        </div>
        <div className="mx-auto border border-gray-300 shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-y-auto max-h-[80vh]">
            <table className="w-full border-collapse">

              <thead className="bg-gray-800 text-white sticky top-0 z-10">
                <tr>
                  <th className="p-3 border border-gray-700 w-16">ID</th>
                  <th className="p-3 border border-gray-700 w-24">Employee ID</th>
                  <th className="p-3 border border-gray-700 w-32">Username</th>
                  <th className="p-3 border border-gray-700 w-40">Email</th>
                  <th className="p-3 border border-gray-700 w-32">First Name</th>
                  <th className="p-3 border border-gray-700 w-32">Last Name</th>
                  <th className="p-3 border border-gray-700 w-32">Password</th>
                  <th className="p-3 border border-gray-700 w-40">Address</th>
                  <th className="p-3 border border-gray-700 w-40">Driver License</th>
                  <th className="p-3 border border-gray-700 w-20">Super Admin</th>
                  <th className="p-3 border border-gray-700 w-20">Supervisor</th>
                  <th className="p-3 border border-gray-700 w-20">Active</th>
                  <th className="p-3 border border-gray-700 w-32">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="cursor-pointer hover:bg-gray-100 even:bg-gray-50 transition duration-200 w-full"
                    >
                      <td className="p-3 border border-gray-300 w-16">{user.id}</td>
                      <td className="p-3 border border-gray-300 w-24">{user.employeeID}</td>
                      <td className="p-3 border border-gray-300 w-32">{user.username}</td>
                      <td className="p-3 border border-gray-300 w-40">{user.email}</td>
                      <td className="p-3 border border-gray-300 w-32">{user.first_name}</td>
                      <td className="p-3 border border-gray-300 w-32">{user.last_name}</td>
                      <td className="p-3 border border-gray-300 w-32">{user.password}</td>
                      <td className="p-3 border border-gray-300 w-40">{user.address}</td>
                      <td className="p-3 border border-gray-300 w-40">{user.driver_license}</td>
                      <td className="p-3 border border-gray-300 w-20">{user.is_superuser ? 'Yes' : 'No'}</td>
                      <td className="p-3 border border-gray-300 w-20">{user.is_staff ? 'Yes' : 'No'}</td>
                      <td className="p-3 border border-gray-300 w-20">{user.is_active ? 'Yes' : 'No'}</td>
                      <td className="p-3 border border-gray-300 w-32 flex space-x-2">
                        <button
                          onClick={() => startEditing(user)}
                          className="px-3 py-1 bg-yellow-500 text-white text-sm font-semibold rounded-md hover:bg-yellow-600 transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-md hover:bg-red-600 transition duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13" className="text-center p-6 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </Sidebar >
    </div >
  );
};

export default ManageUsers;
