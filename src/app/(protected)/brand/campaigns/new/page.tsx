'use client';

import { useRouter } from 'next/navigation';
import { BrandCampaignForm } from '@/components/brand/BrandCampaignForm';
import { createCampaign } from '@/lib/api/campaigns';
import { toast } from '@/lib/ui/toast';
import { routes } from '@/lib/config/routes';
import type { CreateCampaignFormData } from '@/lib/validation/campaign.schema';

export default function CreateCampaignPage() {
  const router = useRouter();

  const handleSubmit = async (data: CreateCampaignFormData) => {
    try {
      // Transform empty strings to undefined for optional fields
      // Convert datetime-local format to ISO 8601 format for dates
      const payload = {
        ...data,
        productLink: data.productLink && data.productLink.trim() !== '' ? data.productLink : undefined,
        announcementDate: data.announcementDate && data.announcementDate.trim() !== '' 
          ? new Date(data.announcementDate).toISOString() 
          : undefined,
        briefAttachmentUrl: data.briefAttachmentUrl && data.briefAttachmentUrl.trim() !== '' 
          ? data.briefAttachmentUrl 
          : undefined,
        // Convert required dates from datetime-local to ISO 8601
        applyStartDate: new Date(data.applyStartDate).toISOString(),
        applyEndDate: new Date(data.applyEndDate).toISOString(),
        postDeadline: new Date(data.postDeadline).toISOString(),
      };
      
      const campaign = await createCampaign(payload);
      toast.success('Campaign berhasil dibuat');
      router.push(routes.brand.campaignDetail(campaign.id));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Gagal membuat campaign';
      toast.error(errorMessage);
      console.error('Campaign creation error:', err.response?.data);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Buat Campaign Baru</h1>
        <p className="text-muted-foreground">Lengkapi informasi campaign Anda</p>
      </div>

      <BrandCampaignForm mode="create" onSubmit={handleSubmit} />
    </div>
  );
}

