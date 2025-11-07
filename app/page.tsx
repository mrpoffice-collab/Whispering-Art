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
    <main className="min-h-screen paper-bg relative">
      {/* Floating artistic whispers - petals, brushstrokes, sentiment symbols */}
      <div className="whisper-petals">
        <div className="whisper-petal petal-1"></div>
        <div className="whisper-petal petal-2"></div>
        <div className="whisper-petal petal-3"></div>
        <div className="whisper-petal petal-4"></div>
        <div className="whisper-petal petal-5"></div>
        <div className="whisper-petal petal-6"></div>
        <div className="whisper-petal petal-7"></div>
        <div className="whisper-petal petal-8"></div>
        <div className="whisper-petal petal-9"></div>
        <div className="whisper-petal petal-10"></div>
        <div className="whisper-petal petal-11"></div>
        <div className="whisper-petal petal-12"></div>
        <div className="whisper-petal petal-13"></div>
        <div className="whisper-petal petal-14"></div>
        <div className="whisper-petal petal-15"></div>
      </div>

      {/* Signature Header - flowing script */}
      <header className="backdrop-blur-sm sticky top-0 z-50 border-b border-whisper-plum/10">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <h1 className="text-6xl font-greatVibes text-whisper-inkBlack text-center tracking-wide">
            Whispering Art
          </h1>
          <p className="text-center text-whisper-plum/70 mt-1 font-cormorant italic text-xs tracking-widest">
            Where every image finds its voice
          </p>
        </div>
      </header>

      {/* Soft progress dots (no boxes) */}
      <div className="max-w-5xl mx-auto px-8 py-4">
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`
                  w-3 h-3 rounded-full transition-all duration-200
                  ${
                    step >= num
                      ? 'bg-whisper-plum shadow-paper'
                      : 'bg-whisper-sage/30'
                  }
                  ${step === num ? 'scale-125 shadow-paper-lg' : ''}
                `}
              />
              {num < 5 && (
                <div
                  className={`
                    w-16 h-px mx-1 transition-all duration-200
                    ${step > num ? 'bg-whisper-plum/40' : 'bg-whisper-sage/20'}
                  `}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content - fade in/out like turning pages */}
        <div className="animate-fade-in">
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
