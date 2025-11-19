'use client';

import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { useBrandProfile } from '@/lib/hooks/brand/useBrand';
import { useUpdateBrandChannels } from '@/lib/hooks/brand/useBrandMutations';
import { toast } from '@/lib/ui/toast';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import type { BrandChannelDto } from '@/lib/api/brand';

const channelSchema = z.object({
  type: z.enum(['SHOPEE', 'TOKOPEDIA', 'TIKTOK_SHOP', 'INSTAGRAM', 'WEBSITE', 'OTHER']),
  label: z.string().optional(),
  url: z.string().url('URL tidak valid'),
});

const step2Schema = z.object({
  channels: z.array(channelSchema).min(0),
});

type Step2FormData = z.infer<typeof step2Schema>;

interface BrandOnboardingStep2Props {
  onBack: () => void;
  onComplete: () => void;
}

export function BrandOnboardingStep2({ onBack, onComplete }: BrandOnboardingStep2Props) {
  // For onboarding step 2, profile should exist after step 1 completes
  // But we still handle 404 gracefully just in case
  const { data: profile, isLoading, error } = useBrandProfile({
    retry: false, // Don't retry if profile doesn't exist
  });
  const updateChannels = useUpdateBrandChannels();
  
  const is404Error = (error as any)?.response?.status === 404;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      channels: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'channels',
  });

  // Populate form with existing channels if available
  useEffect(() => {
    if (profile?.channels && profile.channels.length > 0) {
      reset({
        channels: profile.channels.map((ch) => ({
          type: ch.type,
          label: ch.label || '',
          url: ch.url,
        })),
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: Step2FormData) => {
    try {
      await updateChannels.mutateAsync({
        channels: data.channels.map((ch) => ({
          type: ch.type,
          label: ch.label || undefined,
          url: ch.url,
        })),
      });
      toast.success('Channels berhasil disimpan');
      onComplete();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan channels');
    }
  };

  const addChannel = () => {
    append({
      type: 'SHOPEE',
      label: '',
      url: '',
    });
  };

  // For onboarding, 404 is expected (profile doesn't exist yet)
  // Only show loading/error if we're trying to edit existing profile
  if (isLoading && !is404Error) {
    return <SkeletonCard />;
  }

  // Only show error for non-404 errors (network issues, etc.)
  if (error && !is404Error) {
    return (
      <ErrorState
        title="Gagal memuat profil"
        description="Terjadi kesalahan saat memuat data profil brand."
      />
    );
  }

  return (
    <Card className="p-6">
      <h2 className="mb-6 text-xl font-semibold">Channels Brand</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          {fields.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <p className="text-muted-foreground mb-4">Belum ada channel</p>
              <Button type="button" variant="outline" onClick={addChannel}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Channel
              </Button>
            </div>
          ) : (
            fields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label>Tipe Channel</Label>
                      <select
                        {...register(`channels.${index}.type`)}
                        className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        disabled={updateChannels.isPending}
                      >
                        <option value="SHOPEE">Shopee</option>
                        <option value="TOKOPEDIA">Tokopedia</option>
                        <option value="TIKTOK_SHOP">TikTok Shop</option>
                        <option value="INSTAGRAM">Instagram</option>
                        <option value="WEBSITE">Website</option>
                        <option value="OTHER">Lainnya</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Label (Opsional)</Label>
                      <Input
                        {...register(`channels.${index}.label`)}
                        placeholder="Contoh: Toko Official Shopee"
                        disabled={updateChannels.isPending}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>URL *</Label>
                      <Input
                        {...register(`channels.${index}.url`)}
                        type="url"
                        placeholder="https://shopee.co.id/toko-anda"
                        disabled={updateChannels.isPending}
                      />
                      {errors.channels?.[index]?.url && (
                        <p className="text-sm text-destructive">
                          {errors.channels[index]?.url?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={updateChannels.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {errors.channels && (
          <p className="text-sm text-destructive">{errors.channels.message}</p>
        )}

        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" onClick={addChannel} disabled={updateChannels.isPending}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Channel
          </Button>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onBack} disabled={updateChannels.isPending}>
              Kembali
            </Button>
            <Button type="submit" disabled={updateChannels.isPending}>
              {updateChannels.isPending ? 'Menyimpan...' : 'Selesai'}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}

