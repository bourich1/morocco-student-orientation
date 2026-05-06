'use client';

import { HomeClient } from '@/components/HomeClient';
import { CATEGORIES, DEFAULT_INSTITUTION_IMAGE } from '@/lib/supabase';
import { ArrowLeft, BookOpen, GraduationCap, Building2, Briefcase, Microscope, Palette } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { useEffect, useRef } from 'react';

const CATEGORY_ICONS: Record<string, any> = {
  university: GraduationCap,
  vocational: Briefcase,
  engineering: Building2,
  medicine: Microscope,
  business: BookOpen,
  arts: Palette
};

function Counter({ value, duration = 2 }: { value: string, duration?: number }) {
  const count = useMotionValue(0);
  const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
  const suffix = value.replace(/[0-9]/g, '');
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);

  useEffect(() => {
    const controls = animate(count, numericValue, { duration: duration, ease: "easeOut" });
    return () => controls.stop();
  }, [numericValue, count, duration]);

  return (
    <motion.span ref={ref}>
      {suffix.startsWith('+') ? suffix : ''}
      <motion.span>{rounded}</motion.span>
      {!suffix.startsWith('+') ? suffix : ''}
    </motion.span>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Premium Hero Section */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-40 overflow-hidden">
        {/* Background Layers */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[150px] rounded-full"></div>
        </div>

        <div className="relative z-10 w-[95%] md:w-[90%] max-w-[1200px] mx-auto flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-10"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">مستقبلك يبدأ من هنا</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[36px] sm:text-[48px] md:text-[80px] lg:text-[96px] font-black tracking-tight text-white mb-8 leading-[1] max-w-[1000px] drop-shadow-2xl"
          >
            بوصلة <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">توجيهك</span> في المغرب
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[18px] md:text-[22px] text-slate-400 max-w-[700px] mx-auto mb-16 font-medium leading-relaxed"
          >
            المنصة الرقمية المتكاملة لاستكشاف المسارات التعليمية، المدارس الكبرى، والفرص المهنية المتاحة للطلبة المغاربة.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full max-w-[900px] mx-auto"
          >
            <HomeClient />
          </motion.div>
          
          {/* Stats Row */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-[1000px]">
            {[
              { label: 'مؤسسة تعليمية', value: '+500' },
              { label: 'مدينة مغربية', value: '75' },
              { label: 'تخصص دراسي', value: '+120' },
              { label: 'طالب سنوياً', value: '10K' },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex flex-col items-center"
              >
                <span className="text-[32px] md:text-[40px] font-black text-white">
                  <Counter value={stat.value} />
                </span>
                <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="w-[95%] md:w-[90%] max-w-[1200px] mx-auto py-32 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-[500px]">
            <h2 className="text-[32px] md:text-[48px] font-black text-white mb-4">استكشف حسب الفئة</h2>
            <p className="text-[16px] text-slate-400">اختر مسارك المفضل وتعرف على أفضل المؤسسات التي تقدم برامج متميزة في هذا التخصص.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] || GraduationCap;
            return (
              <Link 
                key={cat.id} 
                href={`/category/${cat.id}`}
                className="group relative bg-[#0B1120]/40 rounded-[2.5rem] border border-white/5 overflow-hidden transition-all duration-500 hover:border-emerald-500/30 hover:shadow-[0_20px_50px_-20px_rgba(16,185,129,0.2)] flex flex-col h-full"
              >
                <div className="aspect-[16/10] relative overflow-hidden flex-shrink-0">
                  <Image 
                    src={DEFAULT_INSTITUTION_IMAGE} 
                    alt={cat.label} 
                    fill 
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                    referrerPolicy="no-referrer"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] to-transparent"></div>
                  
                  <div className="absolute top-6 right-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-10 relative z-10 flex flex-col flex-grow text-right" dir="rtl">
                  <h3 className="text-[24px] font-black text-white mb-4 group-hover:text-emerald-400 transition-colors line-clamp-1 leading-tight">
                    {cat.label}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-slate-400 m-0 group-hover:text-slate-300 transition-colors line-clamp-2 min-h-[40px]">
                    استكشف نخبة المدارس والجامعات في {cat.label} بالمغرب.
                  </p>
                  
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2 text-[12px] font-bold text-emerald-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                    <ArrowLeft className="w-4 h-4" /> استكشف الفئة
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Simplified CTA Section */}
      <section className="w-[95%] md:w-[90%] max-w-[1200px] mx-auto mb-32">
        <div className="relative rounded-[3rem] bg-gradient-to-br from-emerald-600 to-indigo-800 p-12 md:p-24 overflow-hidden text-center flex flex-col items-center">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="relative z-10">
                <h2 className="text-[32px] md:text-[56px] font-black text-white mb-6">هل أنت مستعد لبناء مستقبلك؟</h2>
                <p className="text-[18px] md:text-[20px] text-white/80 max-w-[600px] mx-auto leading-relaxed">
                    نحن هنا لمساعدتك في كل خطوة من رحلتك التعليمية. ابدأ استكشاف خياراتك اليوم واصنع الفرق في مسارك المهني.
                </p>
            </div>
        </div>
      </section>
    </div>
  );
}
