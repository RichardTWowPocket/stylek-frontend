'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCampaignSchema, type CreateCampaignFormData } from '@/lib/validation/campaign.schema';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CampaignFormStep1 } from './CampaignFormStep1';
import { CampaignFormStep2 } from './CampaignFormStep2';
import { CampaignFormStep3 } from './CampaignFormStep3';
import { CampaignFormStep4 } from './CampaignFormStep4';
import { CampaignFormStep5 } from './CampaignFormStep5';

interface BrandCampaignFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<CreateCampaignFormData>;
  onSubmit: (values: CreateCampaignFormData) => Promise<void>;
}

export function BrandCampaignForm({ mode, defaultValues, onSubmit }: BrandCampaignFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<CreateCampaignFormData>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: defaultValues || {
      campaignType: 'PRODUCT_SEEDING',
      promoType: 'PHYSICAL_PRODUCT',
      rewardType: 'FREE_PRODUCT',
      requirePreApproval: false,
      productImages: [],
      deliverables: [],
      eligibleRegions: [],
      goals: [],
      requiredHashtags: [],
      requiredMentions: [],
    },
    mode: 'onChange',
  });

  const handleNext = async () => {
    // Validate current step before moving forward
    let isValid = false;
    switch (currentStep) {
      case 1:
        isValid = await form.trigger(['title', 'goals', 'campaignType', 'promoType']);
        break;
      case 2:
        isValid = await form.trigger(['productName', 'productImages']);
        break;
      case 3:
        isValid = await form.trigger(['deliverables']);
        break;
      case 4:
        isValid = await form.trigger(['rewardType', 'slots', 'eligibleRegions']);
        break;
      case 5:
        isValid = await form.trigger([
          'applyStartDate',
          'applyEndDate',
          'postDeadline',
        ]);
        break;
    }

    if (isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: CreateCampaignFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {/* Stepper */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    currentStep >= step
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  {currentStep > step ? '✓' : step}
                </div>
                <span
                  className={`hidden md:inline ${
                    currentStep >= step ? 'font-medium' : 'text-muted-foreground'
                  }`}
                >
                  {step === 1 && 'Info Dasar'}
                  {step === 2 && 'Produk'}
                  {step === 3 && 'Deliverables'}
                  {step === 4 && 'Reward'}
                  {step === 5 && 'Timeline'}
                </span>
              </div>
              {step < 5 && (
                <div className="mx-2 h-0.5 w-12 bg-border hidden md:block" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Step Content */}
      <Card className="p-6">
        {currentStep === 1 && <CampaignFormStep1 form={form} />}
        {currentStep === 2 && <CampaignFormStep2 form={form} />}
        {currentStep === 3 && <CampaignFormStep3 form={form} />}
        {currentStep === 4 && <CampaignFormStep4 form={form} />}
        {currentStep === 5 && <CampaignFormStep5 form={form} />}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 1}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
        {currentStep < 5 ? (
          <Button type="button" onClick={handleNext}>
            Lanjut
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Menyimpan...' : mode === 'create' ? 'Buat Campaign' : 'Simpan Perubahan'}
          </Button>
        )}
      </div>
    </form>
  );
}

