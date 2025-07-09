import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { FaHeart, FaDownload, FaLanguage, FaMapMarkerAlt, FaTrashAlt, FaHistory, FaSignOutAlt, } from "react-icons/fa";
import { MdSubscriptions } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import ProfileImageUpload from "../context/ProfileUpload.jsx";
import { useState } from "react";

const userName = localStorage.getItem("name") || "";
const userEmail = localStorage.getItem("email") || "";
const profileImg = localStorage.getItem("profileImg");

function Profile() {
  const [isEdit, SetIsEdit] = useState(false);

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
            {" "}
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
          <div className="flex justify-center items-center flex-col relative">
            {/* Profile pic */}
            <img
              src={profileImg}
              alt="Profile pic"
              className="w-22 h-22 rounded-full object-cover bg-amber-400 m-5"
            />
            <ProfileImageUpload />
            <ProfileEditMenu />
          </div>
        ) : (
          <div>
            {/* Profile pic && name section */}
            <div className="w-full flex  flex-row  ">
              <img
                src={profileImg}
                alt="Profile pic"
                className="w-25 h-25 rounded-full object-cover  bg-amber-400 m-5"
              />
              <div className="my-6">
                <h2 className="text-xl  text-gray-600 font-bold">{userName}</h2>
                <p className="text-md text-gray-500 font-semibold ">
                  {userEmail.split("@")[0]}
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
    { labelName: "Password", type: "password", fieldValue: ".......", disabled: true, },
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

        <input type="submit" value="Save" className="bg-red-600 w-25 py-3 text-white rounded-xl" />
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

const menuItems = [
  { label: "Favourites", to: "/favourites", icon: FaHeart },
  { label: "Downloads", to: "/downloads", icon: FaDownload },
  { label: "Language", to: "/language", icon: FaLanguage },
  { label: "Location", to: "/location", icon: FaMapMarkerAlt },
  { label: "Subscription", to: "/subscription", icon: MdSubscriptions },
  { label: "Clear cache", to: "/clear-cache", icon: FaTrashAlt },
  { label: "Clear history", to: "/clear-history", icon: FaHistory },
  { label: "Logout", to: "/logout", icon: FaSignOutAlt },
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

