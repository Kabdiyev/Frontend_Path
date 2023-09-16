import React from 'react';
import { Link, Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard.js';
import './components/assets/styles/App.css';
import Chatbot from './components/chatbot.js';
import Home from './components/home.js';
import Info from './components/info.js';
import Report1 from './components/report1.js';
import Results from './components/results.js';
import Results_new from './components/results_new.js';
import ResultsPdf from './components/results_pdf';
import StudentInfo from './components/student_info.js';
import Upload from './components/upload.js';

const HeaderButtons = () => {
  const hasAccessToken = localStorage.getItem("access_token");
  const location = useLocation();


  return (
    <>
      {(hasAccessToken || location.pathname === "/dashboard") && (
        <div className="button-group">
          <Link to="/dashboard" className="dashboard-btn">Dashboard</Link>
          <Link to="/chatbot" className="chatbot-btn">Chatbot</Link>
          <SignInOutButton />
        </div>
      )}

    </>
  );
};


const SignInOutButton = () => {
  const hasAccessToken = localStorage.getItem("access_token");

  const handleSignOutClick = () => {
    if (hasAccessToken) {
      localStorage.removeItem('access_token'); // remove the token
      window.location.href = '/';
    }
  };

  if (!hasAccessToken) return null; // No button rendered if user isn't authenticated

  return (
    <button className='signout-btn' onClick={handleSignOutClick}>
      Sign Out
    </button>
  );
};


const ProtectedRoute = ({ children }) => {
  const hasAccessToken = localStorage.getItem("access_token");

  // If there's no access token, redirect to home page
  if (!hasAccessToken) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="top-bar">
            <Link to="/" className="logo-container">
              <div>TANU</div>
            </Link>
            <HeaderButtons />
          </div>
        </header>
        <div className="container-fluid bg-grey">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/upload/:pdfId"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report1/:pdfId"
              element={
                <ProtectedRoute>
                  <Report1 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results/:pdfId"
              element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results_new/:pdfId"
              element={
                <ProtectedRoute>
                  <Results_new />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results_pdf/:pdfId"
              element={
                <ProtectedRoute>
                  <ResultsPdf />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chatbot"
              element={
                <ProtectedRoute>
                  <Chatbot />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student_info/:pdfId"
              element={
                <ProtectedRoute>
                  <StudentInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/info"
              element={
                <ProtectedRoute>
                  <Info />
                </ProtectedRoute>
              }
            />
          </Routes>

        </div>
      </div>
    </Router>
  );
};

export default App;