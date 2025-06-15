export default function VehicleCard() {
  return (
    <>
      <div className="vehicle-card w-65   bg-gray-200">
        <div className="img-container  p-4 ">
          <img
            className=" w-full h-64  object-top-center object-cover"
            src="https://images.pexels.com/photos/1413412/pexels-photo-1413412.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt=""
          />
        </div>
        <h3 className="text-2xl font-bold text-center underline m-2">
          Vehicle Name
        </h3>
        <p className="w-64 px-1.5 h-6 overflow-hidden whitespace-nowrap text-ellipsis hover:whitespace-normal hover:overflow-visible hover:h-auto transition-all">
          Description for the vehicles to make it strong for attcting the user
          /customer
        </p>
        <button className="bg-black text-sm text-white m-2 p-2">
          Browse vehicle
        </button>
      </div>
    </>
  );
}
