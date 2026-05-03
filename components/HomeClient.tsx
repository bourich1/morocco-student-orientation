'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, CATEGORIES, isSupabaseConfigured, Institution } from '@/lib/supabase';
import { Search, MapPin, Sparkles } from 'lucide-react';
import { SetupRequired } from './SetupRequired';

export function HomeClient() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !selectedCategory) {
      return;
    }

    const fetchInstitutions = async () => {
      setLoading(true);
      const { data, error } = await supabase!
        .from('institutions')
        .select('id, name, slug, city')
        .eq('category', selectedCategory)
        .order('name');
      
      if (!error && data) {
        setInstitutions(data as Institution[]);
      }
      setLoading(false);
    };

    fetchInstitutions();
  }, [selectedCategory]);

  const handleGo = () => {
    if (selectedSlug) {
      router.push(`/institution/${selectedSlug}`);
    } else if (selectedCategory) {
      router.push(`/category/${selectedCategory}`);
    }
  };

  if (!isSupabaseConfigured) {
    return <SetupRequired />;
  }

  return (
    <div className="w-full relative">
      <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 via-cyan-500/10 to-indigo-500/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative w-full bg-[#030712]/60 backdrop-blur-2xl rounded-[2rem] border border-white/10 p-2 md:p-3 shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-2">
          {/* Step 1: Category Selection */}
          <div className="relative flex-1 w-full group/field">
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500 group-focus-within/field:text-emerald-400 transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <select
              className="w-full h-14 md:h-16 bg-transparent border-none pr-11 pl-4 text-[14px] md:text-[15px] font-medium text-slate-200 appearance-none outline-none cursor-pointer"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSlug('');
              }}
            >
              <option value="" disabled className="bg-[#030712]">الخطوة 1: اختر الفئة</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#030712]">{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="hidden md:block w-px h-8 bg-white/10"></div>

          {/* Step 2: Institution Selection */}
          <div className="relative flex-[1.5] w-full group/field">
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500 group-focus-within/field:text-emerald-400 transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <select
              className="w-full h-14 md:h-16 bg-transparent border-none pr-11 pl-4 text-[14px] md:text-[15px] font-medium text-slate-200 appearance-none outline-none cursor-pointer disabled:opacity-40"
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              disabled={!selectedCategory || loading}
            >
              <option value="" className="bg-[#030712]">{loading ? "جاري التحميل..." : "الخطوة 2: اختر المؤسسة"}</option>
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.slug} className="bg-[#030712]">{inst.name} ({inst.city})</option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            onClick={handleGo}
            disabled={!selectedCategory}
            className="w-full md:w-auto h-14 md:h-16 px-10 rounded-[1.5rem] bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-900 font-bold text-[15px] transition-all duration-300 shadow-[0_8px_20px_-4px_rgba(16,185,129,0.3)] disabled:shadow-none flex items-center justify-center gap-2 active:scale-95"
          >
            <span>بحث</span>
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>
      
      {selectedCategory && !selectedSlug && (
        <div className="absolute -bottom-10 left-0 right-0 flex justify-center opacity-0 animate-in fade-in slide-in-from-top-2 duration-500 fill-mode-forwards">
          <p className="text-[12px] font-medium text-emerald-400/60 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            انقر على بحث لرؤية جميع المؤسسات في {CATEGORIES.find(c => c.id === selectedCategory)?.label}
          </p>
        </div>
      )}
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
    )
}
