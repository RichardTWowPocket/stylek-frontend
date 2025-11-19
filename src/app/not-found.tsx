import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileQuestion } from 'lucide-react';
import { routes } from '@/lib/config/routes';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="p-12 text-center">
        <FileQuestion className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-2 text-2xl font-bold">404</h1>
        <p className="mb-6 text-muted-foreground">Halaman tidak ditemukan</p>
        <Button asChild>
          <Link href={routes.login}>Kembali ke Dashboard</Link>
        </Button>
      </Card>
    </div>
  );
}

