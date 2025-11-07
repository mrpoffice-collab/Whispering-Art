import { NextResponse } from 'next/server';
import type { Order } from '@/types';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM orders
      ORDER BY created_at DESC
    `;

    // Convert database rows to Order objects
    const orders: Order[] = result.map((row: any) => ({
      id: row.id,
      cardDesignId: row.card_design_id,
      cardDesign: row.card_design,
      buyerName: row.buyer_name,
      buyerEmail: row.buyer_email,
      recipient: row.recipient,
      status: row.status,
      stripePaymentId: row.stripe_payment_id,
      amount: row.amount,
      postage: row.postage,
      createdAt: row.created_at,
      printedAt: row.printed_at,
      mailedAt: row.mailed_at,
    }));

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { cardDesign, buyerName, buyerEmail, recipient, amount, status } = await request.json();

    const orderId = crypto.randomUUID();
    const orderStatus = status || 'pending';
    const stripePaymentId = 'test_' + Date.now();

    // Insert into database
    await sql`
      INSERT INTO orders (
        id,
        card_design_id,
        card_design,
        buyer_name,
        buyer_email,
        recipient,
        status,
        stripe_payment_id,
        amount,
        postage
      ) VALUES (
        ${orderId},
        ${cardDesign.id},
        ${JSON.stringify(cardDesign)},
        ${buyerName},
        ${buyerEmail},
        ${JSON.stringify(recipient)},
        ${orderStatus},
        ${stripePaymentId},
        ${amount},
        73
      )
    `;

    console.log(`Order created: ${orderId} for ${buyerName}`);

    const order: Order = {
      id: orderId,
      cardDesignId: cardDesign.id,
      cardDesign,
      recipient,
      buyerEmail,
      buyerName,
      status: orderStatus,
      stripePaymentId,
      amount,
      postage: 73,
      createdAt: new Date(),
    };

    return NextResponse.json({ order, success: true });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { orderId, status, orderIds } = await request.json();

    // Batch update if orderIds provided
    if (orderIds && Array.isArray(orderIds)) {
      const now = new Date().toISOString();

      if (status === 'printed') {
        await sql`
          UPDATE orders
          SET status = ${status}, printed_at = ${now}
          WHERE id = ANY(${orderIds})
        `;
      } else if (status === 'mailed') {
        await sql`
          UPDATE orders
          SET status = ${status}, mailed_at = ${now}
          WHERE id = ANY(${orderIds})
        `;
      } else {
        await sql`
          UPDATE orders
          SET status = ${status}
          WHERE id = ANY(${orderIds})
        `;
      }

      console.log(`Batch updated ${orderIds.length} orders to status ${status}`);
      return NextResponse.json({ success: true, count: orderIds.length });
    }

    // Single order update
    if (status === 'printed') {
      await sql`
        UPDATE orders
        SET status = ${status}, printed_at = NOW()
        WHERE id = ${orderId}
      `;
    } else if (status === 'mailed') {
      await sql`
        UPDATE orders
        SET status = ${status}, mailed_at = NOW()
        WHERE id = ${orderId}
      `;
    } else {
      await sql`
        UPDATE orders
        SET status = ${status}
        WHERE id = ${orderId}
      `;
    }

    console.log(`Updated order ${orderId} to status ${status}`);

    // Fetch updated order
    const result = await sql`
      SELECT * FROM orders WHERE id = ${orderId}
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const row = result[0];
    const order: Order = {
      id: row.id,
      cardDesignId: row.card_design_id,
      cardDesign: row.card_design,
      buyerName: row.buyer_name,
      buyerEmail: row.buyer_email,
      recipient: row.recipient,
      status: row.status,
      stripePaymentId: row.stripe_payment_id,
      amount: row.amount,
      postage: row.postage,
      createdAt: row.created_at,
      printedAt: row.printed_at,
      mailedAt: row.mailed_at,
    };

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
