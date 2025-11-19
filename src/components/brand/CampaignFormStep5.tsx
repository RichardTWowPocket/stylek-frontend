'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { CreateCampaignFormData } from '@/lib/validation/campaign.schema';

interface CampaignFormStep5Props {
  form: UseFormReturn<CreateCampaignFormData>;
}

export function CampaignFormStep5({ form }: CampaignFormStep5Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const requirePreApproval = watch('requirePreApproval');

  // Set default dates if not set
  React.useEffect(() => {
    const now = new Date();
    const applyStart = watch('applyStartDate');
    const applyEnd = watch('applyEndDate');
    const postDeadline = watch('postDeadline');

    if (!applyStart) {
      setValue('applyStartDate', now.toISOString().slice(0, 16));
    }
    if (!applyEnd) {
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() + 7);
      setValue('applyEndDate', endDate.toISOString().slice(0, 16));
    }
    if (!postDeadline) {
      const deadline = new Date(now);
      deadline.setDate(deadline.getDate() + 14);
      setValue('postDeadline', deadline.toISOString().slice(0, 16));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Timeline & Pengaturan</h2>
        <p className="text-sm text-muted-foreground">Tentukan timeline dan pengaturan campaign</p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="applyStartDate">Tanggal Mulai Apply *</Label>
            <Input
              id="applyStartDate"
              {...register('applyStartDate')}
              type="datetime-local"
            />
            {errors.applyStartDate && (
              <p className="text-sm text-destructive">{errors.applyStartDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="applyEndDate">Tanggal Akhir Apply *</Label>
            <Input
              id="applyEndDate"
              {...register('applyEndDate')}
              type="datetime-local"
            />
            {errors.applyEndDate && (
              <p className="text-sm text-destructive">{errors.applyEndDate.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="announcementDate">Tanggal Announcement (Opsional)</Label>
          <Input
            id="announcementDate"
            {...register('announcementDate')}
            type="datetime-local"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postDeadline">Post Deadline *</Label>
          <Input
            id="postDeadline"
            {...register('postDeadline')}
            type="datetime-local"
          />
          {errors.postDeadline && (
            <p className="text-sm text-destructive">{errors.postDeadline.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="requirePreApproval">Require Pre-approval</Label>
            <p className="text-sm text-muted-foreground">
              Creator harus submit draft untuk approval sebelum posting
            </p>
          </div>
          <Switch
            id="requirePreApproval"
            checked={requirePreApproval}
            onCheckedChange={(checked) => setValue('requirePreApproval', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="briefAttachmentUrl">Brief Attachment URL (Opsional)</Label>
          <Input
            id="briefAttachmentUrl"
            {...register('briefAttachmentUrl')}
            type="url"
            placeholder="https://drive.google.com/file/d/..."
          />
          {errors.briefAttachmentUrl && (
            <p className="text-sm text-destructive">{errors.briefAttachmentUrl.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

