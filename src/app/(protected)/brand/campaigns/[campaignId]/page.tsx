'use client';

import { useRouter, useParams } from 'next/navigation';
import { useCampaignDetail } from '@/lib/hooks/brand/useBrandCampaigns';
import { usePublishCampaign } from '@/lib/hooks/brand/useCampaignMutations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import { toast } from '@/lib/ui/toast';
import { routes } from '@/lib/config/routes';
import { Edit, Send, AlertCircle } from 'lucide-react';
import { CampaignOverview } from '@/components/brand/CampaignOverview';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'DRAFT':
      return 'secondary';
    case 'OPEN':
      return 'default';
    case 'ONGOING':
      return 'default';
    case 'COMPLETED':
      return 'secondary';
    case 'SELECTION':
      return 'default';
    default:
      return 'secondary';
  }
}

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.campaignId as string;
  const { data: campaign, isLoading, error, refetch } = useCampaignDetail(campaignId);
  const publishCampaign = usePublishCampaign();
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showInsufficientBalanceDialog, setShowInsufficientBalanceDialog] = useState(false);

  const handlePublish = async () => {
    try {
      await publishCampaign.mutateAsync(campaignId);
      toast.success('Campaign berhasil dipublish');
      setShowPublishDialog(false);
      refetch();
    } catch (err: any) {
      const errorCode = err.response?.data?.code || err.response?.data?.message;
      if (errorCode?.includes('INSUFFICIENT_BALANCE') || errorCode?.includes('balance')) {
        setShowPublishDialog(false);
        setShowInsufficientBalanceDialog(true);
      } else {
        toast.error(err.response?.data?.message || 'Gagal mempublish campaign');
      }
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
        onRetry={() => refetch()}
      />
    );
  }

  if (!campaign) {
    return null;
  }

  const canEdit = campaign.status === 'DRAFT' || campaign.status === 'OPEN';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{campaign.title}</h1>
            <Badge variant={getStatusBadgeVariant(campaign.status)}>{campaign.status}</Badge>
          </div>
          <p className="text-muted-foreground">Detail campaign</p>
        </div>
        <div className="flex gap-2">
          {canEdit && (
            <Button variant="outline" onClick={() => router.push(routes.brand.campaignEdit(campaignId))}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
          {campaign.status === 'DRAFT' && (
            <Button onClick={() => setShowPublishDialog(true)}>
              <Send className="mr-2 h-4 w-4" />
              Publish Campaign
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applicants" disabled>
            Applicants (Phase 4)
          </TabsTrigger>
          <TabsTrigger value="content" disabled>
            Content (Phase 4)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <CampaignOverview campaign={campaign} />
        </TabsContent>

        <TabsContent value="applicants">
          <Card className="p-6">
            <p className="text-muted-foreground">Applicants tab akan tersedia di Phase 4</p>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card className="p-6">
            <p className="text-muted-foreground">Content tab akan tersedia di Phase 4</p>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Publish Confirmation Dialog */}
      <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              Setelah dipublish, campaign akan terbuka untuk creator apply. Saldo akan di-lock sesuai
              dengan total reward campaign. Pastikan saldo Anda mencukupi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublish} disabled={publishCampaign.isPending}>
              {publishCampaign.isPending ? 'Memproses...' : 'Publish'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Insufficient Balance Dialog */}
      <AlertDialog open={showInsufficientBalanceDialog} onOpenChange={setShowInsufficientBalanceDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Saldo Tidak Mencukupi
            </AlertDialogTitle>
            <AlertDialogDescription>
              Saldo Anda tidak mencukupi untuk mempublish campaign ini. Silakan top-up terlebih
              dahulu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push(routes.brand.wallet)}>
              Ke Halaman Top-up
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

