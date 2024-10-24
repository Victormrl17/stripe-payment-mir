import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-09-30.acacia' });
const prisma = new PrismaClient();

// Habilita CORS
app.use(cors({
  origin: 'http://localhost:3000', // Permite solicitudes desde tu frontend
  methods: ['GET', 'POST'], // Métodos permitidos
  allowedHeaders: ['Content-Type'], // Encabezados permitidos
}));

app.use(express.json());

const paymentSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  email: z.string().email(),
});

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, email } = paymentSchema.parse(req.body);

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    await prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        currency,
        paymentId: paymentIntent.id,
        paymentStatus: 'pending',
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    const errorMessage = (error as any).message || "Error al crear el intento de pago";
    res.status(400).json({ error: errorMessage });
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
