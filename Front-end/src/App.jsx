import React from 'react'
import './App.css'
import Navbar from './nav&footer/Navbar.jsx'
import LandingPage from './components/LandingPage.jsx'
import Footer from './nav&footer/Footer.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <div className='w-full h-screen bg-gray-400 text-3xl bold '>
        <LandingPage />
      </div>
      <Footer/>
    </>
  )
}
