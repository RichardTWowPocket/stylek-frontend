'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, X } from 'lucide-react';
import { useUpdateBrandChannels } from '@/lib/hooks/brand/useBrandMutations';
import type { BrandChannel, BrandChannelDto } from '@/lib/api/brand';

const channelSchema = z.object({
  type: z.enum(['SHOPEE', 'TOKOPEDIA', 'TIKTOK_SHOP', 'INSTAGRAM', 'WEBSITE', 'OTHER']),
  label: z.string().optional(),
  url: z.string().url('URL tidak valid'),
});

const channelsSchema = z.object({
  channels: z.array(channelSchema).min(0),
});

type ChannelsFormData = z.infer<typeof channelsSchema>;

interface BrandChannelsFormProps {
  defaultChannels: BrandChannel[];
  onCancel: () => void;
  onSuccess: () => void;
}

export function BrandChannelsForm({
  defaultChannels,
  onCancel,
  onSuccess,
}: BrandChannelsFormProps) {
  const updateChannels = useUpdateBrandChannels();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ChannelsFormData>({
    resolver: zodResolver(channelsSchema),
    defaultValues: {
      channels:
        defaultChannels.length > 0
          ? defaultChannels.map((ch) => ({
              type: ch.type,
              label: ch.label || '',
              url: ch.url,
            }))
          : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'channels',
  });

  const onSubmit = async (data: ChannelsFormData) => {
    try {
      await updateChannels.mutateAsync({
        channels: data.channels.map((ch) => ({
          type: ch.type,
          label: ch.label || undefined,
          url: ch.url,
        })),
      });
      onSuccess();
    } catch (err: any) {
      // Error handling is done by toast in mutation
    }
  };

  const addChannel = () => {
    append({
      type: 'SHOPEE',
      label: '',
      url: '',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-4">
        {fields.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="mb-4 text-muted-foreground">Belum ada channel</p>
            <Button type="button" variant="outline" onClick={addChannel}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Channel
            </Button>
          </div>
        ) : (
          fields.map((field, index) => (
            <div key={field.id} className="rounded-lg border border-border p-4">
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
                      disabled={updateChannels.isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>URL *</Label>
                    <Input
                      {...register(`channels.${index}.url`)}
                      type="url"
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
            </div>
          ))
        )}
      </div>

      {errors.channels && <p className="text-sm text-destructive">{errors.channels.message}</p>}

      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" onClick={addChannel} disabled={updateChannels.isPending}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Channel
        </Button>

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={updateChannels.isPending}>
            <X className="mr-2 h-4 w-4" />
            Batal
          </Button>
          <Button type="submit" disabled={updateChannels.isPending}>
            {updateChannels.isPending ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </div>
    </form>
  );
}

