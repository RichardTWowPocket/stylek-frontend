import { create } from 'zustand';

interface BrandOnboardingState {
  step: 1 | 2;
  setStep: (step: 1 | 2) => void;
  // Optional: store draft form data
  draftData: {
    step1?: Record<string, any>;
    step2?: Record<string, any>;
  };
  setDraftData: (step: 1 | 2, data: Record<string, any>) => void;
  reset: () => void;
}

export const useBrandOnboardingStore = create<BrandOnboardingState>((set) => ({
  step: 1,
  setStep: (step) => set({ step }),
  draftData: {},
  setDraftData: (step, data) =>
    set((state) => ({
      draftData: {
        ...state.draftData,
        [`step${step}`]: data,
      },
    })),
  reset: () => set({ step: 1, draftData: {} }),
}));

