// Core types for Whispering Art

export type CardOccasion =
  | 'birthday'
  | 'comfort'
  | 'gratitude'
  | 'faith'
  | 'celebration'
  | 'sympathy'
  | 'love'
  | 'encouragement';

export type CardMood =
  | 'gentle'
  | 'playful'
  | 'hopeful'
  | 'reflective'
  | 'warm'
  | 'peaceful'
  | 'joyful'
  | 'lighthearted';

export type ArtStyle =
  | 'floral-line-art'
  | 'watercolor'
  | 'botanical'
  | 'boho'
  | 'vintage'
  | 'minimalist'
  | 'impressionist';

export interface CardIntent {
  occasion: CardOccasion;
  specificOccasion?: string; // Optional specific occasion like "Christmas", "Wedding", etc.
  mood: CardMood;
  style: ArtStyle;
  senderName: string;
}

export interface CardImage {
  id: string;
  url: string;
  blobUrl?: string;
  prompt: string;
  colorPalette?: string[];
  aspectRatio: string;
  createdAt: Date;
}

export interface CardText {
  frontCaption: string;
  insideProse: string;
  signature?: string;
}

export interface CardDesign {
  id: string;
  intent: CardIntent;
  image: CardImage;
  text: CardText;
  layout: {
    fontFamily: 'cormorant' | 'libreBaskerville';
    captionSize: string;
    proseSize: string;
    signatureFont: 'greatVibes' | 'allura' | 'alexBrush' | 'pinyonScript' | 'sacramento' | 'dancingScript';
    alignment: 'left' | 'center' | 'right';
    textPosition: 'bottom' | 'top' | 'center';
    overlayStyle: 'gradient' | 'scrim' | 'frame' | 'none';
    frameStyle: 'thick' | 'thin' | 'vignette' | 'corners';
    imageScale?: 'full' | 'large' | 'medium' | 'small';
    imageVerticalPosition?: 'top' | 'center' | 'bottom';
    imageHorizontalPosition?: 'left' | 'center' | 'right';
    backgroundColor?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipientAddress {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  cardDesignId: string;
  cardDesign: CardDesign;
  recipient: RecipientAddress;
  buyerEmail: string;
  buyerName: string;
  status: 'pending' | 'paid' | 'printed' | 'mailed';
  stripePaymentId: string;
  amount: number; // in cents
  postage: number; // in cents
  pdfUrl?: string;
  createdAt: Date;
  printedAt?: Date;
  mailedAt?: Date;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  cards: CardDesign[];
  coverImageUrl?: string;
  createdAt: Date;
}

export interface ChatGPTRequest {
  imageUrl: string;
  occasion: CardOccasion;
  mood: CardMood;
  userGuidance?: string;
}

export interface ChatGPTResponse {
  frontCaption: string;
  insideProse: string;
  reasoning?: string;
}

export interface CuratedImage {
  id: string;
  blobUrl: string;
  thumbnailUrl?: string;
  occasion: CardOccasion;
  mood: CardMood;
  style: ArtStyle;
  midjourneyPrompt?: string;
  tags?: string[];
  isActive: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Store state management types
export interface CardCreationStore {
  step: 1 | 2 | 3 | 4 | 5;
  intent: CardIntent | null;
  selectedImage: CardImage | null;
  generatedText: CardText | null;
  finalDesign: CardDesign | null;

  setStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  setIntent: (intent: CardIntent) => void;
  setImage: (image: CardImage) => void;
  updateGeneratedText: (text: CardText) => void;
  setText: (text: CardText) => void;
  setFinalDesign: (design: CardDesign) => void;
  reset: () => void;
}
