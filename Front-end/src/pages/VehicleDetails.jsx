import { useLocation } from "react-router";
import Navbar from "../components/Navbar";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { FaStar } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { FaPen } from "react-icons/fa"; 



function VehicleDetails() {
  const location = useLocation();
  const { name, price, image, dateRange, id } = location.state || {};
  return (
    <>
      <Navbar />
      <div className="detail-page flex justify-center item-center">
        <div className=" h-screen w-full md:w-[85vw] lg:w-[80vw] px-10 ">
          <div className=" py-5  flex justify-center items-center ">
            <img className="lg:w-[650px]" src={image} alt={name} />
          </div>

          <div className="flex flex-wrap ">
            <div className=" lg:w-[60%] w-full ">
              <BasicFeatures name={name}/>
              <VehicleDescription />
            </div>
            <div className=" lg:w-[40%] w-full ">
              <BookingSection price={price} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VehicleDetails;


export const BasicFeatures =({name})=>{
  return(
  <>
   <section className="w-full   p-6">
                <h1 className="text-3xl font-bold">{name}</h1>
                <p className="text-gray-500"></p>

                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span className="font-bold text-lg text-black">5.0</span>
                  <span className="text-blue-600">
                    <FaStar />
                  </span>
                  <span className="text-gray-600">(21 trips)</span>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded">
                    <span>👤</span>
                    <span>5 seats</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded">
                    <span>⛽</span>
                    <span>Gas (Regular)</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded">
                    <span>🧳</span>
                    <span>20 MPG</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded">
                    <span>⚙️</span>
                    <span>Automatic transmission</span>
                  </div>
                </div>
              </section>
  </>
  )
}

export const VehicleDescription = () => {
  const [expanded, setExpanded] = useState(false);

  const description = `The Range Rover is an iconic luxury SUV known for its unmatched combination of refinement, capability, and cutting-edge technology. With a powerful engine lineup, including hybrid and V8 options, it delivers both smooth on-road performance and exceptional off-road capabilities. The cabin features exquisite materials, advanced infotainment, and best-in-class comfort, making it a top choice for those who demand elegance and ruggedness in one vehicle. The 2024 model continues the legacy with even more tech, improved efficiency, and a bold design that stands out in any environment.`;

  return (
    <div className="w-[90%] px-5 relative mt-6  ">
      <div
        className={`relative text-gray-700 text-sm leading-relaxed transition-all duration-300 ${
          expanded
            ? "line-clamp-none max-h-full"
            : "line-clamp-5 max-h-[7.5rem]"
        }`}
      >
        {description}

        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      {/* Toggle Button */}
      <button
        className="mt-2 text-blue-600 font-medium hover:underline"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
};



//Booking section

const getTodayDate = () => new Date().toISOString().split("T")[0];
const getCurrentTime = () => new Date().toTimeString().split(":").slice(0, 2).join(":");

export const BookingSection = ({ price = "$3,116", originalPrice = "$5,079", onBookingChange }) => {
  const [booking, setBooking] = useState({
    startDate: getTodayDate(),
    startTime: getCurrentTime(),
    endDate: getTodayDate(),
    endTime: getCurrentTime(),
  });

  useEffect(() => {
    if (onBookingChange) onBookingChange(booking);
  }, [booking]);

  const handleChange = (field, value) => {
    setBooking((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full  ">
      <div className="w-full  bg-white rounded-2xl border border-gray-300 p-4 shadow-md pb-32 md:pb-4 my-5">
        {/* Trip Form */}
        <div className="mb-4 md:mb-6">
          <h3 className="font-semibold text-lg mb-2">Your trip</h3>

            <div className="md:flex items-center justify-between max-w-lg   hidden">
          <div>
            <p className="text-sm text-gray-400 line-through">{originalPrice}</p>
            <p className="text-lg font-bold text-black">{price} total</p>
            <p className="text-xs text-gray-500">Before taxes</p>
          </div>
            
          </div>
           <hr className="my-4 md:block hidden" />

          <label className="text-sm text-gray-700">Trip start</label>
          <div className="flex gap-2 mt-1 mb-3">
            <input
              type="date"
              value={booking.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className="w-1/2 p-2 border rounded-md"
            />
            <input
              type="time"
              value={booking.startTime}
              onChange={(e) => handleChange("startTime", e.target.value)}
              className="w-1/2 p-2 border rounded-md"
            />
          </div>

          <label className="text-sm text-gray-700">Trip end</label>
          <div className="flex gap-2 mt-1 mb-3">
            <input
              type="date"
              value={booking.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              className="w-1/2 p-2 border rounded-md"
            />
            <input
              type="time"
              value={booking.endTime}
              onChange={(e) => handleChange("endTime", e.target.value)}
              className="w-1/2 p-2 border rounded-md"
            />
          </div>
        </div>

        <hr className="my-4" />

        {/* Location */}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium text-sm text-gray-700">Pickup & return location</p>
            <p className="text-sm text-black">Lihue, HI 96766</p>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FaPen className="text-sm text-gray-600" />
          </button>
        </div>

        <hr className="my-4" />

        {/* Trip Savings */}
        <div>
          <p className="font-semibold text-md mb-1">Trip Savings</p>
          <div className="flex justify-between bg-gray-200 p-4 rounded-md text-md">
            <span>1-month discount</span>
            <span className="text-green-600 font-semibold">$1,964</span>
          </div>
          <button className=" w-full my-5 hidden md:block  bg-[#5d3bee] text-white font-semibold py-2 px-5 rounded-xl hover:bg-[#4725d2] transition">
            Continue
          </button>
        </div>
      </div>

      {/* Fixed Bottom Section for small/medium screens */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-inner md:hidden md:mt-6 p-4 border-t md:border-none z-50">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <p className="text-sm text-gray-400 line-through">{originalPrice}</p>
            <p className="text-lg font-bold text-black">{price} total</p>
            <p className="text-xs text-gray-500">Before taxes</p>
          </div>
          <button className="bg-[#5d3bee] text-white font-semibold py-2 px-5 rounded-xl hover:bg-[#4725d2] transition">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
