import React, { useState, useEffect } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
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

  const addUser = async () => {
    try {
      await api.post('/api/user/add/', formData);
      fetchUsers();
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
      console.error('Error adding user:', error);
    }
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

  const startEditing = (user) => {
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
        <h1>User Manager</h1>
        <div>
          <h2>{editingUserId ? 'Edit User' : 'Add User'}</h2>
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
          {editingUserId ? (
            <button onClick={() => updateUser(editingUserId)}>Update User</button>
          ) : (
            <button onClick={addUser}>Add User</button>
          )}
        </div>
        <div>
          <h2>User List</h2>
          <table border="1">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Password</th>
                <th>Address</th>
                <th>Driver License</th>
                <th>Super Admin</th>
                <th>Supervisor</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.employeeID}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.password}</td>
                  <td>{user.address}</td>
                  <td>{user.driver_license}</td>
                  <td>{user.is_superuser ? 'Yes' : 'No'}</td>
                  <td>{user.is_staff ? 'Yes' : 'No'}</td>
                  <td>{user.is_active ? 'Yes' : 'No'}</td>
                  <td>
                    <button onClick={() => startEditing(user)}>Edit</button>
                    <button onClick={() => deleteUser(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Sidebar>
    </div>
  );
};

export default ManageUsers;
