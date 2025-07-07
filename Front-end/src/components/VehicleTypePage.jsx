import Vehicle from './VehicleCard';
import { useParams } from 'react-router';
import Navbar from './Navbar';




const VehicleTypePage = () => {
  const { type } = useParams();

  return (
    <>
          <Navbar />
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold">Vehicles of type: {type}</h1>
      {/* Display filtered vehicles or details here */}
      <Vehicle  type={type}/>
      
    </div>
    </>
  );
};

export default VehicleTypePage;



