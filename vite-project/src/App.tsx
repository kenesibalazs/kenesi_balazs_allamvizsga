// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Pages/auth/Register';
import Login from './Pages/auth/Login';
import Dashboard from './Pages/dashboard/Dashboard';
import Timetable from './Pages/timetable/Timetable';
import ProfilePage from './Pages/ProfilePage';
import RegisterWithNeptun from './Pages/auth/RegisterWithNeptun';
import ActiveAttendancePage from './Pages/ActiveAttendancePage';
import { useAuth } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layout/MainLayout';
import './styles/App.css';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Ensure that `isAuthenticated` is not undefined during the initial render
  if (isAuthenticated === undefined) {
    return null; // Or a loading spinner if needed
  }

  return (
    <ThemeProvider>
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
              path="/register-with-neptun"
              element={
                !isAuthenticated ? <RegisterWithNeptun /> : <Navigate to="/dashboard" />
              }
            />
            <Route
              element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/timetable" element={<Timetable requestedView="week" />} />
              <Route path="/timetable/day" element={<Timetable requestedView="day" />} />
              <Route path="/timetable/week" element={<Timetable requestedView="week" />} />
              <Route path="/timetable/month" element={<Timetable requestedView="month" />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/activeattendance/:id" element={<ActiveAttendancePage />} />
            </Route>
          </Routes>
        </Router>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default App;
