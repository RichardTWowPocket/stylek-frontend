'use client';

import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import type { CreateCampaignFormData } from '@/lib/validation/campaign.schema';

interface CampaignFormStep1Props {
  form: UseFormReturn<CreateCampaignFormData>;
}

const goalOptions = [
  { value: 'BRAND_AWARENESS', label: 'Brand Awareness' },
  { value: 'REVIEW_MARKETPLACE', label: 'Review Marketplace' },
  { value: 'SOCIAL_CONTENT', label: 'Social Content' },
  { value: 'TRAFFIC_TO_STORE', label: 'Traffic to Store' },
  { value: 'COLLECT_UGC', label: 'Collect UGC' },
] as const;

export function CampaignFormStep1({ form }: CampaignFormStep1Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const goals = watch('goals') || [];

  const toggleGoal = (goal: typeof goalOptions[number]['value']) => {
    const currentGoals = goals || [];
    if (currentGoals.includes(goal)) {
      setValue('goals', currentGoals.filter((g) => g !== goal), { shouldValidate: true });
    } else {
      setValue('goals', [...currentGoals, goal], { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Informasi Dasar Campaign</h2>
        <p className="text-sm text-muted-foreground">Lengkapi informasi dasar campaign Anda</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Judul Campaign *</Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="Contoh: Summer Fashion Collection Campaign"
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Goals *</Label>
          <div className="space-y-2">
            {goalOptions.map((goal) => (
              <div key={goal.value} className="flex items-center space-x-2">
                <Checkbox
                  id={goal.value}
                  checked={goals.includes(goal.value)}
                  onCheckedChange={() => toggleGoal(goal.value)}
                />
                <Label
                  htmlFor={goal.value}
                  className="cursor-pointer text-sm font-normal"
                >
                  {goal.label}
                </Label>
              </div>
            ))}
          </div>
          {errors.goals && <p className="text-sm text-destructive">{errors.goals.message}</p>}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="campaignType">Tipe Campaign *</Label>
            <select
              id="campaignType"
              {...register('campaignType')}
              className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="PRODUCT_SEEDING">Product Seeding</option>
              <option value="STORE_VISIT">Store Visit</option>
              <option value="DELIVERY_REVIEW">Delivery Review</option>
            </select>
            {errors.campaignType && (
              <p className="text-sm text-destructive">{errors.campaignType.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="promoType">Tipe Promo *</Label>
            <select
              id="promoType"
              {...register('promoType')}
              className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="PHYSICAL_PRODUCT">Physical Product</option>
              <option value="STORE_VISIT">Store Visit</option>
              <option value="SERVICE">Service</option>
            </select>
            {errors.promoType && (
              <p className="text-sm text-destructive">{errors.promoType.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

