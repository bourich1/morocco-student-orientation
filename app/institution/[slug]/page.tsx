import { supabase, isSupabaseConfigured, CATEGORIES, DEFAULT_INSTITUTION_IMAGE } from '@/lib/supabase';
import { SetupRequired } from '@/components/SetupRequired';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ExternalLink, Calendar, Layers, ArrowRight } from 'lucide-react';
import { ShareButton } from '@/components/ShareButton';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!isSupabaseConfigured) return { title: 'توجيه المغرب' };
  
  const { data: inst } = await supabase!
    .from('institutions')
    .select('name, description, city')
    .eq('slug', slug)
    .single();

  if (!inst) {
    return { title: 'المؤسسة غير موجودة' };
  }

  return {
    title: `${inst.name} | توجيه المغرب`,
    description: inst.description?.substring(0, 160) || `تعلم المزيد حول ${inst.name} في ${inst.city}.`,
  };
}

export default async function InstitutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (!isSupabaseConfigured) {
    return <SetupRequired />;
  }

  // Fetch institution
  const { data: inst, error } = await supabase!
    .from('institutions')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !inst) {
    notFound();
  }

  const categoryLabel = CATEGORIES.find(c => c.id === inst.category)?.label || inst.category;

  // Fetch related
  const { data: related } = await supabase!
    .from('institutions')
    .select('name, slug, image_url, city')
    .eq('category', inst.category)
    .neq('id', inst.id)
    .limit(4);

  return (
    <div className="w-full pb-24">
      {/* Editorial Hero Header */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-end">
        <div className="absolute inset-0 z-0">
          <Image 
            src={inst.image_url || DEFAULT_INSTITUTION_IMAGE} 
            alt={inst.name} 
            fill 
            className="object-cover" 
            referrerPolicy="no-referrer"
            unoptimized={!inst.image_url}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/40 to-transparent" />
        </div>

        <div className="relative z-10 w-[95%] md:w-[90%] max-w-[1200px] mx-auto pb-16">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Link href={`/category/${inst.category}`} className="px-4 py-1.5 rounded-full bg-emerald-500 text-slate-950 text-[12px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors">
              {categoryLabel}
            </Link>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[12px] font-bold">
              <MapPin className="w-3.5 h-3.5" />
              {inst.city}
            </div>
          </div>

          <h1 className="text-[40px] md:text-[64px] lg:text-[80px] font-black tracking-tight text-white mb-6 leading-[1.1] max-w-[900px]">
            {inst.name}
          </h1>

          <div className="flex items-center gap-6">
             <div className="flex -space-x-3 rtl:space-x-reverse">
                {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#030712] bg-slate-800 overflow-hidden relative">
                        <Image src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Student" fill className="object-cover" />
                    </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-[#030712] bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-slate-950">
                    +150
                </div>
             </div>
             <p className="text-[14px] font-medium text-slate-300">طالب مهتم بهذه المؤسسة</p>
          </div>
        </div>

        {/* Action Bar Overlay */}
        <div className="absolute bottom-0 right-0 left-0 h-24 bg-gradient-to-t from-[#030712] to-transparent pointer-events-none" />
      </section>

      <div className="w-[95%] md:w-[90%] max-w-[1200px] mx-auto mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Info Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* About Section */}
            <div className="relative group">
               <div className="absolute -inset-4 bg-white/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="relative">
                  <h2 className="text-[24px] font-black text-white mb-6 flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
                    نبذة عن المؤسسة
                  </h2>
                  <div className="text-[18px] leading-relaxed text-slate-400 font-medium whitespace-pre-wrap">
                    {inst.description || "لا توجد تفاصيل إضافية في الوقت الحالي لهذه المؤسسة المتميزة في مسارها التعليمي."}
                  </div>
               </div>
            </div>

            {/* Specialties / Fields */}
            <div className="bg-[#0B1120]/40 rounded-[2.5rem] p-10 border border-white/5 shadow-2xl">
              <h2 className="text-[24px] font-black text-white mb-8 flex items-center gap-3">
                <Layers className="w-6 h-6 text-emerald-500" />
                التخصصات والمسالك المتاحة
              </h2>
              
              {inst.fields && inst.fields.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inst.fields.map((field: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group cursor-default">
                      <div className="w-2 h-2 rounded-full bg-emerald-500/50 group-hover:scale-150 transition-transform"></div>
                      <span className="text-[15px] font-bold text-slate-300 group-hover:text-white transition-colors">{field}</span>
                    </div>
                  ))}
                </div>
              ) : (
                 <div className="text-center py-12 rounded-3xl bg-slate-900/50 border border-dashed border-white/10">
                    <p className="text-[14px] text-slate-500">سيتم تحديث قائمة التخصصات قريباً.</p>
                 </div>
              )}
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-8">
            {/* Quick Actions Card */}
            <div className="sticky top-28 bg-white text-slate-950 rounded-[2.5rem] p-8 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.3)] overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full pointer-events-none"></div>
                
                <h3 className="text-[20px] font-black mb-6 relative z-10">معلومات التسجيل</h3>
                
                <div className="space-y-6 mb-10 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-emerald-600">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">الموقع</p>
                            <p className="text-[16px] font-black">{inst.city}, المغرب</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-indigo-600">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">تاريخ النشر</p>
                            <p className="text-[16px] font-black">{new Date(inst.created_at).toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 relative z-10">
                    {/* Removed apply button logic */}
                    
                    <ShareButton 
                        title={`المؤسسة: ${inst.name}`} 
                        text={`اكتشف ${inst.name} على توجيه المغرب - منصتك الأولى للتوجيه.`}
                    />
                </div>
            </div>
          </div>
        </div>

        {/* Related Institutions Grid */}
        {related && related.length > 0 && (
          <div className="mt-32">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <h2 className="text-[32px] md:text-[40px] font-black text-white">مؤسسات ذات صلة</h2>
                <Link href={`/category/${inst.category}`} className="text-emerald-400 font-bold flex items-center gap-2 hover:text-emerald-300 transition-colors">
                    مشاهدة الكل في {categoryLabel} <ArrowRight className="w-5 h-5 rotate-180" />
                </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((rel) => (
                <Link key={rel.slug} href={`/institution/${rel.slug}`} className="group relative bg-[#0B1120]/40 rounded-3xl border border-white/5 overflow-hidden transition-all hover:border-emerald-500/30 hover:-translate-y-2">
                  <div className="aspect-video relative overflow-hidden">
                    <Image 
                      src={rel.image_url || `https://picsum.photos/seed/${rel.slug}/400/225`} 
                      alt={rel.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0" 
                      unoptimized={!rel.image_url}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030712] to-transparent opacity-60" />
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">{rel.city}</p>
                    <h3 className="text-[16px] font-black text-white group-hover:text-emerald-400 transition-colors line-clamp-2 leading-tight">
                      {rel.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
