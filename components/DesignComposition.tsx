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

  const [fontFamily, setFontFamily] = useState<'cormorant' | 'libreBaskerville'>('cormorant');
  const [signatureFont, setSignatureFont] = useState<'greatVibes' | 'allura' | 'alexBrush' | 'pinyonScript' | 'sacramento' | 'dancingScript'>('greatVibes');
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [showFront, setShowFront] = useState(true);
  const [textPosition, setTextPosition] = useState<'bottom' | 'top' | 'center'>('bottom');
  const overlayStyle = 'none'; // Always no overlay
  const frameStyle = 'thick'; // Not used since overlay is always none
  const [imageScale, setImageScale] = useState<'full' | 'large' | 'medium' | 'small'>('full');
  const [imageVerticalPosition, setImageVerticalPosition] = useState<'top' | 'center' | 'bottom'>('center');
  const [imageHorizontalPosition, setImageHorizontalPosition] = useState<'left' | 'center' | 'right'>('center');
  const backgroundColor = '#FFFFFF'; // Always pure white for printing

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
        textPosition,
        overlayStyle,
        frameStyle,
        imageScale,
        imageVerticalPosition,
        imageHorizontalPosition,
        backgroundColor,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setFinalDesign(design);
    setStep(5); // Navigate to checkout
  };

  const handleBack = () => {
    setStep(3);
  };

  return (
    <div className="max-w-6xl mx-auto watermark-whisper">
      {/* Title */}
      <div className="text-center mb-16">
        <h2 className="text-5xl font-cormorant font-light text-whisper-inkBlack mb-4 tracking-wide">
          Your masterpiece awaits
        </h2>
        <p className="text-lg font-cormorant italic text-whisper-plum/70">
          Fine-tune the final touches before bringing it to life
        </p>
      </div>

      <div className="grid lg:grid-cols-[minmax(300px,400px)_1fr] gap-8 items-start">
        {/* Preview Section - Fixed smaller width */}
        <div className="sticky top-4">
          <h3 className="text-xl font-cormorant font-light text-whisper-inkBlack mb-4 text-center">
            Card Preview
          </h3>

          {/* Front/Inside Toggle */}
          <div className="flex gap-2 mb-4 justify-center">
            <button
              onClick={() => setShowFront(true)}
              className={`px-6 py-2 rounded-full font-cormorant transition-all duration-150 ${
                showFront
                  ? 'bg-whisper-plum text-whisper-parchment shadow-paper'
                  : 'bg-whisper-sage/20 text-whisper-plum/60 hover:bg-whisper-sage/30'
              }`}
            >
              Front
            </button>
            <button
              onClick={() => setShowFront(false)}
              className={`px-6 py-2 rounded-full font-cormorant transition-all duration-150 ${
                !showFront
                  ? 'bg-whisper-plum text-whisper-parchment shadow-paper'
                  : 'bg-whisper-sage/20 text-whisper-plum/60 hover:bg-whisper-sage/30'
              }`}
            >
              Inside
            </button>
          </div>

          {/* Card Display */}
          <div className="p-8 bg-gradient-to-br from-whisper-sage/10 to-whisper-blush/10 rounded-2xl border-2 border-whisper-plum/10">
            {showFront ? (
              // Front of Card
              <div
                className="aspect-[5/7] rounded-lg shadow-2xl overflow-hidden relative border-2 border-white/50"
                style={{ backgroundColor }}
              >
                {/* Image Container with scale and position */}
                <div className={`absolute inset-0 flex ${
                  imageVerticalPosition === 'top' ? 'items-start' :
                  imageVerticalPosition === 'bottom' ? 'items-end' :
                  'items-center'
                } ${
                  imageHorizontalPosition === 'left' ? 'justify-start' :
                  imageHorizontalPosition === 'right' ? 'justify-end' :
                  'justify-center'
                }`}>
                  <div className={`relative ${
                    imageScale === 'small' ? 'w-[60%] h-[60%]' :
                    imageScale === 'medium' ? 'w-[80%] h-[80%]' :
                    imageScale === 'large' ? 'w-[90%] h-[90%]' :
                    'w-full h-full'
                  }`}>
                    {selectedImage.url.startsWith('http') ? (
                      <img
                        src={selectedImage.url}
                        alt="Card artwork"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Image
                        src={selectedImage.url}
                        alt="Card artwork"
                        fill
                        className="object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>

                {/* Overlay styles */}
                {overlayStyle === 'gradient' && (
                  <>
                    {textPosition === 'bottom' && (
                      <div className="absolute inset-0 bg-gradient-to-t from-whisper-inkBlack/75 via-whisper-inkBlack/30 to-transparent" />
                    )}
                    {textPosition === 'top' && (
                      <div className="absolute inset-0 bg-gradient-to-b from-whisper-inkBlack/75 via-whisper-inkBlack/30 to-transparent" />
                    )}
                    {textPosition === 'center' && (
                      <div
                        className="absolute inset-0"
                        style={{
                          background: 'radial-gradient(circle, rgba(13,11,11,0.5) 0%, rgba(13,11,11,0.3) 40%, transparent 70%)'
                        }}
                      />
                    )}
                  </>
                )}
                {overlayStyle === 'scrim' && (
                  <div className="absolute inset-0 bg-whisper-inkBlack/45 backdrop-blur-[1px]" />
                )}
                {overlayStyle === 'frame' && (
                  <>
                    {frameStyle === 'thick' && (
                      <div className="absolute inset-0 border-[20px] border-whisper-parchment/90 shadow-[inset_0_0_40px_rgba(13,11,11,0.3)]" />
                    )}
                    {frameStyle === 'thin' && (
                      <div className="absolute inset-0 border-[3px] border-whisper-parchment/95 shadow-[inset_0_0_20px_rgba(13,11,11,0.2)]" />
                    )}
                    {frameStyle === 'vignette' && (
                      <div
                        className="absolute inset-0"
                        style={{
                          boxShadow: 'inset 0 0 80px 40px rgba(13,11,11,0.6)'
                        }}
                      />
                    )}
                    {frameStyle === 'corners' && (
                      <>
                        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-whisper-parchment/90" />
                        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-whisper-parchment/90" />
                        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-whisper-parchment/90" />
                        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-whisper-parchment/90" />
                      </>
                    )}
                  </>
                )}
                {/* overlayStyle === 'none' shows no overlay */}

                {/* Text positioning */}
                <div className={`absolute left-0 right-0 px-10 flex items-center justify-${alignment === 'left' ? 'start' : alignment === 'right' ? 'end' : 'center'} ${
                  textPosition === 'bottom' ? 'bottom-0 pb-10' :
                  textPosition === 'top' ? 'top-0 pt-10' :
                  'top-1/2 -translate-y-1/2'
                }`}>
                  <div className={`${overlayStyle === 'frame' ? 'max-w-[70%]' : 'w-full'} ${alignment === 'center' ? 'text-center' : alignment === 'right' ? 'text-right' : 'text-left'}`}>
                    <p
                      className="text-3xl text-whisper-parchment leading-tight whitespace-pre-line"
                      style={{
                        fontFamily: fontFamily === 'cormorant' ? 'var(--font-cormorant), serif' : 'var(--font-baskerville), serif',
                        textShadow: overlayStyle === 'none'
                          ? '1px 1px 3px rgba(13,11,11,0.8), 0 0 8px rgba(13,11,11,0.6)'
                          : overlayStyle === 'frame' && frameStyle === 'vignette'
                          ? '1px 1px 4px rgba(13,11,11,0.7)'
                          : overlayStyle === 'frame'
                          ? '1px 1px 4px rgba(13,11,11,0.6)'
                          : '1px 1px 3px rgba(13,11,11,0.5)'
                      }}
                    >
                      {generatedText.frontCaption}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Inside of Card
              <div
                className="aspect-[5/7] rounded-lg shadow-2xl p-10 flex flex-col justify-center border-2 border-white/50"
                style={{ backgroundColor }}
              >
                <div className={`${alignment === 'center' ? 'text-center' : alignment === 'right' ? 'text-right' : 'text-left'}`}>
                  <p
                    className="text-whisper-inkBlack leading-relaxed mb-8 text-lg"
                    style={{
                      fontFamily: fontFamily === 'cormorant' ? 'var(--font-cormorant), serif' : 'var(--font-baskerville), serif'
                    }}
                  >
                    {generatedText.insideProse}
                  </p>
                  <p
                    className="text-4xl text-whisper-plum whitespace-pre-line"
                    style={{
                      fontFamily:
                        signatureFont === 'greatVibes' ? 'var(--font-great-vibes), cursive' :
                        signatureFont === 'allura' ? 'var(--font-allura), cursive' :
                        signatureFont === 'alexBrush' ? 'var(--font-alex-brush), cursive' :
                        signatureFont === 'pinyonScript' ? 'var(--font-pinyon-script), cursive' :
                        signatureFont === 'sacramento' ? 'var(--font-sacramento), cursive' :
                        'var(--font-dancing-script), cursive'
                    }}
                  >
                    {generatedText.signature?.replace(',', ',\n')}
                  </p>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs font-cormorant text-whisper-plum/60 mt-4 text-center italic">
            Toggle between views to see both sides of your card
          </p>
        </div>

        {/* Controls Section */}
        <div>
          <h3 className="text-xl font-cormorant font-light text-whisper-inkBlack mb-4 text-center">
            Design Refinements
          </h3>

          {/* Font Family */}
          <div className="paper-card p-4 mb-4">
            <h4 className="font-cormorant text-whisper-plum mb-3 text-base">
              Body Font
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setFontFamily('cormorant')}
                className={`
                  p-5 rounded-xl border-2 transition-all duration-150
                  ${
                    fontFamily === 'cormorant'
                      ? 'border-whisper-plum/40 bg-whisper-plum/10 shadow-paper'
                      : 'border-whisper-plum/20 hover:border-whisper-plum/30 hover-shimmer'
                  }
                `}
              >
                <p className="font-cormorant text-xl text-whisper-inkBlack mb-1">Cormorant</p>
                <p className="font-cormorant text-sm text-whisper-plum/60 italic">
                  Elegant & flowing
                </p>
              </button>
              <button
                onClick={() => setFontFamily('libreBaskerville')}
                className={`
                  p-5 rounded-xl border-2 transition-all duration-150
                  ${
                    fontFamily === 'libreBaskerville'
                      ? 'border-whisper-plum/40 bg-whisper-plum/10 shadow-paper'
                      : 'border-whisper-plum/20 hover:border-whisper-plum/30 hover-shimmer'
                  }
                `}
              >
                <p className="font-libreBaskerville text-xl text-whisper-inkBlack mb-1">
                  Libre Baskerville
                </p>
                <p className="font-libreBaskerville text-sm text-whisper-plum/60 italic">
                  Classic serif
                </p>
              </button>
            </div>
          </div>

          {/* Signature Font */}
          <div className="paper-card p-4 mb-4">
            <h4 className="font-cormorant text-whisper-plum mb-3 text-base">
              Signature Style
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSignatureFont('greatVibes')}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-150
                  ${
                    signatureFont === 'greatVibes'
                      ? 'border-whisper-plum/40 bg-whisper-plum/10 shadow-paper'
                      : 'border-whisper-plum/20 hover:border-whisper-plum/30 hover-shimmer'
                  }
                `}
              >
                <p className="font-greatVibes text-2xl text-whisper-inkBlack">Great Vibes</p>
              </button>
              <button
                onClick={() => setSignatureFont('allura')}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-150
                  ${
                    signatureFont === 'allura'
                      ? 'border-whisper-plum/40 bg-whisper-plum/10 shadow-paper'
                      : 'border-whisper-plum/20 hover:border-whisper-plum/30 hover-shimmer'
                  }
                `}
              >
                <p className="font-allura text-2xl text-whisper-inkBlack">Allura</p>
              </button>
              <button
                onClick={() => setSignatureFont('alexBrush')}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-150
                  ${
                    signatureFont === 'alexBrush'
                      ? 'border-whisper-plum/40 bg-whisper-plum/10 shadow-paper'
                      : 'border-whisper-plum/20 hover:border-whisper-plum/30 hover-shimmer'
                  }
                `}
              >
                <p className="font-alexBrush text-2xl text-whisper-inkBlack">Alex Brush</p>
              </button>
              <button
                onClick={() => setSignatureFont('pinyonScript')}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-150
                  ${
                    signatureFont === 'pinyonScript'
                      ? 'border-whisper-plum/40 bg-whisper-plum/10 shadow-paper'
                      : 'border-whisper-plum/20 hover:border-whisper-plum/30 hover-shimmer'
                  }
                `}
              >
                <p className="font-pinyonScript text-2xl text-whisper-inkBlack">Pinyon Script</p>
              </button>
              <button
                onClick={() => setSignatureFont('sacramento')}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-150
                  ${
                    signatureFont === 'sacramento'
                      ? 'border-whisper-plum/40 bg-whisper-plum/10 shadow-paper'
                      : 'border-whisper-plum/20 hover:border-whisper-plum/30 hover-shimmer'
                  }
                `}
              >
                <p className="font-sacramento text-2xl text-whisper-inkBlack">Sacramento</p>
              </button>
              <button
                onClick={() => setSignatureFont('dancingScript')}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-150
                  ${
                    signatureFont === 'dancingScript'
                      ? 'border-whisper-plum/40 bg-whisper-plum/10 shadow-paper'
                      : 'border-whisper-plum/20 hover:border-whisper-plum/30 hover-shimmer'
                  }
                `}
              >
                <p className="font-dancingScript text-2xl text-whisper-inkBlack">Dancing Script</p>
              </button>
            </div>
          </div>

          {/* Text Alignment */}
          <div className="paper-card p-4 mb-4">
            <h4 className="font-cormorant text-whisper-plum mb-3 text-base">
              Text Alignment
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => setAlignment(align)}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-150 capitalize font-cormorant
                    ${
                      alignment === align
                        ? 'border-whisper-plum/40 bg-whisper-plum/10 shadow-paper text-whisper-inkBlack'
                        : 'border-whisper-plum/20 hover:border-whisper-plum/30 hover-shimmer text-whisper-plum/70'
                    }
                  `}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>

          {/* Text Position (Front Card) */}
          <div className="paper-card p-4 mb-4">
            <h4 className="font-cormorant text-whisper-plum mb-3 text-base">
              Caption Position
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {(['top', 'center', 'bottom'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setTextPosition(pos)}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-150 capitalize font-cormorant
                    ${
                      textPosition === pos
                        ? 'border-whisper-plum/40 bg-whisper-plum/10 shadow-paper text-whisper-inkBlack'
                        : 'border-whisper-plum/20 hover:border-whisper-plum/30 hover-shimmer text-whisper-plum/70'
                    }
                  `}
                >
                  {pos}
                </button>
              ))}
            </div>
            <p className="text-xs font-cormorant text-whisper-plum/60 mt-3 italic text-center">
              Position text where it reads best with your image
            </p>
          </div>

          {/* Image Size */}
          <div className="paper-card p-4 mb-4">
            <h4 className="font-cormorant text-whisper-plum mb-3 text-base">
              Image Size
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {(['small', 'medium', 'large', 'full'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setImageScale(size)}
                  className={`
                    p-3 rounded-xl border-2 transition-all duration-150 capitalize font-cormorant text-sm
                    ${
                      imageScale === size
                        ? 'border-whisper-plum/40 bg-whisper-plum/10 shadow-paper text-whisper-inkBlack'
                        : 'border-whisper-plum/20 hover:border-whisper-plum/30 hover-shimmer text-whisper-plum/70'
                    }
                  `}
                >
                  {size === 'small' ? '60%' : size === 'medium' ? '80%' : size === 'large' ? '90%' : '100%'}
                </button>
              ))}
            </div>
            <p className="text-xs font-cormorant text-whisper-plum/60 mt-3 italic text-center">
              Control how much of the card the image fills
            </p>
          </div>

          {/* Image Vertical Position */}
          <div className="paper-card p-4 mb-4">
            <h4 className="font-cormorant text-whisper-plum mb-3 text-base">
              Image Vertical Position
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {(['top', 'center', 'bottom'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setImageVerticalPosition(pos)}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-150 capitalize font-cormorant
                    ${
                      imageVerticalPosition === pos
                        ? 'border-whisper-plum/40 bg-whisper-plum/10 shadow-paper text-whisper-inkBlack'
                        : 'border-whisper-plum/20 hover:border-whisper-plum/30 hover-shimmer text-whisper-plum/70'
                    }
                  `}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {/* Image Horizontal Position */}
          <div className="paper-card p-4 mb-4">
            <h4 className="font-cormorant text-whisper-plum mb-3 text-base">
              Image Horizontal Position
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {(['left', 'center', 'right'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setImageHorizontalPosition(pos)}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-150 capitalize font-cormorant
                    ${
                      imageHorizontalPosition === pos
                        ? 'border-whisper-plum/40 bg-whisper-plum/10 shadow-paper text-whisper-inkBlack'
                        : 'border-whisper-plum/20 hover:border-whisper-plum/30 hover-shimmer text-whisper-plum/70'
                    }
                  `}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {/* Design Standards Note */}
          <div className="paper-card p-6 bg-whisper-blushRose/20">
            <h4 className="font-cormorant text-whisper-plum mb-3 text-sm tracking-wide">
              PRINTING SPECIFICATIONS
            </h4>
            <ul className="text-sm font-cormorant text-whisper-inkBlack/70 space-y-2 leading-relaxed">
              <li>• A7 folded card (5×7 inches)</li>
              <li>• 300 DPI premium quality</li>
              <li>• 0.25" safe margins maintained</li>
              <li>• Fine art paper with subtle texture</li>
            </ul>
          </div>
        </div>
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
          className="px-12 py-4 rounded-full font-cormorant text-lg transition-all duration-150 bg-whisper-plum text-whisper-parchment hover-shimmer click-settle shadow-paper-lg glow-soft"
        >
          Continue to Checkout
        </button>
      </div>
    </div>
  );
}
