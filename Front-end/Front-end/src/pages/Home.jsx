import Navbar from '../components/Navbar.jsx'
import LandingPage from '../components/LandingPage.jsx';
import PopularDest from "../components/Destination.jsx";
import SubscriptionForm from "../components/SubscriptionPage.jsx";
import Footer from "../components/Footer.jsx"
import { RiMotorbikeFill, RiEBike2Fill, RiTruckFill } from "react-icons/ri";
import { FaCar, FaBus } from "react-icons/fa";
import { PiTruckTrailerFill } from "react-icons/pi";
import { useNavigate } from 'react-router';
import { FaCarSide, FaRegHandshake, FaGift } from "react-icons/fa";



function Home() {
  return (
    <>
      <Navbar />
      <div className="Home-page flex justify-center flex-col items-center">
        {/* <div className=" w-full h-screen flex justify-center items-center bg-gradient-to-b  from-amber-300 to-amber-600">
          <h1 className="w-full text-white text-4xl font-bold text-center ">
            {" "}
            Here will be image for EasyWheel
          </h1>
        </div> */}
        <LandingPage />
        <VehicleBrowse />
        <PopularDest />
        <FeatureSection/>
        <SubscriptionForm />

        {/* info-boxes */}
        <div className="info-section p-10  flex justify-center flex-row items-center flex-wrap lg:flex-nowrap  gap-10">

          <div className="box1 bg-cyan-200 md:w-[450px]  md:h-70 w-[80vw] h-75  rounded-2xl ">
            <h2 className='text-2xl font-bold  mx-10 mt-13 mb-2 '>Are you looking for a car, bike, scooter, truck ... ?</h2>
            <h4 className='text-md font-semibold text-gray-600 mx-10 '> We provide a platform for easy and affordable solution for renting a vehicle</h4>
            <button className=' bg-red-500  text-white font-bold px-3 py-2 mt-8 mx-10 rounded-xl'> Get Started</button>

          </div>

          {/* box-2's content must be changed */}
          <div className="box2 bg-amber-200 md:w-[450px] md:h-70  w-[80vw] h-85 rounded-2xl">
            <h2 className='text-2xl font-bold  mx-10 mt-13 mb-2 '>Are you looking for a car, bike, scooter, truck ... ?</h2>
            <h4 className='text-md font-semibold text-gray-600 mx-10 '> We provide a platform for easy and affordable solution for renting a vehicle</h4>
            <button className=' bg-red-500  text-white font-bold px-3 py-2 mt-8 mx-10 rounded-xl'> Get Started</button>

          </div>

        </div>

      </div>
      <Footer />
    </>
  );
}


const vehicleTypes = [
  { name: 'Bike', icon: <RiMotorbikeFill /> },
  { name: 'Scooter', icon: <RiEBike2Fill /> },
  { name: 'Truck', icon: <RiTruckFill /> },
  { name: 'CargoTruck', icon: <PiTruckTrailerFill /> },
  { name: 'Car', icon: <FaCar /> },
  { name: 'Bus', icon: <FaBus /> },
];

export const VehicleBrowse = () => {
  const navigate = useNavigate();

  const handleClick = (type) => {
    navigate(`/vehicles/${type}`);
  };

  return (
    <div className="vehicle-browse flex justify-center items-center flex-col mt-4 p-3">
      <h2 className="text-3xl font-bold text-center m-12">
        Browse Our Vehicles
      </h2>

      <ul className="flex flex-wrap justify-center items-center gap-20 list-none mb-4 text-2xl">
        {vehicleTypes.map((vehicle, index) => (
          <li
            key={index}
            className="text-center cursor-pointer"
            onClick={() => handleClick(vehicle.name)}
          >
            {vehicle.icon}
            <h1 className="mt-1 text-sm font-bold">{vehicle.name}</h1>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default Home;



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
    <section className=" my-20 px-10 w-full">
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
