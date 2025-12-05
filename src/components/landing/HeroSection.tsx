'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      delay: 0.3,
    },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FEFBF7] via-[#F5E6D3] to-[#F5C2D1]/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
        >
          {/* Left: Text Content */}
          <motion.div
            variants={itemVariants}
            className="space-y-6 lg:space-y-8 text-center lg:text-left"
          >
            <div className="space-y-4">
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
              >
                <span className="block text-foreground">Cari</span>
                <span className="block text-foreground">Connect</span>
                <span className="block text-[#6c74ab]">
                  Collaborate
                </span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                Menyatukan brand dan creator dalam membangun campaign yang sukses.
                Cari influencer yang pas, kelola campaign dengan mudah, dan tingkatkan brand awareness—semua dalam satu platform.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                asChild
                size="lg"
                variant="default"
                className="rounded-xl bg-[#6c74ab] hover:bg-[#6c74ab]/90 text-white"
              >
                <Link href="/register/creator">
                  Daftar sebagai Creator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl border-2"
              >
                <Link href="/register/brand">
                  Daftar sebagai Brand
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right: Hero Image */}
          <motion.div
            variants={imageVariants}
            className="relative hidden lg:block w-full"
          >
            <div className="relative w-full max-w-lg mx-auto flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero-section1.png"
                alt="StyleK - Kolaborasi Brand dan Creator"
                className="w-full h-auto object-contain rounded-xl"
                loading="eager"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

