import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { FaStar } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { FaPen } from "react-icons/fa";

function VehicleDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, price, image, dateRange, id } = location.state || {};
  
  // Add state to track booking data
  const [bookingData, setBookingData] = useState({
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: 'Lihue, HI 96766'
  });

  // Function to handle continue to payment
  const handleContinueToPayment = () => {
    console.log("Continue button clicked!");
    console.log("Booking data:", bookingData);
    console.log("Price data:", price, "Type:", typeof price); // Debug price
    
    // Basic validation
    if (!bookingData.startDate || !bookingData.startTime || !bookingData.endDate || !bookingData.endTime) {
      alert("Please fill in all trip details before continuing.");
      return;
    }

    // Validate that end date/time is after start date/time
    const startDateTime = new Date(`${bookingData.startDate}T${bookingData.startTime}`);
    const endDateTime = new Date(`${bookingData.endDate}T${bookingData.endTime}`);
    
    if (endDateTime <= startDateTime) {
      alert("End date and time must be after start date and time.");
      return;
    }

    // Handle different price formats
    let basePrice = 3116; // Default price
    
    if (price) {
      if (typeof price === 'string') {
        // If price is a string like "रु3,116" or "Rs. 3000"
        const numericPrice = price.replace(/[^\d]/g, '');
        basePrice = parseInt(numericPrice) || 3116;
      } else if (typeof price === 'number') {
        // If price is already a number
        basePrice = price;
      }
    }

    console.log("Base price:", basePrice); // Debug

    const discount = 1963;
    const serviceFee = 200;
    const taxes = 300;
    const totalPrice = basePrice - discount + serviceFee + taxes;

    console.log("Total price:", totalPrice); // Debug
    console.log("Navigating to payment...");

    // Navigate to payment page with all necessary data
    navigate('/payment', {
      state: {
        bookingData: bookingData,
        vehicleData: {
          name: name,
          price: price,
          image: image,
          id: id,
          dateRange: dateRange
        },
        totalPrice: `रु${totalPrice.toLocaleString()}`,
        originalPrice: typeof price === 'string' ? price : `रु${basePrice.toLocaleString()}`,
        discount: "रु1,963"
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="detail-page flex justify-center item-center md:mb-5 mb-30 ">
        <div className="  w-full md:w-[85vw] lg:w-[80vw] px-10 mt-15 ">
          <div className=" py-5  flex justify-center items-center  ">
            <img className="lg:w-[650px]" src={image} alt={name} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 w-full">
            {/* Left Column on large screens */}
            <div className="lg:col-span-3 row-span-2 space-y-4 order-1 lg:order-1">
              <BasicFeatures name={name} />
              <VehicleDescription />
            </div>

            {/* Booking Section (Right on lg, second overall on mobile) */}
            <div className="lg:col-span-2 row-span-3 space-y-4 order-2 lg:order-2">
              <BookingSection 
                price={price} 
                onBookingChange={setBookingData}
                onContinue={handleContinueToPayment}
              />
            </div>

            {/* Vehicle Features (Below everything) */}
            <div className="lg:col-span-3 row-span-3 order-3 lg:order-3">
              <VehicleFeatures features={features} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VehicleDetails;

export const BasicFeatures = ({ name }) => {
  return (
    <>
      <section className="w-full   p-6">
        <h1 className="text-3xl font-bold">{name}</h1>
        <p className="text-gray-500"></p>

        <div className="flex items-center gap-2 mt-2 text-sm">
          <span className="font-bold text-lg text-black">5.0</span>
          <span className="text-red-600">
            <FaStar />
          </span>
          <span className="text-gray-600">(21 trips)</span>
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded">
            <span>👤</span>
            <span>5 seats</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded">
            <span>⛽</span>
            <span>Gas (Regular)</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded">
            <span>🧳</span>
            <span>20 MPG</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded">
            <span>⚙️</span>
            <span>Automatic transmission</span>
          </div>
        </div>
      </section>
    </>
  );
};

export const VehicleDescription = () => {
  const [expanded, setExpanded] = useState(false);

  const description = `The Range Rover is an iconic luxury SUV known for its unmatched combination of refinement, capability, and cutting-edge technology. With a powerful engine lineup, including hybrid and V8 options, it delivers both smooth on-road performance and exceptional off-road capabilities. The cabin features exquisite materials, advanced infotainment, and best-in-class comfort, making it a top choice for those who demand elegance and ruggedness in one vehicle. The 2024 model continues the legacy with even more tech, improved efficiency, and a bold design that stands out in any environment.`;

  return (
    <div className="w-[90%] px-5 relative mt-6  ">
      <div
        className={`relative text-gray-700 text-sm leading-relaxed transition-all duration-300 ${expanded
          ? "line-clamp-none max-h-full"
          : "line-clamp-5 max-h-[7.5rem]"
          }`}
      >
        {description}

        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      {/* Toggle Button */}
      <button
        className="mt-2 text-blue-600 font-medium hover:underline"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
};

//Booking section

const getTodayDate = () => new Date().toISOString().split("T")[0];
const getCurrentTime = () =>
  new Date().toTimeString().split(":").slice(0, 2).join(":");

export const BookingSection = ({
  price = "रु3,116",
  originalPrice = "रु5,079",
  onBookingChange,
  onContinue
}) => {
  const [booking, setBooking] = useState({
    startDate: getTodayDate(),
    startTime: getCurrentTime(),
    endDate: getTodayDate(),
    endTime: getCurrentTime(),
  });

  useEffect(() => {
    if (onBookingChange) onBookingChange(booking);
  }, [booking, onBookingChange]);

  const handleChange = (field, value) => {
    setBooking((prev) => ({ ...prev, [field]: value }));
  };

  // Format price for display
  const formatPrice = (priceValue) => {
    if (typeof priceValue === 'string') {
      return priceValue;
    } else if (typeof priceValue === 'number') {
      return `रु${priceValue.toLocaleString()}`;
    }
    return "रु3,116";
  };

  const testClick = () => {
    console.log("Button clicked!");
    if (onContinue) {
      onContinue();
    } else {
      console.log("onContinue is not defined");
    }
  };

  return (
    <div className="w-full  ">
      <div className="w-full  bg-white rounded-2xl border border-gray-300 p-4 shadow-md pb-32 md:pb-4 my-5">
        {/* Trip Form */}
        <div className="mb-4 md:mb-6">
          <h3 className="font-semibold text-lg mb-2">Your trip</h3>

          <div className="md:flex items-center justify-between max-w-lg   hidden">
            <div>
              <p className="text-sm text-gray-400 line-through">
                {originalPrice}
              </p>
              <p className="text-lg font-bold text-black">{formatPrice(price)} total</p>
              <p className="text-xs text-gray-500">Before taxes</p>
            </div>
          </div>
          <hr className="my-4 md:block hidden" />

          <label className="text-sm text-gray-700">Trip start</label>
          <div className="flex gap-2 mt-1 mb-3">
            <input
              type="date"
              value={booking.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              min={getTodayDate()}
              className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="time"
              value={booking.startTime}
              onChange={(e) => handleChange("startTime", e.target.value)}
              className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <label className="text-sm text-gray-700">Trip end</label>
          <div className="flex gap-2 mt-1 mb-3">
            <input
              type="date"
              value={booking.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              min={booking.startDate || getTodayDate()}
              className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="time"
              value={booking.endTime}
              onChange={(e) => handleChange("endTime", e.target.value)}
              className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <hr className="my-4" />

        {/* Location */}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium text-sm text-gray-700">
              Pickup & return location
            </p>
            <p className="text-sm text-black">Lihue, HI 96766</p>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FaPen className="text-sm text-gray-600" />
          </button>
        </div>

        <hr className="my-4" />

        {/* Trip Savings */}
        <div>
          <p className="font-semibold text-md mb-1">Trip Savings</p>
          <div className="flex justify-between bg-gray-200 p-4 rounded-md text-md">
            <span>1-month discount</span>
            <span className="text-green-600 font-semibold">रु 1,963</span>
          </div>
          <button 
            onClick={testClick}
            type="button"
            className="w-full my-5 hidden md:block bg-[#ee3b3b] text-white font-semibold py-3 px-5 rounded-xl hover:bg-[#d22525] transition-colors duration-200 cursor-pointer"
          >
            Continue to Payment
          </button>
        </div>
      </div>

      {/* Fixed Bottom Section for small/medium screens */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-inner md:hidden md:mt-6 p-4 border-t md:border-none z-50">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <p className="text-sm text-gray-400 line-through">
              {originalPrice}
            </p>
            <p className="text-lg font-bold text-black">{formatPrice(price)} total</p>
            <p className="text-xs text-gray-500">Before taxes</p>
          </div>
          <button 
            onClick={testClick}
            type="button"
            className="bg-[#5d3bee] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#4725d2] transition-colors duration-200 cursor-pointer"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    category: "Safety",
    items: [
      "Adaptive cruise control",
      "All-wheel drive",
      "Backup camera",
      "Blind spot warning",
      "Brake assist",
    ],
  },
  {
    category: "Device connectivity",
    items: [
      "Android Auto",
      "Apple CarPlay",
      "AUX input",
      "Bluetooth",
      "USB charger",
      "USB input",
    ],
  },
  {
    category: "Additional features",
    items: ["Must be 25+ to book", "Child seat", "Sunroof"],
  },
];

export function VehicleFeatures({ features }) {
  return (
    <div className=" md:w-full lg:w-[60%] py-6 ">
      <h2 className="text-2xl font-bold mb-4">Vehicle features</h2>

      <div className="grid sm:grid-cols-2 gap-8">
        {features.map((group) => (
          <div key={group.category}>
            <h3 className="font-semibold text-lg mb-2">{group.category}</h3>
            <ul className="space-y-1 text-gray-700 text-sm font-semibold">
              {group.items.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}