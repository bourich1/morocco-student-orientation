'use client';

import { FileText, Database, ShieldAlert } from 'lucide-react';

export function SetupRequired() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-red-500/10 text-red-500 p-6 rounded-3xl mb-8 inline-flex items-center justify-center border border-red-500/20 rotate-3">
          <Database size={48} />
        </div>
        
        <h1 className="text-[32px] md:text-[48px] font-black text-white mb-6 tracking-tight leading-tight">
          إعداد <span className="text-red-500">Supabase</span> مطلوب
        </h1>
        
        <p className="text-[18px] text-slate-400 max-w-xl mx-auto mb-12 font-medium leading-relaxed">
          تتطلب هذه المنصة ربطاً بقاعدة بيانات Supabase لتعمل بشكل صحيح. يرجى تهيئة المتغيرات البيئية اللازمة.
        </p>

        <div className="bg-[#0B1120]/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 md:p-12 shadow-2xl text-right" dir="rtl">
          <h2 className="text-[20px] font-black mb-8 flex items-center gap-3 text-white">
            <ShieldAlert className="text-red-500 w-6 h-6" /> تعليمات التثبيت
          </h2>
          
          <div className="space-y-8">
            <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center font-black text-[14px]">1</div>
                <div>
                    <p className="text-slate-200 font-bold mb-1 text-[16px]">إنشاء مشروع جديد</p>
                    <p className="text-slate-500 text-[14px]">قم بزيارة <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-red-400 hover:underline">Supabase</a> وأنشئ مشروعاً مجانياً.</p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center font-black text-[14px]">2</div>
                <div>
                    <p className="text-slate-200 font-bold mb-1 text-[16px]">تهيئة الجداول</p>
                    <p className="text-slate-500 text-[14px]">استخدم SQL Editor لتشغيل الأوامر الموجودة في ملف <code>supabase-setup.sql</code>.</p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center font-black text-[14px]">3</div>
                <div>
                    <p className="text-slate-200 font-bold mb-1 text-[16px]">إضافة المفاتيح السرية</p>
                    <p className="text-slate-500 text-[14px] mb-3">أضف المتغيرات التالية في إعدادات المحرر (Secrets):</p>
                    <div className="bg-black/40 border border-white/5 p-4 rounded-2xl font-mono text-[13px] text-red-400 text-left" dir="ltr">
                        <div>NEXT_PUBLIC_SUPABASE_URL</div>
                        <div>NEXT_PUBLIC_SUPABASE_ANON_KEY</div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
