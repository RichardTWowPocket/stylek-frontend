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
import { Textarea } from '@/components/ui/textarea';
import { useSubmitDraft } from '@/lib/hooks/creator/useTaskSubmissions';

interface SubmitDraftDialogProps {
  taskId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubmitDraftDialog({
  taskId,
  open,
  onOpenChange,
}: SubmitDraftDialogProps) {
  const [draftAssetLink, setDraftAssetLink] = useState('');
  const [draftCaption, setDraftCaption] = useState('');

  const submitMutation = useSubmitDraft(taskId);

  const handleSubmit = () => {
    if (!draftAssetLink.trim() || !draftCaption.trim()) {
      return;
    }

    submitMutation.mutate(
      {
        draftAssetLink: draftAssetLink.trim(),
        draftCaption: draftCaption.trim(),
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setDraftAssetLink('');
          setDraftCaption('');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Submit Draft</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Kirim draft konten Anda untuk review oleh brand.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 py-2 sm:py-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="draftAssetLink" className="text-xs sm:text-sm">
              Link Draft Asset (URL) *
            </Label>
            <Input
              id="draftAssetLink"
              type="url"
              placeholder="https://..."
              value={draftAssetLink}
              onChange={(e) => setDraftAssetLink(e.target.value)}
              className="text-xs sm:text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Masukkan link ke draft konten Anda (contoh: Google Drive, Dropbox, atau platform lainnya)
            </p>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="draftCaption" className="text-xs sm:text-sm">
              Draft Caption *
            </Label>
            <Textarea
              id="draftCaption"
              placeholder="Tuliskan caption yang akan digunakan..."
              value={draftCaption}
              onChange={(e) => setDraftCaption(e.target.value)}
              rows={6}
              className="text-xs sm:text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Pastikan caption mengikuti guidelines yang diberikan
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
            disabled={!draftAssetLink.trim() || !draftCaption.trim() || submitMutation.isPending}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            {submitMutation.isPending ? 'Mengirim...' : 'Kirim Draft'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}



