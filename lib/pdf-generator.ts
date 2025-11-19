import { jsPDF } from 'jspdf';
import type { CardDesign } from '@/types';

// A7 card dimensions: 5x7 inches
// At 300 DPI for printing: 1500x2100 pixels
// PDF uses points (1 inch = 72 points)
const CARD_WIDTH = 5 * 72; // 360 points
const CARD_HEIGHT = 7 * 72; // 504 points
const SAFE_MARGIN = 0.25 * 72; // 18 points (0.25 inch safe margin)

export async function generateCardPDF(design: CardDesign, orderId?: string): Promise<Blob> {
  // Create PDF with A7 dimensions
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: [CARD_WIDTH, CARD_HEIGHT],
  });

  // Page 1: Front of card
  await addFrontPage(pdf, design, orderId);

  // Page 2: Inside of card
  pdf.addPage([CARD_WIDTH, CARD_HEIGHT], 'portrait');
  await addInsidePage(pdf, design, orderId);

  // Return as blob
  return pdf.output('blob');
}

async function addFrontPage(pdf: jsPDF, design: CardDesign, orderId?: string) {
  try {
    // Add order ID in top right corner for matching
    if (orderId) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(200, 200, 200); // Light gray
      pdf.text(`#${orderId.slice(-8)}`, CARD_WIDTH - 8, 12, { align: 'right' });
    }

    // Add background image with scale and position
    if (design.image.blobUrl || design.image.url) {
      const imageUrl = design.image.blobUrl || design.image.url;

      // Get image scale and position settings
      const imageScale = (design.layout as any).imageScale || 'full';
      const imageVerticalPosition = (design.layout as any).imageVerticalPosition || 'center';
      const imageHorizontalPosition = (design.layout as any).imageHorizontalPosition || 'center';

      // Calculate dimensions based on scale
      let imgWidth = CARD_WIDTH;
      let imgHeight = CARD_HEIGHT;

      if (imageScale === 'small') {
        imgWidth = CARD_WIDTH * 0.6;
        imgHeight = CARD_HEIGHT * 0.6;
      } else if (imageScale === 'medium') {
        imgWidth = CARD_WIDTH * 0.8;
        imgHeight = CARD_HEIGHT * 0.8;
      } else if (imageScale === 'large') {
        imgWidth = CARD_WIDTH * 0.9;
        imgHeight = CARD_HEIGHT * 0.9;
      }

      // Calculate position based on alignment
      let imgX = 0;
      let imgY = 0;

      // Horizontal positioning
      if (imageHorizontalPosition === 'center') {
        imgX = (CARD_WIDTH - imgWidth) / 2;
      } else if (imageHorizontalPosition === 'right') {
        imgX = CARD_WIDTH - imgWidth;
      }

      // Vertical positioning
      if (imageVerticalPosition === 'center') {
        imgY = (CARD_HEIGHT - imgHeight) / 2;
      } else if (imageVerticalPosition === 'bottom') {
        imgY = CARD_HEIGHT - imgHeight;
      }

      pdf.addImage(
        imageUrl,
        'JPEG',
        imgX,
        imgY,
        imgWidth,
        imgHeight,
        undefined,
        'FAST'
      );
    }

    // Add overlays based on overlayStyle
    const overlayStyle = (design.layout as any).overlayStyle || 'gradient';
    const textPosition = (design.layout as any).textPosition || 'bottom';
    const frameStyle = (design.layout as any).frameStyle || 'thick';

    if (overlayStyle === 'gradient') {
      // Add gradient overlay (jsPDF doesn't support real gradients, so we use rectangles with opacity)
      pdf.setFillColor(13, 11, 11); // whisper-inkBlack

      if (textPosition === 'bottom') {
        // Simulate gradient from bottom to top
        for (let i = 0; i < 20; i++) {
          const opacity = 0.75 - (i / 20) * 0.75;
          pdf.setGState(pdf.GState({ opacity }));
          pdf.rect(0, CARD_HEIGHT * 0.6 + (i * CARD_HEIGHT * 0.02), CARD_WIDTH, CARD_HEIGHT * 0.02, 'F');
        }
      } else if (textPosition === 'top') {
        // Simulate gradient from top to bottom
        for (let i = 0; i < 20; i++) {
          const opacity = 0.75 - (i / 20) * 0.75;
          pdf.setGState(pdf.GState({ opacity }));
          pdf.rect(0, i * CARD_HEIGHT * 0.02, CARD_WIDTH, CARD_HEIGHT * 0.02, 'F');
        }
      } else {
        // Center: lighter overlay
        pdf.setGState(pdf.GState({ opacity: 0.4 }));
        pdf.rect(0, CARD_HEIGHT * 0.3, CARD_WIDTH, CARD_HEIGHT * 0.4, 'F');
      }
      pdf.setGState(pdf.GState({ opacity: 1 })); // Reset opacity
    } else if (overlayStyle === 'scrim') {
      // Semi-transparent overlay over entire image
      pdf.setGState(pdf.GState({ opacity: 0.45 }));
      pdf.setFillColor(13, 11, 11);
      pdf.rect(0, 0, CARD_WIDTH, CARD_HEIGHT, 'F');
      pdf.setGState(pdf.GState({ opacity: 1 }));
    } else if (overlayStyle === 'frame') {
      // Add frame based on frameStyle
      if (frameStyle === 'thick') {
        pdf.setDrawColor(249, 244, 238); // whisper-parchment
        pdf.setLineWidth(20);
        pdf.rect(10, 10, CARD_WIDTH - 20, CARD_HEIGHT - 20, 'S');
      } else if (frameStyle === 'thin') {
        pdf.setDrawColor(249, 244, 238);
        pdf.setLineWidth(3);
        pdf.rect(1.5, 1.5, CARD_WIDTH - 3, CARD_HEIGHT - 3, 'S');
      } else if (frameStyle === 'vignette') {
        // Vignette effect - darken edges
        pdf.setFillColor(13, 11, 11);
        pdf.setGState(pdf.GState({ opacity: 0.5 }));
        const vignetteWidth = 60;
        // Top
        pdf.rect(0, 0, CARD_WIDTH, vignetteWidth, 'F');
        // Bottom
        pdf.rect(0, CARD_HEIGHT - vignetteWidth, CARD_WIDTH, vignetteWidth, 'F');
        // Left
        pdf.rect(0, 0, vignetteWidth, CARD_HEIGHT, 'F');
        // Right
        pdf.rect(CARD_WIDTH - vignetteWidth, 0, vignetteWidth, CARD_HEIGHT, 'F');
        pdf.setGState(pdf.GState({ opacity: 1 }));
      } else if (frameStyle === 'corners') {
        // Decorative corner brackets
        pdf.setDrawColor(249, 244, 238);
        pdf.setLineWidth(4);
        const cornerSize = 64;
        // Top-left
        pdf.line(0, 0, cornerSize, 0);
        pdf.line(0, 0, 0, cornerSize);
        // Top-right
        pdf.line(CARD_WIDTH, 0, CARD_WIDTH - cornerSize, 0);
        pdf.line(CARD_WIDTH, 0, CARD_WIDTH, cornerSize);
        // Bottom-left
        pdf.line(0, CARD_HEIGHT, cornerSize, CARD_HEIGHT);
        pdf.line(0, CARD_HEIGHT, 0, CARD_HEIGHT - cornerSize);
        // Bottom-right
        pdf.line(CARD_WIDTH, CARD_HEIGHT, CARD_WIDTH - cornerSize, CARD_HEIGHT);
        pdf.line(CARD_WIDTH, CARD_HEIGHT, CARD_WIDTH, CARD_HEIGHT - cornerSize);
      }
    }

    // Add front caption with proper positioning
    const fontFamily = design.layout.fontFamily === 'cormorant' ? 'times' : 'helvetica';
    pdf.setFont(fontFamily, 'normal');
    pdf.setFontSize(28);
    pdf.setTextColor(249, 244, 238); // whisper-parchment

    const alignment = design.layout.alignment;
    let captionY: number;

    // Position text based on textPosition
    if (textPosition === 'bottom') {
      captionY = CARD_HEIGHT - SAFE_MARGIN - 40;
    } else if (textPosition === 'top') {
      captionY = SAFE_MARGIN + 40;
    } else {
      captionY = CARD_HEIGHT / 2;
    }

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

async function addInsidePage(pdf: jsPDF, design: CardDesign, orderId?: string) {
  // Background color for inside
  pdf.setFillColor(249, 244, 238); // whisper-parchment
  pdf.rect(0, 0, CARD_WIDTH, CARD_HEIGHT, 'F');

  // Add order ID in top right corner for matching
  if (orderId) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setGState(pdf.GState({ opacity: 0.3 }));
    pdf.setTextColor(13, 11, 11);
    pdf.text(`#${orderId.slice(-8)}`, CARD_WIDTH - 8, 12, { align: 'right' });
    pdf.setGState(pdf.GState({ opacity: 1 }));
  }

  // Add inside prose
  const fontFamily = design.layout.fontFamily === 'cormorant' ? 'times' : 'helvetica';
  pdf.setFont(fontFamily, 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(13, 11, 11); // whisper-inkBlack

  const proseY = CARD_HEIGHT / 2 - 60;
  const alignment = design.layout.alignment;

  if (alignment === 'center') {
    pdf.text(design.text.insideProse, CARD_WIDTH / 2, proseY, {
      align: 'center',
      maxWidth: CARD_WIDTH - 2 * SAFE_MARGIN - 20,
    });
  } else if (alignment === 'left') {
    pdf.text(design.text.insideProse, SAFE_MARGIN + 10, proseY, {
      align: 'left',
      maxWidth: CARD_WIDTH - 2 * SAFE_MARGIN - 20,
    });
  } else {
    pdf.text(design.text.insideProse, CARD_WIDTH - SAFE_MARGIN - 10, proseY, {
      align: 'right',
      maxWidth: CARD_WIDTH - 2 * SAFE_MARGIN - 20,
    });
  }

  // Add signature (use script-style font for all signature fonts)
  pdf.setFont('times', 'italic'); // Best approximation of script fonts in jsPDF
  pdf.setFontSize(24);
  pdf.setTextColor(91, 62, 67); // whisper-plum

  const signatureY = CARD_HEIGHT - SAFE_MARGIN - 50;
  // Split signature at comma to create line break: "Love," on one line, "Nana" on next
  const signatureText = (design.text.signature || '').replace(',', ',\n');

  if (alignment === 'center') {
    pdf.text(signatureText, CARD_WIDTH / 2, signatureY, {
      align: 'center',
    });
  } else if (alignment === 'left') {
    pdf.text(signatureText, SAFE_MARGIN + 10, signatureY, {
      align: 'left',
    });
  } else {
    pdf.text(signatureText, CARD_WIDTH - SAFE_MARGIN - 10, signatureY, {
      align: 'right',
    });
  }

  // Add back artist line at bottom
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.setGState(pdf.GState({ opacity: 0.4 }));
  pdf.setTextColor(13, 11, 11);
  pdf.text(
    'Illustration © Whispering Art by Nana',
    CARD_WIDTH / 2,
    CARD_HEIGHT - 8,
    { align: 'center' }
  );
  pdf.setGState(pdf.GState({ opacity: 1 }));
}

// Standard A7 envelope dimensions: 5.25 x 7.25 inches
const ENVELOPE_WIDTH = 7.25 * 72; // 522 points (landscape)
const ENVELOPE_HEIGHT = 5.25 * 72; // 378 points

export async function generateEnvelopePDF(recipient: any, orderId: string): Promise<Blob> {
  // Create PDF with envelope dimensions (landscape)
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: [ENVELOPE_WIDTH, ENVELOPE_HEIGHT],
  });

  // Add order ID in top left corner for matching
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(13, 11, 11);
  pdf.text(`Order #${orderId.slice(-8)}`, 20, 20);

  // Add recipient address (centered, slightly right and down)
  pdf.setFont('times', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(13, 11, 11);

  const addressX = ENVELOPE_WIDTH / 2 + 60; // Slightly right of center
  const addressY = ENVELOPE_HEIGHT / 2 - 20; // Slightly above center
  const lineHeight = 20;

  let currentY = addressY;

  pdf.text(recipient.name, addressX, currentY);
  currentY += lineHeight;

  pdf.text(recipient.addressLine1, addressX, currentY);
  currentY += lineHeight;

  if (recipient.addressLine2) {
    pdf.text(recipient.addressLine2, addressX, currentY);
    currentY += lineHeight;
  }

  pdf.text(`${recipient.city}, ${recipient.state} ${recipient.zipCode}`, addressX, currentY);

  // Add return address in top left (below order ID)
  pdf.setFontSize(10);
  pdf.text('Whispering Art by Nana', 20, 40);
  pdf.text('Return Address Here', 20, 55); // TODO: Add actual return address
  pdf.text('City, ST ZIP', 20, 70);

  // Return as blob
  return pdf.output('blob');
}
