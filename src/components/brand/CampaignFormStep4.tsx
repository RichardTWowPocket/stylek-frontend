'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import type { CreateCampaignFormData } from '@/lib/validation/campaign.schema';

interface CampaignFormStep4Props {
  form: UseFormReturn<CreateCampaignFormData>;
}

const commonRegions = [
  'Jakarta',
  'Bandung',
  'Surabaya',
  'Yogyakarta',
  'Medan',
  'Semarang',
  'Makassar',
  'Denpasar',
  'Palembang',
  'Bekasi',
  'Tangerang',
  'Depok',
  'Bogor',
];

export function CampaignFormStep4({ form }: CampaignFormStep4Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const rewardType = watch('rewardType');
  const eligibleRegions = watch('eligibleRegions') || [];
  const [regionInput, setRegionInput] = React.useState('');

  const addRegion = () => {
    if (regionInput.trim() && !eligibleRegions.includes(regionInput.trim())) {
      setValue('eligibleRegions', [...eligibleRegions, regionInput.trim()]);
      setRegionInput('');
    }
  };

  const removeRegion = (region: string) => {
    setValue(
      'eligibleRegions',
      eligibleRegions.filter((r) => r !== region)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Reward & Kuota</h2>
        <p className="text-sm text-muted-foreground">Tentukan reward dan kuota campaign</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Reward Type *</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="reward-free"
                value="FREE_PRODUCT"
                {...register('rewardType')}
                className="h-4 w-4"
              />
              <Label htmlFor="reward-free" className="cursor-pointer font-normal">
                Free Product
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="reward-free-fee"
                value="FREE_PRODUCT_PLUS_FEE"
                {...register('rewardType')}
                className="h-4 w-4"
              />
              <Label htmlFor="reward-free-fee" className="cursor-pointer font-normal">
                Free Product + Fee
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="reward-cashback"
                value="CASHBACK_AFTER_PURCHASE"
                {...register('rewardType')}
                className="h-4 w-4"
              />
              <Label htmlFor="reward-cashback" className="cursor-pointer font-normal">
                Cashback After Purchase
              </Label>
            </div>
          </div>
          {errors.rewardType && (
            <p className="text-sm text-destructive">{errors.rewardType.message}</p>
          )}
        </div>

        {(rewardType === 'FREE_PRODUCT_PLUS_FEE' || rewardType === 'CASHBACK_AFTER_PURCHASE') && (
          <div className="space-y-2">
            <Label htmlFor="feePerCreator">Fee per Creator (Rupiah) *</Label>
            <Input
              id="feePerCreator"
              {...register('feePerCreator', { valueAsNumber: true })}
              type="number"
              min={0}
              placeholder="50000"
            />
            {errors.feePerCreator && (
              <p className="text-sm text-destructive">{errors.feePerCreator.message}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="estimatedProductValue">Estimasi Nilai Produk (Rupiah, Opsional)</Label>
          <Input
            id="estimatedProductValue"
            {...register('estimatedProductValue', { valueAsNumber: true })}
            type="number"
            min={0}
            placeholder="150000"
          />
          {errors.estimatedProductValue && (
            <p className="text-sm text-destructive">{errors.estimatedProductValue.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slots">Jumlah Slots (Creator) *</Label>
          <Input
            id="slots"
            {...register('slots', { valueAsNumber: true })}
            type="number"
            min={1}
            placeholder="10"
          />
          {errors.slots && (
            <p className="text-sm text-destructive">{errors.slots.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Eligible Regions *</Label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={regionInput}
                onChange={(e) => setRegionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addRegion();
                  }
                }}
                placeholder="Masukkan region lalu tekan Enter"
              />
              <Button type="button" variant="outline" onClick={addRegion}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {commonRegions.map((region) => (
                <Button
                  key={region}
                  type="button"
                  variant={eligibleRegions.includes(region) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    if (eligibleRegions.includes(region)) {
                      removeRegion(region);
                    } else {
                      setValue('eligibleRegions', [...eligibleRegions, region]);
                    }
                  }}
                >
                  {region}
                </Button>
              ))}
            </div>
            {eligibleRegions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {eligibleRegions.map((region) => (
                  <div
                    key={region}
                    className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
                  >
                    {region}
                    <button
                      type="button"
                      onClick={() => removeRegion(region)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.eligibleRegions && (
            <p className="text-sm text-destructive">{errors.eligibleRegions.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

