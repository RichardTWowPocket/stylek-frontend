import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShieldX } from 'lucide-react';
import { routes } from '@/lib/config/routes';

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="p-12 text-center">
        <ShieldX className="mx-auto mb-4 h-16 w-16 text-destructive" />
        <h1 className="mb-2 text-2xl font-bold">403</h1>
        <p className="mb-6 text-muted-foreground">
          Anda tidak memiliki akses ke halaman ini.
        </p>
        <Button asChild>
          <Link href={routes.login}>Kembali ke Login</Link>
        </Button>
      </Card>
    </div>
  );
}

