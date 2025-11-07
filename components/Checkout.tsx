'use client';

import { useState } from 'react';
import { useCardStore } from '@/lib/store';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Checkout() {
  const finalDesign = useCardStore((state) => state.finalDesign);
  const setStep = useCardStore((state) => state.setStep);

  const [isProcessing, setIsProcessing] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  if (!finalDesign) return null;

  const CARD_PRICE = 300; // $3.00 in cents
  const POSTAGE = 73; // $0.73 first-class stamp
  const TOTAL = CARD_PRICE + POSTAGE;

  const handleCheckout = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardDesign: finalDesign,
          buyerName,
          buyerEmail,
          recipient: {
            name: recipientName,
            addressLine1,
            addressLine2,
            city,
            state,
            zipCode,
            country: 'US',
          },
          amount: TOTAL,
        }),
      });

      const { sessionUrl } = await response.json();

      // Redirect to Stripe checkout
      if (sessionUrl) {
        window.location.href = sessionUrl;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to process checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    setStep(4);
  };

  const isFormComplete =
    buyerName &&
    buyerEmail &&
    recipientName &&
    addressLine1 &&
    city &&
    state &&
    zipCode;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-playfair text-whisper-charcoal mb-3">
          Send this card
        </h2>
        <p className="text-lg text-whisper-charcoal/70">
          $3 + postage • Printed and mailed within 1-2 days
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          {/* Buyer Information */}
          <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
            <h3 className="text-xl font-playfair text-whisper-charcoal mb-4">
              Your Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-whisper-charcoal mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-whisper-sage/30 rounded-lg focus:border-whisper-sage focus:outline-none"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-whisper-charcoal mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-whisper-sage/30 rounded-lg focus:border-whisper-sage focus:outline-none"
                  placeholder="jane@example.com"
                />
              </div>
            </div>
          </div>

          {/* Recipient Information */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-playfair text-whisper-charcoal mb-4">
              Recipient Address
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-whisper-charcoal mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-whisper-sage/30 rounded-lg focus:border-whisper-sage focus:outline-none"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-whisper-charcoal mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-whisper-sage/30 rounded-lg focus:border-whisper-sage focus:outline-none"
                  placeholder="123 Main St"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-whisper-charcoal mb-1">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-whisper-sage/30 rounded-lg focus:border-whisper-sage focus:outline-none"
                  placeholder="Apt 4B"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-whisper-charcoal mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-whisper-sage/30 rounded-lg focus:border-whisper-sage focus:outline-none"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-whisper-charcoal mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-whisper-sage/30 rounded-lg focus:border-whisper-sage focus:outline-none"
                    placeholder="NY"
                    maxLength={2}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-whisper-charcoal mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-whisper-sage/30 rounded-lg focus:border-whisper-sage focus:outline-none"
                  placeholder="10001"
                  maxLength={10}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg p-6 shadow-lg sticky top-24">
            <h3 className="text-xl font-playfair text-whisper-charcoal mb-4">
              Order Summary
            </h3>

            {/* Mini Preview */}
            <div className="bg-whisper-cream rounded-lg p-4 mb-6">
              <div className="aspect-[5/7] bg-white rounded shadow-md relative overflow-hidden mb-2">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="font-playfair text-sm text-whisper-charcoal text-center px-4">
                    {finalDesign.text.frontCaption}
                  </p>
                </div>
              </div>
              <p className="text-xs text-whisper-charcoal/60 text-center">
                {finalDesign.intent.occasion} • {finalDesign.intent.mood}
              </p>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6 pb-6 border-b border-whisper-sage/30">
              <div className="flex justify-between text-whisper-charcoal">
                <span>Handcrafted card</span>
                <span>${(CARD_PRICE / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-whisper-charcoal">
                <span>First-class postage</span>
                <span>${(POSTAGE / 100).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-medium text-whisper-charcoal mb-6">
              <span>Total</span>
              <span>${(TOTAL / 100).toFixed(2)}</span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={!isFormComplete || isProcessing}
              className={`
                w-full py-4 rounded-lg font-medium text-lg transition-all duration-300
                ${
                  isFormComplete && !isProcessing
                    ? 'bg-whisper-sage text-white hover:bg-whisper-gold hover:scale-105 shadow-lg'
                    : 'bg-whisper-sage/30 text-whisper-charcoal/40 cursor-not-allowed'
                }
              `}
            >
              {isProcessing ? 'Processing...' : 'Proceed to Payment'}
            </button>

            {/* Trust Badges */}
            <div className="mt-6 text-center">
              <p className="text-xs text-whisper-charcoal/60">
                Secure payment powered by Stripe
              </p>
              <p className="text-xs text-whisper-charcoal/60 mt-2">
                Your card will be printed and mailed within 1-2 business days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <button
          onClick={handleBack}
          className="px-8 py-3 rounded-full border-2 border-whisper-sage text-whisper-charcoal hover:bg-whisper-sage hover:text-white transition-all duration-300"
        >
          Back to Design
        </button>
      </div>
    </div>
  );
}
