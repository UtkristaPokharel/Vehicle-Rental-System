// eSewa Payment Gateway Configuration
export const ESEWA_CONFIG = {
  // eSewa Developer/Sandbox URLs
  SANDBOX_URL: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
  PRODUCTION_URL: 'https://epay.esewa.com.np/api/epay/main/v2/form',
  
  // Use sandbox for development
  PAYMENT_URL: import.meta.env.VITE_NODE_ENV === 'production' 
    ? 'https://epay.esewa.com.np/api/epay/main/v2/form'
    : 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
  
  // eSewa Merchant Configuration (Use your actual merchant details)
  MERCHANT_ID: import.meta.env.VITE_ESEWA_MERCHANT_ID || 'EPAYTEST', // Default test merchant
  
  // Success and Failure URLs
  SUCCESS_URL: `${window.location.origin}/payment-success`,
  FAILURE_URL: `${window.location.origin}/payment-failure`,
  
  // eSewa Service Codes
  SERVICE_CODES: {
    ONLINE_SHOPPING: 'ONLINESHOPPING',
    VEHICLE_RENTAL: 'ONLINESHOPPING' // Using online shopping code for vehicle rental
  }
};

// Generate eSewa payment parameters
export const generateEsewaParams = (bookingData, vehicleData, priceBreakdown) => {
  const transactionId = `VRS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    tAmt: priceBreakdown.total, // Total amount
    amt: priceBreakdown.basePrice, // Product amount (excluding service fee and tax)
    txAmt: priceBreakdown.taxes, // Tax amount
    psc: 0, // Product service charge (we'll include this in amt)
    pdc: priceBreakdown.serviceFee, // Delivery charge/service fee
    scd: ESEWA_CONFIG.MERCHANT_ID, // Merchant code
    pid: transactionId, // Product ID/Transaction ID
    su: ESEWA_CONFIG.SUCCESS_URL, // Success URL
    fu: ESEWA_CONFIG.FAILURE_URL, // Failure URL
    
    // Additional metadata (optional)
    productName: `Vehicle Rental - ${vehicleData?.name || 'Vehicle'}`,
    customerName: bookingData?.customerName || 'Customer',
    customerEmail: bookingData?.customerEmail || ''
  };
};

// Create eSewa payment form and submit
export const initiateEsewaPayment = (paymentParams) => {
  // Create a form element
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = ESEWA_CONFIG.PAYMENT_URL;
  form.style.display = 'none';

  // Add form fields
  Object.keys(paymentParams).forEach(key => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = paymentParams[key];
    form.appendChild(input);
  });

  // Submit the form
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

// Verify eSewa payment (to be called from success page)
export const verifyEsewaPayment = async (oid, amt, refId) => {
  try {
    const verificationUrl = import.meta.env.VITE_NODE_ENV === 'production'
      ? 'https://epay.esewa.com.np/api/epay/transaction/status'
      : 'https://rc-epay.esewa.com.np/api/epay/transaction/status';
    
    const response = await fetch(verificationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        product_code: ESEWA_CONFIG.MERCHANT_ID,
        total_amount: amt,
        transaction_uuid: oid,
        product_service_charge: '0',
        product_delivery_charge: '0',
        success_url: ESEWA_CONFIG.SUCCESS_URL,
        failure_url: ESEWA_CONFIG.FAILURE_URL,
        signed_field_names: 'total_amount,transaction_uuid,product_code',
        signature: '' // You would need to generate HMAC signature here
      }).toString()
    });

    return await response.json();
  } catch (error) {
    console.error('eSewa verification failed:', error);
    return null;
  }
};
