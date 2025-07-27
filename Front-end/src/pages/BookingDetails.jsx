import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCar, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser, FaReceipt, FaSpinner } from 'react-icons/fa';
import { getApiUrl, getImageUrl } from '../config/api';

const BookingDetails = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookingDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl(`api/bookings/${bookingId}`));

      if (!response.ok) {
        throw new Error('Booking not found');
      }

      const data = await response.json();
      setBooking(data.data);
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId, fetchBookingDetails]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link 
            to="/bookings" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/bookings" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Booking History
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Details</h1>
              <p className="text-gray-600">Booking ID: {booking.bookingId}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(booking.bookingStatus)} mt-4 sm:mt-0`}>
              {booking.bookingStatus || 'Unknown'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Information</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="aspect-w-16 aspect-h-12 rounded-lg overflow-hidden bg-gray-100">
                    {booking.vehicleId?.images?.[0] || booking.vehicleImage ? (
                      <img
                        src={getImageUrl(booking.vehicleId?.images?.[0] || booking.vehicleImage)}
                        alt={booking.vehicleName}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center text-gray-400">
                        <FaCar className="text-4xl" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{booking.vehicleName}</h3>
                  {booking.vehicleModel && (
                    <p className="text-gray-600 mb-2">Model: {booking.vehicleModel}</p>
                  )}
                  {booking.vehicleType && (
                    <p className="text-gray-600 mb-2">Type: {booking.vehicleType}</p>
                  )}
                  {booking.vehicleId?.location && (
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <span>{booking.vehicleId.location}</span>
                    </div>
                  )}
                  <div className="mt-4">
                    <span className="text-2xl font-bold text-green-600">
                      रु{booking.pricePerDay?.toLocaleString() || 'N/A'}
                    </span>
                    <span className="text-gray-500 ml-2">per day</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Period */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Period</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Pickup</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>{formatDate(booking.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaClock className="text-gray-400" />
                      <span>{formatTime(booking.startTime)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Return</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>{formatDate(booking.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaClock className="text-gray-400" />
                      <span>{formatTime(booking.endTime)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaUser className="text-gray-400" />
                    <span>{booking.userName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaEnvelope className="text-gray-400" />
                    <span>{booking.userEmail}</span>
                  </div>
                  {booking.userPhone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaPhone className="text-gray-400" />
                      <span>{booking.userPhone}</span>
                    </div>
                  )}
                </div>
                {booking.billingAddress && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Billing Address</h4>
                    <div className="text-gray-600 text-sm">
                      {booking.billingAddress.address && <p>{booking.billingAddress.address}</p>}
                      {booking.billingAddress.city && <p>{booking.billingAddress.city}</p>}
                      {booking.billingAddress.state && <p>{booking.billingAddress.state}</p>}
                      {booking.billingAddress.zipCode && <p>{booking.billingAddress.zipCode}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Price Summary</h2>
              {booking.pricing ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Price</span>
                    <span className="font-medium">रु{booking.pricing.basePrice?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-medium">रु{booking.pricing.serviceFee?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes</span>
                    <span className="font-medium">रु{booking.pricing.taxes?.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-green-600">रु{booking.pricing.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <p>Pricing details not available</p>
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium capitalize">{booking.paymentMethod || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    booking.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.paymentStatus || 'N/A'}
                  </span>
                </div>
                {booking.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-medium text-xs">{booking.transactionId}</span>
                  </div>
                )}
                {booking.paymentDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Date</span>
                    <span className="font-medium">{formatDate(booking.paymentDate)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => window.print()}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <FaReceipt className="mr-2" />
                  Print Booking
                </button>
                {booking.bookingStatus === 'confirmed' && (
                  <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                    Contact Support
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
