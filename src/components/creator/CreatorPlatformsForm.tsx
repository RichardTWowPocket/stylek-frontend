'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, X } from 'lucide-react';
import { useUpdateCreatorPlatforms } from '@/lib/hooks/creator/useCreatorMutations';
import type { CreatorPlatform, CreatorPlatformDto } from '@/lib/api/creator';

const platformSchema = z.object({
  platformType: z.enum(['INSTAGRAM', 'TIKTOK', 'YOUTUBE', 'BLOG', 'OTHER']),
  handle: z.string().min(1, 'Handle harus diisi'),
  profileUrl: z.string().url('URL tidak valid'),
  followers: z.number().min(0, 'Followers harus >= 0'),
  avgViews: z.number().min(0, 'Avg views harus >= 0').optional(),
  avgLikes: z.number().min(0, 'Avg likes harus >= 0').optional(),
  isPrimary: z.boolean().optional(),
});

const platformsSchema = z.object({
  platforms: z.array(platformSchema).min(1, 'Minimal 1 platform diperlukan'),
});

type PlatformsFormData = z.infer<typeof platformsSchema>;

interface CreatorPlatformsFormProps {
  defaultPlatforms: CreatorPlatform[];
  onCancel: () => void;
  onSuccess: () => void;
}

export function CreatorPlatformsForm({
  defaultPlatforms,
  onCancel,
  onSuccess,
}: CreatorPlatformsFormProps) {
  const updatePlatforms = useUpdateCreatorPlatforms();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PlatformsFormData>({
    resolver: zodResolver(platformsSchema),
    defaultValues: {
      platforms:
        defaultPlatforms.length > 0
          ? defaultPlatforms.map((p) => ({
              platformType: p.platformType,
              handle: p.handle,
              profileUrl: p.profileUrl,
              followers: p.followers,
              avgViews: p.avgViews,
              avgLikes: p.avgLikes,
              isPrimary: p.isPrimary,
            }))
          : [
              {
                platformType: 'INSTAGRAM' as const,
                handle: '',
                profileUrl: '',
                followers: 0,
                isPrimary: true,
              },
            ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'platforms',
  });

  const onSubmit = async (data: PlatformsFormData) => {
    try {
      // Ensure only one primary platform
      const primaryCount = data.platforms.filter((p) => p.isPrimary).length;
      if (primaryCount !== 1) {
        throw new Error('Harus ada tepat satu platform utama');
      }

      await updatePlatforms.mutateAsync({
        platforms: data.platforms.map((p) => ({
          platformType: p.platformType,
          handle: p.handle,
          profileUrl: p.profileUrl,
          followers: p.followers,
          avgViews: p.avgViews,
          avgLikes: p.avgLikes,
          isPrimary: p.isPrimary,
        })),
      });
      onSuccess();
    } catch (err: any) {
      // Error handling is done by toast in mutation
    }
  };

  const addPlatform = () => {
    append({
      platformType: 'INSTAGRAM',
      handle: '',
      profileUrl: '',
      followers: 0,
      isPrimary: false,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
      <div className="space-y-3 sm:space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-border p-3 sm:p-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-1 space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Tipe Platform *</Label>
                  <select
                    {...register(`platforms.${index}.platformType`)}
                    className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    disabled={updatePlatforms.isPending}
                  >
                    <option value="INSTAGRAM">Instagram</option>
                    <option value="TIKTOK">TikTok</option>
                    <option value="YOUTUBE">YouTube</option>
                    <option value="BLOG">Blog</option>
                    <option value="OTHER">Lainnya</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Handle / Username *</Label>
                  <Input
                    {...register(`platforms.${index}.handle`)}
                    disabled={updatePlatforms.isPending}
                    className="text-sm sm:text-base"
                  />
                  {errors.platforms?.[index]?.handle && (
                    <p className="text-xs text-destructive sm:text-sm">
                      {errors.platforms[index]?.handle?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Profile URL *</Label>
                  <Input
                    {...register(`platforms.${index}.profileUrl`)}
                    type="url"
                    disabled={updatePlatforms.isPending}
                    className="text-sm sm:text-base"
                  />
                  {errors.platforms?.[index]?.profileUrl && (
                    <p className="text-xs text-destructive sm:text-sm">
                      {errors.platforms[index]?.profileUrl?.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm">Followers *</Label>
                    <Input
                      {...register(`platforms.${index}.followers`, { valueAsNumber: true })}
                      type="number"
                      min="0"
                      disabled={updatePlatforms.isPending}
                      className="text-sm sm:text-base"
                    />
                    {errors.platforms?.[index]?.followers && (
                      <p className="text-xs text-destructive sm:text-sm">
                        {errors.platforms[index]?.followers?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm">Avg Views (Opsional)</Label>
                    <Input
                      {...register(`platforms.${index}.avgViews`, { valueAsNumber: true })}
                      type="number"
                      min="0"
                      disabled={updatePlatforms.isPending}
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm">Avg Likes (Opsional)</Label>
                    <Input
                      {...register(`platforms.${index}.avgLikes`, { valueAsNumber: true })}
                      type="number"
                      min="0"
                      disabled={updatePlatforms.isPending}
                      className="text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`platforms.${index}.isPrimary`}
                    {...register(`platforms.${index}.isPrimary`)}
                    disabled={updatePlatforms.isPending}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor={`platforms.${index}.isPrimary`} className="cursor-pointer text-xs sm:text-sm">
                    Platform Utama
                  </Label>
                </div>
              </div>

              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={updatePlatforms.isPending}
                  className="flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {errors.platforms && <p className="text-xs text-destructive sm:text-sm">{errors.platforms.message}</p>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="outline" onClick={addPlatform} disabled={updatePlatforms.isPending} className="w-full sm:w-auto" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Platform
        </Button>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={onCancel} disabled={updatePlatforms.isPending} className="w-full sm:w-auto" size="sm">
            <X className="mr-2 h-4 w-4" />
            Batal
          </Button>
          <Button type="submit" disabled={updatePlatforms.isPending} className="w-full sm:w-auto" size="sm">
            {updatePlatforms.isPending ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </div>
    </form>
  );
}


