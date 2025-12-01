'use client';

import { useState } from 'react';
import { useAdminUsers } from '@/lib/hooks/admin/useAdminUsers';
import { useToggleUserSuspension } from '@/lib/hooks/admin/useToggleUserSuspension';
import { useAdminUsersStore } from '@/store/adminUsers.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { Search, UserCog, Ban, CheckCircle2 } from 'lucide-react';
import { formatDateTimeShort } from '@/lib/utils/formatDate';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

function getRoleBadgeVariant(role: string) {
  switch (role) {
    case 'ADMIN':
      return 'default';
    case 'BRAND':
      return 'secondary';
    case 'CREATOR':
      return 'secondary';
    default:
      return 'secondary';
  }
}

function getStatusBadgeVariant(status: string) {
  return status === 'ACTIVE' ? 'default' : 'destructive';
}

export default function AdminUsersPage() {
  const { role, status, search, setRole, setStatus, setSearch } = useAdminUsersStore();
  const { data, isLoading, error, refetch } = useAdminUsers();
  const toggleSuspension = useToggleUserSuspension();
  const [suspensionTarget, setSuspensionTarget] = useState<{
    id: string;
    email: string;
    suspend: boolean;
  } | null>(null);

  const handleSuspendClick = (user: { id: string; email: string; status: string }) => {
    setSuspensionTarget({
      id: user.id,
      email: user.email,
      suspend: user.status === 'ACTIVE',
    });
  };

  const handleConfirmSuspension = async () => {
    if (!suspensionTarget) return;
    try {
      await toggleSuspension.mutateAsync({
        id: suspensionTarget.id,
        suspend: suspensionTarget.suspend,
      });
      setSuspensionTarget(null);
    } catch (err) {
      // Error handled in mutation
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Gagal memuat users"
        description="Terjadi kesalahan saat memuat daftar user."
        onRetry={() => refetch()}
      />
    );
  }

  const users = data?.data || [];

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Kelola status user (suspend/unsuspend)</p>
        </div>

        {/* Filter Bar */}
        <Card className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={role} onValueChange={(value) => setRole(value as any)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Role</SelectItem>
                  <SelectItem value="BRAND">Brand</SelectItem>
                  <SelectItem value="CREATOR">Creator</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={(value) => setStatus(value as any)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Users List */}
        {users.length === 0 ? (
          <EmptyState
            icon={UserCog}
            title="Belum ada user"
            description={
              search || role !== 'ALL' || status !== 'ALL'
                ? 'Tidak ada user yang sesuai dengan filter Anda.'
                : 'Belum ada user yang terdaftar.'
            }
          />
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{user.email}</p>
                      <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                      <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Created: {formatDateTimeShort(user.createdAt)}
                    </p>
                  </div>
                  <Button
                    variant={user.status === 'ACTIVE' ? 'destructive' : 'default'}
                    size="sm"
                    onClick={() => handleSuspendClick(user)}
                    disabled={toggleSuspension.isPending}
                  >
                    {user.status === 'ACTIVE' ? (
                      <>
                        <Ban className="mr-2 h-4 w-4" />
                        Suspend
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Unsuspend
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Suspension Confirmation Dialog */}
      <AlertDialog
        open={!!suspensionTarget}
        onOpenChange={(open) => !open && setSuspensionTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {suspensionTarget?.suspend ? 'Suspend User?' : 'Unsuspend User?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {suspensionTarget?.suspend
                ? `Yakin mau suspend user ${suspensionTarget.email}? User tidak akan bisa login setelah di-suspend.`
                : `Yakin mau unsuspend user ${suspensionTarget?.email}? User akan bisa login kembali.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSuspension}
              disabled={toggleSuspension.isPending}
            >
              {suspensionTarget?.suspend ? 'Suspend' : 'Unsuspend'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

