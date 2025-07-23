const express = require('express');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const Transaction = require('../models/Transaction');
const Booking = require('../models/Booking');
const router = express.Router();

// eSewa configuration
const ESEWA_CONFIG = {
  merchantId: 'EPAYTEST', // Use 'EPAYTEST' for testing, replace with actual merchant ID for production
  secretKey: '8gBm/:&EnhH.1/q', // eSewa secret key for testing
  successUrl: process.env.FRONTEND_URL + '/payment/esewa/success',
  failureUrl: process.env.FRONTEND_URL + '/payment/esewa/failure',
  baseUrl: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form' // Testing URL
};

// Helper function to generate signature
const generateSignature = (message, secretKey) => {
  const hash = crypto.createHmac('sha256', secretKey);
  hash.update(message);
  return hash.digest('base64');
};

// Initiate eSewa payment
router.post('/initiate', async (req, res) => {
  try {
    console.log('eSewa payment initiation request:', req.body);
    const { amount, bookingData, vehicleData, billingAddress, userInfo } = req.body;

    // Generate unique transaction UUID
    const transactionUuid = uuidv4();
    const productCode = 'EPAYTEST'; // Use 'EPAYTEST' for testing
    
    // Store transaction details in database
    const transactionData = {
      uuid: transactionUuid,
      amount: amount,
      status: 'pending',
      paymentMethod: 'esewa',
      bookingData,
      vehicleData,
      billingAddress,
      userInfo: userInfo || null,
      // Store user information in main fields as well for compatibility
      userEmail: userInfo?.email || null,
      userId: userInfo?.userId || null,
      createdAt: new Date()
    };

    console.log('Creating transaction with data:', transactionData);

    // Save transaction to database
    const savedTransaction = await Transaction.create(transactionData);
    console.log('Transaction saved successfully:', savedTransaction._id);

    // Create message for signature
    const message = `total_amount=${amount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
    
    // Generate signature
    const signature = generateSignature(message, ESEWA_CONFIG.secretKey);

    // Prepare eSewa form data
    const esewaFormData = {
      amount: amount,
      failure_url: ESEWA_CONFIG.failureUrl,
      product_delivery_charge: 0,
      product_service_charge: 0,
      product_code: productCode,
      signature: signature,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      success_url: ESEWA_CONFIG.successUrl,
      tax_amount: 0,
      total_amount: amount,
      transaction_uuid: transactionUuid
    };

    // Create HTML form for auto-submission to eSewa
    const htmlForm = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Redirecting to eSewa...</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
          }
          .loader {
            text-align: center;
          }
          .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #60a917;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="loader">
          <div class="spinner"></div>
          <h3>Redirecting to eSewa...</h3>
          <p>Please wait while we redirect you to complete your payment.</p>
        </div>
        
        <form id="esewaForm" action="${ESEWA_CONFIG.baseUrl}" method="POST" style="display: none;">
          ${Object.entries(esewaFormData).map(([key, value]) => 
            `<input type="hidden" name="${key}" value="${value}" />`
          ).join('')}
        </form>
        
        <script>
          // Auto-submit form after 2 seconds
          setTimeout(function() {
            document.getElementById('esewaForm').submit();
          }, 2000);
        </script>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(htmlForm);

  } catch (error) {
    console.error('eSewa payment initiation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to initiate eSewa payment',
      error: error.message 
    });
  }
});

// Handle eSewa success callback
router.get('/success', async (req, res) => {
  try {
    console.log('eSewa success callback received:', req.query);
    const { data } = req.query;
    
    if (!data) {
      console.log('No data parameter in success callback');
      return res.status(400).json({ 
        success: false, 
        message: 'No transaction data received' 
      });
    }

    // Decode the base64 data
    const decodedData = Buffer.from(data, 'base64').toString('utf-8');
    const transactionData = JSON.parse(decodedData);
    console.log('Decoded transaction data:', transactionData);
    
    // Verify the transaction with eSewa
    const verificationResponse = await verifyEsewaTransaction(
      transactionData.transaction_code,
      transactionData.total_amount,
      transactionData.transaction_uuid
    );
    console.log('eSewa verification response:', verificationResponse);

    if (verificationResponse.status === 'COMPLETE') {
      console.log('Payment verified successfully, updating transaction...');
      
      // Payment successful - Update transaction status in database
      const updateResult = await Transaction.updateOne(
        { uuid: transactionData.transaction_uuid },
        { 
          status: 'completed',
          transactionCode: transactionData.transaction_code,
          completedAt: new Date()
        }
      );
      console.log('Transaction update result:', updateResult);

      // Get the complete transaction data to create booking
      const transaction = await Transaction.findOne({ uuid: transactionData.transaction_uuid });
      console.log('Retrieved transaction for booking creation:', transaction ? 'Found' : 'Not found');
      
      if (transaction) {
        // Create booking record
        const bookingRecord = {
          // User information
          userName: transaction.userInfo?.name || transaction.billingAddress?.name || 'Guest User',
          userEmail: transaction.userInfo?.email || transaction.billingAddress?.email || 'guest@example.com',
          userPhone: transaction.userInfo?.phone || transaction.billingAddress?.phone,
          userId: transaction.userInfo?.userId || null,
          
          // Vehicle information
          vehicleId: transaction.vehicleData._id || transaction.vehicleData.id,
          vehicleName: transaction.vehicleData.name,
          vehicleModel: transaction.vehicleData.model,
          vehicleType: transaction.vehicleData.type,
          vehicleLocation: transaction.vehicleData.location,
          vehicleImage: transaction.vehicleData.image,
          pricePerDay: transaction.vehicleData.price,
          
          // Booking period
          startDate: new Date(transaction.bookingData.startDate),
          endDate: new Date(transaction.bookingData.endDate),
          startTime: transaction.bookingData.startTime,
          endTime: transaction.bookingData.endTime,
          
          // Pricing details
          pricing: {
            basePrice: transaction.amount - 200 - Math.round((transaction.amount - 200) * 0.05), // Reverse calculate base price
            serviceFee: 200,
            taxes: Math.round((transaction.amount - 200) * 0.05),
            totalAmount: transaction.amount
          },
          
          // Billing information
          billingAddress: transaction.billingAddress,
          
          // Payment information
          paymentMethod: 'esewa',
          paymentStatus: 'completed',
          transactionId: transaction.uuid,
          esewaTransactionCode: transactionData.transaction_code,
          esewaRefId: transactionData.ref_id || transactionData.transaction_code,
          paymentDate: new Date(),
          
          // Booking status
          bookingStatus: 'confirmed'
        };

        try {
          const booking = new Booking(bookingRecord);
          await booking.save();
          console.log('Booking created successfully:', booking.bookingId);
        } catch (bookingError) {
          console.error('Error creating booking:', bookingError);
          // Don't fail the payment even if booking creation fails
          // We can manually create booking later using transaction data
        }
      }

      // Redirect to success page with transaction details
      const successUrl = `${process.env.FRONTEND_URL}/payment/success?transactionId=${transactionData.transaction_uuid}&status=success`;
      res.redirect(successUrl);
    } else {
      // Payment verification failed
      await Transaction.updateOne(
        { uuid: transactionData.transaction_uuid },
        { 
          status: 'failed',
          failedAt: new Date(),
          errorMessage: 'Payment verification failed'
        }
      );
      
      const failureUrl = `${process.env.FRONTEND_URL}/payment/failure?error=verification_failed`;
      res.redirect(failureUrl);
    }

  } catch (error) {
    console.error('eSewa success callback error:', error);
    const failureUrl = `${process.env.FRONTEND_URL}/payment/failure?error=callback_error`;
    res.redirect(failureUrl);
  }
});

// Handle eSewa failure callback
router.get('/failure', async (req, res) => {
  try {
    const { transaction_uuid } = req.query;
    
    // Update transaction status to failed
    if (transaction_uuid) {
      await Transaction.updateOne(
        { uuid: transaction_uuid },
        { 
          status: 'failed',
          failedAt: new Date(),
          errorMessage: 'Payment cancelled by user'
        }
      );
    }

    // Redirect to failure page
    const failureUrl = `${process.env.FRONTEND_URL}/payment/failure?error=payment_cancelled`;
    res.redirect(failureUrl);

  } catch (error) {
    console.error('eSewa failure callback error:', error);
    const failureUrl = `${process.env.FRONTEND_URL}/payment/failure?error=callback_error`;
    res.redirect(failureUrl);
  }
});

// Verify eSewa transaction
const verifyEsewaTransaction = async (transactionCode, totalAmount, transactionUuid) => {
  try {
    const verificationUrl = 'https://rc-epay.esewa.com.np/api/epay/transaction/status/';
    
    const verificationData = {
      product_code: 'EPAYTEST',
      total_amount: totalAmount,
      transaction_uuid: transactionUuid
    };

    const response = await fetch(verificationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verificationData)
    });

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('eSewa verification error:', error);
    throw error;
  }
};

// Get transaction status
router.get('/status/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;
    console.log('Fetching transaction status for UUID:', uuid);
    
    // Fetch transaction from database
    const transaction = await Transaction.findOne({ uuid });
    
    if (!transaction) {
      console.log('Transaction not found for UUID:', uuid);
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    console.log('Transaction found:', {
      uuid: transaction.uuid,
      status: transaction.status,
      amount: transaction.amount,
      createdAt: transaction.createdAt,
      completedAt: transaction.completedAt
    });

    res.json({
      success: true,
      transaction: {
        uuid: transaction.uuid,
        status: transaction.status,
        amount: transaction.amount,
        paymentMethod: transaction.paymentMethod,
        transactionCode: transaction.transactionCode,
        createdAt: transaction.createdAt,
        completedAt: transaction.completedAt,
        bookingData: transaction.bookingData,
        vehicleData: transaction.vehicleData,
        userInfo: transaction.userInfo
      }
    });

  } catch (error) {
    console.error('Transaction status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get transaction status',
      error: error.message 
    });
  }
});

// Get booking details by transaction ID
router.get('/booking/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    // Find booking by transaction ID
    const booking = await Booking.findOne({ transactionId })
      .populate('vehicleId', 'name model type location image price');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      booking: booking
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get booking details',
      error: error.message 
    });
  }
});

// Get all bookings for a user
router.get('/bookings/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const bookings = await Booking.findByUser(userId);
    
    res.json({
      success: true,
      bookings: bookings,
      total: bookings.length
    });

  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get user bookings',
      error: error.message 
    });
  }
});

// Get all bookings for a vehicle
router.get('/bookings/vehicle/:vehicleId', async (req, res) => {
  try {
    const { vehicleId } = req.params;
    
    const bookings = await Booking.findByVehicle(vehicleId);
    
    res.json({
      success: true,
      bookings: bookings,
      total: bookings.length
    });

  } catch (error) {
    console.error('Get vehicle bookings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get vehicle bookings',
      error: error.message 
    });
  }
});

// Update booking status
router.patch('/booking/:bookingId/status', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, reason } = req.body;
    
    const booking = await Booking.findOne({ bookingId });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (status === 'cancelled') {
      await booking.cancelBooking(reason);
    } else {
      booking.bookingStatus = status;
      await booking.save();
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      booking: booking
    });

  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update booking status',
      error: error.message 
    });
  }
});

// Debug route - Get all transactions (remove in production)
router.get('/debug/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find({}).sort({ createdAt: -1 }).limit(10);
    
    res.json({
      success: true,
      transactions: transactions.map(t => ({
        uuid: t.uuid,
        status: t.status,
        amount: t.amount,
        paymentMethod: t.paymentMethod,
        userInfo: t.userInfo,
        createdAt: t.createdAt,
        completedAt: t.completedAt
      }))
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get transactions',
      error: error.message 
    });
  }
});

module.exports = router;
