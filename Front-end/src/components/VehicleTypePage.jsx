import Vehicle from './VehicleCard';
import { useParams } from 'react-router';




const VehicleTypePage = () => {
  const { type } = useParams();

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold">Vehicles of type: {type}</h1>
      {/* Display filtered vehicles or details here */}
      <Vehicle />
      
    </div>
  );
};

export default VehicleTypePage;



