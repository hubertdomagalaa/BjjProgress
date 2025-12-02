
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const { Client, Databases, Users } = require('node-appwrite');
require('dotenv').config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Appwrite
const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('69283bd60018f7ae198f')
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const users = new Users(client);

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'BjjProgress Backend Running!' });
});

// Create payment
app.post('/create-subscription', async (req, res) => {
  try {
    const { userId, email } = req.body;

    // Create or get customer
    let customer;
    const existing = await stripe.customers.list({ email, limit: 1 });

    if (existing.data.length > 0) {
      customer = existing.data[0];
    } else {
      customer = await stripe.customers.create({
        email,
        metadata: { appwrite_user_id: userId }
      });
    }

    // Create ephemeral key
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2023-10-16' }
    );

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 499, // $4.99
      currency: 'usd',
      customer: customer.id,
      metadata: { appwrite_user_id: userId }
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log('[WEBHOOK ERROR] Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle payment success
  try {
    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object;
      const userId = intent.metadata.appwrite_user_id;
      
      console.log(`[PAYMENT SUCCESS] Payment succeeded for user: ${userId}`);
      
      // Update user preferences to grant PRO
      await users.updatePrefs(
        userId,
        {
          subscription_tier: 'pro',
          subscription_status: 'active',
          stripe_customer_id: intent.customer,
          subscription_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
          subscription_renewal_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // Next payment date (1 year)
        }
      );
      
      console.log(`[PRO GRANTED] User ${userId} upgraded to PRO!`);
    }
  } catch (error) {
    console.error('Webhook handler error:', error);
  }

  res.json({received: true});
});

// Only start server if running locally (not in Vercel)
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`[SERVER] Running on port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
