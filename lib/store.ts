import { create } from 'zustand';
import type { CardCreationStore, CardIntent, CardImage, CardText, CardDesign } from '@/types';

export const useCardStore = create<CardCreationStore>((set) => ({
  step: 1,
  intent: null,
  selectedImage: null,
  generatedText: null,
  finalDesign: null,

  setStep: (step) => set({ step }),

  setIntent: (intent) => set({ intent, step: 2 }),

  setImage: (image) => set({ selectedImage: image, step: 3 }),

  setText: (text) => set({ generatedText: text, step: 4 }),

  setFinalDesign: (design) => set({ finalDesign: design, step: 5 }),

  reset: () => set({
    step: 1,
    intent: null,
    selectedImage: null,
    generatedText: null,
    finalDesign: null,
  }),
}));
