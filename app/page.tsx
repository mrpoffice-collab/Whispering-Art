'use client';

import { useCardStore } from '@/lib/store';
import IntentSelection from '@/components/IntentSelection';
import ImageSelection from '@/components/ImageSelection';
import TextGeneration from '@/components/TextGeneration';
import DesignComposition from '@/components/DesignComposition';
import Checkout from '@/components/Checkout';

export default function Home() {
  const step = useCardStore((state) => state.step);

  return (
    <main className="min-h-screen paper-bg">
      {/* Header */}
      <header className="border-b border-whisper-sage/30 bg-whisper-softWhite/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-playfair text-whisper-charcoal">
            Whispering Art
          </h1>
          <p className="text-whisper-charcoal/70 mt-1 font-light">
            Where words and art whisper together
          </p>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-12">
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="flex items-center flex-1">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  font-medium transition-all duration-300
                  ${
                    step >= num
                      ? 'bg-whisper-sage text-white'
                      : 'bg-whisper-cream border-2 border-whisper-sage/30 text-whisper-charcoal/40'
                  }
                `}
              >
                {num}
              </div>
              {num < 5 && (
                <div
                  className={`
                    flex-1 h-1 mx-2 transition-all duration-300
                    ${step > num ? 'bg-whisper-sage' : 'bg-whisper-sage/20'}
                  `}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="animate-fold">
          {step === 1 && <IntentSelection />}
          {step === 2 && <ImageSelection />}
          {step === 3 && <TextGeneration />}
          {step === 4 && <DesignComposition />}
          {step === 5 && <Checkout />}
        </div>
      </div>
    </main>
  );
}
