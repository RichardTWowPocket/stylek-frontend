import { z } from 'zod';

// Step 1: Basic Info
export const campaignBasicInfoSchema = z.object({
  title: z.string().min(3, 'Judul campaign minimal 3 karakter'),
  goals: z
    .array(
      z.enum([
        'BRAND_AWARENESS',
        'REVIEW_MARKETPLACE',
        'SOCIAL_CONTENT',
        'TRAFFIC_TO_STORE',
        'COLLECT_UGC',
      ])
    )
    .min(1, 'Pilih minimal 1 goal'),
  campaignType: z.enum(['PRODUCT_SEEDING', 'STORE_VISIT', 'DELIVERY_REVIEW']),
  promoType: z.enum(['PHYSICAL_PRODUCT', 'STORE_VISIT', 'SERVICE']),
});

// Step 2: Product
export const campaignProductSchema = z.object({
  productName: z.string().min(2, 'Nama produk minimal 2 karakter'),
  productImages: z.array(z.string().url('URL gambar tidak valid')).min(1, 'Minimal 1 gambar produk'),
  productLink: z.string().url('URL tidak valid').optional().or(z.literal('')),
  normalPrice: z.number().min(0, 'Harga tidak valid').optional(),
});

// Step 3: Deliverables
export const deliverableSchema = z.object({
  deliverableType: z.enum([
    'INSTAGRAM_POST',
    'INSTAGRAM_REELS',
    'INSTAGRAM_STORY',
    'TIKTOK_VIDEO',
    'YOUTUBE_SHORT',
    'YOUTUBE_VIDEO',
    'MARKETPLACE_REVIEW',
    'BLOG_ARTICLE',
  ]),
  quantity: z.number().min(1, 'Quantity minimal 1'),
  captionGuideline: z.string().optional(),
  requiredHashtags: z.array(z.string()).default([]),
  requiredMentions: z.array(z.string()).default([]),
  promoCodeOrLink: z.string().optional(),
});

export const campaignDeliverablesSchema = z.object({
  deliverables: z.array(deliverableSchema).min(1, 'Minimal 1 deliverable'),
});

// Step 4: Reward & Quota
export const campaignRewardSchema = z.object({
  rewardType: z.enum(['FREE_PRODUCT', 'FREE_PRODUCT_PLUS_FEE', 'CASHBACK_AFTER_PURCHASE']),
  feePerCreator: z.number().min(0, 'Fee tidak valid').optional(),
  estimatedProductValue: z.number().min(0, 'Nilai produk tidak valid').optional(),
  slots: z.number().min(1, 'Slots minimal 1'),
  eligibleRegions: z.array(z.string()).min(1, 'Pilih minimal 1 region'),
});

// Step 5: Timeline & Settings
export const campaignTimelineSchema = z.object({
  applyStartDate: z.string().min(1, 'Tanggal mulai apply harus diisi'),
  applyEndDate: z.string().min(1, 'Tanggal akhir apply harus diisi'),
  announcementDate: z.string().optional(),
  postDeadline: z.string().min(1, 'Post deadline harus diisi'),
  requirePreApproval: z.boolean().default(false),
  briefAttachmentUrl: z.string().url('URL tidak valid').optional().or(z.literal('')),
});

// Combined schema for full campaign
export const createCampaignSchema = campaignBasicInfoSchema
  .merge(campaignProductSchema)
  .merge(campaignDeliverablesSchema)
  .merge(campaignRewardSchema)
  .merge(campaignTimelineSchema)
  .refine(
    (data) => {
      // Validate feePerCreator for certain reward types
      if (
        (data.rewardType === 'FREE_PRODUCT_PLUS_FEE' ||
          data.rewardType === 'CASHBACK_AFTER_PURCHASE') &&
        (!data.feePerCreator || data.feePerCreator <= 0)
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Fee harus diisi untuk reward type ini',
      path: ['feePerCreator'],
    }
  )
  .refine(
    (data) => {
      // Validate dates
      const start = new Date(data.applyStartDate);
      const end = new Date(data.applyEndDate);
      const deadline = new Date(data.postDeadline);
      return end > start && deadline > end;
    },
    {
      message: 'Tanggal tidak valid. Pastikan: Apply End > Apply Start, dan Post Deadline > Apply End',
      path: ['applyEndDate'],
    }
  );

export type CampaignBasicInfoFormData = z.infer<typeof campaignBasicInfoSchema>;
export type CampaignProductFormData = z.infer<typeof campaignProductSchema>;
export type CampaignDeliverableFormData = z.infer<typeof deliverableSchema>;
export type CampaignDeliverablesFormData = z.infer<typeof campaignDeliverablesSchema>;
export type CampaignRewardFormData = z.infer<typeof campaignRewardSchema>;
export type CampaignTimelineFormData = z.infer<typeof campaignTimelineSchema>;
export type CreateCampaignFormData = z.infer<typeof createCampaignSchema>;

