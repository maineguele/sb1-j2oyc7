import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

interface CheckoutFormProps {
  cart: Product[];
  totalAmount: number;
  onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ cart, totalAmount, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);

    if (paymentMethod === 'stripe') {
      if (!stripe || !elements) {
        setProcessing(false);
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError('Card element not found');
        setProcessing(false);
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setError(error.message || 'An error occurred');
        setProcessing(false);
      } else {
        // Send paymentMethod.id to your server for processing
        console.log('Stripe payment successful:', paymentMethod);
        // Reset cart and show success message
        setProcessing(false);
      }
    } else if (paymentMethod === 'qr') {
      // Handle QR code payment logic here
      console.log('QR code payment initiated');
      // Simulate payment process
      setTimeout(() => {
        console.log('QR code payment successful');
        setProcessing(false);
      }, 2000);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
        <CardDescription>Complete your purchase</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Your Cart</h3>
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.name}</span>
                <span>${item.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="mt-2 font-bold">
              Total: ${totalAmount.toFixed(2)}
            </div>
          </div>
          <Tabs defaultValue="stripe" onValueChange={(value) => setPaymentMethod(value as 'stripe' | 'qr')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stripe">Stripe</TabsTrigger>
              <TabsTrigger value="qr">Maybank QR</TabsTrigger>
            </TabsList>
            <TabsContent value="stripe">
              <div className="mb-4">
                <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
              </div>
            </TabsContent>
            <TabsContent value="qr">
              <div className="mb-4">
                <img src="https://example.com/maybank-qr-code.png" alt="Maybank QR Code" className="max-w-xs mx-auto" />
                <p className="text-center mt-2">Scan the QR code to pay</p>
              </div>
            </TabsContent>
          </Tabs>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="flex justify-between mt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Processing...' : 'Pay Now'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;