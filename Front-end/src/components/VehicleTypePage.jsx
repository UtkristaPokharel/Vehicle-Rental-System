
import { useParams } from 'react-router';




const VehicleTypePage = () => {
  const { type } = useParams();

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold">Vehicles of type: {type}</h1>
      {/* Display filtered vehicles or details here */}
      <VehicleCard />
    </div>
  );
};

export default VehicleTypePage;



export const VehicleCard =() =>{
  return (
    <div className="vehicle-card p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">Vehicle Name</h2>
      <p className="text-gray-600">Description of the vehicle.</p>
      <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">View Details</button>
    </div>
  );
}