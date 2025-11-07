import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { generateCardPDF } from '@/lib/pdf-generator';
import type { CardDesign } from '@/types';

export async function POST(request: Request) {
  try {
    const { cardDesign }: { cardDesign: CardDesign } = await request.json();

    // Generate PDF
    const pdfBlob = await generateCardPDF(cardDesign);

    // Upload to Vercel Blob
    const filename = `card-${cardDesign.id}-${Date.now()}.pdf`;
    const blob = await put(filename, pdfBlob, {
      access: 'public',
      contentType: 'application/pdf',
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
