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
          mood: intent.mood,
          userGuidance,
        }),
      });

      const data = await response.json();

      if (data.frontCaption && data.insideProse) {
        setFrontCaption(data.frontCaption);
        setInsideProse(data.insideProse);
      }
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
        signature: 'Love, Nana',
      };
      setText(cardText);
    }
  };

  const handleBack = () => {
    setStep(2);
  };

  const handleRefine = () => {
    generateText();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-playfair text-whisper-charcoal mb-3">
          Let words whisper
        </h2>
        <p className="text-lg text-whisper-charcoal/70">
          AI-crafted prose to match your art
        </p>
      </div>

      {isGenerating && !frontCaption ? (
        <div className="bg-white rounded-lg p-12 shadow-lg text-center">
          <div className="animate-glow mb-4">
            <svg
              className="mx-auto h-12 w-12 text-whisper-sage"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <p className="text-whisper-charcoal/70">
            Crafting words that match your art...
          </p>
        </div>
      ) : (
        <>
          {/* Generated Text Display */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Front Caption */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-playfair text-whisper-charcoal mb-4">
                Front Caption
              </h3>
              <textarea
                value={frontCaption}
                onChange={(e) => setFrontCaption(e.target.value)}
                className="w-full p-4 border-2 border-whisper-sage/30 rounded-lg focus:border-whisper-sage focus:outline-none font-playfair text-2xl text-center"
                rows={3}
                placeholder="Your front caption..."
              />
              <p className="text-xs text-whisper-charcoal/60 mt-2">
                2-6 words, poetic or minimal
              </p>
            </div>

            {/* Inside Prose */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-playfair text-whisper-charcoal mb-4">
                Inside Prose
              </h3>
              <textarea
                value={insideProse}
                onChange={(e) => setInsideProse(e.target.value)}
                className="w-full p-4 border-2 border-whisper-sage/30 rounded-lg focus:border-whisper-sage focus:outline-none font-lora"
                rows={6}
                placeholder="Your heartfelt message..."
              />
              <p className="text-xs text-whisper-charcoal/60 mt-2">
                1-3 sentences with warmth and sincerity
              </p>
            </div>
          </div>

          {/* Refinement Section */}
          <div className="bg-whisper-cream/50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-playfair text-whisper-charcoal mb-3">
              Refine the tone
            </h3>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={userGuidance}
                onChange={(e) => setUserGuidance(e.target.value)}
                placeholder='e.g., "softer", "warmer", "funnier", or "faith tone"'
                className="flex-1 px-4 py-2 border-2 border-whisper-sage/30 rounded-lg focus:border-whisper-sage focus:outline-none"
              />
              <button
                onClick={handleRefine}
                disabled={isGenerating}
                className="px-6 py-2 bg-whisper-sage text-white rounded-lg hover:bg-whisper-gold transition-all duration-300 disabled:opacity-50"
              >
                {isGenerating ? 'Refining...' : 'Refine'}
              </button>
            </div>
            <p className="text-xs text-whisper-charcoal/60">
              Provide guidance to adjust the tone and style of the generated text
            </p>
          </div>

          {/* Preview Card */}
          <div className="bg-white rounded-lg p-8 shadow-lg mb-8">
            <h3 className="text-lg font-playfair text-whisper-charcoal mb-6 text-center">
              Preview
            </h3>
            <div className="max-w-sm mx-auto bg-whisper-cream rounded-lg p-8 shadow-md">
              <div className="text-center mb-6">
                <p className="font-playfair text-2xl text-whisper-charcoal leading-relaxed">
                  {frontCaption || 'Your caption here'}
                </p>
              </div>
              <div className="border-t border-whisper-sage/30 pt-6">
                <p className="font-lora text-whisper-charcoal leading-relaxed mb-6">
                  {insideProse || 'Your message here'}
                </p>
                <p className="font-allura text-xl text-whisper-charcoal/80 text-right">
                  Love, Nana
                </p>
              </div>
            </div>
          </div>
        </>
      )}

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
          disabled={!frontCaption || !insideProse}
          className={`
            px-10 py-3 rounded-full font-medium transition-all duration-300
            ${
              frontCaption && insideProse
                ? 'bg-whisper-sage text-white hover:bg-whisper-gold hover:scale-105 shadow-lg'
                : 'bg-whisper-sage/30 text-whisper-charcoal/40 cursor-not-allowed'
            }
          `}
        >
          Continue to Design
        </button>
      </div>
    </div>
  );
}
