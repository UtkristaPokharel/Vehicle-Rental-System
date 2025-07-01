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
      {/* <div>{name}</div>
<div>{price}</div>
<div>{image}</div>
<div>{dateRange}</div>
<div>{id}</div> */}
      <Navbar />
      <div className="detail-page flex justify-center item-center">
        <div className=" h-screen w-full md:w-[85vw] lg:w-[80vw] px-10 ">
          <div className=" py-5  flex justify-center items-center ">
            <img className="lg:w-[650px]" src={image} alt={name} />
          </div>
       <section className="w-[60%]  p-6">
  <h1 className="text-3xl font-bold">{name}</h1>
  <p className="text-gray-500"></p>

  <div className="flex items-center gap-2 mt-2 text-sm">
    <span className="font-bold text-lg text-black">5.0</span>
    <span className="text-blue-600">
      <FaStar/>
    </span>
    <span className="text-gray-600">(21 trips)</span>
    {/* <span className="text-purple-600 flex items-center gap-1 ml-2">
      <svg className="w-4 h-4 fill-purple-600" viewBox="0 0 24 24">
        <path d="M12 2L13.09 8.26L19 8.27L14 12.14L15.18 18.02L12 14.77L8.82 18.02L10 12.14L5 8.27L10.91 8.26L12 2Z" />
      </svg>
      All-Star Host
    </span> */}
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

<VehicleDescription/>


        </div>
      </div>
    </>
  );
}

export default VehicleDetails;


export const VehicleDescription =()=>{
    const [expanded,setExpanded]=useState(false);

  const description = `The Range Rover is an iconic luxury SUV known for its unmatched combination of refinement, capability, and cutting-edge technology. With a powerful engine lineup, including hybrid and V8 options, it delivers both smooth on-road performance and exceptional off-road capabilities. The cabin features exquisite materials, advanced infotainment, and best-in-class comfort, making it a top choice for those who demand elegance and ruggedness in one vehicle. The 2024 model continues the legacy with even more tech, improved efficiency, and a bold design that stands out in any environment.`;

  return(
     <div className=" w-[60%] relative mt-6">
        <div className={`relative text-gray-700 text-sm leading-relaxed transition-all duration-300 ${
          expanded ? "line-clamp-none max-h-full" : "line-clamp-5 max-h-[7.5rem]"
        }`}>
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
}