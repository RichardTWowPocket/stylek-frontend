'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useInviteCreator } from '@/lib/hooks/brand/useInviteCreator';
import { useBrandCampaigns } from '@/lib/hooks/brand/useBrandCampaigns';
import { getCampaignApplications } from '@/lib/api/campaigns';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import { useQuery } from '@tanstack/react-query';
import type { Creator, SocialPlatformType } from '@/lib/api/creators';

interface InviteCreatorDialogProps {
  creator: Creator;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteCreatorDialog({
  creator,
  open,
  onOpenChange,
}: InviteCreatorDialogProps) {
  const [campaignId, setCampaignId] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatformType | ''>('');
  const [message, setMessage] = useState('');

  // Get campaigns that are OPEN or SELECTION (can invite)
  const { data: campaignsData, isLoading: isLoadingCampaigns } = useBrandCampaigns({
    status: undefined, // Get all to filter client-side
  });

  const availableCampaigns =
    campaignsData?.data?.filter(
      (campaign) => campaign.status === 'OPEN' || campaign.status === 'SELECTION',
    ) || [];

  // Fetch applications for all campaigns to check if creator has already applied
  const campaignIds = availableCampaigns.map((c) => c.id);
  const campaignIdsString = campaignIds.join(',');
  
  const applicationsQueries = useQuery({
    queryKey: ['campaign-applications-for-creator', creator.id, campaignIdsString],
    queryFn: async () => {
      // Fetch applications for all campaigns in parallel
      const results = await Promise.all(
        campaignIds.map(async (campaignId) => {
          try {
            const apps = await getCampaignApplications(campaignId, { pageSize: 100 });
            return { campaignId, applications: apps.data };
          } catch (error) {
            console.error(`Failed to fetch applications for campaign ${campaignId}:`, error);
            return { campaignId, applications: [] };
          }
        }),
      );
      return results;
    },
    enabled: open && campaignIds.length > 0, // Only fetch when dialog is open and we have campaigns
    staleTime: 30000, // Cache for 30 seconds
  });

  // Create a map of campaign IDs to whether creator has applied
  const creatorHasApplied = useMemo(() => {
    const appliedMap: Record<string, boolean> = {};
    if (applicationsQueries.data) {
      applicationsQueries.data.forEach(({ campaignId, applications }) => {
        // Check if creator has any application (APPLIED, ACCEPTED, REJECTED, WAITLISTED)
        const hasApplied = applications.some(
          (app) => app.creator.id === creator.id,
        );
        appliedMap[campaignId] = hasApplied;
      });
    }
    return appliedMap;
  }, [applicationsQueries.data, creator.id]);

  // Clear selected campaign if it becomes disabled (creator has applied)
  useEffect(() => {
    if (campaignId && creatorHasApplied[campaignId]) {
      setCampaignId('');
    }
  }, [campaignId, creatorHasApplied]);

  const inviteMutation = useInviteCreator(campaignId);

  const creatorPlatforms = creator.platforms.map((p) => p.type);

  const handleInvite = () => {
    if (!campaignId || !selectedPlatform) {
      return;
    }

    inviteMutation.mutate(
      {
        creatorId: creator.id,
        selectedPlatform: selectedPlatform as SocialPlatformType,
        selectedPlatformHandle: creator.platforms.find((p) => p.type === selectedPlatform)
          ?.handle,
        message: message || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setCampaignId('');
          setSelectedPlatform('');
          setMessage('');
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Undang {creator.displayName}</DialogTitle>
          <DialogDescription>
            Pilih campaign dan platform untuk mengundang creator ini
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Campaign Selection */}
          <div className="space-y-2">
            <Label htmlFor="campaign">Campaign *</Label>
            {isLoadingCampaigns ? (
              <SkeletonCard />
            ) : availableCampaigns.length === 0 ? (
              <ErrorState
                title="Tidak ada campaign tersedia"
                description="Anda perlu memiliki campaign dengan status OPEN atau SELECTION untuk mengundang creator."
              />
            ) : (
              <>
                <Select value={campaignId} onValueChange={setCampaignId}>
                  <SelectTrigger id="campaign">
                    <SelectValue placeholder="Pilih campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCampaigns.map((campaign) => {
                      const hasApplied = creatorHasApplied[campaign.id] || false;
                      return (
                        <SelectItem
                          key={campaign.id}
                          value={campaign.id}
                          disabled={hasApplied}
                          className={hasApplied ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                          {campaign.title} ({campaign.status})
                          {hasApplied && ' - Sudah mendaftar'}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {applicationsQueries.isLoading && (
                  <p className="text-xs text-muted-foreground">
                    Memeriksa status pendaftaran creator...
                  </p>
                )}
              </>
            )}
          </div>

          {/* Platform Selection */}
          <div className="space-y-2">
            <Label htmlFor="platform">Platform *</Label>
            <Select
              value={selectedPlatform}
              onValueChange={(value) => setSelectedPlatform(value as SocialPlatformType)}
            >
              <SelectTrigger id="platform">
                <SelectValue placeholder="Pilih platform" />
              </SelectTrigger>
              <SelectContent>
                {creatorPlatforms.map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                    {creator.platforms.find((p) => p.type === platform)?.handle &&
                      ` (@${creator.platforms.find((p) => p.type === platform)?.handle})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPlatform && !creatorPlatforms.includes(selectedPlatform as SocialPlatformType) && (
              <p className="text-sm text-destructive">
                Creator tidak memiliki platform ini
              </p>
            )}
          </div>

          {/* Optional Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Pesan Undangan (Opsional)</Label>
            <Textarea
              id="message"
              placeholder="Tulis pesan undangan untuk creator..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button
              onClick={handleInvite}
              disabled={
                !campaignId ||
                !selectedPlatform ||
                !creatorPlatforms.includes(selectedPlatform as SocialPlatformType) ||
                inviteMutation.isPending
              }
            >
              {inviteMutation.isPending ? 'Mengundang...' : 'Undang Creator'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


