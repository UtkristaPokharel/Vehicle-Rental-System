import Footer from './Footer.jsx'
import Navbar from './Navbar.jsx'
import { RiMotorbikeFill , RiEBike2Fill , RiTruckFill} from "react-icons/ri";
import { FaCar,FaBus } from "react-icons/fa";
import { PiTruckTrailerFill } from "react-icons/pi";



function Home() {
  return (
    <>
    <Navbar />
      <div className="Home-page flex justify-center flex-col items-center">
        <div className=" w-full h-screen flex justify-center items-center bg-gradient-to-b  from-amber-300 to-amber-600">
          <h1 className="w-full text-white text-4xl font-bold text-center ">
            {" "}
            Here will be image for EasyWheel
          </h1>
        </div>

        {/* <div className="main-image flex justify-center items-center flex-col ">
   <div className="  absolute top-[-500px] overflow-hidden  lg:w-[75vw] lg:h-[75vw]  w-[900px] h-[900px]   bg-gradient-to-b from-blue-200 to-blue-800 rounded-full z-0" ></div>
   <div className="  h-[100px] w-[300px]  z-100 text-3xl font-bold text-center mt-2 text-white"> Most Convenient Platform For Vehicle Rental</div>
  <img src="src\images\main-page-removebg.png" className=" max-w-[1100px] w-[80vw] min-w-[400px]  z-5  overflow-hidden " />
    </div> */}
        <div className="vehicle-browse flex justify-center items-center flex-col mt-4 p-3">
          <h2 className="text-3xl font-bold text-center m-12">
            Browse Our Vehicles
          </h2>

          <div className ="flex flex-wrap justify-center items-center gap-20 list-none mb-4 text-2xl" >
          
            <li className=' text-center'><RiMotorbikeFill/> <h1 className=' mt-1 text-sm font-bold'>Bike</h1> </li>
            <li className=' text-center'><RiEBike2Fill className='w-full'/><h1 className=' mt-1 text-sm font-bold'>Scooter</h1> </li>
            <li className=' text-center' ><RiTruckFill className='w-full'/><h1 className=' mt-1 text-sm font-bold'>Truck</h1> </li>
            <li  className=' text-center' ><PiTruckTrailerFill className='w-full' /><h1 className=' mt-1 text-sm font-bold'>CargoTruck</h1> </li>
            <li className=" text-center"><FaCar className='w-full'/><h1 className='mt-1 text-sm font-bold'>Car </h1> </li>
            <li className=" text-center"><FaBus className='w-full'/><h1 className='mt-1 text-sm font-bold'>Bus</h1> </li>
        
          </div>


        </div>
        
        {/* info-boxes */}
        <div className="info-section p-10  flex justify-center flex-row items-center flex-wrap lg:flex-nowrap  gap-10">

          <div className="box1 bg-cyan-200 md:w-[450px]  md:h-70 w-[80vw] h-75  rounded-2xl ">
            <h2 className='text-2xl font-bold  mx-10 mt-13 mb-2 '>Are you looking for a car, bike, scooter, truck ... ?</h2>
            <h4 className='text-md font-semibold text-gray-600 mx-10 '> We provide a platform for easy and affordable solution for renting a vehicle</h4>
            <button className=' bg-red-500  text-white font-bold px-3 py-2 mt-8 mx-10 rounded-xl'> Get Started</button>

          </div>

          {/* box-2's content must be changed */}
          <div className="box2 bg-amber-200 md:w-[450px] md:h-70  w-[80vw] h-85 rounded-2xl">
                <h2 className='text-2xl font-bold  mx-10 mt-13 mb-2 '>Are you looking for a car, bike, scooter, truck ... ?</h2>
            <h4 className='text-md font-semibold text-gray-600 mx-10 '> We provide a platform for easy and affordable solution for renting a vehicle</h4>
            <button className=' bg-red-500  text-white font-bold px-3 py-2 mt-8 mx-10 rounded-xl'> Get Started</button>

          </div>

        </div>

      </div>
    <Footer />  
    </>
  );
}

export default Home;
