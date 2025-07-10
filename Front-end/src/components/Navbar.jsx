import { useState, useRef, useEffect } from 'react'
import { IoMenu, IoClose } from "react-icons/io5";
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const menuref = useRef(null);
    const location = useLocation();

    const profileImg = localStorage.getItem("profileImg")
    const profile = "https://imgs.search.brave.com/XfEYZ8GiGdxGCdS_JsblVMJV7ufqdKMwU1a9uPFGtjg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvNS9Qcm9m/aWxlLVBORy1GcmVl/LUltYWdlLnBuZw"
    const imgUrl = profileImg || profile;

    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuref.current && !menuref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const handleToggle = () => setIsOpen(prev => !prev);

    const handleProfileClick = () => {
        const token = localStorage.getItem("token");
        if (token) navigate("/profile");
        else navigate("/login");
    }

    const handleFAQClick = () => {
        const isHome = window.location.pathname === '/';

        if (isHome) {
            const faqSection = document.getElementById('faq-section');
            if (faqSection) faqSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/', { state: { scrollToFAQ: true } });
            setTimeout(() => {
                const faqSection = document.getElementById('faq-section');
                if (faqSection) faqSection.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }

        setIsOpen(false);
    };

    const handleContactUsClick = () => {
        const isHome = window.location.pathname === '/';

        if (isHome) {
            const section = document.getElementById('contactus-section');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/', { state: { scrollToContactUs: true } });
            setTimeout(() => {
                const section = document.getElementById('contactus-section');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }

        setIsOpen(false);
    };

    const getLinkClass = (path) => {
        const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
        return `decoration-3 hover:underline hover:decoration-red-600 hover:underline-offset-8 ${
            isActive ? 'underline underline-offset-8 decoration-red-600' : ''
        }`;
    };

    return (
        <nav className='sticky top-0 left-0 w-full h-18 bg-black flex justify-around items-center gap-10 px-3 xl:px-10 z-10'>
            <div>
                <img src="/logo.png" alt="EasyWheels Logo" className="h-30" />
            </div>

            <div className='flex gap-10 items-center text-white text-lg'>
                {/* Desktop nav */}
                <ul className='hidden xl:flex space-x-9'>
                    <li><Link to="/" className={getLinkClass('/')}>Home</Link></li>
                    <li><Link to="/about" className={getLinkClass('/about')}>About us</Link></li>
                    <li><Link to="/browse" className={getLinkClass('/browse')}>Vehicles</Link></li>
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

                <button className='profile-icon' onClick={handleProfileClick}>
                    <img src={imgUrl} className='w-10 h-10 rounded-full bg-white' alt="profile" />
                </button>

                {/* Toggle button for mobile */}
                <button className='xl:hidden text-white' onClick={handleToggle}>
                    {isOpen ? <IoClose className="ham-menu text-3xl" /> : <IoMenu className="ham-menu text-3xl" />}
                </button>

                {/* Mobile menu */}
                <div
                    ref={menuref}
                    className={`xl:hidden text-white absolute top-16 right-0 bg-gray-600 w-30 h-35 list-none pl-5 transition-all duration-300 ease-in-out ${
                        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                >
                    <li><Link to="/" className="text-white hover:text-gray-400">Home</Link></li>
                    <li><Link to="/about" className="text-white hover:text-gray-400">About us</Link></li>
                    <li><Link to="/browse" className="text-white hover:text-gray-400">Vehicles</Link></li>
                    <li><button onClick={handleContactUsClick} className="text-white hover:text-gray-400">Contact us</button></li>
                    <li><button onClick={handleFAQClick} className="text-white hover:text-gray-400">FAQ</button></li>
                </div>
            </div>
        </nav>
    );
}
