import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

// app.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Loginpage from './pages/loginpage'
import Home from './pages/Home'
import H2 from './pages/H2'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Loginpage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/hometest" element={<H2/>} />
    </Routes>
  </BrowserRouter>
)


export default App
