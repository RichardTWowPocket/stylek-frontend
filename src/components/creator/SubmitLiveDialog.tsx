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
import { Input } from '@/components/ui/input';
import { useSubmitLive } from '@/lib/hooks/creator/useTaskSubmissions';

interface SubmitLiveDialogProps {
  taskId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubmitLiveDialog({
  taskId,
  open,
  onOpenChange,
}: SubmitLiveDialogProps) {
  const [livePostLink, setLivePostLink] = useState('');
  const [liveScreenshotLink, setLiveScreenshotLink] = useState('');

  const submitMutation = useSubmitLive(taskId);

  const handleSubmit = () => {
    if (!livePostLink.trim()) {
      return;
    }

    submitMutation.mutate(
      {
        livePostLink: livePostLink.trim(),
        liveScreenshotLink: liveScreenshotLink.trim() || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setLivePostLink('');
          setLiveScreenshotLink('');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Submit Live Content</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Kirim link ke konten yang sudah diposting.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 py-2 sm:py-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="livePostLink" className="text-xs sm:text-sm">
              Link Post Live (URL) *
            </Label>
            <Input
              id="livePostLink"
              type="url"
              placeholder="https://instagram.com/p/..."
              value={livePostLink}
              onChange={(e) => setLivePostLink(e.target.value)}
              className="text-xs sm:text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Masukkan link ke post yang sudah dipublikasikan
            </p>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="liveScreenshotLink" className="text-xs sm:text-sm">
              Screenshot Link (Opsional)
            </Label>
            <Input
              id="liveScreenshotLink"
              type="url"
              placeholder="https://..."
              value={liveScreenshotLink}
              onChange={(e) => setLiveScreenshotLink(e.target.value)}
              className="text-xs sm:text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Link ke screenshot sebagai bukti posting (opsional)
            </p>
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
            disabled={!livePostLink.trim() || submitMutation.isPending}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            {submitMutation.isPending ? 'Mengirim...' : 'Kirim Live Content'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}





