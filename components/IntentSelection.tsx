'use client';

import { useState } from 'react';
import { useCardStore } from '@/lib/store';
import type { CardOccasion, CardMood, ArtStyle } from '@/types';

const occasions: { value: CardOccasion; label: string; description: string }[] = [
  { value: 'birthday', label: 'Birthday', description: 'Celebrate another year' },
  { value: 'comfort', label: 'Comfort', description: 'A gentle embrace' },
  { value: 'gratitude', label: 'Gratitude', description: 'Heartfelt thanks' },
  { value: 'faith', label: 'Faith', description: 'Spiritual warmth' },
  { value: 'celebration', label: 'Celebration', description: 'Joyful moments' },
  { value: 'sympathy', label: 'Sympathy', description: 'Tender condolences' },
  { value: 'love', label: 'Love', description: 'Affection spoken' },
  { value: 'encouragement', label: 'Encouragement', description: 'Strength shared' },
];

const moods: { value: CardMood; label: string }[] = [
  { value: 'gentle', label: 'Gentle' },
  { value: 'playful', label: 'Playful' },
  { value: 'hopeful', label: 'Hopeful' },
  { value: 'reflective', label: 'Reflective' },
  { value: 'warm', label: 'Warm' },
  { value: 'peaceful', label: 'Peaceful' },
  { value: 'joyful', label: 'Joyful' },
  { value: 'lighthearted', label: 'Lighthearted' },
];

const styles: { value: ArtStyle; label: string; description: string }[] = [
  { value: 'floral-line-art', label: 'Floral Line Art', description: 'Delicate ink strokes' },
  { value: 'watercolor', label: 'Watercolor', description: 'Soft color washes' },
  { value: 'botanical', label: 'Botanical', description: 'Detailed flora' },
  { value: 'boho', label: 'Boho', description: 'Free-spirited' },
  { value: 'vintage', label: 'Vintage', description: 'Timeless charm' },
  { value: 'minimalist', label: 'Minimalist', description: 'Essential beauty' },
  { value: 'impressionist', label: 'Impressionist', description: 'Painterly light' },
];

// Specific occasions mapped to general sentiments
const specificOccasions: Record<CardOccasion, string[]> = {
  celebration: ['Christmas', 'Easter', 'Hanukkah', 'New Year', 'Anniversary', 'Graduation', 'Retirement', 'Promotion'],
  birthday: ['Milestone Birthday', "Child's Birthday", 'Sweet 16', '21st Birthday', '50th Birthday'],
  love: ["Valentine's Day", 'Anniversary', 'Wedding', 'Engagement', 'Just Because'],
  gratitude: ["Teacher Appreciation", "Employee Recognition", "Volunteer Thanks"],
  sympathy: ['Loss of Loved One', 'Loss of Pet', 'Illness', 'Difficult Time'],
  comfort: ['Get Well Soon', 'Thinking of You', 'Support'],
  encouragement: ['New Job', 'New Home', 'New Baby', 'Back to School'],
  faith: ['Baptism', 'Confirmation', 'First Communion', 'Prayer Support'],
};

