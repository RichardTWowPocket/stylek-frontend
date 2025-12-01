import { api } from './axios';
import type { DeliverableType, SocialPlatformType } from './campaigns';

export type TaskStatus =
  | 'PENDING'
  | 'DRAFT_SUBMITTED'
  | 'DRAFT_APPROVED'
  | 'DRAFT_REVISION_REQUESTED'
  | 'LIVE_SUBMITTED'
  | 'LIVE_APPROVED'
  | 'LIVE_REJECTED'
  | 'LIVE_REVISION_REQUESTED';

export interface CreatorBasicInfo {
  id: string;
  displayName: string;
  avatarUrl?: string;
}

export interface CampaignTask {
  id: string;
  campaignId: string;
  creator: CreatorBasicInfo;
  deliverableType: DeliverableType;
  status: TaskStatus;
  draftAssetLink?: string;
  draftCaption?: string;
  livePostLink?: string;
  liveScreenshotLink?: string;
  lastReviewNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  // Guideline info from campaign deliverable
  captionGuideline?: string;
  requiredHashtags: string[];
  requiredMentions: string[];
  promoCodeOrLink?: string;
}

export interface GetCampaignTasksParams {
  status?: TaskStatus;
  platform?: SocialPlatformType;
  search?: string;
}

export interface CampaignTasksResponse {
  data: CampaignTask[];
  total: number;
  summary?: {
    total: number;
    pending: number;
    draftSubmitted: number;
    liveSubmitted: number;
    approved: number;
  };
}

export async function getCampaignTasks(
  campaignId: string,
  params: GetCampaignTasksParams = {}
): Promise<CampaignTasksResponse> {
  const { status, platform, search } = params;
  const queryParams: Record<string, string> = {};

  if (status) {
    queryParams.status = status;
  }

  if (platform) {
    queryParams.platform = platform;
  }

  if (search) {
    queryParams.search = search;
  }

  const res = await api.get<CampaignTasksResponse>(`/campaigns/${campaignId}/tasks`, {
    params: queryParams,
  });
  return res.data;
}

export async function getTaskById(taskId: string): Promise<CreatorTask> {
  const res = await api.get<CreatorTask>(`/tasks/${taskId}`);
  return res.data;
}

// Draft Review
export async function reviewDraftApprove(taskId: string): Promise<void> {
  await api.post(`/tasks/${taskId}/review-draft`, { action: 'APPROVE' });
}

export async function reviewDraftRequestRevision(taskId: string, note: string): Promise<void> {
  await api.post(`/tasks/${taskId}/review-draft`, { action: 'REQUEST_REVISION', note });
}

// Live Content Review
export async function reviewLiveApprove(taskId: string): Promise<void> {
  await api.post(`/tasks/${taskId}/review-live`, { action: 'APPROVE' });
}

export async function reviewLiveRequestRevision(taskId: string, note: string): Promise<void> {
  await api.post(`/tasks/${taskId}/review-live`, { action: 'REQUEST_REVISION', note });
}

export async function reviewLiveReject(taskId: string, note: string): Promise<void> {
  await api.post(`/tasks/${taskId}/review-live`, { action: 'REJECT', note });
}

// Creator Tasks Types & APIs
export interface CreatorTask {
  id: string;
  campaignId: string;
  creator: CreatorBasicInfo;
  deliverableType: DeliverableType;
  status: TaskStatus;
  draftAssetLink?: string;
  draftCaption?: string;
  livePostLink?: string;
  liveScreenshotLink?: string;
  lastReviewNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
  campaign: {
    id: string;
    title: string;
    status: string;
    requirePreApproval: boolean;
    brand: {
      id: string;
      name: string;
      logoUrl?: string;
    };
  };
  captionGuideline?: string;
  requiredHashtags: string[];
  requiredMentions: string[];
  promoCodeOrLink?: string;
}

export interface GetCreatorTasksParams {
  status?: TaskStatus;
  page?: number;
  pageSize?: number;
}

export interface CreatorTasksResponse {
  data: CreatorTask[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getCreatorTasks(
  params: GetCreatorTasksParams = {}
): Promise<CreatorTasksResponse> {
  const { status, page = 1, pageSize = 20 } = params;
  const queryParams: Record<string, string | number> = {
    page,
    pageSize,
  };

  if (status) {
    queryParams.status = status;
  }

  const res = await api.get<CreatorTasksResponse>('/creators/me/tasks', {
    params: queryParams,
  });
  return res.data;
}

export interface SubmitDraftDto {
  draftAssetLink: string;
  draftCaption: string;
}

export interface SubmitLiveDto {
  livePostLink: string;
  liveScreenshotLink?: string;
}

export async function submitDraft(taskId: string, data: SubmitDraftDto): Promise<void> {
  await api.post(`/tasks/${taskId}/submit-draft`, data);
}

export async function submitLive(taskId: string, data: SubmitLiveDto): Promise<void> {
  await api.post(`/tasks/${taskId}/submit-live`, data);
}

