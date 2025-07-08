import { useNavigate } from "react-router";
import { RiMotorbikeFill} from "react-icons/ri";
import { FaCar, FaBus } from "react-icons/fa";
import { PiTruckTrailerFill } from "react-icons/pi";
import VehicleCard from "../components/VehicleCard";
import vehicleData from '../assets/Sample.json';

const vehicleTypes = [
  { name: 'Two-Wheeler', icon: <RiMotorbikeFill /> },
  { name: 'Car', icon: <FaCar /> },
  { name: 'Truck', icon: <PiTruckTrailerFill /> },
  { name: 'Mini-Bus', icon: <FaBus /> },
];

 export default function VehicleBrowse()  {
  const navigate = useNavigate();

  const handleClick = (type) => {
    navigate(`/vehicles/${type}`);
  };

  return (
    <div className="vehicle-browse flex justify-center items-center flex-col my-10 p-3  w-[90vw] md:w-[80vw]">
      <h2 className="text-3xl font-bold text-center m-12">
        Browse Our Vehicles
      </h2>

      <ul className="flex flex-wrap justify-center items-center gap-20 list-none mb-4 text-2xl">
        {vehicleTypes.map((vehicle, index) => (
          <li
            key={index}
            className="text-center cursor-pointer  flex flex-col items-center "
            onClick={() => handleClick(vehicle.name)}
          >
            {vehicle.icon}
            <h1 className="mt-1 text-sm font-bold">{vehicle.name}</h1>
          </li>
        ))}
      </ul>

      
        <SuggestedVehicle/>
      
    </div>
  );
}; 


export const  SuggestedVehicle=()=>{
    const Vehicle = vehicleData;

  function generateUniqueRandomNumbers(){
    const numbers =new Set();

    while(numbers.size<6){
        const randomNum =Math.floor(Math.random()*24)+1;
        numbers.add(randomNum);
    }
    return Array.from(numbers);
  }
  const randomIds =generateUniqueRandomNumbers();
  const filteredVehicles = Vehicle.filter(
    Vehicle => randomIds.includes(Vehicle.id)
    )


  return(
        <>
        
        <div className="grid  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredVehicles.map((vehicle)=>
         <VehicleCard  vehicle={vehicle} key={vehicle.id} />)}

        </div>
        </>
    )
}