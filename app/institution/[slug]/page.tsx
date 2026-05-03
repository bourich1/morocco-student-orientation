import { supabase, isSupabaseConfigured, CATEGORIES } from '@/lib/supabase';
import { SetupRequired } from '@/components/SetupRequired';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ExternalLink, Calendar, Layers, ChevronLeft } from 'lucide-react';
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
    .select('name, slug, image_url')
    .eq('category', inst.category)
    .neq('id', inst.id)
    .limit(3);

  return (
    <div className="w-[90%] max-w-[1200px] mx-auto py-6">
      {/* Hero Banner */}
      <div className="relative h-[300px] md:h-[400px] w-full bg-slate-900 md:rounded-3xl overflow-hidden md:mt-6 mb-8 shadow-sm">
        <Image 
          src={inst.image_url || `https://picsum.photos/seed/${inst.id}/1920/1080`} 
          alt={inst.name} 
          fill 
          className="object-cover opacity-50 mix-blend-overlay" 
          referrerPolicy="no-referrer"
          unoptimized={!inst.image_url}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent h-3/4" />
        
        <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end px-6 md:px-12 w-full">
          <div className="pb-8 md:pb-12 w-full">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Link href={`/category/${inst.category}`} className="inline-flex items-center text-[12px] md:text-[14px] font-bold text-slate-900 bg-emerald-400 px-4 py-1.5 rounded-full uppercase tracking-wider hover:bg-emerald-300 transition-colors shadow-sm">
                {categoryLabel}
              </Link>
              <span className="inline-flex items-center text-[12px] md:text-[14px] font-medium text-white/90 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-sm">
                <MapPin className="w-3.5 h-3.5 ml-1.5" />
                {inst.city}
              </span>
            </div>
            <h1 className="text-[32px] md:text-[48px] lg:text-[56px] font-extrabold tracking-tight text-white mb-4 leading-tight drop-shadow-lg">
              {inst.name}
            </h1>
            <p className="text-[16px] md:text-[18px] lg:text-[20px] text-slate-200 max-w-3xl line-clamp-2 md:line-clamp-3 drop-shadow-sm">
              {inst.description || "لا يوجد وصف حالياً لهذه المؤسسة."}
            </p>
          </div>
        </div>
      </div>

      {/* About Section - Full Width */}
      <div className="bg-[#0B1120] rounded-3xl p-8 border border-slate-800 shadow-sm mb-6 relative overflow-hidden">
        <h2 className="text-[20px] font-bold text-slate-100 mb-6 flex items-center">
          عن المؤسسة
        </h2>
        <div className="text-[15px] leading-relaxed text-slate-400 whitespace-pre-wrap">
          {inst.description || "لا توجد تفاصيل إضافية في الوقت الحالي."}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
        {/* Main Content Areas */}
        <div className="order-1 lg:col-span-2 space-y-6">
          <div className="bg-[#0B1120] rounded-3xl p-8 border border-slate-800 shadow-sm">
            <h2 className="text-[20px] font-bold text-slate-100 mb-6 flex items-center">
              <Layers className="w-5 h-5 text-emerald-500 ml-2" /> التخصصات والمسالك المتاحة
            </h2>
            {inst.fields && inst.fields.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {inst.fields.map((field: string, idx: number) => (
                  <span key={idx} className="inline-flex items-center bg-slate-900 text-slate-300 text-[14px] font-medium px-4 py-2 border border-slate-700 rounded-xl">
                    {field}
                  </span>
                ))}
              </div>
            ) : (
               <div className="text-center py-8 bg-slate-900 rounded-2xl border border-slate-800 placeholder-slate-400">
                  <p className="text-[14px] text-slate-500">لم يتم إدراج تخصصات بعد.</p>
               </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="order-2 space-y-6">
          <div className="bg-[#0B1120] rounded-3xl p-6 border border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-100 text-[16px] mb-4">معلومات سريعة</h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-center text-[14px] text-slate-400 bg-slate-900 p-3 rounded-xl border border-slate-800">
                <MapPin className="w-5 h-5 ml-3 text-emerald-500" />
                <span className="font-medium">المدينة:</span> 
                <span className="mr-2 text-slate-100">{inst.city}</span>
              </li>
              <li className="flex items-center text-[14px] text-slate-400 bg-slate-900 p-3 rounded-xl border border-slate-800">
                <Calendar className="w-5 h-5 ml-3 text-emerald-500" />
                <span className="font-medium">أضيفت يوم:</span> 
                <span className="mr-2 text-slate-100">{new Date(inst.created_at).toLocaleDateString('ar-MA')}</span>
              </li>
            </ul>
            
            {inst.apply_link ? (
              <a 
                href={inst.apply_link.startsWith('http') ? inst.apply_link : `https://${inst.apply_link}`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 text-white h-12 rounded-xl font-semibold hover:bg-emerald-700 transition shadow-sm"
              >
                قدم الآن <ExternalLink className="w-4 h-4 mr-1" />
              </a>
            ) : (
              <button disabled className="w-full inline-flex items-center justify-center bg-slate-900 text-slate-500 h-12 rounded-xl font-semibold cursor-not-allowed">
                التسجيل مغلق
              </button>
            )}
          </div>

          {related && related.length > 0 && (
            <div className="bg-[#0B1120] rounded-3xl p-6 border border-slate-800 shadow-sm relative overflow-hidden">
              {/* Decorative background element behind text */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-[100px] -z-10 opacity-50 pointer-events-none" />
              <h3 className="font-bold text-slate-100 text-[16px] mb-5 relative z-10">مؤسسات ذات صلة</h3>
              <div className="space-y-4 relative z-10">
                {related.map((rel) => (
                  <Link key={rel.slug} href={`/institution/${rel.slug}`} className="flex items-center gap-4 group p-2 hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-700">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-900 border border-slate-700 shadow-sm">
                       <Image 
                          src={rel.image_url || `https://picsum.photos/seed/${rel.slug}/100/100`} 
                          alt={rel.name} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-300" 
                          referrerPolicy="no-referrer"
                          unoptimized={!rel.image_url}
                        />
                    </div>
                    <div className="flex-1">
                      <span className="text-[14px] font-bold text-slate-200 group-hover:text-emerald-400 line-clamp-2 leading-snug transition-colors">
                        {rel.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
