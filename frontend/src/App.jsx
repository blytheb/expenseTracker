import React from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router";

import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage'; 
import HomePage from './pages/Dashboard/HomePage';
import IncomePage from './pages/Dashboard/IncomePage';
import ExpensePage from './pages/Dashboard/ExpensePage';
import UserProvider from './context/userProvider';
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/income" element={<IncomePage />} />
            <Route path="/expense" element={<ExpensePage />} />
          </Routes>
        </Router>
      </div>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: '13px'
          },
        }}
      />
    </UserProvider>

  )
}

export default App;

const Root = () => {
  //check if token exists in localStorage
  const isAuthenticated = !!localStorage.getItem('token');

  //redirect to dashboard if authenticated, otherwise to login
  return isAuthenticated ? (
  <Navigate to="/dashboard" /> 
  ) : ( 
    <Navigate to="/login" />
  );
}