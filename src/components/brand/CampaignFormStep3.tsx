'use client';

import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, X } from 'lucide-react';
import type { CreateCampaignFormData } from '@/lib/validation/campaign.schema';

interface CampaignFormStep3Props {
  form: UseFormReturn<CreateCampaignFormData>;
}

const deliverableTypes = [
  { value: 'INSTAGRAM_POST', label: 'Instagram Post' },
  { value: 'INSTAGRAM_REELS', label: 'Instagram Reels' },
  { value: 'INSTAGRAM_STORY', label: 'Instagram Story' },
  { value: 'TIKTOK_VIDEO', label: 'TikTok Video' },
  { value: 'YOUTUBE_SHORT', label: 'YouTube Short' },
  { value: 'YOUTUBE_VIDEO', label: 'YouTube Video' },
  { value: 'MARKETPLACE_REVIEW', label: 'Marketplace Review' },
  { value: 'BLOG_ARTICLE', label: 'Blog Article' },
] as const;

export function CampaignFormStep3({ form }: CampaignFormStep3Props) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'deliverables',
  });

  const addDeliverable = () => {
    append({
      deliverableType: 'INSTAGRAM_POST',
      quantity: 1,
      captionGuideline: '',
      requiredHashtags: [],
      requiredMentions: [],
      promoCodeOrLink: '',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Deliverables</h2>
        <p className="text-sm text-muted-foreground">Tentukan konten yang harus dibuat creator</p>
      </div>

      <div className="space-y-4">
        {fields.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="mb-4 text-muted-foreground">Belum ada deliverable</p>
            <Button type="button" variant="outline" onClick={addDeliverable}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Deliverable
            </Button>
          </div>
        ) : (
          fields.map((field, index) => {
            const hashtags = watch(`deliverables.${index}.requiredHashtags`) || [];
            const mentions = watch(`deliverables.${index}.requiredMentions`) || [];
            const [hashtagInput, setHashtagInput] = React.useState('');
            const [mentionInput, setMentionInput] = React.useState('');

            const addHashtag = () => {
              if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
                setValue(`deliverables.${index}.requiredHashtags`, [...hashtags, hashtagInput.trim()]);
                setHashtagInput('');
              }
            };

            const removeHashtag = (tag: string) => {
              setValue(
                `deliverables.${index}.requiredHashtags`,
                hashtags.filter((t) => t !== tag)
              );
            };

            const addMention = () => {
              if (mentionInput.trim() && !mentions.includes(mentionInput.trim())) {
                setValue(`deliverables.${index}.requiredMentions`, [...mentions, mentionInput.trim()]);
                setMentionInput('');
              }
            };

            const removeMention = (mention: string) => {
              setValue(
                `deliverables.${index}.requiredMentions`,
                mentions.filter((m) => m !== mention)
              );
            };

            return (
              <div key={field.id} className="rounded-lg border border-border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium">Deliverable {index + 1}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Tipe Deliverable *</Label>
                      <select
                        {...register(`deliverables.${index}.deliverableType`)}
                        className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      >
                        {deliverableTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Quantity *</Label>
                      <Input
                        {...register(`deliverables.${index}.quantity`, { valueAsNumber: true })}
                        type="number"
                        min={1}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Caption Guideline (Opsional)</Label>
                    <Textarea
                      {...register(`deliverables.${index}.captionGuideline`)}
                      rows={3}
                      placeholder="Contoh: Highlight fitur utama produk..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Required Hashtags</Label>
                    <div className="flex gap-2">
                      <Input
                        value={hashtagInput}
                        onChange={(e) => setHashtagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addHashtag();
                          }
                        }}
                        placeholder="Masukkan hashtag lalu tekan Enter"
                      />
                      <Button type="button" variant="outline" onClick={addHashtag}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {hashtags.map((tag) => (
                          <div
                            key={tag}
                            className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => removeHashtag(tag)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Required Mentions</Label>
                    <div className="flex gap-2">
                      <Input
                        value={mentionInput}
                        onChange={(e) => setMentionInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addMention();
                          }
                        }}
                        placeholder="Masukkan mention lalu tekan Enter"
                      />
                      <Button type="button" variant="outline" onClick={addMention}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {mentions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {mentions.map((mention) => (
                          <div
                            key={mention}
                            className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
                          >
                            @{mention}
                            <button
                              type="button"
                              onClick={() => removeMention(mention)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Promo Code / Link (Opsional)</Label>
                    <Input
                      {...register(`deliverables.${index}.promoCodeOrLink`)}
                      placeholder="PROMO123 atau https://..."
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}

        {errors.deliverables && (
          <p className="text-sm text-destructive">{errors.deliverables.message}</p>
        )}

        <Button type="button" variant="outline" onClick={addDeliverable}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Deliverable
        </Button>
      </div>
    </div>
  );
}

