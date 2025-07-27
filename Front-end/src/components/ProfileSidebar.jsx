import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart,  FaCar, FaMapMarkerAlt, FaAngleRight , FaHistory, } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdDashboardCustomize } from "react-icons/md";

import axios from "axios";
import Logout from "../pages/Api/Logout.jsx";
import { getApiUrl } from "../config/api";
const defaultProfile = "https://imgs.search.brave.com/XfEYZ8GiGdxGCdS_JsblVMJV7ufqdKMwU1a9uPFGtjg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvNS9Qcm9m/aWxlLVBORy1GcmVl/LUltYWdlLnBuZw";

export default function ProfileSidebar({ isOpen, onClose }) {
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImg, setProfileImg] = useState(defaultProfile);
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(defaultProfile);
  const [licenseFront, setLicenseFront] = useState(null);
  const [licenseBack, setLicenseBack] = useState(null);
  const [licenseFrontPreview, setLicenseFrontPreview] = useState(null);
  const [licenseBackPreview, setLicenseBackPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isHost, setIsHost] = useState(false);
  const fileInputRef = useRef(null);
  const sidebarRef = useRef(null);

  // Fetch user profile from backend
  useEffect(() => {
    if (isOpen) {
      const fetchProfile = async () => {
        const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
        if (!token) return;
        try {
          const res = await axios.get(getApiUrl("api/fetch/users/me"), {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          // Handle both old and new response structures
          const userData = res.data.data || res.data;
          
          setName(userData.name || "");
          setEmail(userData.email || "");
          setProfileImg(userData.imgUrl || defaultProfile);
          setProfileImagePreview(userData.imgUrl || defaultProfile);
          if (userData.licenseFront) setLicenseFrontPreview(userData.licenseFront);
          if (userData.licenseBack) setLicenseBackPreview(userData.licenseBack);
          
          // Set host status from user data
          setIsHost(userData.isHost || false);
          
          // Update localStorage and notify navbar if profile image exists
          if (userData.imgUrl) {
            localStorage.setItem("profileImg", userData.imgUrl);
            window.dispatchEvent(new Event('profileImageUpdated'));
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      };
      fetchProfile();
    }
  }, [isOpen]);

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
        setIsEdit(false);
      }
    };

    if (isOpen) {
      // Add a small delay to prevent immediate closing when opening
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle ESC key to close sidebar
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleLicenseFrontChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLicenseFront(file);
      setLicenseFrontPreview(URL.createObjectURL(file));
    }
  };

  const handleLicenseBackChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLicenseBack(file);
      setLicenseBackPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      
      // Update basic profile info
      if (name || email || password) {
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (password) updateData.password = password;
        
        await axios.put(getApiUrl("api/fetch/users/me"), updateData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // Upload profile image
      if (profileImage) {
        const formData = new FormData();
        formData.append("profileImage", profileImage);
        const res = await axios.post(
          getApiUrl("api/fetch/users/upload-profile"),
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.imgUrl) {
          setProfileImg(res.data.imgUrl);
          setProfileImagePreview(res.data.imgUrl);
          localStorage.setItem("profileImg", res.data.imgUrl);
          window.dispatchEvent(new Event('profileImageUpdated'));
        }
      }

      // Upload license images
      if (licenseFront || licenseBack) {
        const formData = new FormData();
        if (licenseFront) formData.append("licenseFront", licenseFront);
        if (licenseBack) formData.append("licenseBack", licenseBack);
        const res = await axios.post(
          getApiUrl("api/fetch/users/upload-license"),
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.uploadedFiles) {
          if (res.data.uploadedFiles.licenseFront) {
            setLicenseFrontPreview(res.data.uploadedFiles.licenseFront);
          }
          if (res.data.uploadedFiles.licenseBack) {
            setLicenseBackPreview(res.data.uploadedFiles.licenseBack);
          }
        }
      }
      setSuccessMsg("Profile updated successfully!");
      setPassword("");
      setProfileImage(null);
      
      setTimeout(() => {
        setIsEdit(false);
      }, 1000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          w-full sm:w-80 md:w-96 lg:w-[420px]
          max-w-full overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
          <h2 className="text-2xl md:text-2xl font-bold text-gray-800">
            {isEdit ? "Edit Profile" : "Profile"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors touch-manipulation"
            aria-label="Close profile sidebar"
          >
            <IoClose className="text-2xl md:text-3xl text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto pb-16 md:pb-20 hide-scrollbar">
          {isEdit ? (
            <div className="p-3 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center gap-3 md:gap-4">
                  <div className="relative">
                    <img
                      src={profileImagePreview}
                      alt="Profile"
                      className="w-40 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 md:p-2 rounded-full shadow-lg hover:bg-blue-700 transition touch-manipulation"
                    >
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base md:text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base md:text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base md:text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Leave blank to keep current password"
                    />
                  </div>
                </div>

                {/* License Upload Section */}
                <div className="space-y-2 md:space-y-3">
                  <label className="block text-sm md:text-base font-medium text-gray-700">License Images</label>
                  <div className="grid grid-cols-2 gap-2 md:gap-4">
                    <div className="space-y-1 md:space-y-2">
                      <span className="text-sm text-gray-500">Front</span>
                      <div 
                        className="relative w-full h-40 md:h-20 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer hover:border-gray-400 transition touch-manipulation"
                        onClick={() => document.getElementById('licenseFrontInput').click()}
                      >
                        {licenseFrontPreview ? (
                          <img src={licenseFrontPreview} alt="License Front" className="object-cover w-full h-full rounded-lg" />
                        ) : (
                          <div className="text-center">
                            <svg className="w-4 h-4 md:w-6 md:h-6 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span className="text-sm text-gray-400">Add Front</span>
                          </div>
                        )}
                      </div>
                      <input 
                        id="licenseFrontInput"
                        type="file" 
                        accept="image/*" 
                        onChange={handleLicenseFrontChange} 
                        className="hidden" 
                      />
                    </div>
                    
                    <div className="space-y-1  md:space-y-2">
                      <span className="text-sm text-gray-500">Back</span>
                      <div 
                        className="relative w-full h-40 md:h-20 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer hover:border-gray-400 transition touch-manipulation"
                        onClick={() => document.getElementById('licenseBackInput').click()}
                      >
                        {licenseBackPreview ? (
                          <img src={licenseBackPreview} alt="License Back" className="object-cover w-full h-full rounded-lg" />
                        ) : (
                          <div className="text-center">
                            <svg className="w-4 h-4 md:w-6 md:h-6 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span className="text-sm text-gray-400">Add Back</span>
                          </div>
                        )}
                      </div>
                      <input 
                        id="licenseBackInput"
                        type="file" 
                        accept="image/*" 
                        onChange={handleLicenseBackChange} 
                        className="hidden" 
                      />
                    </div>
                  </div>
                </div>

                {/* Messages */}
                {successMsg && <div className="text-green-600 text-xs md:text-sm font-medium">{successMsg}</div>}
                {errorMsg && <div className="text-red-600 text-xs md:text-sm font-medium">{errorMsg}</div>}

                {/* Action Buttons */}
                <div className="flex gap-2 md:gap-3 pt-3 md:pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEdit(false)}
                    className="flex-1 px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition touch-manipulation"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-3 md:px-4 py-2 text-sm md:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 touch-manipulation"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-3 md:p-6">
              {/* Profile Header */}
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <img
                  src={profileImg}
                  alt="Profile"
                  className="w-25 h-25 md:w-20 md:h-20 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl md:text-lg font-semibold text-gray-800 truncate">{name || 'User'}</h3>
                  <p className="text-md md:text-sm text-gray-500 truncate">{email ? email.split("@")[0] : 'No email'}</p>
                  <button
                    onClick={() => setIsEdit(true)}
                    className="mt-1 md:mt-2 px-2 md:px-3 py-1 text-md  md:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition touch-manipulation"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
           
              {/* Settings Menu */}
              <div className="space-y-1 pt-5">
                  <hr className="border-gray-200 mb-4 md:mb-6" />
                <SidebarSettingsMenu isHost={isHost} onClose={onClose} />
                   {/* License Display */}
              {(licenseFrontPreview || licenseBackPreview) && (
                <div className="mb-4 md:mb-6">
                  <h4 className="text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3">Driving License</h4>
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    {licenseFrontPreview && (
                      <div className="space-y-1">
                        <span className="text-xs text-gray-500">Front</span>
                        <div className="w-full h-40 md:h-36 border border-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={licenseFrontPreview} 
                            alt="License Front" 
                            className="object-cover w-full h-full" 
                          />
                        </div>
                      </div>
                    )}
                    {licenseBackPreview && (
                      <div className="space-y-1">
                        <span className="text-xs text-gray-500">Back</span>
                        <div className="w-full h-40 md:h-36 border border-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={licenseBackPreview} 
                            alt="License Back" 
                            className="object-cover w-full h-full" 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

                <div className="pt-3 md:pt-4 flex justify-center">
                  <Logout />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line no-unused-vars
function SidebarSettingsItem({ icon: Icon, label, to, onClose }) {
  if (label !== 'Logout') {
    return (
      <>
      <Link
        to={to}
        onClick={onClose}
        className="flex items-center justify-between px-3 md:px-4 py-1  rounded-lg  hover:bg-gray-300 transition touch-manipulation"
      >
        <div className="flex items-center gap-2 md:gap-3 text-3xl text-gray-700 min-w-0 ">
          <Icon className=" md:text-lg flex-shrink-0 text-xl " />
          <span className="text-lg pl-2 md:text-sm font-medium truncate"> {label}</span>
        </div>
        <span className="text-gray-400 text-xs md:text-sm flex-shrink-0">{<FaAngleRight/>}</span>

      </Link>
      <hr className="border-gray-200 my-2 md:my-3" />
      </>
    );
  }
  return null;
}

const sidebarMenuItems = [
  { label: "Favourites", to: "/favorites", icon: FaHeart },
  { label: "Add Vehicle", to: "/add-vehicle", icon:FaCar }, 
  { label: "Booking History", to: "/booking-history", icon: FaHistory },
];

function SidebarSettingsMenu({ isHost, onClose }) {
  const menuItems = [...sidebarMenuItems];
  
  // Add Host Dashboard for hosts
  if (isHost) {
    menuItems.splice(1, 0, { label: "Host Dashboard", to: "/host-dashboard", icon: MdDashboardCustomize });
  }
  
  return (
    <div className="space-y-1">
      {menuItems.map((item, index) => (
        <SidebarSettingsItem
          key={index}
          label={item.label}
          to={item.to}
          icon={item.icon}
          onClose={onClose}
        />
      ))}
    </div>
  );
}
