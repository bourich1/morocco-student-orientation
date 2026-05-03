import { supabase, isSupabaseConfigured, CATEGORIES } from '@/lib/supabase';
import { SetupRequired } from '@/components/SetupRequired';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowRight, MapPin, Building2 } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const categoryInfo = CATEGORIES.find(c => c.id === category);
  if (!categoryInfo) {
    return { title: 'الفئة غير موجودة' };
  }
  return {
    title: `${categoryInfo.label} في المغرب | توجيه المغرب`,
    description: `استكشف جميع ${categoryInfo.label} في المغرب. دليلك الشامل للتوجيه.`
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  
  if (!isSupabaseConfigured) {
    return <SetupRequired />;
  }

  const categoryInfo = CATEGORIES.find(c => c.id === category);
  if (!categoryInfo) {
    notFound();
  }

  const { data: institutions, error } = await supabase!
    .from('institutions')
    .select('*')
    .eq('category', category)
    .order('name');

  return (
    <div className="w-full pb-32">
      {/* Category Header */}
      <section className="relative w-full pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full opacity-50"></div>
        </div>

        <div className="relative z-10 w-[90%] max-w-[1200px] mx-auto">
          <Link href="/" className="group inline-flex items-center gap-2 text-[13px] font-bold text-emerald-400 mb-8 hover:text-emerald-300 transition-colors">
            <ArrowRight className="w-4 h-4" /> العودة للرئيسية
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-[40px] md:text-[64px] font-black text-white tracking-tight leading-tight">
                {categoryInfo.label}
              </h1>
              <p className="text-[18px] md:text-[20px] text-slate-400 mt-4 max-w-[600px] font-medium">
                اكتشف نخبة المؤسسات التعليمية في مجال {categoryInfo.label} عبر ربوع المملكة.
              </p>
            </div>
            
            <div className="px-6 py-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-[32px] font-black text-white">{institutions?.length || 0}</span>
                <span className="text-[14px] font-bold text-slate-500 mr-2 uppercase tracking-widest">مؤسسة تعليمية</span>
            </div>
          </div>
        </div>
      </section>

      <section className="w-[90%] max-w-[1200px] mx-auto mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {institutions && institutions.length > 0 ? (
            institutions.map((inst) => (
              <Link 
                key={inst.id} 
                href={`/institution/${inst.slug}`}
                className="group relative bg-[#0B1120]/40 rounded-[2.5rem] border border-white/5 overflow-hidden transition-all duration-500 hover:border-emerald-500/30 hover:shadow-[0_20px_50px_-20px_rgba(16,185,129,0.2)] flex flex-col h-full"
              >
                <div className="aspect-video relative overflow-hidden flex-shrink-0">
                  <Image 
                    src={inst.image_url || `https://picsum.photos/seed/${inst.id}/800/450`} 
                    alt={inst.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" 
                    referrerPolicy="no-referrer"
                    unoptimized={!inst.image_url}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent"></div>
                  
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" />
                    {inst.city}
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-[20px] font-black text-white mb-3 group-hover:text-emerald-400 transition-colors line-clamp-1 leading-tight">
                    {inst.name}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-slate-400 line-clamp-2 m-0 font-medium min-h-[42px]">
                    {inst.description || "استكشف الفرص التعليمية المتاحة في هذه المؤسسة الرائدة."}
                  </p>
                  
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[12px] font-bold text-emerald-500">
                        عرض التفاصيل <ArrowRight className="w-4 h-4 rotate-180" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors">
                        <Building2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full border border-dashed border-white/10 text-center py-32 bg-white/5 rounded-[3rem]">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 text-slate-600">
                    <Building2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">قريباً في هذه الفئة</h3>
                <p className="text-slate-400 max-w-[400px] mx-auto">نعمل حالياً على إضافة أفضل المؤسسات التعليمية في هذا المجال. يرجى العودة لاحقاً.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
