import Link from 'next/link';
import Image from 'next/image';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full h-[80px] bg-[#030712]/70 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      <div className="w-[95%] md:w-[90%] max-w-[1200px] mx-auto h-full flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02] active:scale-95">
          <div className="relative w-28 h-10 sm:w-36 sm:h-14">
            <Image 
              src="/logo-white.png" 
              alt="Logo" 
              fill 
              className="object-contain"
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
        </div>
      </div>
    </nav>
  );
}
