import express from 'express';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-09-30.acacia' });

app.use(express.json());

// Endpoint para crear Payment Intent
app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.listen(3001, () => {
  console.log('Backend running on http://localhost:3001');
});
