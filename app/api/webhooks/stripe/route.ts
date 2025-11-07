import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendOrderConfirmation } from '@/lib/email';
import type { Order } from '@/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-10-29.clover',
});

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Extract order data from metadata
    const metadata = session.metadata!;

    // Create order object
    const order: Order = {
      id: session.id,
      cardDesignId: metadata.cardDesignId,
      cardDesign: JSON.parse(metadata.cardDesign || '{}'),
      recipient: JSON.parse(metadata.recipientAddress),
      buyerEmail: session.customer_email || '',
      buyerName: metadata.buyerName,
      status: 'paid',
      stripePaymentId: session.payment_intent as string,
      amount: session.amount_total || 0,
      postage: 73,
      createdAt: new Date(),
    };

    try {
      // Send confirmation email
      await sendOrderConfirmation(order);

      // In production, save order to database here
      console.log('Order created:', order.id);

      return NextResponse.json({ received: true });
    } catch (error) {
      console.error('Failed to process order:', error);
      return NextResponse.json(
        { error: 'Failed to process order' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
