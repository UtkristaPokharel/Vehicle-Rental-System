import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaDownload, FaCalendarAlt } from 'react-icons/fa';
import { getApiUrl } from '../config/api';
import BackButton from '../components/BackButton';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redirectCountdown, setRedirectCountdown] = useState(10); // Auto redirect in 10 seconds
  
  useEffect(() => {
    const fetchTransactionAndBookingDetails = async () => {
      try {
        // Get transaction ID from URL params
        const searchParams = new URLSearchParams(location.search);
        
        // eSewa might use different parameter names, try all possibilities
        const transactionId = searchParams.get('transactionId') || 
                             searchParams.get('transaction_uuid') || 
                             searchParams.get('oid');
        const status = searchParams.get('status');
        
        // Also check if transaction data is in base64 encoded 'data' parameter
        const dataParam = searchParams.get('data');
        let transactionIdFromData = null;
        if (dataParam) {
          try {
            const decodedData = atob(dataParam);
            const parsedData = JSON.parse(decodedData);
            transactionIdFromData = parsedData.transaction_uuid;
          } catch (decodeError) {
            console.log('Could not decode data parameter:', decodeError.message);
          }
        }
        
        const finalTransactionId = transactionId || transactionIdFromData;
        
        console.log('=== PaymentSuccess Debug Info ===');
        console.log('Current URL:', window.location.href);
        console.log('Search params:', location.search);
        console.log('Transaction ID from transactionId param:', searchParams.get('transactionId'));
        console.log('Transaction ID from transaction_uuid param:', searchParams.get('transaction_uuid'));
        console.log('Transaction ID from oid param:', searchParams.get('oid'));
        console.log('Transaction ID from data param:', transactionIdFromData);
        console.log('Final Transaction ID:', finalTransactionId);
        console.log('Status from URL:', status);
        console.log('All URL params:', Object.fromEntries(searchParams.entries()));
        
        if (finalTransactionId) {
          console.log('Fetching transaction details for:', finalTransactionId);
          
          // Fetch transaction details
          const transactionApiUrl = getApiUrl(`api/payment/esewa/status/${finalTransactionId}`);
          console.log('Transaction API URL:', transactionApiUrl);
          
          const transactionResponse = await fetch(transactionApiUrl);
          console.log('Transaction response status:', transactionResponse.status);
          
          if (transactionResponse.ok) {
            const transactionData = await transactionResponse.json();
            console.log('Transaction data received:', transactionData);
            setTransactionDetails(transactionData.transaction);
          } else {
            const errorText = await transactionResponse.text();
            console.log('Failed to fetch transaction details:', transactionResponse.status, errorText);
            setError(`Failed to fetch transaction details: ${transactionResponse.status}`);
          }

          // Fetch booking details
          const bookingApiUrl = getApiUrl(`api/payment/esewa/booking/${finalTransactionId}`);
          console.log('Booking API URL:', bookingApiUrl);
          
          const bookingResponse = await fetch(bookingApiUrl);
          console.log('Booking response status:', bookingResponse.status);
          
          if (bookingResponse.ok) {
            const bookingData = await bookingResponse.json();
            console.log('Booking data received:', bookingData);
            setBookingDetails(bookingData.booking);
          } else {
            console.log('Booking not found, might still be processing');
          }
        } else {
          console.log('❌ No transaction ID found in any URL parameter');
          setError('Transaction ID not found in URL parameters. Please check the payment callback URL.');
        }
      } catch (error) {
        console.error('Error fetching details:', error);
        setError('Failed to fetch transaction details');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionAndBookingDetails();
  }, [location.search]);

  // Auto redirect countdown
  useEffect(() => {
    if (!loading && !error && status === 'success') {
      const interval = setInterval(() => {
        setRedirectCountdown(prev => {
          if (prev <= 1) {
            navigate('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [loading, error, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Processing Your Payment...</h2>
          <p className="text-gray-600 mb-4">Please wait while we verify your transaction with eSewa</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              • Verifying payment status<br/>
              • Creating your booking<br/>
              • Preparing confirmation details
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaTimesCircle className="text-4xl text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
          <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const isSuccess = status === 'success' && transactionDetails?.status === 'completed';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <BackButton text="Back to vehicles" />
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8 text-center">
          {isSuccess ? (
            <>
              <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
              <p className="text-gray-600 mb-4">
                Your booking has been confirmed. You will receive a confirmation email shortly.
              </p>
              {redirectCountdown > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-blue-700">
                    Redirecting to home page in <span className="font-bold">{redirectCountdown}</span> seconds...
                  </p>
                  <button 
                    onClick={() => navigate('/')}
                    className="text-blue-600 underline hover:text-blue-800 mt-2"
                  >
                    Go to Home Now
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
              <p className="text-gray-600 mb-6">
                There was an issue processing your payment. Please try again.
              </p>
            </>
          )}
        </div>

        {/* Transaction Details */}
        {transactionDetails && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium">{transactionDetails.uuid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium text-green-600">रु{transactionDetails.amount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">eSewa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium capitalize px-2 py-1 rounded text-sm ${
                      transactionDetails.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : transactionDetails.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {transactionDetails.status}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {new Date(transactionDetails.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">
                      {new Date(transactionDetails.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  {transactionDetails.transactionCode && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">eSewa Code:</span>
                      <span className="font-medium">{transactionDetails.transactionCode}</span>
                    </div>
                  )}
                  {transactionDetails.userInfo?.name && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-medium">{transactionDetails.userInfo.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Show pending status message */}
            {transactionDetails.status === 'pending' && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-2">⏳ Payment is being processed</h3>
                <p className="text-sm text-yellow-700">
                  Your payment is still being verified with eSewa. This may take a few moments. 
                  Please refresh this page in a minute or contact support if the issue persists.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Booking Details */}
        {bookingDetails && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Vehicle Information</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Vehicle:</span> {bookingDetails.vehicleName}</p>
                  {bookingDetails.vehicleModel && (
                    <p><span className="text-gray-600">Model:</span> {bookingDetails.vehicleModel}</p>
                  )}
                  {bookingDetails.vehicleLocation && (
                    <p><span className="text-gray-600">Location:</span> {bookingDetails.vehicleLocation}</p>
                  )}
                  <p><span className="text-gray-600">Price per day:</span> रु{bookingDetails.pricePerDay?.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Booking Period</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Start:</span> {new Date(bookingDetails.startDate).toLocaleDateString()} at {bookingDetails.startTime}</p>
                  <p><span className="text-gray-600">End:</span> {new Date(bookingDetails.endDate).toLocaleDateString()} at {bookingDetails.endTime}</p>
                  <p><span className="text-gray-600">Duration:</span> {bookingDetails.durationText || `${bookingDetails.duration?.days} day(s)`}</p>
                  <p><span className="text-gray-600">Booking ID:</span> {bookingDetails.bookingId}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            {bookingDetails.userName && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium text-gray-900 mb-3">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p><span className="text-gray-600">Name:</span> {bookingDetails.userName}</p>
                    <p><span className="text-gray-600">Email:</span> {bookingDetails.userEmail}</p>
                  </div>
                  <div className="space-y-2">
                    {bookingDetails.userPhone && (
                      <p><span className="text-gray-600">Phone:</span> {bookingDetails.userPhone}</p>
                    )}
                    <p><span className="text-gray-600">Status:</span> 
                      <span className={`ml-1 font-medium capitalize ${
                        bookingDetails.bookingStatus === 'confirmed' 
                          ? 'text-green-600' 
                          : 'text-orange-600'
                      }`}>
                        {bookingDetails.bookingStatus}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isSuccess && (
            <>
              <button 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => window.print()}
              >
                <FaDownload className="mr-2" />
                Download Receipt
              </button>
              <Link
                to="/bookings"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaCalendarAlt className="mr-2" />
                View My Bookings
              </Link>
            </>
          )}
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Continue Browsing
          </Link>
          {!isSuccess && (
            <button
              onClick={() => navigate(-2)}
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>

        {/* Next Steps */}
        {isSuccess && (
          <div className="bg-blue-50 rounded-lg p-6 mt-8">
            <h3 className="font-semibold text-blue-900 mb-3">What's Next?</h3>
            <ul className="space-y-2 text-blue-800">
              <li>• You will receive a confirmation email with all booking details</li>
              <li>• Our team will contact you 24 hours before your booking</li>
              <li>• Please bring a valid driving license for vehicle pickup</li>
              <li>• Contact us if you need to make any changes to your booking</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
