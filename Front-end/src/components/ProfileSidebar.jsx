import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaDownload, FaLanguage, FaMapMarkerAlt, FaTrashAlt, FaHistory, FaSignOutAlt } from "react-icons/fa";
import { MdSubscriptions } from "react-icons/md";
import { IoClose } from "react-icons/io5";
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
          setName(res.data.name);
          setEmail(res.data.email);
          setProfileImg(res.data.imgUrl || defaultProfile);
          setProfileImagePreview(res.data.imgUrl || defaultProfile);
          if (res.data.licenseFront) setLicenseFrontPreview(res.data.licenseFront);
          if (res.data.licenseBack) setLicenseBackPreview(res.data.licenseBack);
          
          // Update localStorage and notify navbar if profile image exists
          if (res.data.imgUrl) {
            localStorage.setItem("profileImg", res.data.imgUrl);
            window.dispatchEvent(new Event('profileImageUpdated'));
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      };
      fetchProfile();
    }
  }, [isOpen]);

  // Handle click outside to close sidebar (only for desktop)
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close on outside click for desktop (md and above)
      if (window.innerWidth >= 768 && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
        setIsEdit(false); 
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
              setIsEdit(false); 

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
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-opacity-50 z-40" 
        onClick={() => {
          // On mobile, allow backdrop click to close
          if (window.innerWidth < 768) {
            onClose();
          }
        }}
      />
      
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          w-full md:w-96 lg:w-[420px]
          md:max-w-md lg:max-w-lg`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {isEdit ? "Edit Profile" : "Profile"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Close profile sidebar"
          >
            <IoClose className="text-2xl text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto pb-20">
          {isEdit ? (
            <div className="p-4 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <img
                      src={profileImagePreview}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Leave blank to keep current password"
                    />
                  </div>
                </div>

                {/* License Upload Section */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">License Images</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-xs text-gray-500">Front</span>
                      <div 
                        className="relative w-full h-20 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer hover:border-gray-400 transition"
                        onClick={() => document.getElementById('licenseFrontInput').click()}
                      >
                        {licenseFrontPreview ? (
                          <img src={licenseFrontPreview} alt="License Front" className="object-cover w-full h-full rounded-lg" />
                        ) : (
                          <div className="text-center">
                            <svg className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span className="text-xs text-gray-400">Add Front</span>
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
                    
                    <div className="space-y-2">
                      <span className="text-xs text-gray-500">Back</span>
                      <div 
                        className="relative w-full h-20 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer hover:border-gray-400 transition"
                        onClick={() => document.getElementById('licenseBackInput').click()}
                      >
                        {licenseBackPreview ? (
                          <img src={licenseBackPreview} alt="License Back" className="object-cover w-full h-full rounded-lg" />
                        ) : (
                          <div className="text-center">
                            <svg className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span className="text-xs text-gray-400">Add Back</span>
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
                {successMsg && <div className="text-green-600 text-sm font-medium">{successMsg}</div>}
                {errorMsg && <div className="text-red-600 text-sm font-medium">{errorMsg}</div>}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEdit(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-4 md:p-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={profileImg}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
                  <p className="text-sm text-gray-500">{email.split("@")[0]}</p>
                  <button
                    onClick={() => setIsEdit(true)}
                    className="mt-2 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* License Display */}
              {(licenseFrontPreview || licenseBackPreview) && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Driving License</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {licenseFrontPreview && (
                      <div className="space-y-1">
                        <span className="text-xs text-gray-500">Front</span>
                        <div className="w-full h-36 border border-gray-200 rounded-lg overflow-hidden">
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
                        <div className="w-full h-36 border border-gray-200 rounded-lg overflow-hidden">
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

              {/* Settings Menu */}
              <div className="space-y-1">
                <SidebarSettingsMenu />
                <div className="pt-4 flex justify-center
                ">

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

function SidebarSettingsItem({ icon: Icon, label, to }) {
  if (label !== 'Logout') {
    return (
      <Link
        to={to}
        className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition"
      >
        <div className="flex items-center gap-3 text-gray-700">
          <Icon className="text-lg" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-gray-400 text-sm">{">"}</span>
      </Link>
    );
  }
  return null;
}

const sidebarMenuItems = [
  { label: "Favourites", to: "/favorites", icon: FaHeart },
  { label: "Your  vehicles" , icon: FaMapMarkerAlt },
  { label: "Clear cache", to: "/", icon: FaTrashAlt },
  { label: "Bookin History", to: "/", icon: FaHistory },
];

function SidebarSettingsMenu() {
  return (
    <div className="space-y-1">
      {sidebarMenuItems.map((item, index) => (
        <SidebarSettingsItem
          key={index}
          label={item.label}
          to={item.to}
          icon={item.icon}
        />
      ))}
    </div>
  );
}
