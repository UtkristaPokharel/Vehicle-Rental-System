import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';
import BackButton from '../components/BackButton';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get failure parameters if any
  const pid = searchParams.get('pid');
  const errorMessage = searchParams.get('message') || 'Payment was cancelled or failed';

  const handleRetryPayment = () => {
    // Navigate back to payment page
    const storedPaymentData = localStorage.getItem('pendingPayment');
    if (storedPaymentData) {
      const paymentData = JSON.parse(storedPaymentData);
      navigate('/payment', {
        state: {
          bookingData: paymentData.bookingData,
          vehicleData: paymentData.vehicleData
        }
      });
    } else {
      navigate('/vehicles');
    }
  };

  const handleBackToHome = () => {
    // Clear pending payment data
    localStorage.removeItem('pendingPayment');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <BackButton to="/" text="Back to Home" />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h1>
          <p className="text-gray-600 mb-6">
            {errorMessage}
          </p>

          {pid && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700">
                <strong>Transaction ID:</strong> {pid}
              </p>
              <p className="text-sm text-red-600 mt-1">
                Please note this transaction ID for any inquiries.
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-6 text-left">
              <h3 className="font-semibold text-gray-800 mb-3">What you can do:</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Check your eSewa balance and try again</li>
                <li>• Ensure you have a stable internet connection</li>
                <li>• Try using a different payment method</li>
                <li>• Contact support if the problem persists</li>
              </ul>
            </div>

            <div className="space-x-4">
              <button
                onClick={handleRetryPayment}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Retry Payment
              </button>
              <button
                onClick={handleBackToHome}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
