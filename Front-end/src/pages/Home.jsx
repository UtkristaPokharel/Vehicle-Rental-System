import LandingPage from '../components/LandingPage.jsx';
import PopularDest from "../components/Destination.jsx";
import SubscriptionForm from "../components/SubscriptionPage.jsx";
import VehicleBrowse from './Browse.jsx';
import ContactUs from './ContactUs.jsx';
import FAQPage from './FAQPage.jsx';
import { FaCarSide, FaRegHandshake, FaGift } from "react-icons/fa";

function Home() {
  return (
    <div className="Home-page flex justify-center flex-col items-center">
      <LandingPage />
      <VehicleBrowse />
      <PopularDest />
      <FeatureSection/>
      <ContactUs/>
      <FAQPage />
      <SubscriptionForm />
    </div>
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