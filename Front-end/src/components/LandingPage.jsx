import { useEffect, useState } from 'react';
import Jeep from '../images/offroad.png';
import SUV from '../images/jeep.png';
import Sedan from '../images/suv.png';
import Offroad from '../images/sedan.png';

const vehicles = [Jeep, SUV, Sedan, Offroad];

const texts = [
  'CHOOSE YOUR\nCOMFORTABLE VEHICLES',
  'RENT THE RIDE YOU DESERVE',
  'ENJOY LUXURY AND SAFETY'
];


function LandingPage() {
  const [vehicleIndex, setVehicleIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const vehicleTimer = setInterval(() => {
      setVehicleIndex((prev) => (prev + 1) % vehicles.length);
    }, 4000); 

    const textTimer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, 6000);

    return () => {
      clearInterval(vehicleTimer);
      clearInterval(textTimer);
    };
  }, []);

  return (
    <div className="flex flex-wrap-reverse items-center justify-center gap-[4vw] w-full px-6 py-12 pt-24 bg-[#f6f6f6] font-sans">

      {/* TEXT SECTION */}
      <div className="w-full md:max-w-[600px] flex justify-center items-center flex-col animate-fade-up text-center">
        <p className="text-[16px] md:text-[20px] text-[#333] mb-2">
          All discount just for you
        </p>
        <h1 className="text-red-600 text-[28px] md:text-[40px] font-bold my-1">
          Need A Ride?
        </h1>
        <h2 className="text-[24px] md:text-[36px] font-black text-[#111] my-2 whitespace-pre-line">
          {texts[textIndex]}
        </h2>
        <p className="text-[16px] md:text-[22px] text-[#555] mb-4 md:mb-6">
          Best worldwide VEHICLE hire deals!!!!!
        </p>
        <button className="bg-black text-white text-[16px] md:text-[20px] px-6 py-3 hover:bg-red-600 transition hover:scale-109">
          Contact Now
        </button>
      </div>

      {/* IMAGE SECTION */}
      <div className="w-full md:max-w-[500px] flex justify-center animate-fade-up delay-[500ms] transition-all duration-700">
        <img
          src={vehicles[vehicleIndex]}
          alt="Vehicle"
          className="w-full h-auto max-h-[300px] md:max-h-[400px] object-contain transition-opacity duration-700"
          style={{ height: '400px' }}
        />
      </div>
    </div>
  );
}


export default LandingPage;
