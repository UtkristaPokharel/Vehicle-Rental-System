import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { verifyEsewaPayment } from '../config/esewa';
import BackButton from '../components/BackButton';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get payment parameters from URL
        const oid = searchParams.get('oid'); // Transaction UUID
        const amt = searchParams.get('amt'); // Amount
        const refId = searchParams.get('refId'); // eSewa reference ID

        // Get stored payment data
        const storedPaymentData = localStorage.getItem('pendingPayment');
        if (storedPaymentData) {
          setPaymentData(JSON.parse(storedPaymentData));
        }

        if (oid && amt) {
          // Verify payment with eSewa (optional - for production)
          // const result = await verifyEsewaPayment(oid, amt, refId);
          // setVerificationResult(result);

          // For demo purposes, consider payment successful
          setVerificationResult({ status: 'success', transaction_uuid: oid, ref_id: refId });
          
          // Clear pending payment data
          localStorage.removeItem('pendingPayment');
        } else {
          setVerificationResult({ status: 'failed', message: 'Invalid payment parameters' });
        }
      } catch (error) {
        console.error('Payment verification failed:', error);
        setVerificationResult({ status: 'failed', message: 'Verification failed' });
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleContinue = () => {
    if (verificationResult?.status === 'success' && paymentData) {
      // Navigate to booking confirmation with payment data
      navigate('/booking-confirmation', {
        state: {
          bookingData: paymentData.bookingData,
          vehicleData: paymentData.vehicleData,
          totalPrice: paymentData.priceBreakdown.total,
          priceBreakdown: paymentData.priceBreakdown,
          paymentMethod: 'esewa',
          transactionId: verificationResult.transaction_uuid,
          esewaRefId: verificationResult.ref_id,
          paymentStatus: 'completed'
        }
      });
    } else {
      navigate('/');
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we verify your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <BackButton to="/" text="Back to Home" />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {verificationResult?.status === 'success' ? (
            <>
              <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
              <p className="text-gray-600 mb-6">
                Your payment has been processed successfully via eSewa.
              </p>
              
              {paymentData && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                  <h3 className="font-semibold text-gray-800 mb-4">Payment Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle:</span>
                      <span className="font-medium">{paymentData.vehicleData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">रु{paymentData.priceBreakdown?.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-medium">{verificationResult.transaction_uuid}</span>
                    </div>
                    {verificationResult.ref_id && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">eSewa Ref ID:</span>
                        <span className="font-medium">{verificationResult.ref_id}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={handleContinue}
                className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                Continue to Booking Confirmation
              </button>
            </>
          ) : (
            <>
              <div className="text-6xl mb-6">❌</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h1>
              <p className="text-gray-600 mb-6">
                There was an issue processing your payment. Please try again.
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
