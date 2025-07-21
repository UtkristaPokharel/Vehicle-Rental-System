import Navbar from '../components/Navbar.jsx'
import LandingPage from '../components/LandingPage.jsx';
import PopularDest from "../components/Destination.jsx";
import SubscriptionForm from "../components/SubscriptionPage.jsx";
import Footer from "../components/footer.jsx"
import VehicleBrowse from './Browse.jsx';
import ContactUs from './ContactUs.jsx';
import FAQPage from './FAQPage.jsx';
import ProfileSidebar from '../components/ProfileSidebar.jsx';
import { useState } from 'react';
import { FaCarSide, FaRegHandshake, FaGift } from "react-icons/fa";

function Home() {
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);

  const handleProfileClick = () => {
    setIsProfileSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsProfileSidebarOpen(false);
  };

  return (
    <>
      <Navbar onProfileClick={handleProfileClick} />
      <div className="Home-page flex justify-center flex-col items-center">
        <LandingPage />
        <VehicleBrowse />
        <PopularDest />

        {/* info-boxes */}
        {/* <div className="info-section p-10  flex justify-center flex-row items-center flex-wrap lg:flex-nowrap  gap-10">

          <div className="box1 bg-cyan-200 md:w-[450px]  md:h-70 w-[80vw] h-75  rounded-2xl ">
            <h2 className='text-2xl font-bold  mx-10 mt-13 mb-2 '>Are you looking for a car, bike, scooter, truck ... ?</h2>
            <h4 className='text-md font-semibold text-gray-600 mx-10 '> We provide a platform for easy and affordable solution for renting a vehicle</h4>
            <button className=' bg-red-500  text-white font-bold px-3 py-2 mt-8 mx-10 rounded-xl'> Get Started</button>

          </div> */}

          {/* box-2's content must be changed */}
          {/* <div className="box2 bg-amber-200 md:w-[450px] md:h-70  w-[80vw] h-85 rounded-2xl">
            <h2 className='text-2xl font-bold  mx-10 mt-13 mb-2 '>Are you looking for a car, bike, scooter, truck ... ?</h2>
            <h4 className='text-md font-semibold text-gray-600 mx-10 '> We provide a platform for easy and affordable solution for renting a vehicle</h4>
            <button className=' bg-red-500  text-white font-bold px-3 py-2 mt-8 mx-10 rounded-xl'> Get Started</button>

          </div> */}

        {/* </div> */}

      </div>
        <FeatureSection/>
        <ContactUs/>
        <FAQPage />
        <SubscriptionForm />
      <Footer />
      
      {/* Profile Sidebar */}
      <ProfileSidebar 
        isOpen={isProfileSidebarOpen} 
        onClose={handleCloseSidebar} 
      />
    </>
  );
} 

export function FeatureSection() {
  const features = [
    {
      icon: <FaCarSide className="text-3xl text-red-600" />,
      title: "Exclusive web benefits",
      description: "Fast Track priority, Premium Cover, Pets Friendly Pack and much more!",
    },
    {
      icon: <FaRegHandshake className="text-3xl text-red-600" />,
      title: "Free cancellation",
      description: "Modify or cancel your booking free of charge with Premium or Standard rate",
    },
    {
      icon: <FaGift className="text-3xl text-red-600" />,
      title: "Upgraded fleet every year",
      description: "Take a break from routine with the latest vehicle models on the market",
    },
  ];

  return (
    <section className=" my-10 px-10 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border-1 border-gray-200 shadow-sm p-6 text-center hover:shadow-md transition-shadow"
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}


export default Home;