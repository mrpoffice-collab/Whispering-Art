import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { generateCardPDF, generateEnvelopePDF } from '@/lib/pdf-generator';
import { jsPDF } from 'jspdf';

export async function POST(request: Request) {
  try {
    const { action, orderIds } = await request.json();

    if (action === 'downloadCards') {
      // Fetch all orders
      const result = await sql`
        SELECT * FROM orders
        WHERE id = ANY(${orderIds})
        ORDER BY created_at DESC
      `;

      // Create a combined PDF with all cards
      let combinedPDF: jsPDF | null = null;

      for (const row of result) {
        const cardPDF = await generateCardPDF(row.card_design, row.id);
        const arrayBuffer = await cardPDF.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        if (!combinedPDF) {
          // First PDF - use it as base
          combinedPDF = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: [5 * 72, 7 * 72],
          });

          // Load first PDF
          // Note: jsPDF doesn't support loading external PDFs easily
          // We'll generate them separately for now
        }
      }

      // For now, return array of individual PDFs
      const pdfs = [];
      for (const row of result) {
        const cardPDF = await generateCardPDF(row.card_design, row.id);
        const arrayBuffer = await cardPDF.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        pdfs.push({
          orderId: row.id,
          shortId: row.id.slice(-8),
          url: `data:application/pdf;base64,${base64}`,
          filename: `card-${row.id.slice(-8)}.pdf`,
        });
      }

      return NextResponse.json({ pdfs });
    }

    if (action === 'downloadEnvelopes') {
      // Fetch all orders
      const result = await sql`
        SELECT * FROM orders
        WHERE id = ANY(${orderIds})
        ORDER BY created_at DESC
      `;

      const pdfs = [];
      for (const row of result) {
        const envelopePDF = await generateEnvelopePDF(row.recipient, row.id);
        const arrayBuffer = await envelopePDF.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        pdfs.push({
          orderId: row.id,
          shortId: row.id.slice(-8),
          url: `data:application/pdf;base64,${base64}`,
          filename: `envelope-${row.id.slice(-8)}.pdf`,
        });
      }

      return NextResponse.json({ pdfs });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Batch operation error:', error);
    return NextResponse.json(
      { error: 'Batch operation failed' },
      { status: 500 }
    );
  }
}
