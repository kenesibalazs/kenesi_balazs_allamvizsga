// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Auth/Register';
import Login from './Auth/Login';
import Dashboard from './Pages/Dashboard';
import Timetable from './Pages/Timetable';
import ProfilePage from './Pages/ProfilePage';
import RegisterWithNeptun from './Auth/RegisterWithNeptun';
import { useAuth } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';
import './App.css';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Ensure that `isAuthenticated` is not undefined during the initial render
  if (isAuthenticated === undefined) {
    return null; // Or a loading spinner if needed
  }

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
            path="/register-with-neptun"
            element={
              !isAuthenticated ? <RegisterWithNeptun /> : <Navigate to="/dashboard" />
            }
          />
          <Route
            path="/timetable"
            element={
              isAuthenticated ? <Timetable /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </Router>
    </SidebarProvider>
  );
};

export default App;
