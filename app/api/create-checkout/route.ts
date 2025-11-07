import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-10-29.clover',
});

export async function POST(request: Request) {
  try {
    const { cardDesign, buyerName, buyerEmail, recipient, amount } = await request.json();

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Whispering Art Greeting Card',
              description: `${cardDesign.intent.occasion} card - ${cardDesign.text.frontCaption}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      customer_email: buyerEmail,
      metadata: {
        cardDesignId: cardDesign.id,
        buyerName,
        recipientName: recipient.name,
        recipientAddress: JSON.stringify(recipient),
      },
    });

    // Store order in database (would typically save to DB here)
    // For now, we'll handle this in the webhook

    return NextResponse.json({
      sessionId: session.id,
      sessionUrl: session.url
    });
  } catch (error) {
    console.error('Checkout creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