export default function IntentSelection() {
  const [selectedOccasion, setSelectedOccasion] = useState<CardOccasion | null>(null);
  const [specificOccasion, setSpecificOccasion] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<CardMood | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle | null>(null);
  const [salutation, setSalutation] = useState('');

  const setIntent = useCardStore((state) => state.setIntent);

  const handleContinue = () => {
    if (selectedOccasion && selectedMood && selectedStyle && salutation.trim()) {
      setIntent({
        occasion: selectedOccasion,
        specificOccasion: specificOccasion || undefined,
        mood: selectedMood,
        style: selectedStyle,
        senderName: salutation.trim(),
      });
    }
  };

  const isComplete = selectedOccasion && selectedMood && selectedStyle && salutation.trim();

  return (
    <div className="max-w-4xl mx-auto watermark-whisper">
      {/* Title - soft glow */}
      <div className="text-center mb-12">
        <h2 className="text-6xl font-cormorant font-light text-whisper-inkBlack mb-3 tracking-wide">
          Begin with intention
        </h2>
        <p className="text-base font-cormorant italic text-whisper-plum/70">
          Every meaningful card starts with a feeling
        </p>
      </div>

      {/* Occasion - overlapping cards, no borders */}
      <section className="mb-12">
        <h3 className="text-2xl font-cormorant font-light text-whisper-inkBlack mb-6 text-center">
          Choose the occasion
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {occasions.map((occasion) => (
            <button
              key={occasion.value}
              onClick={() => {
                setSelectedOccasion(occasion.value);
                setSpecificOccasion(''); // Reset specific occasion when changing main occasion
              }}
              className={`
                group p-6 rounded-2xl transition-all duration-150 relative
                hover-shimmer click-settle
                ${
                  selectedOccasion === occasion.value
                    ? 'ring-4 ring-whisper-plum bg-whisper-plum/20 shadow-paper-lg'
                    : 'paper-card'
                }
              `}
            >
              {selectedOccasion === occasion.value && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-whisper-plum rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              <p className="font-cormorant text-lg text-whisper-inkBlack mb-1">
                {occasion.label}
              </p>
              <p className="font-cormorant text-xs text-whisper-plum/60 italic">
                {occasion.description}
              </p>
            </button>
          ))}
        </div>

        {/* Specific Occasion - appears after main occasion selected */}
        {selectedOccasion && specificOccasions[selectedOccasion] && (
          <div className="mt-6 animate-fade-in">
            <p className="text-sm font-cormorant text-whisper-plum/70 italic text-center mb-3">
              Make it more specific (optional)
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {specificOccasions[selectedOccasion].map((specific) => (
                <button
                  key={specific}
                  onClick={() => setSpecificOccasion(specificOccasion === specific ? '' : specific)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-cormorant transition-all duration-150
                    ${
                      specificOccasion === specific
                        ? 'bg-whisper-plum text-whisper-parchment shadow-paper ring-2 ring-whisper-plum/50'
                        : 'bg-whisper-sage/20 text-whisper-plum/70 hover:bg-whisper-sage/30'
                    }
                  `}
                >
                  {specific}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Mood - match other containers */}
      <section className="mb-12">
        <h3 className="text-2xl font-cormorant font-light text-whisper-inkBlack mb-6 text-center">
          Choose the mood
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`
                group p-5 rounded-2xl transition-all duration-150 relative
                hover-shimmer click-settle
                ${
                  selectedMood === mood.value
                    ? 'ring-4 ring-whisper-plum bg-whisper-plum/20 shadow-paper-lg'
                    : 'paper-card'
                }
              `}
            >
              {selectedMood === mood.value && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-whisper-plum rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              <p className="font-cormorant text-lg text-whisper-inkBlack text-center">
                {mood.label}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Style - compact grid */}
      <section className="mb-12">
        <h3 className="text-2xl font-cormorant font-light text-whisper-inkBlack mb-6 text-center">
          Choose an art style
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {styles.map((style) => (
            <button
              key={style.value}
              onClick={() => setSelectedStyle(style.value)}
              className={`
                group p-4 rounded-2xl text-center transition-all duration-150 relative
                hover-shimmer click-settle
                ${
                  selectedStyle === style.value
                    ? 'ring-4 ring-whisper-plum bg-whisper-plum/20 shadow-paper-lg'
                    : 'paper-card'
                }
              `}
            >
              {selectedStyle === style.value && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-whisper-plum rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              <div className="font-cormorant text-base text-whisper-inkBlack mb-1">
                {style.label}
              </div>
              <div className="font-cormorant text-xs text-whisper-plum/60 italic">
                {style.description}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Salutation */}
      <section className="mb-12">
        <h3 className="text-2xl font-cormorant font-light text-whisper-inkBlack mb-6 text-center">
          How will you sign it?
        </h3>
        <div className="max-w-md mx-auto">
          <div className="paper-card p-6 rounded-2xl">
            <input
              type="text"
              value={salutation}
              onChange={(e) => setSalutation(e.target.value)}
              placeholder="e.g., Love, Nana | Your friend, Michelle | Warmly, Henry"
              className="w-full px-6 py-4 border-2 border-whisper-plum/20 rounded-xl focus:border-whisper-plum/40 focus:outline-none font-cormorant text-lg text-center bg-transparent transition-all duration-150"
              maxLength={50}
            />
            <p className="text-xs font-cormorant text-whisper-plum/60 mt-3 text-center italic">
              This will appear exactly as you type it
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setSalutation('Love, ')}
                className="px-3 py-1 text-xs font-cormorant text-whisper-plum/70 bg-whisper-sage/10 rounded-full hover:bg-whisper-sage/20 transition-all duration-150"
              >
                Love,
              </button>
              <button
                type="button"
                onClick={() => setSalutation('Your friend, ')}
                className="px-3 py-1 text-xs font-cormorant text-whisper-plum/70 bg-whisper-sage/10 rounded-full hover:bg-whisper-sage/20 transition-all duration-150"
              >
                Your friend,
              </button>
              <button
                type="button"
                onClick={() => setSalutation('Warmly, ')}
                className="px-3 py-1 text-xs font-cormorant text-whisper-plum/70 bg-whisper-sage/10 rounded-full hover:bg-whisper-sage/20 transition-all duration-150"
              >
                Warmly,
              </button>
              <button
                type="button"
                onClick={() => setSalutation('With love, ')}
                className="px-3 py-1 text-xs font-cormorant text-whisper-plum/70 bg-whisper-sage/10 rounded-full hover:bg-whisper-sage/20 transition-all duration-150"
              >
                With love,
              </button>
              <button
                type="button"
                onClick={() => setSalutation('Thinking of you, ')}
                className="px-3 py-1 text-xs font-cormorant text-whisper-plum/70 bg-whisper-sage/10 rounded-full hover:bg-whisper-sage/20 transition-all duration-150"
              >
                Thinking of you,
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Continue - luminous button */}
      <div className="text-center mt-16">
        <button
          onClick={handleContinue}
          disabled={!isComplete}
          className={`
            px-12 py-4 rounded-full font-cormorant text-lg transition-all duration-150
            ${
              isComplete
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
