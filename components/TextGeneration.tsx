'use client';

import { useState, useEffect } from 'react';
import { useCardStore } from '@/lib/store';
import type { CardText } from '@/types';

export default function TextGeneration() {
  const intent = useCardStore((state) => state.intent);
  const selectedImage = useCardStore((state) => state.selectedImage);
  const setText = useCardStore((state) => state.setText);
  const setStep = useCardStore((state) => state.setStep);

  const [isGenerating, setIsGenerating] = useState(false);
  const [frontCaption, setFrontCaption] = useState('');
  const [insideProse, setInsideProse] = useState('');
  const [userGuidance, setUserGuidance] = useState('');

  if (!intent || !selectedImage) return null;

  const generateText = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: selectedImage.url,
          occasion: intent.occasion,
          specificOccasion: intent.specificOccasion,
          mood: intent.mood,
          userGuidance,
        }),
      });
      const data = await response.json();
      setFrontCaption(data.frontCaption);
      setInsideProse(data.insideProse);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate text. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-generate on mount
  useEffect(() => {
    if (!frontCaption && !insideProse) {
      generateText();
    }
  }, []);

  const handleContinue = () => {
    if (frontCaption && insideProse) {
      const cardText: CardText = {
        frontCaption,
        insideProse,
        signature: intent.senderName,
      };
      setText(cardText);
      setStep(4);
    }
  };

  const handleBack = () => {
    setStep(2);
  };

  const handleRefine = () => {
    generateText();
  };

  return (
    <div className="max-w-4xl mx-auto watermark-whisper">
      {/* Title */}
      <div className="text-center mb-16">
        <h2 className="text-5xl font-cormorant font-light text-whisper-inkBlack mb-4 tracking-wide">
          Words that whisper
        </h2>
        <p className="text-lg font-cormorant italic text-whisper-plum/70">
          AI-crafted prose to match your art
        </p>

        {/* Gentle instruction */}
        <div className="mt-8 max-w-2xl mx-auto">
          <p className="text-sm font-cormorant text-whisper-inkBlack/60 leading-relaxed">
            Each word has been thoughtfully woven to complement your chosen image and sentiment.
            Feel free to refine these whispers—make them yours, let them carry your voice,
            and watch as they breathe life into your creation.
          </p>
        </div>
      </div>

      {isGenerating && !frontCaption ? (
        <div className="paper-card p-16 text-center">
          <div className="mb-6">
            <div className="inline-block animate-pulse">
              <svg
                className="h-16 w-16 text-whisper-plum/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
          </div>
          <p className="font-cormorant text-xl text-whisper-inkBlack/60 italic">
            Crafting words that match your art...
          </p>
        </div>
      ) : (
        <>
          {/* Generated Text Display */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Front Caption */}
            <div className="paper-card p-6">
              <h3 className="text-xl font-cormorant font-light text-whisper-inkBlack mb-4 text-center">
                Front Caption
              </h3>
              <textarea
                value={frontCaption}
                onChange={(e) => setFrontCaption(e.target.value)}
                className="w-full p-4 border-2 border-whisper-plum/20 rounded-xl focus:border-whisper-plum/40 focus:outline-none font-cormorant text-xl text-center bg-transparent resize-none"
                rows={4}
                placeholder="Your front caption..."
              />
              <p className="text-xs font-cormorant text-whisper-plum/60 mt-3 text-center italic">
                2-6 words, poetic or minimal
              </p>
            </div>

            {/* Inside Prose */}
            <div className="paper-card p-6">
              <h3 className="text-xl font-cormorant font-light text-whisper-inkBlack mb-4 text-center">
                Inside Prose
              </h3>
              <textarea
                value={insideProse}
                onChange={(e) => setInsideProse(e.target.value)}
                className="w-full p-4 border-2 border-whisper-plum/20 rounded-xl focus:border-whisper-plum/40 focus:outline-none font-cormorant text-base leading-relaxed bg-transparent resize-none"
                rows={7}
                placeholder="Your heartfelt message..."
              />
              <p className="text-xs font-cormorant text-whisper-plum/60 mt-3 text-center italic">
                1-3 sentences with warmth and sincerity
              </p>
            </div>
          </div>

          {/* Refinement Section */}
          <div className="paper-card p-6 mb-8">
            <h3 className="text-2xl font-cormorant font-light text-whisper-inkBlack mb-4 text-center">
              Refine the tone
            </h3>
            <div className="flex gap-3 mb-3">
              <input
                type="text"
                value={userGuidance}
                onChange={(e) => setUserGuidance(e.target.value)}
                placeholder='e.g., "softer", "warmer", "more poetic"'
                className="flex-1 px-4 py-3 border-2 border-whisper-plum/20 rounded-full focus:border-whisper-plum/40 focus:outline-none font-cormorant"
                onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
              />
              <button
                onClick={handleRefine}
                disabled={isGenerating}
                className={`px-8 py-3 rounded-full font-cormorant transition-all duration-150 ${
                  isGenerating
                    ? 'bg-whisper-sage/20 text-whisper-plum/40 cursor-not-allowed'
                    : 'bg-whisper-plum text-whisper-parchment hover-shimmer click-settle'
                }`}
              >
                {isGenerating ? 'Refining...' : 'Refine'}
              </button>
            </div>
            <p className="text-xs font-cormorant text-whisper-plum/60 text-center italic">
              Provide guidance to adjust the tone and style
            </p>
          </div>

          {/* Preview Card */}
          <div className="paper-card p-8 mb-8">
            <h3 className="text-2xl font-cormorant font-light text-whisper-inkBlack mb-8 text-center">
              Preview
            </h3>
            <div className="max-w-sm mx-auto paper-card p-8">
              <div className="text-center mb-8">
                <p className="font-cormorant text-2xl text-whisper-inkBlack leading-relaxed whitespace-pre-line">
                  {frontCaption || 'Your caption here'}
                </p>
              </div>
              <div className="border-t border-whisper-plum/20 pt-6">
                <p className="font-cormorant text-base text-whisper-inkBlack leading-relaxed mb-6">
                  {insideProse || 'Your message here'}
                </p>
                <p className="font-greatVibes text-2xl text-whisper-plum text-right whitespace-pre-line">
                  {intent.senderName?.replace(',', ',\n')}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

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
          disabled={!frontCaption || !insideProse}
          className={`
            px-12 py-4 rounded-full font-cormorant text-lg transition-all duration-150
            ${
              frontCaption && insideProse
                ? 'bg-whisper-plum text-whisper-parchment hover-shimmer click-settle shadow-paper-lg glow-soft'
                : 'bg-whisper-sage/20 text-whisper-plum/40 cursor-not-allowed'
            }
          `}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
