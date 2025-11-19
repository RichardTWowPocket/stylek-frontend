'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { CreateCampaignFormData } from '@/lib/validation/campaign.schema';

interface CampaignFormStep2Props {
  form: UseFormReturn<CreateCampaignFormData>;
}

export function CampaignFormStep2({ form }: CampaignFormStep2Props) {
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'productImages',
  });

  const productImages = watch('productImages') || [];

  const addImage = () => {
    append('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Informasi Produk</h2>
        <p className="text-sm text-muted-foreground">Detail produk yang akan di-promote</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="productName">Nama Produk *</Label>
          <Input
            id="productName"
            {...register('productName')}
            placeholder="Contoh: Summer Dress Collection"
          />
          {errors.productName && (
            <p className="text-sm text-destructive">{errors.productName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Gambar Produk *</Label>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...register(`productImages.${index}` as const)}
                  type="url"
                  placeholder="https://example.com/product-image.jpg"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            {errors.productImages && (
              <p className="text-sm text-destructive">{errors.productImages.message}</p>
            )}
            <Button type="button" variant="outline" onClick={addImage}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Gambar
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="productLink">Link Produk (Opsional)</Label>
          <Input
            id="productLink"
            {...register('productLink')}
            type="url"
            placeholder="https://shopee.co.id/product-link"
          />
          {errors.productLink && (
            <p className="text-sm text-destructive">{errors.productLink.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="normalPrice">Harga Normal (Opsional)</Label>
          <Input
            id="normalPrice"
            {...register('normalPrice', { valueAsNumber: true })}
            type="number"
            placeholder="299000"
          />
          {errors.normalPrice && (
            <p className="text-sm text-destructive">{errors.normalPrice.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

