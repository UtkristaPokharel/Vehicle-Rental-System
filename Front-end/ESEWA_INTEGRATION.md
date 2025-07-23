# eSewa Payment Gateway Integration

This document explains the eSewa payment gateway integration implemented in the Vehicle Rental System.

## Overview

eSewa is a popular digital wallet and payment gateway in Nepal. This integration allows users to pay for vehicle rentals using their eSewa account.

## Features Implemented

1. **eSewa Payment Option**: Added as a payment method alongside credit cards, PayPal, etc.
2. **Payment Flow**: Seamless redirect to eSewa for payment processing
3. **Success/Failure Handling**: Dedicated pages for payment success and failure scenarios
4. **Booking Confirmation**: Complete booking confirmation with eSewa transaction details

## Files Added/Modified

### New Files Created:
- `src/config/esewa.js` - eSewa configuration and payment functions
- `src/pages/PaymentSuccess.jsx` - Handles successful payments from eSewa
- `src/pages/PaymentFailure.jsx` - Handles failed payments from eSewa
- `src/pages/BookingConfirmation.jsx` - Complete booking confirmation page

### Modified Files:
- `src/pages/PaymentPage.jsx` - Added eSewa payment method and handling
- `src/App.jsx` - Added new routes for payment success, failure, and confirmation
- `.env.example` - Added eSewa configuration variables

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# eSewa Configuration
VITE_NODE_ENV=development
VITE_ESEWA_MERCHANT_ID=EPAYTEST
VITE_APP_URL=http://localhost:5173
```

### For Production:
- Replace `EPAYTEST` with your actual eSewa merchant ID
- Set `VITE_NODE_ENV=production`
- Update `VITE_APP_URL` with your production domain

## Payment Flow

1. **User selects eSewa** on payment page
2. **Payment initiation**: Form is created with eSewa parameters and submitted
3. **eSewa redirect**: User is redirected to eSewa payment gateway
4. **Payment processing**: User completes payment on eSewa
5. **Return to app**: eSewa redirects back with payment status
6. **Verification**: Payment is verified (optional for demo)
7. **Confirmation**: User sees booking confirmation with transaction details

## Routes Added

- `/payment-success` - Handles successful eSewa payments
- `/payment-failure` - Handles failed eSewa payments
- `/booking-confirmation` - Final booking confirmation page

## eSewa API Endpoints

### Sandbox (Testing):
- Payment URL: `https://rc-epay.esewa.com.np/api/epay/main/v2/form`
- Verification URL: `https://rc-epay.esewa.com.np/api/epay/transaction/status`

### Production:
- Payment URL: `https://epay.esewa.com.np/api/epay/main/v2/form`
- Verification URL: `https://epay.esewa.com.np/api/epay/transaction/status`

## Testing

To test the integration:

1. Use merchant ID: `EPAYTEST`
2. Use any amount (minimum Rs. 10)
3. On eSewa test page, use test credentials provided by eSewa
4. Payment will be processed in test mode

## Security Considerations

1. **HTTPS Required**: eSewa requires HTTPS for production
2. **Signature Verification**: Implement HMAC signature verification for production
3. **Amount Validation**: Always verify payment amount server-side
4. **Transaction Logging**: Log all payment transactions for audit

## Error Handling

- Network errors during payment initiation
- eSewa server errors
- Invalid payment parameters
- Cancelled payments
- Verification failures

## Future Enhancements

1. **Server-side verification**: Implement proper payment verification on backend
2. **Webhook integration**: Handle eSewa webhooks for real-time updates
3. **Refund support**: Implement refund functionality
4. **Payment analytics**: Track payment success rates and user preferences

## Support

For eSewa integration support:
- eSewa Developer Portal: https://developer.esewa.com.np/
- eSewa Merchant Support: merchant@esewa.com.np
- Contact: +977-01-5970001
