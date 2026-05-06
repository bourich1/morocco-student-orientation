import type {Metadata} from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { SmoothScroll } from '@/components/SmoothScroll';

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-sans', weight: ['300', '400', '500', '600', '700', '800'] });

export const metadata: Metadata = {
  title: 'توجيه المغرب',
  description: 'اكتشف جميع المؤسسات التعليمية في المغرب.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} font-sans min-h-screen flex flex-col bg-[#030712] text-slate-100 relative selection:bg-emerald-500/30 selection:text-emerald-200`} suppressHydrationWarning>
        <SmoothScroll>
          {/* Advanced Background System */}
          <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden" suppressHydrationWarning>
            {/* Base Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
            
            {/* Radial Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full opacity-30"></div>
            
            {/* Noise Texture */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          </div>

          <Navbar />
          <main className="flex-grow w-full flex flex-col relative z-10">
            {children}
          </main>
          
          <footer className="bg-[#030712] border-t border-white/5 py-12 mt-auto text-center relative z-20">
            <div className="w-[95%] md:w-[90%] max-w-[1200px] mx-auto">
              <p className="text-[14px] text-slate-500 font-black tracking-widest uppercase mb-2">
                توجيه المغرب • {new Date().getFullYear()}
              </p>
              <p className="text-[12px] text-slate-600 font-medium">
                جميع الحقوق محفوظة للمنصة الوطنية للتوجيه التربوي الرقمية
              </p>
            </div>
          </footer>
        </SmoothScroll>
      </body>
    </html>
  );
}
