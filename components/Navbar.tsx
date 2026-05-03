import Link from 'next/link';
import Image from 'next/image';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full h-[80px] bg-[#030712]/70 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      <div className="w-[90%] max-w-[1200px] mx-auto h-full flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02] active:scale-95">
          <div className="relative w-28 h-10 sm:w-36 sm:h-14">
            <Image 
              src="/lycee-logo.png" 
              alt="Logo" 
              fill 
              className="object-contain filter brightness-110"
              referrerPolicy="no-referrer"
              priority
            />
          </div>
        </Link>
        
        <div className="flex items-center gap-8">
          <Link 
            href="/" 
            className="text-[14px] font-semibold text-slate-400 hover:text-emerald-400 transition-colors relative group"
          >
            الرئيسية
            <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
          </Link>
          
          <Link 
            href="/dashboard"
            className="relative inline-flex items-center justify-center px-6 py-2.5 text-[13px] font-bold text-white overflow-hidden rounded-full group bg-slate-900 border border-white/10 hover:border-emerald-500/50 transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            <span className="relative z-10">لوحة القيادة</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
