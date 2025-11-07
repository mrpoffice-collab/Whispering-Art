'use client';

import { useState } from 'react';
import { useCardStore } from '@/lib/store';
import type { CardImage } from '@/types';
import Image from 'next/image';

export default function ImageSelection() {
  const intent = useCardStore((state) => state.intent);
  const setImage = useCardStore((state) => state.setImage);
  const setStep = useCardStore((state) => state.setStep);

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!intent) return null;

  // Generate MidJourney prompt based on intent
  const generateMidjourneyPrompt = () => {
    const styleMap: Record<string, string> = {
      'floral-line-art': 'elegant line drawing, botanical illustration',
      'watercolor': 'soft watercolor painting, flowing colors',
      'botanical': 'detailed botanical illustration, scientific drawing',
      'boho': 'bohemian style, earthy and free-spirited',
      'vintage': 'vintage illustration, classic aesthetic',
      'minimalist': 'minimalist design, clean and simple',
      'impressionist': 'impressionist painting, soft brushstrokes',
    };

    const moodMap: Record<string, string> = {
      gentle: 'gentle, soft, delicate',
      playful: 'playful, whimsical, fun',
      hopeful: 'hopeful, uplifting, bright',
      reflective: 'contemplative, thoughtful, serene',
      warm: 'warm, cozy, inviting',
      peaceful: 'peaceful, calm, tranquil',
      joyful: 'joyful, vibrant, happy',
    };

    const occasionTheme: Record<string, string> = {
      birthday: 'birthday celebration',
      comfort: 'comforting embrace',
      gratitude: 'thankfulness and appreciation',
      faith: 'spiritual and sacred',
      celebration: 'festive celebration',
      sympathy: 'sympathy and remembrance',
      love: 'love and affection',
      encouragement: 'encouragement and strength',
    };

    return `${styleMap[intent.style]}, ${moodMap[intent.mood]} atmosphere, ${occasionTheme[intent.occasion]}, greeting card design, elegant composition, white background, high quality --ar 5:7`;
  };

  const handleOpenMidjourney = () => {
    const prompt = generateMidjourneyPrompt();
    // Copy prompt to clipboard
    navigator.clipboard.writeText(prompt);
    // Open MidJourney Organize
    window.open('https://www.midjourney.com/imagine', '_blank');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = async () => {
    if (!uploadedImage || !imagePreview) return;

    setIsUploading(true);

    try {
      // Upload to Vercel Blob
      const formData = new FormData();
      formData.append('file', uploadedImage);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.url) {
        const cardImage: CardImage = {
          id: crypto.randomUUID(),
          url: imagePreview,
          blobUrl: data.url,
          prompt: generateMidjourneyPrompt(),
          aspectRatio: '5:7',
          createdAt: new Date(),
        };

        setImage(cardImage);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-playfair text-whisper-charcoal mb-3">
          Find your art
        </h2>
        <p className="text-lg text-whisper-charcoal/70">
          Create or select an image that speaks to your intention
        </p>
      </div>

      {/* Selected Intent Summary */}
      <div className="bg-white/60 backdrop-blur rounded-lg p-5 mb-8 border border-whisper-sage/30">
        <div className="flex gap-4 text-sm text-whisper-charcoal/70">
          <span className="font-medium">Occasion:</span>
          <span className="capitalize">{intent.occasion}</span>
          <span className="mx-2">•</span>
          <span className="font-medium">Mood:</span>
          <span className="capitalize">{intent.mood}</span>
          <span className="mx-2">•</span>
          <span className="font-medium">Style:</span>
          <span className="capitalize">{intent.style.replace('-', ' ')}</span>
        </div>
      </div>

      {/* MidJourney Section */}
      <div className="bg-white rounded-lg p-8 shadow-lg mb-8">
        <h3 className="text-2xl font-playfair text-whisper-charcoal mb-4">
          Generate with MidJourney
        </h3>
        <div className="bg-whisper-cream p-4 rounded-lg mb-4">
          <p className="text-sm text-whisper-charcoal/80 mb-2 font-medium">
            Suggested prompt:
          </p>
          <p className="text-sm text-whisper-charcoal/70 font-mono bg-white p-3 rounded">
            {generateMidjourneyPrompt()}
          </p>
        </div>
        <button
          onClick={handleOpenMidjourney}
          className="w-full bg-whisper-sage text-white py-3 rounded-lg hover:bg-whisper-gold transition-all duration-300 font-medium"
        >
          Open MidJourney & Copy Prompt
        </button>
        <p className="text-xs text-whisper-charcoal/60 mt-3 text-center">
          The prompt has been copied to your clipboard. Generate your image, then upload it below.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <h3 className="text-2xl font-playfair text-whisper-charcoal mb-4">
          Upload your chosen image
        </h3>

        {!imagePreview ? (
          <label className="block border-2 border-dashed border-whisper-sage/40 rounded-lg p-12 text-center cursor-pointer hover:border-whisper-sage hover:bg-whisper-cream/30 transition-all duration-300">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="text-whisper-charcoal/60">
              <svg
                className="mx-auto h-12 w-12 mb-4"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-lg mb-2">Click to upload your image</p>
              <p className="text-sm">PNG, JPG up to 10MB</p>
            </div>
          </label>
        ) : (
          <div>
            <div className="relative w-full max-w-md mx-auto mb-6">
              <Image
                src={imagePreview}
                alt="Selected card image"
                width={400}
                height={560}
                className="rounded-lg shadow-lg"
              />
            </div>
            <button
              onClick={() => {
                setUploadedImage(null);
                setImagePreview(null);
              }}
              className="text-whisper-charcoal/60 hover:text-whisper-charcoal text-sm mb-4 block mx-auto"
            >
              Choose a different image
            </button>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 justify-between mt-8">
        <button
          onClick={handleBack}
          className="px-8 py-3 rounded-full border-2 border-whisper-sage text-whisper-charcoal hover:bg-whisper-sage hover:text-white transition-all duration-300"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!uploadedImage || isUploading}
          className={`
            px-10 py-3 rounded-full font-medium transition-all duration-300
            ${
              uploadedImage && !isUploading
                ? 'bg-whisper-sage text-white hover:bg-whisper-gold hover:scale-105 shadow-lg'
                : 'bg-whisper-sage/30 text-whisper-charcoal/40 cursor-not-allowed'
            }
          `}
        >
          {isUploading ? 'Uploading...' : 'Continue to Text Generation'}
        </button>
      </div>
    </div>
  );
}
