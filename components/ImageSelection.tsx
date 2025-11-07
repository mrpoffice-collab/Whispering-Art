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
  const [promptCopied, setPromptCopied] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);

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
      lighthearted: 'lighthearted, cheerful, carefree',
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

    // If specific occasion is provided, use it for more targeted imagery
    const occasionDetail = intent.specificOccasion
      ? `${intent.specificOccasion} themed, ${occasionTheme[intent.occasion]}`
      : occasionTheme[intent.occasion];

    return `${styleMap[intent.style]}, ${moodMap[intent.mood]} atmosphere, ${occasionDetail}, greeting card design, elegant composition, white background, high quality --ar 5:7`;
  };

  const handleOpenMidjourney = () => {
    const prompt = generateMidjourneyPrompt();
    // Copy prompt to clipboard
    navigator.clipboard.writeText(prompt);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 3000);
    // Open MidJourney Alpha
    window.open('https://alpha.midjourney.com/imagine', '_blank');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      setImageUrl(''); // Clear URL if file is selected
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = async () => {
    if (!imageUrl.trim()) return;

    setIsLoadingUrl(true);
    try {
      // Basic URL validation
      const url = new URL(imageUrl);
      if (!url.hostname.includes('midjourney') && !url.hostname.includes('cdn')) {
        alert('Please use a MidJourney image URL');
        setIsLoadingUrl(false);
        return;
      }

      // Set preview directly - backend will handle fetching
      setImagePreview(imageUrl);
      setUploadedImage(null);
      setIsLoadingUrl(false);
    } catch (error) {
      console.error('Error with URL:', error);
      alert('Invalid URL format. Please paste the complete image URL from MidJourney.');
      setIsLoadingUrl(false);
    }
  };

  const handleContinue = async () => {
    if (!imagePreview) return;

    setIsUploading(true);

    try {
      let blobUrl = imagePreview; // Temporary: use preview URL

      // TODO: Implement after deployment
      // if (uploadedImage) {
      //   const formData = new FormData();
      //   formData.append('file', uploadedImage);
      //   const response = await fetch('/api/upload-image', {
      //     method: 'POST',
      //     body: formData,
      //   });
      //   const data = await response.json();
      //   blobUrl = data.url;
      // } else if (imageUrl) {
      //   const response = await fetch('/api/upload-image', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ imageUrl }),
      //   });
      //   const data = await response.json();
      //   blobUrl = data.url;
      // }

      const cardImage: CardImage = {
        id: crypto.randomUUID(),
        url: imagePreview,
        blobUrl: blobUrl,
        prompt: generateMidjourneyPrompt(),
        aspectRatio: '5:7',
        createdAt: new Date(),
      };

      setImage(cardImage);
      setStep(3); // Move to next step
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto watermark-whisper">
      {/* Title - soft glow */}
      <div className="text-center mb-16">
        <h2 className="text-5xl font-cormorant font-light text-whisper-inkBlack mb-4 tracking-wide">
          Discover your image
        </h2>
        <p className="text-lg font-cormorant italic text-whisper-plum/70">
          Every masterpiece begins with inspiration
        </p>
      </div>

      {/* Selected Intent Summary - subtle paper card */}
      <div className="paper-card p-6 mb-12 border-none">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-cormorant text-whisper-inkBlack/60">
          <span><span className="text-whisper-plum">Occasion:</span> <span className="capitalize italic">{intent.occasion}</span></span>
          <span className="text-whisper-plum/30">•</span>
          <span><span className="text-whisper-plum">Mood:</span> <span className="capitalize italic">{intent.mood}</span></span>
          <span className="text-whisper-plum/30">•</span>
          <span><span className="text-whisper-plum">Style:</span> <span className="capitalize italic">{intent.style.replace('-', ' ')}</span></span>
        </div>
      </div>

      {/* MidJourney Section - elegant paper card */}
      <div className="paper-card p-8 mb-8 hover-shimmer">
        <h3 className="text-3xl font-cormorant font-light text-whisper-inkBlack mb-6 text-center">
          Create with MidJourney
        </h3>

        <div className="bg-whisper-parchment/50 p-5 rounded-xl mb-6 border border-whisper-plum/10">
          <p className="text-sm font-cormorant text-whisper-plum mb-3 tracking-wide">
            Your curated prompt:
          </p>
          <p className="text-sm font-cormorant text-whisper-inkBlack/70 leading-relaxed italic">
            {generateMidjourneyPrompt()}
          </p>
        </div>

        <button
          onClick={handleOpenMidjourney}
          className="w-full px-8 py-4 rounded-full font-cormorant text-lg transition-all duration-150 bg-whisper-plum text-whisper-parchment hover-shimmer click-settle shadow-paper-lg glow-soft"
        >
          {promptCopied ? '✓ Prompt Copied — Opening MidJourney' : 'Open MidJourney & Copy Prompt'}
        </button>

        <p className="text-xs font-cormorant text-whisper-inkBlack/50 mt-4 text-center italic">
          Generate your masterpiece, then return to upload
        </p>
      </div>

      {/* Upload Section - elegant paper card */}
      <div className="paper-card p-8">
        <h3 className="text-3xl font-cormorant font-light text-whisper-inkBlack mb-6 text-center">
          Add your artwork
        </h3>

        {!imagePreview ? (
          <div className="space-y-6">
            {/* URL Input Option */}
            <div>
              <p className="text-sm font-cormorant text-whisper-plum mb-3 text-center">
                Paste MidJourney image URL
              </p>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://cdn.midjourney.com/..."
                  className="flex-1 px-4 py-3 rounded-full border-2 border-whisper-plum/20 font-cormorant focus:outline-none focus:border-whisper-plum/40 transition-all duration-150"
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                />
                <button
                  onClick={handleUrlSubmit}
                  disabled={!imageUrl.trim() || isLoadingUrl}
                  className={`px-8 py-3 rounded-full font-cormorant transition-all duration-150 ${
                    imageUrl.trim() && !isLoadingUrl
                      ? 'bg-whisper-plum text-whisper-parchment hover-shimmer click-settle'
                      : 'bg-whisper-sage/20 text-whisper-plum/40 cursor-not-allowed'
                  }`}
                >
                  {isLoadingUrl ? 'Loading...' : 'Load'}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-whisper-plum/10"></div>
              <span className="text-sm font-cormorant italic text-whisper-plum/50">or</span>
              <div className="flex-1 h-px bg-whisper-plum/10"></div>
            </div>

            {/* File Upload Option */}
            <label className="block border-2 border-dashed border-whisper-plum/20 rounded-2xl p-12 text-center cursor-pointer hover:border-whisper-plum/40 hover:bg-whisper-blushRose/10 transition-all duration-150 hover-shimmer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="text-whisper-inkBlack/50">
                <svg
                  className="mx-auto h-12 w-12 mb-4 text-whisper-plum/40"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  strokeWidth={1.5}
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-lg font-cormorant mb-1 text-whisper-inkBlack/70">Upload from computer</p>
                <p className="text-sm font-cormorant italic text-whisper-plum/60">PNG or JPG, up to 10MB</p>
              </div>
            </label>
          </div>
        ) : (
          <div>
            <div className="relative w-full max-w-md mx-auto mb-6">
              {imageUrl ? (
                // Display URL image using img tag to avoid Next.js Image optimization issues
                <img
                  src={imagePreview}
                  alt="Selected card image"
                  className="w-full h-auto rounded-2xl shadow-paper-lg"
                />
              ) : (
                <Image
                  src={imagePreview}
                  alt="Selected card image"
                  width={400}
                  height={560}
                  className="rounded-2xl shadow-paper-lg"
                />
              )}
            </div>
            <button
              onClick={() => {
                setUploadedImage(null);
                setImagePreview(null);
                setImageUrl('');
              }}
              className="font-cormorant text-whisper-plum/70 hover:text-whisper-plum text-sm mb-4 block mx-auto hover-shimmer italic"
            >
              Choose a different image
            </button>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 justify-between mt-12">
        <button
          onClick={handleBack}
          className="px-10 py-3 rounded-full border-2 border-whisper-plum/30 font-cormorant text-whisper-inkBlack hover:bg-whisper-plum/10 hover:border-whisper-plum/50 transition-all duration-150 hover-shimmer click-settle"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!imagePreview || isUploading}
          className={`
            px-12 py-4 rounded-full font-cormorant text-lg transition-all duration-150
            ${
              imagePreview && !isUploading
                ? 'bg-whisper-plum text-whisper-parchment hover-shimmer click-settle shadow-paper-lg glow-soft'
                : 'bg-whisper-sage/20 text-whisper-plum/40 cursor-not-allowed'
            }
          `}
        >
          {isUploading ? 'Preparing your image...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
