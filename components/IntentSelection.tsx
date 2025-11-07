'use client';

import { useState } from 'react';
import { useCardStore } from '@/lib/store';
import type { CardOccasion, CardMood, ArtStyle } from '@/types';

const occasions: { value: CardOccasion; label: string; emoji: string }[] = [
  { value: 'birthday', label: 'Birthday', emoji: '🎂' },
  { value: 'comfort', label: 'Comfort', emoji: '🤗' },
  { value: 'gratitude', label: 'Gratitude', emoji: '🙏' },
  { value: 'faith', label: 'Faith', emoji: '✝️' },
  { value: 'celebration', label: 'Celebration', emoji: '🎉' },
  { value: 'sympathy', label: 'Sympathy', emoji: '🕊️' },
  { value: 'love', label: 'Love', emoji: '💝' },
  { value: 'encouragement', label: 'Encouragement', emoji: '💪' },
];

const moods: { value: CardMood; label: string }[] = [
  { value: 'gentle', label: 'Gentle' },
  { value: 'playful', label: 'Playful' },
  { value: 'hopeful', label: 'Hopeful' },
  { value: 'reflective', label: 'Reflective' },
  { value: 'warm', label: 'Warm' },
  { value: 'peaceful', label: 'Peaceful' },
  { value: 'joyful', label: 'Joyful' },
];

const styles: { value: ArtStyle; label: string; description: string }[] = [
  { value: 'floral-line-art', label: 'Floral Line Art', description: 'Elegant linework with botanical elements' },
  { value: 'watercolor', label: 'Watercolor', description: 'Soft, flowing washes of color' },
  { value: 'botanical', label: 'Botanical', description: 'Detailed plant illustrations' },
  { value: 'boho', label: 'Boho', description: 'Free-spirited and earthy' },
  { value: 'vintage', label: 'Vintage', description: 'Classic, timeless aesthetics' },
  { value: 'minimalist', label: 'Minimalist', description: 'Clean, simple, spacious' },
  { value: 'impressionist', label: 'Impressionist', description: 'Painterly, atmospheric' },
];

export default function IntentSelection() {
  const [selectedOccasion, setSelectedOccasion] = useState<CardOccasion | null>(null);
  const [selectedMood, setSelectedMood] = useState<CardMood | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle | null>(null);

  const setIntent = useCardStore((state) => state.setIntent);

  const handleContinue = () => {
    if (selectedOccasion && selectedMood && selectedStyle) {
      setIntent({
        occasion: selectedOccasion,
        mood: selectedMood,
        style: selectedStyle,
      });
    }
  };

  const isComplete = selectedOccasion && selectedMood && selectedStyle;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-playfair text-whisper-charcoal mb-3">
          Begin with intention
        </h2>
        <p className="text-lg text-whisper-charcoal/70">
          Every meaningful card starts with a feeling
        </p>
      </div>

      {/* Occasion Selection */}
      <section className="mb-10">
        <h3 className="text-xl font-playfair text-whisper-charcoal mb-4">
          What's the occasion?
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {occasions.map((occasion) => (
            <button
              key={occasion.value}
              onClick={() => setSelectedOccasion(occasion.value)}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200
                hover:scale-105 hover:shadow-lg
                ${
                  selectedOccasion === occasion.value
                    ? 'border-whisper-gold bg-whisper-gold/10'
                    : 'border-whisper-sage/30 bg-white hover:border-whisper-sage'
                }
              `}
            >
              <div className="text-3xl mb-2">{occasion.emoji}</div>
              <div className="text-sm font-medium text-whisper-charcoal">
                {occasion.label}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Mood Selection */}
      <section className="mb-10">
        <h3 className="text-xl font-playfair text-whisper-charcoal mb-4">
          What's the mood?
        </h3>
        <div className="flex flex-wrap gap-3">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`
                px-6 py-3 rounded-full border-2 transition-all duration-200
                hover:scale-105
                ${
                  selectedMood === mood.value
                    ? 'border-whisper-blush bg-whisper-blush text-whisper-charcoal'
                    : 'border-whisper-sage/30 bg-white hover:border-whisper-sage text-whisper-charcoal/70'
                }
              `}
            >
              {mood.label}
            </button>
          ))}
        </div>
      </section>

      {/* Style Selection */}
      <section className="mb-10">
        <h3 className="text-xl font-playfair text-whisper-charcoal mb-4">
          Choose an art style
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {styles.map((style) => (
            <button
              key={style.value}
              onClick={() => setSelectedStyle(style.value)}
              className={`
                p-5 rounded-lg border-2 transition-all duration-200 text-left
                hover:scale-105 hover:shadow-lg
                ${
                  selectedStyle === style.value
                    ? 'border-whisper-sage bg-whisper-sage/10'
                    : 'border-whisper-sage/30 bg-white hover:border-whisper-sage'
                }
              `}
            >
              <div className="font-playfair text-lg text-whisper-charcoal mb-1">
                {style.label}
              </div>
              <div className="text-sm text-whisper-charcoal/60">
                {style.description}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Continue Button */}
      <div className="text-center mt-12">
        <button
          onClick={handleContinue}
          disabled={!isComplete}
          className={`
            px-10 py-4 rounded-full font-medium text-lg transition-all duration-300
            ${
              isComplete
                ? 'bg-whisper-sage text-white hover:bg-whisper-gold hover:scale-105 shadow-lg'
                : 'bg-whisper-sage/30 text-whisper-charcoal/40 cursor-not-allowed'
            }
          `}
        >
          Continue to Image Selection
        </button>
      </div>
    </div>
  );
}
