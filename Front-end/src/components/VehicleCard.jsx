import { FaRegHeart } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";


export default function VehicleCard() {
  return (
    <>
      <div className="vehicle-card w-90 rounded-xl mt-4 bg-white border border-gray-300 shadow-xl">
       
        <div className="img-container relative">
          <img
            className="w-full h-40 rounded-t-xl object-center  object-cover"
            src="https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg"
            alt=""
          />

          <div className="fav-btn absolute top-2 right-2 w-8 bg-gray-100 rounded p-2">
            <FaRegHeart />
          </div>
        </div>


<div className="detail-container">
        <div className="detail px-4 pt-3 text-start">
          <h3 className="text-xl font-bold">Vehicle Name</h3>
          <div className="flex flex-row items-center gap-1 font-bolder" >
           4.5 <FaStar/> 
          </div>
          <div className="dates text-sm "> July 3 - 29</div>
        </div>

        <div className="pricing flex flex-col items-end mb-3 mr-3">
          <span className="font-bold underline">रु 5000 total</span>
          <span className="text-sm text-shadow-black"> Before texes</span>
        </div>
      </div>
      </div>
    </>
  );
}
