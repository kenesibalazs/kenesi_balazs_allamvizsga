// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './auth/Register';
import Login from './auth/Login';
import Dashboard from './pages/Dashboard';
import Timetable from './pages/Timetable';
import ProfilePage from './pages/ProfilePage';
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
