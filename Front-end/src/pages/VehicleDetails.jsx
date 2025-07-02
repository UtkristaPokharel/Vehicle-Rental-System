import { useLocation } from "react-router";
import Navbar from "../components/Navbar";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { FaStar } from "react-icons/fa6";
import { useState } from "react";

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
            <div className=" lg:w-[60%] w-full h-[500px]">
              <section className="w-full  p-6">
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

              <VehicleDescription />
            </div>
            <div className=" lg:w-[40%] w-full h-[500px]">
              <BookingSection price={price} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VehicleDetails;

export const VehicleDescription = () => {
  const [expanded, setExpanded] = useState(false);

  const description = `The Range Rover is an iconic luxury SUV known for its unmatched combination of refinement, capability, and cutting-edge technology. With a powerful engine lineup, including hybrid and V8 options, it delivers both smooth on-road performance and exceptional off-road capabilities. The cabin features exquisite materials, advanced infotainment, and best-in-class comfort, making it a top choice for those who demand elegance and ruggedness in one vehicle. The 2024 model continues the legacy with even more tech, improved efficiency, and a bold design that stands out in any environment.`;

  return (
    <div className="w-[90%] px-5  relative mt-6">
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

export const BookingSection = ({ price }) => {
  return (
    <>
      <div className="w-full rounded-2xl border border-gray-800 p-3 ">
        {/* price section */}
        <div>
          <h2 className="text-2xl font-bold underline mt-3">{price} total</h2>
          <span className="text-sm font-semibold text-gray-400 mx-2">
            Before taxes
          </span>
          <hr className="bold mt-4 text-gray-700" />
        </div>
        {/* date section */}
        <div>
          <h3 className="text-2xl font-bold">Your trip</h3>
          
          <label htmlFor="start">Trip start</label>
          <div className="w-full p-2 ">

          <input type="date" className="border-1 rounded-2xl p-2 w-[60%] "/>
          <input type="time" className="border-1 rounded-2xl p-2 w-[35%] ml-5 "/>
        
         </div>

        <label htmlFor="end">Trip end</label>
        <div className="w-full p-2 ">

          <input type="date" className="border-1 rounded-2xl p-2 w-[60%] "/>
          <input type="time" className="border-1 rounded-2xl p-2 w-[35%] ml-5 "/>
        
         </div>
    
    </div>
      </div>
    </>
  );
};
