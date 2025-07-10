import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home.jsx'
import VehicleTypePage from './components/VehicleTypePage';
import AuthForm from './pages/Auth.jsx';
import VehicleDetails from './pages/VehicleDetails.jsx';
import Profile from './pages/Profile.jsx';
import AboutUs from './pages/AboutUs.jsx';
import ContactUs from './pages/ContactUs.jsx';
import Vehicle from './pages/Vehicles.jsx';
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import AdminPanel from './pages/admin/AdminPanel.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

import Logout from './pages/Api/logout.jsx';
import { UserProvider } from "./context/UserContext.jsx"

import FAQPage from './pages/FAQPage.jsx';


export default function App() {

  return (

    <UserProvider>

      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthForm />} />
          <Route path="/vehicles/:type" element={<VehicleTypePage />} />

          <Route path="/vehicle/:type/:id" element={<VehicleDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />

          <Route path="/vehicle/:type/:id" element={<VehicleDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/faq" element={<FAQPage />} />

          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="browse" element={<Vehicle />} />

           <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
          {/* Fallback route for 404 */}
        </Routes>
      </Router>

    </UserProvider>
  )
}
