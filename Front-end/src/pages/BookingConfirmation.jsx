import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaCalendarAlt, FaMapMarkerAlt, FaCar, FaReceipt } from 'react-icons/fa';
import { getImageUrl } from '../config/api';
import BackButton from '../components/BackButton';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    bookingData, 
    vehicleData, 
    totalPrice, 
    priceBreakdown, 
    paymentMethod, 
    transactionId,
    esewaRefId,
    paymentStatus 
  } = location.state || {};

  if (!bookingData || !vehicleData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">No booking data found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const getPaymentMethodDisplay = () => {
    switch (paymentMethod) {
      case 'esewa':
        return 'eSewa';
      case 'card':
        return 'Credit Card';
      case 'paypal':
        return 'PayPal';
      case 'apple':
        return 'Apple Pay';
      case 'google':
        return 'Google Pay';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <BackButton to="/" text="Back to Home" />
        </div>

        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6 text-center">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 text-lg">
            Your vehicle rental has been successfully booked.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <FaCar className="text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold">Vehicle Details</h2>
              </div>
              
              <div className="flex items-center space-x-4">
                <img
                  src={getImageUrl(vehicleData.image)}
                  alt={vehicleData.name}
                  className="w-24 h-18 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{vehicleData.name}</h3>
                  <p className="text-gray-600">
                    {vehicleData.seats} seats • {vehicleData.transmission} • {vehicleData.fuelType}
                  </p>
                  <p className="text-sm text-gray-500">
                    License Plate: {vehicleData.licensePlate || 'TBD'}
                  </p>
                </div>
              </div>
            </div>

            {/* Trip Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <FaCalendarAlt className="text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold">Trip Details</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Start Date & Time</label>
                  <p className="text-gray-900">{formatDate(bookingData.startDate)}</p>
                  <p className="text-gray-600">{bookingData.startTime || '10:00 AM'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">End Date & Time</label>
                  <p className="text-gray-900">{formatDate(bookingData.endDate)}</p>
                  <p className="text-gray-600">{bookingData.endTime || '10:00 AM'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600 flex items-center">
                    <FaMapMarkerAlt className="mr-1" />
                    Pickup Location
                  </label>
                  <p className="text-gray-900">{bookingData.location || vehicleData.location || 'Butwal, Nepal'}</p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <FaReceipt className="text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold">Payment Details</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">{getPaymentMethodDisplay()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-medium text-sm">{transactionId}</span>
                </div>
                {esewaRefId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">eSewa Reference ID</span>
                    <span className="font-medium text-sm">{esewaRefId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className="font-medium text-green-600">
                    {paymentStatus === 'completed' ? 'Completed' : 'Confirmed'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Price Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Base Price ({priceBreakdown?.days || 1} day{(priceBreakdown?.days || 1) > 1 ? 's' : ''})</span>
                  <span>रु{priceBreakdown?.basePrice?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Service Fee</span>
                  <span>रु{priceBreakdown?.serviceFee?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Taxes</span>
                  <span>रु{priceBreakdown?.taxes?.toLocaleString() || '0'}</span>
                </div>
              </div>
              
              <hr className="my-4" />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Paid</span>
                <span className="text-green-600">रु{totalPrice?.toLocaleString() || priceBreakdown?.total?.toLocaleString() || '0'}</span>
              </div>
              
              {/* Important Information */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Important Information</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Bring a valid driving license</li>
                  <li>• Vehicle inspection before pickup</li>
                  <li>• Return with same fuel level</li>
                  <li>• Late return charges may apply</li>
                </ul>
              </div>
              
              {/* Contact Information */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600">
                  Contact our support team:
                </p>
                <p className="text-sm text-blue-600">
                  📞 +977-9876543210<br />
                  ✉️ support@vehiclerental.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 text-center space-x-4">
          <button
            onClick={() => window.print()}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Print Confirmation
          </button>
          <button
            onClick={() => navigate('/vehicles')}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            Book Another Vehicle
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
