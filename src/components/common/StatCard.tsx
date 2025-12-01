import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/utils/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, description, className }: StatCardProps) {
  return (
    <Card className={cn('p-4 sm:p-6', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1 flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground sm:text-sm">{label}</p>
          <p className="text-xl font-bold sm:text-2xl truncate">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {Icon && (
          <div className="rounded-full bg-primary/10 p-2 sm:p-3 flex-shrink-0 ml-2">
            <Icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
          </div>
        )}
      </div>
    </Card>
  );
}

