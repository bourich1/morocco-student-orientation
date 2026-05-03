'use client';

import { Share2, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ShareButton({ title, text }: { title: string, text: string }) {
  const [shared, setShared] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    // Get the current URL only on the client side
    setUrl(window.location.href);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (err) {
        console.log('Failed to copy', err);
      }
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="w-full h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center gap-2 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
    >
      {shared ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
      {shared ? 'تم نسخ الرابط!' : 'مشاركة المؤسسة'}
    </button>
  );
}
