import Link from 'next/link';
import Image from 'next/image';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full h-[72px] bg-[#030712]/80 backdrop-blur-md border-b border-slate-800 shadow-sm">
      <div className="w-[90%] max-w-[1200px] mx-auto h-full flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-24 h-12 sm:w-32 sm:h-16">
            <Image 
              src="/lycee-logo.png" 
              alt="Logo" 
              fill 
              className="object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </Link>
        <div className="flex gap-6 text-[14px] font-medium items-center">
          <Link href="/" className="text-emerald-600 no-underline">الرئيسية</Link>
          <Link 
            href="/dashboard"
            className="bg-slate-800 text-white px-3 py-1 rounded-full text-[12px] hover:bg-slate-700 transition"
          >
            لوحة القيادة
          </Link>
        </div>
      </div>
    </nav>
  );
}
