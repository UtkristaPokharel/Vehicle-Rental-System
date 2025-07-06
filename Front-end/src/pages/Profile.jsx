import { Link } from "react-router";
import { useState } from "react";
import {
  FaHeart,
  FaDownload,
  FaLanguage,
  FaMapMarkerAlt,
  FaTrashAlt,
  FaHistory,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdSubscriptions } from "react-icons/md";
import { IoClose } from "react-icons/io5";

function Profile() {
  const [isEdit, SetIsEdit] = useState(false);

  return (
    <>
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
          <div
            className=" text-3xl absolute left-105 top-4.5
      "
          >
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
          <div className="flex justify-center items-center flex-col">
            {/* Profile pic */}
            <img
              src="https://imgs.search.brave.com/IFrfkTDeXEOdpuqS16cJ_cTvFuk1-ZBdrEqFBjnL-SM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9weXhp/cy5ueW1hZy5jb20v/djEvaW1ncy8xYzQv/NjQ1L2NmZWJmZWE2/M2UxMDgyMWRhNzk4/ZDQzYTNhY2VhYWEy/MGYtdGhlLWJlYXIt/amVyZW15LWFsbGVu/LXdoaXRlLWxlZGUu/cnZlcnRpY2FsLnc1/NzAuanBn"
              alt="Profile pic"
              className="w-22 h-22 rounded-full object-cover  bg-amber-400 m-5"
            />
            <ProfileEditMenu />
          </div>
        ) : (
          <div>
            {/* Profile pic && name section */}
            <div className="w-full flex  flex-row  ">
              <img
                src="https://imgs.search.brave.com/IFrfkTDeXEOdpuqS16cJ_cTvFuk1-ZBdrEqFBjnL-SM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9weXhp/cy5ueW1hZy5jb20v/djEvaW1ncy8xYzQv/NjQ1L2NmZWJmZWE2/M2UxMDgyMWRhNzk4/ZDQzYTNhY2VhYWEy/MGYtdGhlLWJlYXIt/amVyZW15LWFsbGVu/LXdoaXRlLWxlZGUu/cnZlcnRpY2FsLnc1/NzAuanBn"
                alt="Profile pic"
                className="w-25 h-25 rounded-full object-cover  bg-amber-400 m-5"
              />
              <div className="my-6">
                <h2 className="text-xl  text-gray-600 font-bold">
                  Bhuwan Muji
                </h2>
                <p className="text-md text-gray-500 font-semibold ">
                  Chutiya
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

const fieldItem = [
  { labelName: "UserName", type: "text", fieldValue: "BHuwan kathayat" },
  { labelName: "Email", type: "Email", fieldValue: "Bhuwan@kathayat.com" },
  { labelName: "Password", type: "password", fieldValue: "......." },
];

export function ProfileEditMenu() {
  return (
    <>
      {fieldItem.map((item, index) => (
        <ProfileEdit
          labelName={item.labelName}
          index={index}
          type={item.type}
          fieldValue={item.fieldValue}
        />
      ))}
    </>
  );
}

export function ProfileEdit({ labelName, type, fieldValue }) {
  return (
    <div
      className="w-full px-5 flex flex-col
        "
    >
      <label className="text-xl font-semibold w-full px-3 mb-2">
        {labelName}
      </label>

      <input
        type={type}
        value={fieldValue}
        className="bg-gray-200  text-lg text-gray-700 rounded-xl py-2 px-4 mb-4
           "
        placeholder={fieldValue}
      />
    </div>
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
