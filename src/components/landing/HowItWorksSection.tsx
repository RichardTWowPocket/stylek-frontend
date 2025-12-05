'use client';

import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, Search, Handshake, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Buat Profil Anda',
    description: 'Daftar sebagai brand atau creator dan bangun profil Anda dengan gaya dan kebutuhan unik Anda.',
  },
  {
    number: '02',
    icon: Search,
    title: 'Temukan & Cocokkan',
    description: 'Jelajahi profil atau biarkan AI kami mencocokkan Anda dengan partner yang sempurna untuk kampanye Anda.',
  },
  {
    number: '03',
    icon: Handshake,
    title: 'Mulai Berkolaborasi',
    description: 'Luncurkan kampanye, kelola tugas, dan berkomunikasi dengan lancar melalui platform kami.',
  },
  {
    number: '04',
    icon: CheckCircle,
    title: 'Lacak & Berkembang',
    description: 'Pantau performa, analisis hasil, dan skala kemitraan Anda untuk kesuksesan jangka panjang.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Cara Kerja
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mulai dalam empat langkah sederhana dan mulai perjalanan kolaborasi Anda hari ini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="border-border relative overflow-hidden">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-[#6c74ab] flex items-center justify-center text-white font-bold text-lg">
                        {step.number}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

