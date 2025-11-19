import { create } from 'zustand';
import type { CreateCampaignFormData } from '@/lib/validation/campaign.schema';

interface BrandCampaignFormState {
  step: 1 | 2 | 3 | 4 | 5;
  setStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  formData: Partial<CreateCampaignFormData>;
  updateFormData: (data: Partial<CreateCampaignFormData>) => void;
  reset: () => void;
}

export const useBrandCampaignFormStore = create<BrandCampaignFormState>((set) => ({
  step: 1,
  setStep: (step) => set({ step }),
  formData: {},
  updateFormData: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
      },
    })),
  reset: () => set({ step: 1, formData: {} }),
}));

