import React, { useState, useEffect } from 'react';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

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
    is_active: true,
    is_staff: true,
  });
  const [editingUserId, setEditingUserId] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/user/data/', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
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
      const res = await fetch('http://127.0.0.1:8000/api/user/add/', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });
      if (res.ok) {
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
          is_active: true,
          is_staff: true,
        });
      } else {
        console.error('Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Update user with a full payload using PUT
  const updateUser = async (id) => {
    // Create a complete payload
    const payload = { ...formData };
    // If password is empty, remove it from the payload
    if (payload.password === "") {
      delete payload.password;
    }
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/user/update/${id}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
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
          is_active: true,
          is_staff: true,
        });
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };  

  // Delete user
  const deleteUser = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/user/delete/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        fetchUsers();
      } else {
        console.error('Failed to delete user');
      }
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
      is_active: user.is_active ?? true,
      is_staff: user.is_staff ?? true,
    });
  };

  return (
    <div>
      <h1>User Management</h1>
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
            Superuser
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
        <div>
          <label>
            <input
              type="checkbox"
              name="is_staff"
              checked={formData.is_staff}
              onChange={handleChange}
            />
            Staff
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
              <th>Superuser</th>
              <th>Active</th>
              <th>Staff</th>
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
                <td>{user.is_active ? 'Yes' : 'No'}</td>
                <td>{user.is_staff ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => startEditing(user)}>Edit</button>
                  <button onClick={() => deleteUser(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
