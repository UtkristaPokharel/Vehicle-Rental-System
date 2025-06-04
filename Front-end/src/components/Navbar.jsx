import {useState,useRef,useEffect} from 'react'
import { IoMenu, IoClose } from "react-icons/io5";
import profile from "../../public/whiteprofile.svg"


export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const menuref = useRef(null);

useEffect(()=>{

  const  handleClickOutside =(event)=>{
    const target = event.target ;

    if (menuref.current && !menuref.current.contains(target)){
        setIsOpen(false);
    }
  };
    document.addEventListener('mousedown',handleClickOutside);
    return () => {
        document.removeEventListener('mousedown',handleClickOutside);
    }
  
},[isOpen]);

    const handleToggle = () => {
        setIsOpen(prev=> !prev);
      };

  return (
   <>
    <nav className=' relative w-full h-16 bg-gray-800 flex justify-between items-center px-3 xl:px-10 z-10'>
        <div><span className='text-white text-2xl font-bold'>EasyWheels</span></div>
        <div className='flex gap-6 items-center text-white '>
            <ul className='hidden xl:flex space-x-9'>
                <li><a href="#" className=' hover:text-gray-400'>Home</a></li>
                <li><a href="#" className=' hover:text-gray-400'>About us</a></li>
                <li><a href="#" className=' hover:text-gray-400'>Vehicles</a></li>
                <li><a href="#" className=' hover:text-gray-400'>Contact</a></li>
            </ul>

         <button className=' border px-2 py-1  rounded-xl hover:cursor-pointer hover:scale-105  '  > Become a host</button>
        <div className='profile-icon  '>
            <img src={profile} className='w-9'  alt="" />
             </div>

        <button  className='xl:hidden text-white' onClick={handleToggle}> 
             {isOpen ? <IoClose className="ham-menu text-3xl" /> : <IoMenu className="ham-menu text-3xl" />} 
        </button>

         {/* for mobile  or tablet view */}
        <div 
        ref ={menuref}
         className={` xl:hidden text-white absolute top-16 right-0 bg-gray-600 w-30
          h-30 list-none pl-5 transition-all duration-300 ease-in-out 
            ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                <li><a href="#" className='text-white hover:text-gray-400'>Home</a></li>
                <li><a href="#" className='text-white hover:text-gray-400'>About us</a></li>
                <li><a href="#" className='text-white hover:text-gray-400'>Vehicles</a></li>
                <li><a href="#" className='text-white hover:text-gray-400'>Contact</a></li>
            </div> 
            
            
        </div>
    </nav>
   </>
  )
}
