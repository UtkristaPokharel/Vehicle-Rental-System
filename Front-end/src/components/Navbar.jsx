import { useState, useRef, useEffect } from 'react'
import { IoMenu, IoClose } from "react-icons/io5";
// import profile from "../../public/whiteprofile.svg"
import { useNavigate } from 'react-router-dom';

export default  function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const menuref = useRef(null);
    const profileImg = localStorage.getItem("profileImg")
    const profile = "https://imgs.search.brave.com/XfEYZ8GiGdxGCdS_JsblVMJV7ufqdKMwU1a9uPFGtjg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvNS9Qcm9m/aWxlLVBORy1GcmVl/LUltYWdlLnBuZw"
    const imgUrl = profileImg || profile;

    const navigate = useNavigate();

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

    const handleProfileClick = () => {
        const token = localStorage.getItem("token")

        if (token) {
            navigate("/profile")
        } else {
            navigate("/login")
        }

    }

    const handleFAQClick = () => {
        const isHome = window.location.pathname === '/';

        if (isHome) {
            const faqSection = document.getElementById('faq-section');
            if (faqSection) {
                faqSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate('/', { state: { scrollToFAQ: true } });

            setTimeout(() => {
                const faqSection = document.getElementById('faq-section');
                if (faqSection) {
                    faqSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500);
        }

        setIsOpen(false);
    };
    const handleContactUsClick = () => {
        const isHome = window.location.pathname === '/';

        if (isHome) {
            const ContactUsSection = document.getElementById('contactus-section');
            if (ContactUsSection) {
                ContactUsSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate('/', { state: { scrollToContactUs: true } });

            setTimeout(() => {
                const ContactUsSection = document.getElementById('contactus-section');
                if (ContactUsSection) {
                    ContactUsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500);
        }

        setIsOpen(false);
    };

    return (
        <>
            <nav className='sticky top-0 left-0 w-full h-18 bg-black flex justify-around items-center gap-10 px-3 xl:px-10 z-10'>
                <div> <img src="/logo.png" alt="EasyWheels Logo" className="h-30" /></div>
                <div className='flex gap-10 items-center text-white text-lg '>
                    <ul className='hidden xl:flex space-x-9'>
                        <li><a href="/" className=' hover:decoration-red-600 decoration-3 hover:underline hover:underline-offset-8'>Home</a></li>
                        <li><a href="/about" className=' hover:decoration-red-600 decoration-3 hover:underline hover:underline-offset-8'>About us</a></li>
                        <li><a href="#" className=' hover:decoration-red-600 decoration-3 hover:underline hover:underline-offset-8'>Vehicles</a></li>
                        {/* <li><a href="/contact" className=' hover:decoration-red-600 decoration-3 hover:underline hover:underline-offset-8'>Contact us</a></li> */}
                        <li>
                            <button
                                onClick={handleContactUsClick}
                                className="hover:decoration-red-600 decoration-3 hover:underline hover:underline-offset-8"
                            >
                                Contact Us
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={handleFAQClick}
                                className="hover:decoration-red-600 decoration-3 hover:underline hover:underline-offset-8"
                            >
                                FAQ
                            </button>
                        </li>
                    </ul>

                    <button className="flex border-0 px-4 py-2 bg-red-600 text-white text-sm md:text-base rounded-2xl hover:cursor-pointer hover:scale-110 transition-transform duration-200">
                        Become a host
                    </button>

                    <button className='profile-icon ' onClick={handleProfileClick}>
                        <img src={imgUrl===null?imgUrl:profile} className='w-10 h-10 rounded-full bg-white' alt="" />
                    </button>

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
                        <li><a href="/about" className='text-white hover:text-gray-400'>About us</a></li>
                        <li><a href="#" className='text-white hover:text-gray-400'>Vehicles</a></li>
                        <li><a href="/contact" className='text-white hover:text-gray-400'>Contact us</a></li>
                        <li>
                            <button onClick={handleFAQClick} className="text-white hover:text-gray-400">
                                FAQ
                            </button>
                        </li>
                    </div>
                </div>
            </nav>
        </>
    )
}