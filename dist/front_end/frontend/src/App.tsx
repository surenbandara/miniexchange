import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/auth/SignUp';
import HomePage from './components/homepage/HomePage';
import Dashboard from './components/dashboard/Dashboard';
import SignIn from './components/auth/SignIn';

const App: React.FC = () => {
  console.log("Reactedddd")

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;

