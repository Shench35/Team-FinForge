require('dotenv').config();
const axios = require('axios');

const SQUAD_PUBLIC_KEY = process.env.SQUAD_PUBLIC_KEY;
const SQUAD_SECRET_KEY = process.env.SQUAD_SECRET_KEY;
const SQUAD_BASE_URL = process.env.SQUAD_BASE_URL;

async function initiatePayment() {
  if (!SQUAD_PUBLIC_KEY || !SQUAD_SECRET_KEY || !SQUAD_BASE_URL) {
    console.error('Squad API keys or base URL are not set in the .env file.');
    return;
  }

  try {
    const paymentData = {
      // You will need to replace these with actual values based on Squad API documentation
      amount: 100000, // Amount in kobo (e.g., 100000 kobo = 1000 NGN)
      currency: "NGN",
      email: "test@example.com",
      // Reference should be unique for each transaction
      transaction_ref: `finforge_payment_${Date.now()}`,
      callback_url: "http://localhost:3000/payment/callback", // Replace with your actual callback URL
      // Add other required parameters as per Squad API documentation
      // For example:
      // payment_options: ["card", "bank_transfer"],
      // customer_name: "John Doe",
      // customer_phone: "08012345678"
    };

    const headers = {
      Authorization: `Bearer ${SQUAD_SECRET_KEY}`, // Use Secret Key for server-side
      'Content-Type': 'application/json',
      'x-squad-encrypted-key': SQUAD_PUBLIC_KEY // Public key might be needed in some headers
    };

    const response = await axios.post(`${SQUAD_BASE_URL}/transaction/initiate`, paymentData, { headers });

    console.log('Payment initiation successful:');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error initiating payment:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Data:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    throw error;
  }
}

// Call the function to initiate payment
initiatePayment();
