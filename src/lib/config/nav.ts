import {
  LayoutDashboard as Dashboard,
  FolderKanban,
  Wallet,
  User,
  Shield,
  Search,
  ClipboardList,
  Building2,
  Users,
  ArrowUpCircle,
  ArrowDownCircle,
  UserCog,
  FileText,
  Bell,
} from 'lucide-react';
import { routes } from './routes';
import { SidebarItem } from '@/components/layout/AppSidebar';

export const brandNavItems: SidebarItem[] = [
  { icon: Dashboard, label: 'Dashboard', href: routes.brand.dashboard },
  { icon: FolderKanban, label: 'Campaigns', href: routes.brand.campaigns },
  { icon: Wallet, label: 'Wallet', href: routes.brand.wallet },
  { icon: User, label: 'Profile', href: routes.brand.profile },
  { icon: Shield, label: 'Verification', href: routes.brand.verification },
];

export const creatorNavItems: SidebarItem[] = [
  { icon: Dashboard, label: 'Dashboard', href: routes.creator.dashboard },
  { icon: Search, label: 'Discover', href: routes.creator.discoverCampaigns },
  { icon: FolderKanban, label: 'My Campaigns', href: routes.creator.myCampaigns },
  { icon: ClipboardList, label: 'Tasks', href: routes.creator.tasks },
  { icon: Wallet, label: 'Wallet', href: routes.creator.wallet },
  { icon: User, label: 'Profile', href: routes.creator.profile },
];

export const adminNavItems: SidebarItem[] = [
  { icon: Dashboard, label: 'Dashboard', href: routes.admin.dashboard },
  { icon: Building2, label: 'Brands', href: routes.admin.brands },
  { icon: Users, label: 'Creators', href: routes.admin.creators },
  { icon: FolderKanban, label: 'Campaigns', href: routes.admin.campaigns },
  { icon: ArrowUpCircle, label: 'Top-ups', href: routes.admin.topups },
  { icon: ArrowDownCircle, label: 'Withdrawals', href: routes.admin.withdrawals },
  { icon: UserCog, label: 'Users', href: routes.admin.users },
  { icon: FileText, label: 'Wallet Logs', href: routes.admin.walletLogs },
];

