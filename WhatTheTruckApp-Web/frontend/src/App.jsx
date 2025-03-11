import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Incidents from './pages/Incidents'
import NotFound from './pages/NotFound'
import Logs from './pages/Logs'
import LogDetail from './components/LogDetail'
import Profile from './pages/Profile'
import ManageEquipment from './pages/ManageEquipment'
import ManageUsers from './pages/ManageUsers'
import ProtectedRoute from './components/ProtectedRoute'

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        <Route path="/incidents" element={
          <ProtectedRoute>
            <Incidents />
          </ProtectedRoute>
        } />

        <Route path="/logs" element={
          <ProtectedRoute>
            <Logs />
          </ProtectedRoute>
        } />

        <Route path="/logs/:id" element={
          <ProtectedRoute>
            <LogDetail />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        <Route path="/manage-equipment" element={
          <ProtectedRoute>
            <ManageEquipment />
          </ProtectedRoute>
        } />

        <Route path="/manage-users" element={
          <ProtectedRoute>
            <ManageUsers />
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
