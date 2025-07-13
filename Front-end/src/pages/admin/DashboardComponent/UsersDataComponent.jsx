import {useState,useEffect} from "react"
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";
import toast,{ Toaster } from "react-hot-toast";

function UsersDataComponent() {
    const [showDropdown, setShowDropdown] = useState(null);
    const [users, setUsers] = useState([]); // State to hold user data

    useEffect(()=>{
        axios.get("http://localhost:3001/api/fetch/users")
        .then(res=>setUsers(res.data.reverse()))
        .catch(err=>toast.error("Error fetching users:", err));

    },[])

    console.log(users);
  

  return (
    <div className="overflow-x-auto">
      <Toaster />
        <table className='w-full'>
            <thead>
         <tr className="text-left text-sm font-medium text-gray-500 border-b">
            <th className="pb-3 px-4">User Id</th>
            <th className="pb-3 px-4">Name</th>
            <th className="pb-3 px-4">Email</th>
            <th className="pb-3 px-4">User type</th>
            <th className="pb-3 px-4">Created At</th>
            <th className="pb-3 px-4">Last Active</th>
            <th className="pb-3 px-4">Action</th>
          </tr>
            </thead>
            <tbody>
              {users.map((user,index)=>(
            <tr  className="border-b border-gray-100 hover:bg-gray-100">
            <td className="py-4 px-4 text-sm text-gray-600">{user._id}</td>
            <td className="py-4 px-4 text-sm text-gray-600">{user.name} </td>
            <td className="py-4 px-4 text-sm text-gray-600"> {user.email}</td>
            <td className="py-4 px-4 text-sm text-gray-600">{user.type} </td>
            <td className="py-4 px-4 text-sm text-gray-600"> {user.createdAt}</td>
            <td className="py-4 px-4 text-sm text-gray-600"> {user.lastLogin}</td>
            <td className="py-4 px-4">
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(showDropdown === index ? null : index)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <BsThreeDotsVertical className="text-gray-600" />
                  </button>

                  {showDropdown === index && (
                    <div className="absolute right-0 top-8 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                        Edit
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                        Delete
                      </button>
                    </div>
                  )}    
                  </div>
            </td>
                </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default UsersDataComponent;
