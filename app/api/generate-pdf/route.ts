import { NextResponse } from 'next/server';
// import { put } from '@vercel/blob';
import { generateCardPDF, generateEnvelopePDF } from '@/lib/pdf-generator';
import type { CardDesign } from '@/types';

export async function POST(request: Request) {
  try {
    const { cardDesign, orderId, recipient }: { cardDesign: CardDesign, orderId?: string, recipient?: any } = await request.json();

    // Generate PDF with order ID if provided
    const pdfBlob = await generateCardPDF(cardDesign, orderId);

    // FOR TESTING: Return PDF directly instead of uploading to Vercel Blob
    // Convert blob to base64 for direct download
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64}`;

    return NextResponse.json({
      url: dataUrl,
      filename: orderId ? `card-${orderId.slice(-8)}.pdf` : `whispering-art-card-${cardDesign.id}.pdf`,
    });

    // TODO: When ready for production with Vercel Blob:
    // const filename = `card-${cardDesign.id}-${Date.now()}.pdf`;
    // const blob = await put(filename, pdfBlob, {
    //   access: 'public',
    //   contentType: 'application/pdf',
    // });
    // return NextResponse.json({
    //   url: blob.url,
    //   pathname: blob.pathname,
    // });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
