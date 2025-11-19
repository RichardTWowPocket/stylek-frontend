import { toast as showToast } from '@/hooks/use-toast';

export const toast = {
  success: (title: string, description?: string) => {
    showToast({
      title,
      description,
      variant: 'default',
    });
  },
  error: (title: string, description?: string) => {
    showToast({
      title,
      description,
      variant: 'destructive',
    });
  },
  info: (title: string, description?: string) => {
    showToast({
      title,
      description,
    });
  },
};

