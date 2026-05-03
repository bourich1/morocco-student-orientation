import type {Metadata} from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-sans', weight: ['300', '400', '500', '600', '700', '800'] });

export const metadata: Metadata = {
  title: 'توجيه المغرب',
  description: 'اكتشف جميع المؤسسات التعليمية في المغرب.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} font-sans min-h-screen flex flex-col bg-[#030712] text-slate-100 relative z-0`} suppressHydrationWarning>
        {/* Global Background Grid */}
        <div className="fixed inset-0 w-full min-h-screen bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(circle_800px_at_50%_0%,#000_100%,transparent_100%)] pointer-events-none -z-10"></div>
        <Navbar />
        <main className="flex-grow w-full flex flex-col relative z-10">
          {children}
        </main>
        <footer className="bg-[#0B1120] border-t border-slate-800 py-5 mt-auto text-center text-[12px] text-slate-400">
          <p>© {new Date().getFullYear()} توجيه المغرب • منصة التوجيه التربوي • مدعوم بـ Next.js و Supabase</p>
        </footer>
      </body>
    </html>
  );
}
