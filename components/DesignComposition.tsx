'use client';

import { useState } from 'react';
import { useCardStore } from '@/lib/store';
import type { CardDesign } from '@/types';
import Image from 'next/image';

export default function DesignComposition() {
  const intent = useCardStore((state) => state.intent);
  const selectedImage = useCardStore((state) => state.selectedImage);
  const generatedText = useCardStore((state) => state.generatedText);
  const setFinalDesign = useCardStore((state) => state.setFinalDesign);
  const setStep = useCardStore((state) => state.setStep);

  const [fontFamily, setFontFamily] = useState<'lora' | 'playfair'>('playfair');
  const [signatureFont, setSignatureFont] = useState<'greatVibes' | 'allura'>('allura');
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('center');

  if (!intent || !selectedImage || !generatedText) return null;

  const handleContinue = () => {
    const design: CardDesign = {
      id: crypto.randomUUID(),
      intent,
      image: selectedImage,
      text: generatedText,
      layout: {
        fontFamily,
        captionSize: '2xl',
        proseSize: 'base',
        signatureFont,
        alignment,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setFinalDesign(design);
  };

  const handleBack = () => {
    setStep(3);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-playfair text-whisper-charcoal mb-3">
          Compose your card
        </h2>
        <p className="text-lg text-whisper-charcoal/70">
          Fine-tune the design before printing
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Preview Section */}
        <div>
          <h3 className="text-xl font-playfair text-whisper-charcoal mb-4">
            Card Preview
          </h3>

          {/* Front of Card */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
            <p className="text-xs text-whisper-charcoal/50 mb-4 text-center">
              Front
            </p>
            <div className="aspect-[5/7] bg-whisper-cream rounded-lg shadow-lg overflow-hidden relative">
              <Image
                src={selectedImage.url}
                alt="Card design"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className={`absolute bottom-0 left-0 right-0 p-8 text-${alignment}`}>
                <p
                  className={`font-${fontFamily} text-3xl text-white drop-shadow-lg leading-tight`}
                >
                  {generatedText.frontCaption}
                </p>
              </div>
            </div>
          </div>

          {/* Inside of Card */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <p className="text-xs text-whisper-charcoal/50 mb-4 text-center">
              Inside
            </p>
            <div className="aspect-[5/7] bg-whisper-cream rounded-lg shadow-lg p-safe flex flex-col justify-center">
              <div className={`text-${alignment}`}>
                <p className={`font-${fontFamily} text-whisper-charcoal leading-relaxed mb-8 text-lg`}>
                  {generatedText.insideProse}
                </p>
                <p className={`font-${signatureFont} text-2xl text-whisper-charcoal/80`}>
                  {generatedText.signature}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div>
          <h3 className="text-xl font-playfair text-whisper-charcoal mb-4">
            Design Controls
          </h3>

          {/* Font Family */}
          <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
            <h4 className="font-playfair text-whisper-charcoal mb-3">
              Body Font
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFontFamily('lora')}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${
                    fontFamily === 'lora'
                      ? 'border-whisper-sage bg-whisper-sage/10'
                      : 'border-whisper-sage/30 hover:border-whisper-sage'
                  }
                `}
              >
                <p className="font-lora text-lg">Lora</p>
                <p className="font-lora text-sm text-whisper-charcoal/70">
                  Elegant serif
                </p>
              </button>
              <button
                onClick={() => setFontFamily('playfair')}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${
                    fontFamily === 'playfair'
                      ? 'border-whisper-sage bg-whisper-sage/10'
                      : 'border-whisper-sage/30 hover:border-whisper-sage'
                  }
                `}
              >
                <p className="font-playfair text-lg">Playfair</p>
                <p className="font-playfair text-sm text-whisper-charcoal/70">
                  Classic beauty
                </p>
              </button>
            </div>
          </div>

          {/* Signature Font */}
          <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
            <h4 className="font-playfair text-whisper-charcoal mb-3">
              Signature Font
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSignatureFont('greatVibes')}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${
                    signatureFont === 'greatVibes'
                      ? 'border-whisper-sage bg-whisper-sage/10'
                      : 'border-whisper-sage/30 hover:border-whisper-sage'
                  }
                `}
              >
                <p className="font-greatVibes text-2xl">Great Vibes</p>
              </button>
              <button
                onClick={() => setSignatureFont('allura')}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${
                    signatureFont === 'allura'
                      ? 'border-whisper-sage bg-whisper-sage/10'
                      : 'border-whisper-sage/30 hover:border-whisper-sage'
                  }
                `}
              >
                <p className="font-allura text-2xl">Allura</p>
              </button>
            </div>
          </div>

          {/* Alignment */}
          <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
            <h4 className="font-playfair text-whisper-charcoal mb-3">
              Text Alignment
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => setAlignment(align)}
                  className={`
                    p-4 rounded-lg border-2 transition-all capitalize
                    ${
                      alignment === align
                        ? 'border-whisper-sage bg-whisper-sage/10'
                        : 'border-whisper-sage/30 hover:border-whisper-sage'
                    }
                  `}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>

          {/* Design Standards Note */}
          <div className="bg-whisper-blush/20 rounded-lg p-6">
            <h4 className="font-playfair text-whisper-charcoal mb-2 text-sm">
              Design Standards
            </h4>
            <ul className="text-xs text-whisper-charcoal/70 space-y-1">
              <li>• 0.25" safe margins for printing</li>
              <li>• A7 folded card (5×7 inches)</li>
              <li>• 300 DPI for crisp printing</li>
              <li>• Paper texture and natural lighting</li>
            </ul>
          </div>
        </div>
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
          className="px-10 py-3 rounded-full font-medium bg-whisper-sage text-white hover:bg-whisper-gold hover:scale-105 shadow-lg transition-all duration-300"
        >
          Continue to Checkout
        </button>
      </div>
    </div>
  );
}
