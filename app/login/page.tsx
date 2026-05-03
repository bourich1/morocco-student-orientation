'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Lock, Mail } from 'lucide-react';
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
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-[400px] bg-[#0B1120] rounded-2xl shadow-xl border border-slate-800 p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-[24px] font-extrabold text-slate-100">تسجيل دخول المسؤول</h1>
          <p className="text-[14px] text-slate-400 mt-2">قم بتسجيل الدخول لإدارة المؤسسات.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 text-red-400 text-sm rounded-lg border border-red-900/50">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-right" dir="rtl">
          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wide text-slate-400 mb-2">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 pr-10 pl-4 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-[14px] focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-right placeholder:text-slate-500"
                placeholder="admin@orientamaroc.com"
                dir="ltr"
              />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wide text-slate-400 mb-2 mt-4">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 pr-10 pl-4 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-[14px] focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-right placeholder:text-slate-500"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 mt-6"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
