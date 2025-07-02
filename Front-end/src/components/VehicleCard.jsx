import { FaRegHeart } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router";
import vehicleData from "../assets/Sample.json"

export const  VehicleCard =({vehicle,type})=>{
  return(
  
    <Link 
     to={`/vehicle/${type}/${vehicle.id}`}
     state={{
      id:vehicle.id,
      name:vehicle.name,
      image:vehicle.image,
      dateRange:vehicle.dateRange,
      price:vehicle.price,
     }}
    
    >

    <div key={vehicle.id} className="vehicle-card w-full rounded-xl bg-white border border-gray-300 shadow-xl">
      <div className="img-container relative">
        <img
          className="w-full h-40 rounded-t-xl object-cover object-center"
          src={vehicle.image}
          alt={vehicle.name}
        />
        <div className="fav-btn absolute top-2 right-2 w-8 bg-gray-100 rounded p-2">
          <FaRegHeart />
        </div>
      </div>

      <div className="detail-container">
        <div className="detail px-4 pt-3 text-start">
          <h3 className="text-xl font-bold">{vehicle.name}</h3>
          <div className="flex flex-row items-center gap-1 font-bolder">
            4.5 <FaStar />
          </div>
          <div className="dates text-sm">{vehicle.dateRange}</div>
        </div>

        <div className="pricing flex flex-col items-end mb-3 mr-3">
          <span className="font-bold underline">{vehicle.price} total</span>
          <span className="text-sm text-gray-500">Before taxes</span>
        </div>
      </div>
    </div>
    
    </Link>
  )

}



export default function Vehicle({type}) {

  const vehicles= vehicleData;
 
  return (
    <>
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
  {vehicles.map((vehicle) => (

    <VehicleCard  type={type} vehicle={vehicle} key={vehicle.id} />
    
    
  ))}
  
</div>

    </>
  );
}


