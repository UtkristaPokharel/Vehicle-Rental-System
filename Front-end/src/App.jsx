import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import './App.css'
import Home from './pages/Home.jsx'
import VehicleTypePage from './components/VehicleTypePage';
import AuthForm from './pages/Auth.jsx';
import VehicleDetails from './pages/VehicleDetails.jsx';
import Profile from './pages/Profile.jsx';

export default function App() {
  return (
     <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthForm/>}/>
        <Route path="/vehicles/:type" element={<VehicleTypePage />} />
        <Route path="/vehicle/:type/:id" element={<VehicleDetails/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </Router>
  )
}
