import {useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AddVehicleForm from './AddVehicleForm.jsx';



function AddVehiclePage() {

    const navigate = useNavigate();

      useEffect(() => {
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    if (!name || !email || !token) {
      toast.error("You must be logged in. Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      toast.success(`Welcome back, ${name}!`);
    }
  }, [navigate]);
  return (
    <div>
      <AddVehicleForm />
    </div>
  )
}

export default AddVehiclePage
