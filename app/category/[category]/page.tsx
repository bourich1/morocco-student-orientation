import { supabase, isSupabaseConfigured, CATEGORIES } from '@/lib/supabase';
import { SetupRequired } from '@/components/SetupRequired';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

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
    <div className="w-[90%] max-w-[1200px] mx-auto py-6 pt-12 pb-20">
      <div className="mb-10">
        <Link href="/" className="text-[13px] text-emerald-400 hover:underline mb-4 inline-block font-semibold">
          &rarr; العودة للرئيسية
        </Link>
        <h1 className="text-[32px] font-extrabold tracking-[-0.02em] text-slate-100 mb-2">{categoryInfo.label}</h1>
        <p className="text-[18px] text-slate-400">
          تم العثور على {institutions?.length || 0} مؤسسة في هذه الفئة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {institutions && institutions.length > 0 ? (
          institutions.map((inst) => (
            <Link 
              key={inst.id} 
              href={`/institution/${inst.slug}`}
              className="bg-[#0B1120] rounded-2xl border border-slate-800/80 overflow-hidden hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.15)] hover:border-emerald-500/30 transition-all duration-300 flex flex-col group relative"
            >
              <div className="relative h-[160px] w-full bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent z-10" />
                <Image 
                  src={inst.image_url || `https://picsum.photos/seed/${inst.id}/600/400`} 
                  alt={inst.name} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-110" 
                  referrerPolicy="no-referrer"
                  unoptimized={!inst.image_url} // If using picsum
                />
              </div>
              <div className="p-6 flex flex-col flex-grow relative z-20">
                <div className="mb-2">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded inline-block">
                    {inst.city}
                  </span>
                </div>
                <h3 className="text-[16px] font-bold text-slate-100 mb-2 line-clamp-1">
                  {inst.name}
                </h3>
                <p className="text-[13px] text-slate-400 line-clamp-3 m-0 leading-relaxed">
                  {inst.description}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full border border-slate-800 text-center py-20 bg-[#0B1120] rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold text-slate-200 mb-2">لم يتم العثور على أي مؤسسة.</h3>
            <p className="text-slate-400">لا توجد بيانات حالياً في هذه الفئة.</p>
          </div>
        )}
      </div>
    </div>
  );
}
