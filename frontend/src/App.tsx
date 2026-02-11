import { useState } from 'react'
import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Component } from 'react';
import Navbar from './Components/Navbar/Navbar';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
