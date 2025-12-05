'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/config/routes';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
    },
  },
};

export function LoginRoleModal({ open, onOpenChange }: LoginRoleModalProps) {
  const router = useRouter();

  const handleRoleSelect = (role: 'brand' | 'creator') => {
    onOpenChange(false);
    router.push(`/register?tab=${role}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-md bg-background border-border p-0 overflow-hidden [&>button[class*='absolute']]:hidden">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-foreground">
              Mulai yuk!
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Pilih role yang sesuai dengan aktivitas kamu.
          </p>
        </DialogHeader>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="px-6 pb-6 space-y-4"
              >
                {/* Brand Card */}
                <motion.button
                  variants={cardVariants}
                  onClick={() => handleRoleSelect('brand')}
                  className="w-full group relative overflow-hidden rounded-xl border-2 border-border bg-gradient-to-r from-[#6c74ab]/10 via-[#6c74ab]/5 to-transparent hover:from-[#6c74ab]/20 hover:via-[#6c74ab]/10 hover:border-[#6c74ab]/50 transition-all duration-300 p-5 text-left"
                >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/pop-up-auth/brand.png"
                  alt="Brand"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-foreground mb-1">
                  Brand
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Ingin mengenalkan produk dan meningkatkan awareness lewat kolaborasi dengan creator.
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#6c74ab]/20 group-hover:bg-[#6c74ab]/30 flex items-center justify-center transition-colors">
                  <ArrowRight className="h-4 w-4 text-[#6c74ab]" />
                </div>
              </div>
                </div>
              </motion.button>

              {/* Creator Card */}
              <motion.button
                variants={cardVariants}
                onClick={() => handleRoleSelect('creator')}
                className="w-full group relative overflow-hidden rounded-xl border-2 border-border bg-gradient-to-r from-[#F5C2D1]/10 via-[#F5C2D1]/5 to-transparent hover:from-[#F5C2D1]/20 hover:via-[#F5C2D1]/10 hover:border-[#F5C2D1]/50 transition-all duration-300 p-5 text-left"
              >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/pop-up-auth/creator.png"
                  alt="Creator"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-foreground mb-1">
                  Creator
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Ingin monetisasi konten dan kerja sama dengan brand yang cocok.
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#F5C2D1]/20 group-hover:bg-[#F5C2D1]/30 flex items-center justify-center transition-colors">
                  <ArrowRight className="h-4 w-4 text-[#F5C2D1]" />
                </div>
              </div>
                </div>
              </motion.button>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>
      )}
    </AnimatePresence>
  );
}

