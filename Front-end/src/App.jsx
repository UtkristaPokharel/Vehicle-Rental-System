import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import './App.css'
import Home from './components/Home.jsx'
import VehicleTypePage from './components/VehicleTypePage';


export default function App() {
  return (
     <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vehicles/:type" element={<VehicleTypePage />} />
      </Routes>
    </Router>
  )
}
