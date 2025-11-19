import { api } from './axios';

export interface Notification {
  id: string;
  title: string;
  body?: string;
  type: 'CAMPAIGN' | 'WALLET' | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
  data?: {
    targetUrl?: string;
    [key: string]: any;
  };
}

export interface NotificationsResponse {
  data: Notification[];
  total: number;
  page: number;
  pageSize: number;
}

export interface GetNotificationsParams {
  page?: number;
  pageSize?: number;
}

export async function getNotifications(
  params: GetNotificationsParams = {}
): Promise<NotificationsResponse> {
  const { page = 1, pageSize = 20 } = params;
  const res = await api.get<NotificationsResponse>('/notifications', {
    params: { page, pageSize },
  });
  return res.data;
}

export async function markNotificationRead(id: string): Promise<void> {
  await api.post(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.post('/notifications/read-all');
}

