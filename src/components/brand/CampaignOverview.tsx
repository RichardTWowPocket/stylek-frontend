'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Campaign } from '@/lib/api/campaigns';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';

interface CampaignOverviewProps {
  campaign: Campaign;
}

export function CampaignOverview({ campaign }: CampaignOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Campaign Info */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Informasi Campaign</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Judul</p>
            <p className="font-medium">{campaign.title}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge>{campaign.status}</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tipe Campaign</p>
            <p className="font-medium">{campaign.campaignType}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tipe Promo</p>
            <p className="font-medium">{campaign.promoType}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">Goals</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {campaign.goals.map((goal) => (
                <Badge key={goal} variant="secondary">
                  {goal}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Product Info */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Produk</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Nama Produk</p>
            <p className="font-medium">{campaign.productName}</p>
          </div>
          {campaign.productImages.length > 0 && (
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Gambar Produk</p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {campaign.productImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="h-32 w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>
          )}
          {campaign.productLink && (
            <div>
              <p className="text-sm text-muted-foreground">Link Produk</p>
              <a
                href={campaign.productLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {campaign.productLink}
              </a>
            </div>
          )}
          {campaign.normalPrice && (
            <div>
              <p className="text-sm text-muted-foreground">Harga Normal</p>
              <p className="font-medium">{formatCurrency(campaign.normalPrice)}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Deliverables */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Deliverables</h2>
        <div className="space-y-4">
          {campaign.deliverables.map((deliverable, index) => (
            <div key={index} className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {deliverable.quantity}x {deliverable.deliverableType}
                  </p>
                  {deliverable.captionGuideline && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {deliverable.captionGuideline}
                    </p>
                  )}
                </div>
              </div>
              {(deliverable.requiredHashtags.length > 0 ||
                deliverable.requiredMentions.length > 0) && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {deliverable.requiredHashtags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                  {deliverable.requiredMentions.map((mention) => (
                    <Badge key={mention} variant="secondary">
                      @{mention}
                    </Badge>
                  ))}
                </div>
              )}
              {deliverable.promoCodeOrLink && (
                <p className="mt-2 text-sm">
                  <span className="text-muted-foreground">Promo:</span> {deliverable.promoCodeOrLink}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Reward & Quota */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Reward & Kuota</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Reward Type</p>
            <p className="font-medium">{campaign.rewardType}</p>
          </div>
          {campaign.feePerCreator && (
            <div>
              <p className="text-sm text-muted-foreground">Fee per Creator</p>
              <p className="font-medium">{formatCurrency(campaign.feePerCreator)}</p>
            </div>
          )}
          {campaign.estimatedProductValue && (
            <div>
              <p className="text-sm text-muted-foreground">Estimasi Nilai Produk</p>
              <p className="font-medium">{formatCurrency(campaign.estimatedProductValue)}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">Slots</p>
            <p className="font-medium">{campaign.slots} creator</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">Eligible Regions</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {campaign.eligibleRegions.map((region) => (
                <Badge key={region} variant="secondary">
                  {region}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Timeline & Settings */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Timeline & Pengaturan</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Tanggal Mulai Apply</p>
            <p className="font-medium">{formatDate(campaign.applyStartDate)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tanggal Akhir Apply</p>
            <p className="font-medium">{formatDate(campaign.applyEndDate)}</p>
          </div>
          {campaign.announcementDate && (
            <div>
              <p className="text-sm text-muted-foreground">Tanggal Announcement</p>
              <p className="font-medium">{formatDate(campaign.announcementDate)}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">Post Deadline</p>
            <p className="font-medium">{formatDate(campaign.postDeadline)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Require Pre-approval</p>
            <Badge variant={campaign.requirePreApproval ? 'default' : 'secondary'}>
              {campaign.requirePreApproval ? 'Ya' : 'Tidak'}
            </Badge>
          </div>
          {campaign.briefAttachmentUrl && (
            <div>
              <p className="text-sm text-muted-foreground">Brief Attachment</p>
              <a
                href={campaign.briefAttachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Download Brief
              </a>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

