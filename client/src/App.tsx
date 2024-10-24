import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './App.css'; // Importa el archivo CSS

const stripePromise = loadStripe('pk_test_51QCubJFHd88AYQboizF9rSFS6dBuKnIAiDMcnhgY8HRRayBAlG8gqqOT5DqRIGTrq6qHiqilUkgzhM4bDVmli9s500AlzjsyAt');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState('usd');
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error: cardError } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)!,
      billing_details: { email },
    });

    if (cardError) {
      setError(cardError.message || 'Error al procesar el método de pago');
      return;
    }

    const res = await fetch('http://localhost:3001/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency, email }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      setError(errorData.error || 'Error en el servidor');
      return;
    }

    const { clientSecret } = await res.json();

    const paymentConfirmation = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement)! },
    });

    if (paymentConfirmation.error) {
      setError(paymentConfirmation.error.message || 'Error en la confirmación del pago');
    } else {
      setPaymentSuccess(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h2>Realiza tu Pago</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Cantidad (en centavos)"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        required
      />
      <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
        <option value="usd">USD</option>
        <option value="eur">EUR</option>
      </select>
      <CardElement className="card-element" />
      <button type="submit" disabled={!stripe} className="submit-button">Pagar</button>
      {error && <div className="error-message">{error}</div>}
      {paymentSuccess && <div className="success-message">¡Pago exitoso!</div>}
    </form>
  );
};

function App() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

export default App;
