'use client';

import { useRouter, useParams } from 'next/navigation';
import { useCampaignDetail } from '@/lib/hooks/brand/useBrandCampaigns';
import { useUpdateCampaign } from '@/lib/hooks/brand/useCampaignMutations';
import { BrandCampaignForm } from '@/components/brand/BrandCampaignForm';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import { toast } from '@/lib/ui/toast';
import { routes } from '@/lib/config/routes';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { CreateCampaignFormData } from '@/lib/validation/campaign.schema';

export default function EditCampaignPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.campaignId as string;
  const { data: campaign, isLoading, error } = useCampaignDetail(campaignId);
  const updateCampaign = useUpdateCampaign();

  const handleSubmit = async (data: CreateCampaignFormData) => {
    try {
      await updateCampaign.mutateAsync({ id: campaignId, data });
      toast.success('Campaign berhasil diperbarui');
      router.push(routes.brand.campaignDetail(campaignId));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal memperbarui campaign');
    }
  };

  if (isLoading) {
    return <SkeletonCard />;
  }

  if (error) {
    return (
      <ErrorState
        title="Gagal memuat campaign"
        description="Terjadi kesalahan saat memuat data campaign."
      />
    );
  }

  if (!campaign) {
    return null;
  }

  // Check if campaign can be edited
  const canEdit = campaign.status === 'DRAFT' || campaign.status === 'OPEN';

  if (!canEdit) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Campaign tidak bisa diubah pada status {campaign.status}. Hanya campaign dengan status
          DRAFT atau OPEN yang dapat diedit.
        </AlertDescription>
      </Alert>
    );
  }

  // Map campaign data to form default values
  const defaultValues: Partial<CreateCampaignFormData> = {
    title: campaign.title,
    goals: campaign.goals,
    campaignType: campaign.campaignType,
    promoType: campaign.promoType,
    productName: campaign.productName,
    productImages: campaign.productImages,
    productLink: campaign.productLink || '',
    normalPrice: campaign.normalPrice,
    rewardType: campaign.rewardType,
    feePerCreator: campaign.feePerCreator,
    estimatedProductValue: campaign.estimatedProductValue,
    slots: campaign.slots,
    eligibleRegions: campaign.eligibleRegions,
    applyStartDate: campaign.applyStartDate.slice(0, 16),
    applyEndDate: campaign.applyEndDate.slice(0, 16),
    announcementDate: campaign.announcementDate?.slice(0, 16),
    postDeadline: campaign.postDeadline.slice(0, 16),
    requirePreApproval: campaign.requirePreApproval,
    briefAttachmentUrl: campaign.briefAttachmentUrl || '',
    deliverables: campaign.deliverables.map((d) => ({
      deliverableType: d.deliverableType,
      quantity: d.quantity,
      captionGuideline: d.captionGuideline || '',
      requiredHashtags: d.requiredHashtags,
      requiredMentions: d.requiredMentions,
      promoCodeOrLink: d.promoCodeOrLink || '',
    })),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Campaign</h1>
        <p className="text-muted-foreground">Ubah informasi campaign Anda</p>
      </div>

      <BrandCampaignForm mode="edit" defaultValues={defaultValues} onSubmit={handleSubmit} />
    </div>
  );
}

