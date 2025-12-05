'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
  {
    image: '/why-stylek/why1.png',
    title: 'Temukan Creator yang Tepat',
    description: 'Cari creator yang benar-benar cocok dengan karakter brand Anda—mulai dari value, gaya konten, hingga audiens. Semuanya dipersonalisasi lewat pencocokan cerdas.',
  },
  {
    image: '/why-stylek/why2.png',
    title: 'Kolaborasi Tanpa Drama',
    description: 'Komunikasi, brief, kontrak, dan progress kampanye—semua rapi dalam satu tempat. Nggak perlu lagi bolak-balik platform lain.',
  },
  {
    image: '/why-stylek/why3.png',
    title: 'Tingkatkan Jangkauan & Dampak',
    description: 'Creator mendapat akses ke campaign eksklusif. Brand mendapat hasil konten dan engagement yang lebih kuat. Win–win.',
  },
  {
    image: '/why-stylek/why4.png',
    title: 'Aman & Terpercaya',
    description: 'Setiap kerja sama diproteksi dengan standar keamanan terbaik, jadi Anda bisa fokus berkarya tanpa khawatir soal detail teknis.',
  },
  {
    image: '/why-stylek/why5.png',
    title: 'Setup Kampanye dalam Hitungan Menit',
    description: 'Buat campaign baru semudah mengisi formulir. Alur kerjanya cepat, jelas, dan ramah pengguna—baik untuk brand maupun creator.',
  },
  {
    image: '/why-stylek/why6.png',
    title: 'Wawasan yang Memberi Keputusan Lebih Baik',
    description: 'Dapatkan data yang benar-benar berguna: performa konten, engagement, ROI, sampai creator insights. Semua terangkum dalam satu dashboard yang mudah dipahami.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          variants={headerVariants}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Mengapa Memilih StyleK?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Semua yang Anda butuhkan untuk menemukan partner yang tepat, berkolaborasi dengan lancar, dan membangun kemitraan yang benar-benar berdampak.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
        >
          {features.map((feature, index) => {
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="flex flex-col items-center text-center space-y-4"
              >
                {/* Image */}
                <div className="w-full max-w-[280px] flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-auto object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

