import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import {FaHeart,FaDownload,FaLanguage,FaMapMarkerAlt,FaTrashAlt,FaHistory,FaSignOutAlt,} from "react-icons/fa";
import { MdSubscriptions } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import ProfileImageUpload from "../context/ProfileUpload.jsx";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Logout from "./Api/logout.jsx";

const defaultProfile = "https://imgs.search.brave.com/XfEYZ8GiGdxGCdS_JsblVMJV7ufqdKMwU1a9uPFGtjg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvNS9Qcm9m/aWxlLVBORy1GcmVl/LUltYWdlLnBuZw";

function Profile() {
  const [isEdit, SetIsEdit] = useState(false);
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

  // Fetch user profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:3001/api/fetch/users/me", {
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
        setProfileImg(defaultProfile);
        setProfileImagePreview(defaultProfile);
      }
    };
    fetchProfile();
  }, []);

  // Handle profile image preview
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle license image preview
  const handleLicenseFrontChange = (e) => {
    const file = e.target.files[0];
    setLicenseFront(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLicenseFrontPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const handleLicenseBackChange = (e) => {
    const file = e.target.files[0];
    setLicenseBack(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLicenseBackPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    try {
      // Update name/password
      await axios.put(
        "http://localhost:3001/api/fetch/users/update-profile",
        { name, password: password || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem("name", name);
      // Upload profile image
      if (profileImage) {
        const formData = new FormData();
        formData.append("profileImg", profileImage);
        const res = await axios.post(
          "http://localhost:3001/api/fetch/users/upload-profile-image",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        localStorage.setItem("profileImg", res.data.imgUrl);
        setProfileImg(res.data.imgUrl);
        setProfileImagePreview(res.data.imgUrl);
        // Notify navbar of profile image update
        window.dispatchEvent(new Event('profileImageUpdated'));
      }
      // Upload license images
      if (licenseFront || licenseBack) {
        const formData = new FormData();
        if (licenseFront) formData.append("licenseFront", licenseFront);
        if (licenseBack) formData.append("licenseBack", licenseBack);
        await axios.post(
          "http://localhost:3001/api/fetch/users/upload-license",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setSuccessMsg("Profile updated successfully!");
      setPassword("");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-120 z-50">
        <div
          className="w-full relative
      "
        >
          {" "}
          <h1 className="text-3xl font-bold text-gray-700 py-5 text-center">
            {isEdit ? "Edit Profile" : "Profile"}
          </h1>
        </div>
        {isEdit ? (
          <div className=" text-3xl absolute left-105 top-4.5">
            <button
              className="  p-2
        "
              onClick={(prev) => {
                SetIsEdit(!prev);
              }}
            >
              <IoClose />
            </button>
          </div>
        ) : (
          ""
        )}

        <hr className="w-full bg-gray-500" />

        {isEdit ? (
          <form onSubmit={handleProfileUpdate} className="flex flex-col items-center gap-8 mt-8 bg-white rounded-2xl shadow-lg p-8 max-w-lg mx-auto border border-gray-200">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center gap-2">
              <label className="text-lg font-semibold mb-1">Profile Picture</label>
              <div className="w-32 h-32 rounded-full border-4 border-amber-400 overflow-hidden flex items-center justify-center bg-gray-100 shadow">
                <img
                  src={profileImagePreview}
                  alt="Profile Preview"
                  className="object-cover w-full h-full"
                />
              </div>
              <input type="file" accept="image/*" onChange={handleProfileImageChange} className="mt-2" />
            </div>
            {/* Name and Password */}
            <div className="flex flex-col gap-2 w-full max-w-xs">
              <label className="text-md font-semibold">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="border rounded px-3 py-2 shadow-sm"
              />
              <label className="text-md font-semibold mt-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="border rounded px-3 py-2 shadow-sm"
                placeholder="Leave blank to keep current password"
              />
            </div>
            {/* License Section */}
            <div className="flex flex-col items-center gap-2 w-full max-w-xs">
              <label className="text-lg font-semibold mb-1">License Images</label>
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <span className="text-sm mb-1">Front</span>
                  <div className="w-28 h-20 border-2 border-gray-300 rounded bg-gray-100 flex items-center justify-center overflow-hidden shadow">
                    {licenseFrontPreview ? (
                      <img src={licenseFrontPreview} alt="License Front" className="object-contain w-full h-full" />
                    ) : (
                      <span className="text-gray-400 text-xs">No image</span>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleLicenseFrontChange} className="mt-1" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm mb-1">Back</span>
                  <div className="w-28 h-20 border-2 border-gray-300 rounded bg-gray-100 flex items-center justify-center overflow-hidden shadow">
                    {licenseBackPreview ? (
                      <img src={licenseBackPreview} alt="License Back" className="object-contain w-full h-full" />
                    ) : (
                      <span className="text-gray-400 text-xs">No image</span>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleLicenseBackChange} className="mt-1" />
                </div>
              </div>
            </div>
            {/* Success/Error Messages */}
            {successMsg && <div className="text-green-600 font-semibold">{successMsg}</div>}
            {errorMsg && <div className="text-red-600 font-semibold">{errorMsg}</div>}
            <button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-red-500 text-white px-8 py-2 rounded-xl font-bold mt-4 shadow-lg hover:scale-105 transition-transform duration-200 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        ) : (
          <div>
            {/* Profile pic && name section */}
            <div className="w-full flex  flex-row  ">
              <img
                src={profileImg}
                alt="Profile pic"
                className="w-28 h-28 rounded-full object-cover  bg-amber-400 m-5 border-4 border-amber-400 shadow"
              />
              <div className="my-6">
                <h2 className="text-xl  text-gray-600 font-bold">{name}</h2>
                <p className="text-md text-gray-500 font-semibold ">
                  {email.split("@")[0]}
                </p>

                <button
                  onClick={() => {
                    SetIsEdit(!isEdit);
                  }}
                  className=" border border-gray-500 rounded-2xl py-1 px-2 hover:scale-105 my-2"
                >
                  Edit Profile
                </button>
              </div>
            </div>
            <SettingsMenu />
            <div className="flex justify-center mt-2">
            <Logout/>
            </div>
            
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;

export function ProfileEditMenu() {
  const fieldItem = [
    { labelName: "UserName", type: "text", fieldValue: userName },
    { labelName: "Email", type: "email", fieldValue: userEmail },
    { labelName: "Password",  type: "password", fieldValue: ".......",disabled: true, },
  ];

  return (
    <>
      <form className="w-full px-5 flex flex-col justify-center items-center ">
        {fieldItem.map((item, index) => (
          <ProfileEdit
            key={index}
            labelName={item.labelName}
            type={item.type}
            fieldValue={item.fieldValue}
            disabled={item.disabled}
          />
        ))}

          <input type="submit"  value="Save" className="bg-red-600 w-25 py-3 text-white rounded-xl"  />
      </form>
    </>
  );
}

export function ProfileEdit({ labelName, type, fieldValue, disabled }) {
  const [value, setValue] = useState(fieldValue);

  return (
    <>
      <label className="text-xl font-semibold  px-3 mb-2 text-start w-90">
        {labelName}
      </label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        className="bg-gray-200 text-lg text-gray-700 rounded-xl py-2 px-4 mb-4 w-90"
        placeholder={labelName}
      />
    </>
  );
}

export function SettingsItem({ icon: Icon, label, to }) {
  
    if(label!=='Logout'){
  return (
    <Link
      to={to}
      className="flex items-center justify-between px-4 py-3 border-b hover:bg-gray-100 transition"
    >
      <div className="flex items-center gap-3 text-gray-700">
        <Icon className="text-xl" />
        <span className="text-md font-medium">{label}</span>
      </div>
      <span className="text-gray-400 text-lg">{">"}</span>
    </Link>
  );
}

}

const menuItems = [
  { label: "Favourites", to: "/favourites", icon: FaHeart },
  { label: "Downloads", to: "/downloads", icon: FaDownload },
  { label: "Language", to: "/language", icon: FaLanguage },
  { label: "Location", to: "/location", icon: FaMapMarkerAlt },
  { label: "Subscription", to: "/subscription", icon: MdSubscriptions },
  { label: "Clear cache", to: "/clear-cache", icon: FaTrashAlt },
  { label: "Clear history", to: "/clear-history", icon: FaHistory },
];

export function SettingsMenu() {
  return (
    <div className="w-full max-w-md mx-auto mt-6 rounded-lg bg-white shadow">
      {menuItems.map((item, index) => (
        <SettingsItem
          key={index}
          label={item.label}
          to={item.to}
          icon={item.icon}
        />
      ))}
    </div>
  );
}

