import { useState, useRef, useEffect } from 'react'
import { IoMenu, IoClose } from "react-icons/io5";
import profile from "../../public/whiteprofile.svg"
import {useUserContext} from "../context/UserContext"


export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const menuref = useRef(null);
    const {user}= useUserContext();
    const imgUrl = user?.imgUrl || profile ;

    useEffect(() => {

        const handleClickOutside = (event) => {
            const target = event.target;

            if (menuref.current && !menuref.current.contains(target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }

    }, [isOpen]);

    const handleToggle = () => {
        setIsOpen(prev => !prev);
    };

    return (
        <>
            <nav className='static w-full h-18 bg-black flex justify-around items-center gap-10 px-3 xl:px-10 z-10'>
                <div> <img src="/logo.png" alt="EasyWheels Logo" className="h-30" /></div>
                <div className='flex gap-10 items-center text-white text-lg '>
                    <ul className='hidden xl:flex space-x-9'>
                        <li><a href="/" className=' hover:decoration-red-600 decoration-3 hover:underline hover:underline-offset-8'>Home</a></li>
                        <li><a href="#" className=' hover:decoration-red-600 decoration-3 hover:underline hover:underline-offset-8'>About us</a></li>
                        <li><a href="#" className=' hover:decoration-red-600 decoration-3 hover:underline hover:underline-offset-8'>Vehicles</a></li>
                        <li><a href="#" className=' hover:decoration-red-600 decoration-3 hover:underline hover:underline-offset-8'>Contact us</a></li>
                        <li><a href="/faq" className=' hover:decoration-red-600 decoration-3 hover:underline hover:underline-offset-8'>FAQ</a></li>
                    </ul>

                    <button className="flex border-0 px-4 py-2 bg-red-600 text-white text-sm md:text-base rounded-2xl hover:cursor-pointer hover:scale-110 transition-transform duration-200">
                        Become a host
                    </button>

                    <div className='profile-icon  '>
                        <a href="/profile"><img src={imgUrl} className='w-10 rounded-full' alt="" /></a>
                    </div>

                    <button className='xl:hidden text-white' onClick={handleToggle}>
                        {isOpen ? <IoClose className="ham-menu text-3xl" /> : <IoMenu className="ham-menu text-3xl" />}
                    </button>

                    {/* for mobile  or tablet view */}
                    <div
                        ref={menuref}
                        className={` xl:hidden text-white absolute top-16 right-0 bg-gray-600 w-30
          h-35 list-none pl-5 transition-all duration-300 ease-in-out 
            ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                        <li><a href="/" className='text-white hover:text-gray-400'>Home</a></li>
                        <li><a href="#" className='text-white hover:text-gray-400'>About us</a></li>
                        <li><a href="#" className='text-white hover:text-gray-400'>Vehicles</a></li>
                        <li><a href="#" className='text-white hover:text-gray-400'>Contact us</a></li>
                        <li><a href="/faq" className='text-white hover:text-gray-400'>FAQ</a></li>
                    </div>


                </div>
            </nav>
        </>
    )
}