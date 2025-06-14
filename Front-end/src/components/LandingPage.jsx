import VehicleImage from '../images/offroad.png';

function LandingPage() {
  return (
    <div className="flex flex-wrap-reverse items-center justify-center gap-[4vw] w-full px-6 py-12 bg-[#f6f6f6] font-sans">
      <div className="w-full md:max-w-[600px] flex justify-center items-center flex-col ">
        <p className="text-[16px] md:text-[20px] text-[#333] mb-2">
          All discount just for you
        </p>
        <h1 className="text-red-600 text-[28px] md:text-[40px] font-bold my-1">
          Need A Ride?
        </h1>
        <h2 className="text-[24px] md:text-[36px] font-black text-[#111] my-2  text-center">
          CHOOSE YOUR<br />COMFORTABLE VEHICLES
        </h2>
        <p className="text-[16px] md:text-[22px] text-[#555] mb-4 md:mb-6">
          Best worldwide VEHICLE hire deals!!!!!
        </p>
        <button className="bg-black text-white text-[16px] md:text-[20px] px-6 py-3 hover:bg-red-600 transition">
          Contact Now
        </button>
      </div>

      <div className="w-full md:max-w-[500px] flex justify-center">
        <img
          src={VehicleImage}
          alt="Vehicle"
          className="w-full h-auto max-h-[300px] md:max-h-[400px] object-contain"
        />
      </div>
    </div>
  );
}

export default LandingPage;
