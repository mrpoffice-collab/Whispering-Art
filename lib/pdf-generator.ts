import { jsPDF } from 'jspdf';
import type { CardDesign } from '@/types';

// A7 card dimensions: 5x7 inches
// At 300 DPI for printing: 1500x2100 pixels
// PDF uses points (1 inch = 72 points)
const CARD_WIDTH = 5 * 72; // 360 points
const CARD_HEIGHT = 7 * 72; // 504 points
const SAFE_MARGIN = 0.25 * 72; // 18 points (0.25 inch safe margin)

export async function generateCardPDF(design: CardDesign): Promise<Blob> {
  // Create PDF with A7 dimensions
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: [CARD_WIDTH, CARD_HEIGHT],
  });

  // Page 1: Front of card
  await addFrontPage(pdf, design);

  // Page 2: Inside of card
  pdf.addPage([CARD_WIDTH, CARD_HEIGHT], 'portrait');
  await addInsidePage(pdf, design);

  // Return as blob
  return pdf.output('blob');
}

async function addFrontPage(pdf: jsPDF, design: CardDesign) {
  try {
    // Add background image
    if (design.image.blobUrl || design.image.url) {
      const imageUrl = design.image.blobUrl || design.image.url;
      pdf.addImage(
        imageUrl,
        'JPEG',
        0,
        0,
        CARD_WIDTH,
        CARD_HEIGHT,
        undefined,
        'FAST'
      );
    }

    // Add semi-transparent overlay for text readability
    // Note: jsPDF has limited transparency support
    pdf.setFillColor(0, 0, 0);
    pdf.rect(0, CARD_HEIGHT * 0.6, CARD_WIDTH, CARD_HEIGHT * 0.4, 'F');

    // Add front caption
    const fontFamily = design.layout.fontFamily === 'playfair' ? 'times' : 'helvetica';
    pdf.setFont(fontFamily, 'normal');
    pdf.setFontSize(32);
    pdf.setTextColor(255, 255, 255);

    const captionY = CARD_HEIGHT - SAFE_MARGIN - 40;
    const alignment = design.layout.alignment;

    if (alignment === 'center') {
      pdf.text(design.text.frontCaption, CARD_WIDTH / 2, captionY, {
        align: 'center',
        maxWidth: CARD_WIDTH - 2 * SAFE_MARGIN,
      });
    } else if (alignment === 'left') {
      pdf.text(design.text.frontCaption, SAFE_MARGIN, captionY, {
        align: 'left',
        maxWidth: CARD_WIDTH - 2 * SAFE_MARGIN,
      });
    } else {
      pdf.text(design.text.frontCaption, CARD_WIDTH - SAFE_MARGIN, captionY, {
        align: 'right',
        maxWidth: CARD_WIDTH - 2 * SAFE_MARGIN,
      });
    }
  } catch (error) {
    console.error('Error adding front page:', error);
  }
}

async function addInsidePage(pdf: jsPDF, design: CardDesign) {
  // Background color for inside
  pdf.setFillColor(250, 247, 242); // whisper-cream
  pdf.rect(0, 0, CARD_WIDTH, CARD_HEIGHT, 'F');

  // Add inside prose
  const fontFamily = design.layout.fontFamily === 'playfair' ? 'times' : 'helvetica';
  pdf.setFont(fontFamily, 'normal');
  pdf.setFontSize(16);
  pdf.setTextColor(74, 74, 74); // whisper-charcoal

  const proseY = CARD_HEIGHT / 2 - 40;
  const alignment = design.layout.alignment;

  if (alignment === 'center') {
    pdf.text(design.text.insideProse, CARD_WIDTH / 2, proseY, {
      align: 'center',
      maxWidth: CARD_WIDTH - 2 * SAFE_MARGIN,
    });
  } else if (alignment === 'left') {
    pdf.text(design.text.insideProse, SAFE_MARGIN, proseY, {
      align: 'left',
      maxWidth: CARD_WIDTH - 2 * SAFE_MARGIN,
    });
  } else {
    pdf.text(design.text.insideProse, CARD_WIDTH - SAFE_MARGIN, proseY, {
      align: 'right',
      maxWidth: CARD_WIDTH - 2 * SAFE_MARGIN,
    });
  }

  // Add signature
  const signatureFont = design.layout.signatureFont === 'greatVibes' ? 'times' : 'helvetica';
  pdf.setFont(signatureFont, 'italic');
  pdf.setFontSize(20);
  pdf.setTextColor(74, 74, 74);

  const signatureY = CARD_HEIGHT - SAFE_MARGIN - 60;

  if (alignment === 'center') {
    pdf.text(design.text.signature || 'Love, Nana', CARD_WIDTH / 2, signatureY, {
      align: 'center',
    });
  } else if (alignment === 'left') {
    pdf.text(design.text.signature || 'Love, Nana', SAFE_MARGIN, signatureY, {
      align: 'left',
    });
  } else {
    pdf.text(design.text.signature || 'Love, Nana', CARD_WIDTH - SAFE_MARGIN, signatureY, {
      align: 'right',
    });
  }

  // Add back artist line at bottom
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(74, 74, 74, 128); // 50% opacity
  pdf.text(
    'Illustration © Whispering Art by Nana',
    CARD_WIDTH / 2,
    CARD_HEIGHT - 10,
    { align: 'center' }
  );
}
