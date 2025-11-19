export const routes = {
  // Public routes
  login: '/login',
  register: {
    brand: '/register/brand',
    creator: '/register/creator',
  },
  // Brand routes
  brand: {
    dashboard: '/brand/dashboard',
    onboarding: '/brand/onboarding',
    campaigns: '/brand/campaigns',
    campaignNew: '/brand/campaigns/new',
    campaignDetail: (id: string) => `/brand/campaigns/${id}`,
    campaignEdit: (id: string) => `/brand/campaigns/${id}/edit`,
    profile: '/brand/profile',
    verification: '/brand/verification',
    wallet: '/brand/wallet',
  },
  // Creator routes
  creator: {
    dashboard: '/creator/dashboard',
    onboarding: '/creator/onboarding',
    discoverCampaigns: '/creator/campaigns/discover',
    myCampaigns: '/creator/campaigns/my',
    campaignDetail: (id: string) => `/creator/campaigns/${id}`,
    tasks: '/creator/tasks',
    taskDetail: (id: string) => `/creator/tasks/${id}`,
    profile: '/creator/profile',
    wallet: '/creator/wallet',
  },
  // Admin routes
  admin: {
    dashboard: '/admin/dashboard',
    brands: '/admin/brands',
    brandDetail: (id: string) => `/admin/brands/${id}`,
    creators: '/admin/creators',
    campaigns: '/admin/campaigns',
    topups: '/admin/topups',
    withdrawals: '/admin/withdrawals',
    users: '/admin/users',
    walletLogs: '/admin/logs/wallet',
  },
  // Shared routes
  notifications: '/notifications',
  accountSettings: '/account',
  forbidden: '/403',
} as const;

