'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Lock, Mail, ShieldCheck } from 'lucide-react';
import { SetupRequired } from '@/components/SetupRequired';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    if (isSupabaseConfigured && supabase) {
      supabase!.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          router.push('/dashboard');
        }
      });
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !supabase) return;

    setLoading(true);
    setError(null);

    const { error } = await supabase!.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  if (!isSupabaseConfigured) {
    return <SetupRequired />;
  }

  return (
    <div className="flex items-center justify-center min-h-[85vh] relative px-4 overflow-hidden">
      {/* Abstract Background for Login */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-[480px] relative z-10">
        <div className="bg-[#0B1120]/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 p-10 md:p-14 shadow-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full group-hover:w-40 group-hover:h-40 transition-all duration-700"></div>
          
          <div className="text-center mb-12 relative z-10">
            <div className="mx-auto w-16 h-16 bg-white/5 border border-white/10 text-emerald-400 rounded-3xl flex items-center justify-center mb-8 rotate-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-[32px] font-black text-white tracking-tight">بوابة الإدارة</h1>
            <p className="text-[14px] font-medium text-slate-500 mt-3">سجل الدخول لإدارة المؤسسات والبيانات.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 text-red-400 text-[13px] font-bold rounded-2xl border border-red-500/20 animate-in fade-in slide-in-from-top-2">
              ⚠️ {error === 'Invalid login credentials' ? 'بيانات الدخول غير صحيحة' : error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6 text-right" dir="rtl">
            <div className="space-y-2">
              <label className="block text-[12px] font-black uppercase tracking-widest text-slate-500 mr-2">البريد الإلكتروني</label>
              <div className="relative group/input">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within/input:text-emerald-400 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-14 pr-12 pl-4 bg-white/5 border border-white/5 rounded-2xl text-white text-[15px] font-medium focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-600 text-right"
                  placeholder="admin@orientamaroc.com"
                  dir="ltr"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-[12px] font-black uppercase tracking-widest text-slate-500 mr-2">كلمة المرور</label>
              <div className="relative group/input">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within/input:text-emerald-400 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-14 pr-12 pl-4 bg-white/5 border border-white/5 rounded-2xl text-white text-[15px] font-medium focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-600 text-right"
                  placeholder="••••••••"
                  dir="ltr"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-emerald-500 text-slate-950 font-black rounded-2xl hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] active:scale-95 mt-10"
            >
              {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
            </button>
          </form>
        </div>
        
        <p className="text-center mt-12 text-[12px] font-bold text-slate-600 uppercase tracking-widest">
            توجيه المغرب • الوصول مقيد للمسؤولين فقط
        </p>
      </div>
    </div>
  );
}
