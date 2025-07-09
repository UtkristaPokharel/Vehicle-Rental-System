import axios from "axios"
import { useNavigate } from "react-router"


function Logout() {

  const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    timeout: 10000,
    withCredentials: true, // This is crucial for cookies
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem("profileImg")
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem("name");
      localStorage.removeItem("none");

      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };


  return (
    <div className="w-full bg-orange-500 h-screen flex  justify-center items-center">

      <button onClick={handleLogout} className="border bg-white p-3 text-2xl"> Logout</button>
    </div>
  )
}

export default Logout
