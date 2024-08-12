// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Auth/Register';
import Login from './Auth/Login';
import Dashboard from './Pages/Dashboard';
import Timetable from './Pages/Timetable';
import ProfilePage from './Pages/ProfilePage';
import { useAuth } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext'; // Import the provider
import './App.css';

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <SidebarProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              !isAuthenticated ? <Register /> : <Navigate to="/dashboard" />
            }
          />
          <Route
            path="/login"
            element={
              !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/timetable"
            element={
              isAuthenticated ? <Timetable /> : <Navigate to="/login" />
            }
          />


        </Routes>
      </Router>
    </SidebarProvider>
  );
};

export default App;
