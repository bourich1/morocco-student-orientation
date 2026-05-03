'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, CATEGORIES, isSupabaseConfigured, Institution } from '@/lib/supabase';
import { ChevronRight, GraduationCap, MapPin } from 'lucide-react';
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
    <div className="w-full bg-[#0B1120]/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] p-6 relative text-start">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 flex flex-col gap-2 w-full relative">
          <label className="text-[12px] font-semibold uppercase tracking-[0.05em] text-slate-400">الخطوة 1: اختر الفئة</label>
          <select
            className="w-full h-12 bg-slate-900/50 border border-slate-700 rounded-lg px-4 text-[14px] text-slate-100 appearance-none outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSlug('');
            }}
          >
            <option value="" disabled>جميع الفئات</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 flex flex-col gap-2 w-full relative">
          <label className="text-[12px] font-semibold uppercase tracking-[0.05em] text-slate-400">الخطوة 2: اختر المؤسسة</label>
          <select
            className="w-full h-12 bg-slate-900/50 border border-slate-700 rounded-lg px-4 text-[14px] text-slate-100 appearance-none outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            disabled={!selectedCategory || loading}
          >
            <option value="">{loading ? "جاري التحميل..." : "ابدأ الكتابة أو اختر..."}</option>
            {institutions.map((inst) => (
              <option key={inst.id} value={inst.slug}>{inst.name} ({inst.city})</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGo}
          disabled={!selectedCategory}
          className="h-12 bg-emerald-600 text-white rounded-lg px-8 font-semibold text-[15px] hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 md:mt-0 whitespace-nowrap w-full md:w-auto"
        >
          استكشاف البرامج
        </button>
      </div>
      
      {selectedCategory && !selectedSlug && (
        <p className="mt-4 text-[13px] text-slate-500 text-center absolute -bottom-8 left-0 right-0">
          انقر على &quot;استكشاف البرامج&quot; لرؤية جميع المؤسسات في هذه الفئة.
        </p>
      )}
    </div>
  );
}
