'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useApplyCampaign } from '@/lib/hooks/creator/useApplyCampaign';
import { useCreatorProfile } from '@/lib/hooks/creator/useCreator';
import type { SocialPlatformType, DeliverableType } from '@/lib/api/campaigns';

interface ApplyCampaignDialogProps {
  campaignId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requiredPlatforms?: DeliverableType[];
}

export function ApplyCampaignDialog({
  campaignId,
  open,
  onOpenChange,
  requiredPlatforms = [],
}: ApplyCampaignDialogProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatformType | ''>('');
  const [selectedPlatformHandle, setSelectedPlatformHandle] = useState('');
  const [applyNote, setApplyNote] = useState('');

  const { data: creatorProfile } = useCreatorProfile();
  const applyMutation = useApplyCampaign(campaignId);

  // Map creator platforms to available options
  const availablePlatforms = creatorProfile?.platforms || [];
  
  // Filter platforms based on campaign requirements if specified
  const platformOptions = requiredPlatforms.length > 0
    ? availablePlatforms.filter((p) => {
        const platformMap: Record<SocialPlatformType, DeliverableType[]> = {
          INSTAGRAM: ['INSTAGRAM_POST', 'INSTAGRAM_REELS', 'INSTAGRAM_STORY'],
          TIKTOK: ['TIKTOK_VIDEO'],
          YOUTUBE: ['YOUTUBE_SHORT', 'YOUTUBE_VIDEO'],
          BLOG: ['BLOG_ARTICLE'],
          OTHER: [],
        };
        return platformMap[p.platformType]?.some((dt) => requiredPlatforms.includes(dt));
      })
    : availablePlatforms;

  const handleSubmit = () => {
    if (!selectedPlatform) {
      return;
    }

    applyMutation.mutate(
      {
        selectedPlatform,
        selectedPlatformHandle: selectedPlatformHandle || undefined,
        applyNote: applyNote || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setSelectedPlatform('');
          setSelectedPlatformHandle('');
          setApplyNote('');
        },
      }
    );
  };

  const selectedPlatformData = availablePlatforms.find(
    (p) => p.platformType === selectedPlatform
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Apply ke Campaign</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Lengkapi informasi berikut untuk mengirim aplikasi Anda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 py-2 sm:py-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="platform" className="text-xs sm:text-sm">Platform yang Akan Digunakan *</Label>
            <Select
              value={selectedPlatform}
              onValueChange={(value) => {
                setSelectedPlatform(value as SocialPlatformType);
                const platform = availablePlatforms.find((p) => p.platformType === value);
                setSelectedPlatformHandle(platform?.handle || '');
              }}
            >
              <SelectTrigger id="platform" className="text-xs sm:text-sm">
                <SelectValue placeholder="Pilih platform" />
              </SelectTrigger>
              <SelectContent>
                {platformOptions.length === 0 ? (
                  <SelectItem value="none" disabled>
                    Tidak ada platform yang sesuai
                  </SelectItem>
                ) : (
                  platformOptions.map((platform) => (
                    <SelectItem key={platform.id} value={platform.platformType} className="text-xs sm:text-sm">
                      {platform.platformType} - @{platform.handle}
                      {platform.followers && ` (${(platform.followers / 1000).toFixed(1)}k followers)`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {selectedPlatformData && (
              <p className="text-xs text-muted-foreground break-words">
                Handle: @{selectedPlatformData.handle}
                {selectedPlatformData.followers && (
                  <> • {selectedPlatformData.followers.toLocaleString('id-ID')} followers</>
                )}
              </p>
            )}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="note" className="text-xs sm:text-sm">Catatan untuk Brand (Opsional)</Label>
            <Textarea
              id="note"
              placeholder="Tuliskan alasan mengapa Anda cocok untuk campaign ini..."
              value={applyNote}
              onChange={(e) => setApplyNote(e.target.value)}
              rows={4}
              className="text-xs sm:text-sm"
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedPlatform || applyMutation.isPending}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            {applyMutation.isPending ? 'Mengirim...' : 'Kirim Aplikasi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

