import { FaRegHeart } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router";


export const  VehicleCard =({vehicle})=>{
  return(
    <Link to={`/vehicle/${vehicle.id}`}>
                {/* {console.log(vehicle)} */}
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



export default function Vehicle() {

  const vehicles = [
  {
    name: "Toyota Fortuner",
    id:1,
    rating: 4.5,
    dateRange: "July 3 - 29",
    price: "रु 5000",
    image: "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg",
  },
  {
    name: "Jeep Wrangler",
    id:2,
    rating: 4.8,
    dateRange: "Aug 1 - 15",
    price: "रु 7000",
    image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
  },
  {
    name: "Hyundai Creta",
    id:3,
    rating: 4.2,
    dateRange: "Sept 5 - 22",
    price: "रु 5500",
    image: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
  },
  {
    name: "Mahindra Scorpio",
    id:4,
    rating: 4.7,
    dateRange: "Oct 1 - 10",
    price: "रु 6000",
    image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
  },
  {
    name: "Suzuki Swift",
    id:5,
    rating: 4.3,
    dateRange: "Oct 15 - Nov 2",
    price: "रु 5200",
    image: "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg",
  },
  {
    name: "Hyundai Santro",
    id:6,
    rating: 4.6,
    dateRange: "Nov 10 - Dec 1",
    price: "रु 7500",
    image: "https://images.pexels.com/photos/114905/pexels-photo-114905.jpeg",
  },
  {
    name: "Land Cruser",
    id:7,
    rating: 4.4,
    dateRange: "Dec 5 - 20",
    price: "रु 6800",
    image: "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg",
  },
  {
    name: "Range Rover",
    id:8,
    rating: 4.9,
    dateRange: "Jan 1 - 12",
    price: "रु 9500",
    image: "https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg",
  },
];

  return (
    <>
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
  {vehicles.map((vehicle) => (

    <VehicleCard vehicle={vehicle} key={vehicle.id} />
    
    
  ))}
  
</div>

    </>
  );
}


