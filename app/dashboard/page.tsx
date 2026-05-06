'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured, CATEGORIES, Institution } from '@/lib/supabase';
import { SetupRequired } from '@/components/SetupRequired';
import { LogOut, Plus, Edit2, Trash2, LayoutDashboard, Building2, MapPin, ExternalLink, Search } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

export default function Dashboard() {
  const router = useRouter();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [formData, setFormData] = useState<Partial<Institution>>({
    name: '', slug: '', category: 'university', description: '', fields: [], city: '', image_url: '', apply_link: ''
  });
  const [fieldsText, setFieldsText] = useState('');

  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchInstitutions = async () => {
    setLoading(true);
    const { data } = await supabase!.from('institutions').select('*').order('created_at', { ascending: false });
    if (data) setInstitutions(data as Institution[]);
    setLoading(false);
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const checkSession = async () => {
      const { data: { session } } = await supabase!.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        fetchInstitutions();
      }
    };
    checkSession();
  }, [router]);

  const handleLogout = async () => {
    await supabase!.auth.signOut();
    router.push('/login');
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setLoading(true);
    await supabase!.from('institutions').delete().eq('id', itemToDelete);
    setItemToDelete(null);
    fetchInstitutions();
  };

  const handleEdit = (inst: Institution) => {
    setIsEditing(inst.id);
    setFormData(inst);
    setFieldsText(inst.fields ? inst.fields.join(', ') : '');
    setFormError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generateSlug = (name: string, city: string) => {
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const combined = `${name} ${city} ${randomSuffix}`;
    // Support Arabic and Latin characters in slugs
    return combined.toLowerCase()
      .replace(/[^\u0600-\u06FFa-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleError = (error: any) => {
    if (error.code === '23505') {
      setFormError('هذه المؤسسة موجودة بالفعل (أو الاسم مستخدم). يرجى تغيير الاسم.');
    } else {
      setFormError(error.message);
    }
    setLoading(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const fieldsArray = fieldsText.split(',').map(f => f.trim()).filter(Boolean);
    const payload = {
      ...formData,
      slug: formData.slug || generateSlug(formData.name || '', formData.city || ''),
      fields: fieldsArray
    };

    setFormError(null);
    if (isEditing) {
      const { error } = await supabase!.from('institutions').update(payload).eq('id', isEditing);
      if (error) return handleError(error);
    } else {
      const { error } = await supabase!.from('institutions').insert([payload]);
      if (error) return handleError(error);
    }

    setFormData({ name: '', slug: '', category: 'university', description: '', fields: [], city: '', image_url: '', apply_link: '' });
    setFieldsText('');
    setIsEditing(null);
    fetchInstitutions();
  };

  const filteredInstitutions = institutions.filter(inst => 
    inst.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inst.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isSupabaseConfigured) return <SetupRequired />;

  return (
    <div className="w-full pb-24">
      {/* Dashboard Header */}
      <div className="bg-[#0B1120]/40 backdrop-blur-xl border-b border-white/5 py-12 mb-12">
        <div className="w-[95%] md:w-[90%] max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-3xl flex items-center justify-center">
                <LayoutDashboard className="w-8 h-8" />
            </div>
            <div>
                <h1 className="text-[32px] font-black text-white tracking-tight leading-none mb-2">لوحة القيادة</h1>
                <p className="text-slate-500 font-bold text-[14px] uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    إدارة المحتوى والمؤسسات
                </p>
            </div>
          </div>
          
          <button onClick={handleLogout} className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[14px] font-bold text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all active:scale-95">
            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> تسجيل الخروج
          </button>
        </div>
      </div>

      <div className="w-[95%] md:w-[90%] max-w-[1400px] mx-auto space-y-12">
        {/* Form Section - Now Full Width (90%) and Top-Centered */}
        <section className="flex justify-center">
            <div className="w-full bg-[#0B1120]/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 p-10 md:p-14 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-bl-full pointer-events-none"></div>
              
              <h2 className="text-[24px] font-black text-white mb-10 flex items-center gap-3 relative z-10">
                {isEditing ? <Edit2 className="w-7 h-7 text-emerald-500"/> : <Plus className="w-7 h-7 text-emerald-500"/>}
                {isEditing ? 'تعديل بيانات المؤسسة' : 'إضافة مؤسسة جديدة'}
              </h2>

              {formError && (
                <div className="mb-8 p-4 bg-red-500/10 text-red-400 text-[13px] font-bold rounded-2xl border border-red-500/20 animate-in fade-in slide-in-from-top-2 relative z-10" dir="rtl">
                  ⚠️ {formError}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-8 relative z-10" dir="rtl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="block text-[12px] font-black uppercase tracking-widest text-slate-500 mr-2">اسم المؤسسة <span className="text-red-500">*</span></label>
                        <input 
                            type="text" required value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full h-14 px-6 bg-white/5 border border-white/5 rounded-2xl text-white text-[15px] font-medium focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700" 
                            placeholder="مثال: جامعة محمد الخامس"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[12px] font-black uppercase tracking-widest text-slate-500 mr-2">المدينة <span className="text-red-500">*</span></label>
                        <input 
                            type="text" required value={formData.city} 
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            className="w-full h-14 px-6 bg-white/5 border border-white/5 rounded-2xl text-white text-[15px] font-medium focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700" 
                            placeholder="الرباط"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[12px] font-black uppercase tracking-widest text-slate-500 mr-2">الفئة</label>
                        <select 
                            value={formData.category} 
                            onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                            className="w-full h-14 px-6 bg-white/5 border border-white/5 rounded-2xl text-white text-[15px] font-medium focus:border-emerald-500/50 outline-none transition-all appearance-none cursor-pointer"
                        >
                            {CATEGORIES.map(c => <option key={c.id} value={c.id} className="bg-[#030712]">{c.label}</option>)}
                        </select>
                    </div>
                    {/* Removed image_url input */}
                    {/* Removed apply_link input */}
                    <div className="space-y-2">
                        <label className="block text-[12px] font-black uppercase tracking-widest text-slate-500 mr-2">التخصصات (مفصولة بفاصلة)</label>
                        <input 
                            type="text"
                            value={fieldsText} 
                            onChange={(e) => setFieldsText(e.target.value)}
                            className="w-full h-14 px-6 bg-white/5 border border-white/5 rounded-2xl text-white text-[15px] font-medium focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700" 
                            placeholder="الهندسة، الطب، التجارة..."
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-[12px] font-black uppercase tracking-widest text-slate-500 mr-2">الوصف</label>
                    <textarea 
                        value={formData.description} 
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full p-6 bg-white/5 border border-white/5 rounded-2xl text-white text-[15px] font-medium focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700 min-h-[120px]" 
                        placeholder="اكتب وصفاً مختصراً للمؤسسة..."
                    />
                </div>
                
                <div className="flex gap-6 pt-4">
                  <button disabled={loading} type="submit" className="flex-1 bg-emerald-500 text-slate-950 h-16 rounded-2xl text-[16px] font-black hover:bg-emerald-400 transition-all shadow-xl active:scale-95 disabled:opacity-50">
                    {isEditing ? 'حفظ التغييرات' : 'إنشاء المؤسسة'}
                  </button>
                  {isEditing && (
                    <button type="button" onClick={() => { setIsEditing(null); setFormData({ category: 'university' }); setFieldsText(''); setFormError(null); }} className="px-10 h-16 bg-white/5 border border-white/10 rounded-2xl text-slate-300 text-[15px] font-bold hover:bg-white/10 transition-all">
                      إلغاء
                    </button>
                  )}
                </div>
              </form>
            </div>
        </section>

        {/* List Section - Now Below the Form, Full Width */}
        <section className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <h2 className="font-black text-white text-[24px]">قائمة المؤسسات المسجلة</h2>
                <div className="relative group/search w-full md:w-[400px]">
                    <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/search:text-emerald-400 transition-colors w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="ابحث عن مؤسسة أو مدينة..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-14 pr-14 pl-6 bg-[#0B1120]/40 backdrop-blur-xl border border-white/5 rounded-2xl text-white text-[15px] font-medium focus:border-emerald-500/30 outline-none transition-all"
                        dir="rtl"
                    />
                </div>
            </div>

            <div className="bg-[#0B1120]/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse" dir="rtl">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="px-8 py-6 text-[12px] font-black text-slate-500 uppercase tracking-widest">المؤسسة</th>
                                <th className="px-8 py-6 text-[12px] font-black text-slate-500 uppercase tracking-widest">المدينة</th>
                                <th className="px-8 py-6 text-[12px] font-black text-slate-500 uppercase tracking-widest">الفئة</th>
                                <th className="px-8 py-6 text-[12px] font-black text-slate-500 uppercase tracking-widest text-left">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading && institutions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                                            <span className="text-[14px] font-bold text-slate-500">جاري تحميل البيانات...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredInstitutions.map(inst => (
                                    <tr key={inst.id} className="hover:bg-white/5 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden flex items-center justify-center border border-white/5 flex-shrink-0">
                                                    {inst.image_url ? (
                                                        <img src={inst.image_url} alt="" className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                                                    ) : (
                                                        <Building2 className="text-slate-600 w-5 h-5" />
                                                    )}
                                                </div>
                                                <span className="font-black text-[15px] text-white group-hover:text-emerald-400 transition-colors truncate max-w-[300px]">
                                                    {inst.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[14px] font-bold text-slate-400 flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-slate-600" /> {inst.city}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[12px] font-black text-emerald-500/70 uppercase tracking-widest bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
                                                {CATEGORIES.find(c => c.id === inst.category)?.label || inst.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 justify-end">
                                                <Link 
                                                    href={`/institution/${inst.slug}`}
                                                    target="_blank"
                                                    className="p-3 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all"
                                                >
                                                    <ExternalLink size={18} />
                                                </Link>
                                                <button 
                                                    onClick={() => handleEdit(inst)} 
                                                    className="p-3 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(inst.id)} 
                                                    className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && filteredInstitutions.length === 0 && (
                    <div className="p-20 text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-slate-700">
                            <Search size={32} />
                        </div>
                        <h3 className="text-white font-black">لا توجد مؤسسات مطابقة</h3>
                        <p className="text-slate-500 text-[14px]">لم نجد أي مؤسسة بهذا الاسم في قاعدة البيانات.</p>
                    </div>
                )}
            </div>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {itemToDelete && (
          <div className="fixed inset-0 bg-[#030712]/90 flex items-center justify-center z-[100] p-6 backdrop-blur-md">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#0B1120] rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 text-right border border-white/5 relative overflow-hidden" 
                dir="rtl"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-full"></div>
              
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mb-6 relative z-10">
                  <Trash2 className="w-8 h-8" />
              </div>
              
              <h3 className="text-[24px] font-black text-white mb-3 relative z-10">تأكيد الحذف</h3>
              <p className="text-[15px] font-medium text-slate-400 mb-10 leading-relaxed relative z-10">
                هل أنت متأكد من رغبتك في حذف هذه المؤسسة؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
              
              <div className="flex gap-4 justify-end relative z-10">
                <button onClick={() => setItemToDelete(null)} className="flex-1 h-14 font-bold text-slate-400 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">إلغاء</button>
                <button onClick={confirmDelete} className="flex-1 h-14 font-black text-white bg-red-600 hover:bg-red-500 rounded-2xl transition-all shadow-xl active:scale-95">حذف نهائي</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
