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
      const campaign = await createCampaign(data);
      toast.success('Campaign berhasil dibuat');
      router.push(routes.brand.campaignDetail(campaign.id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal membuat campaign');
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

