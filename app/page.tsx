import { HomeClient } from '@/components/HomeClient';
import { CATEGORIES } from '@/lib/supabase';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Space Themed Hero Section */}
      <section className="relative w-full overflow-hidden bg-[#050A1A] text-center pt-24 pb-48 flex flex-col items-center justify-center min-h-[85vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-[#050A1A] to-[#050A1A] text-slate-100">
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

        {/* Decorative Space Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           {/* Stars */}
           <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 bg-white rounded-full opacity-70 shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]"></div>
           <div className="absolute top-[40%] right-[20%] w-2 h-2 bg-purple-400 rounded-full opacity-60 shadow-[0_0_15px_3px_rgba(168,85,247,0.8)]"></div>
           <div className="absolute top-[60%] left-[30%] w-1 h-1 bg-cyan-300 rounded-full opacity-80 shadow-[0_0_8px_1px_rgba(34,211,238,0.8)]"></div>
           <div className="absolute top-[10%] right-[35%] w-1.5 h-1.5 bg-pink-400 rounded-full opacity-50"></div>
           <div className="absolute bottom-[30%] left-[5%] w-2 h-2 bg-blue-300 rounded-full opacity-60"></div>
           <div className="absolute top-[70%] right-[10%] w-1.5 h-1.5 bg-white rounded-full opacity-40"></div>
           <div className="absolute bottom-[10%] left-[45%] w-2 h-2 bg-emerald-300 rounded-full opacity-50 shadow-[0_0_8px_1px_rgba(52,211,153,0.8)]"></div>
           
           {/* Glows / Nebulas */}
           <div className="absolute top-[25%] left-[10%] w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-800/10 rounded-[30%_70%_50%_50%] blur-3xl"></div>
           <div className="absolute top-[15%] right-[15%] w-80 h-80 bg-gradient-to-tr from-cyan-500/5 to-blue-800/10 rounded-[40%_60%_70%_30%] blur-3xl"></div>
           <div className="absolute bottom-[-10%] left-[50%] -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-t from-indigo-600/10 to-transparent blur-3xl mix-blend-screen overflow-hidden"></div>
           
           {/* Placeholder for floating islands (abstract geometric shapes) */}
           <div className="absolute top-[40%] left-[5%] w-32 h-20 bg-gradient-to-b from-indigo-800/40 to-[#050A1A] rounded-t-xl rotate-[-10deg] blur-[2px] opacity-60 border-t border-indigo-500/30"></div>
           <div className="absolute top-[30%] right-[5%] w-24 h-16 bg-gradient-to-b from-purple-800/40 to-[#050A1A] rounded-t-xl rotate-[15deg] blur-[2px] opacity-60 border-t border-purple-500/30"></div>
        </div>

        <div className="relative z-10 w-[90%] max-w-[1000px] mx-auto flex flex-col items-center">
          <span className="text-purple-400 font-medium tracking-[0.2em] text-[14px] md:text-[16px] mb-8 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] uppercase">
            توجيه • دراسة • بناء المستقبل
          </span>
          
          <h1 className="text-[40px] md:text-[60px] lg:text-[72px] font-extrabold tracking-[-0.03em] text-white mb-6 leading-[1.1] drop-shadow-xl max-w-[800px]">
            اكتشف مسارك في المغرب
          </h1>
          
          <p className="text-[16px] md:text-[20px] text-slate-300/80 max-w-[650px] mx-auto mb-16 leading-relaxed font-light">
            ابحث في جميع المؤسسات التعليمية، من مراكز التكوين المهني إلى مدارس الهندسة الكبرى. بوابتك نحو الاحتراف تبدأ من هنا.
          </p>

          <div className="w-full max-w-[900px] mx-auto relative group">
            {/* Soft highlight behind the search box */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 via-indigo-500/30 to-purple-500/30 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
               <HomeClient />
            </div>
          </div>
          
          <div className="absolute -bottom-24 flex flex-col items-center text-slate-400 text-[11px] uppercase tracking-[0.2em] animate-pulse">
            <span className="mb-3">التمرير للاسفل للبدء</span>
            <div className="w-px h-16 bg-gradient-to-b from-slate-400/80 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Explore Categories Section */}
      <section className="w-[90%] max-w-[1200px] mx-auto py-24 pb-32">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-[18px] font-bold text-slate-100">استكشف حسب الفئة</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/category/${cat.id}`}
              className="bg-[#0B1120] rounded-2xl border border-slate-800/80 overflow-hidden hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.15)] hover:border-emerald-500/30 transition-all duration-300 group flex flex-col relative"
            >
              <div className="h-[160px] bg-slate-900 w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent z-10" />
                <Image 
                  src={`https://picsum.photos/seed/${cat.id}/400/200`} 
                  alt={cat.label} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-110" 
                  referrerPolicy="no-referrer"
                  unoptimized
                />
              </div>
              <div className="p-6 flex flex-col flex-grow relative z-20">
                <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded inline-block self-start mb-2">فئة</span>
                <h3 className="text-[16px] font-bold text-slate-100 mb-2">
                  {cat.label}
                </h3>
                <p className="text-[13px] text-slate-400 m-0 leading-relaxed">
                  عرض جميع المؤسسات في هذه الفئة.
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
