'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured, CATEGORIES, Institution } from '@/lib/supabase';
import { SetupRequired } from '@/components/SetupRequired';
import { LogOut, Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Institution>>({
    name: '', slug: '', category: 'university', description: '', fields: [], city: '', image_url: '', apply_link: ''
  });
  const [fieldsText, setFieldsText] = useState('');

  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

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
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const fieldsArray = fieldsText.split(',').map(f => f.trim()).filter(Boolean);
    const payload = {
      ...formData,
      slug: formData.slug || generateSlug(formData.name || ''),
      fields: fieldsArray
    };

    if (isEditing) {
      await supabase!.from('institutions').update(payload).eq('id', isEditing);
    } else {
      await supabase!.from('institutions').insert([payload]);
    }

    setFormData({ name: '', slug: '', category: 'university', description: '', fields: [], city: '', image_url: '', apply_link: '' });
    setFieldsText('');
    setIsEditing(null);
    fetchInstitutions();
  };

  if (!isSupabaseConfigured) return <SetupRequired />;

  return (
    <div className="w-full py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[24px] font-extrabold text-slate-100">لوحة القيادة</h1>
        <button onClick={handleLogout} className="flex items-center text-[14px] text-slate-400 hover:text-red-400 transition font-medium">
          <LogOut className="w-4 h-4 ml-2" /> تسجيل الخروج
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Panel */}
        <div className="lg:col-span-1 bg-[#0B1120] p-6 rounded-xl border border-slate-800 shadow-[0_1px_2px_rgba(0,0,0,0.3)] h-fit sticky top-24">
          <h2 className="text-[16px] font-bold text-slate-100 mb-4 flex items-center">
            {isEditing ? <Edit2 className="w-4 h-4 ml-2 text-emerald-500"/> : <Plus className="w-4 h-4 ml-2 text-emerald-500"/>}
            {isEditing ? 'تعديل المؤسسة' : 'إضافة مؤسسة جديدة'}
          </h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">الاسم</label>
              <input 
                type="text" required value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-1 w-full p-2 bg-slate-900 border border-slate-700 rounded focus:ring-2 outline-none focus:ring-emerald-500 text-slate-100 text-right" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">الرابط الدائم (Slug) (اختياري)</label>
              <input 
                type="text" value={formData.slug} placeholder="يتم إنشاؤه تلقائياً إذا كان فارغاً"
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                className="mt-1 w-full p-2 bg-slate-900 border border-slate-700 rounded focus:ring-2 outline-none focus:ring-emerald-500 text-slate-100 text-left placeholder:text-slate-500" 
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">الفئة</label>
              <select 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                className="mt-1 w-full p-2 bg-slate-900 border border-slate-700 rounded focus:ring-2 outline-none focus:ring-emerald-500 text-slate-100"
              >
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">المدينة</label>
              <input 
                type="text" required value={formData.city} 
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="mt-1 w-full p-2 bg-slate-900 border border-slate-700 rounded focus:ring-2 outline-none focus:ring-emerald-500 text-slate-100 text-right" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">رابط الصورة</label>
              <div className="flex gap-2">
                 <input 
                  type="url" value={formData.image_url} 
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="mt-1 w-full p-2 bg-slate-900 border border-slate-700 rounded focus:ring-2 outline-none focus:ring-emerald-500 text-slate-100 text-left placeholder:text-slate-500" 
                  placeholder="https://..."
                  dir="ltr"
                />
              </div>
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-300 mb-1">رابط التقديم</label>
               <input 
                type="url" value={formData.apply_link} 
                onChange={(e) => setFormData({...formData, apply_link: e.target.value})}
                className="mt-1 w-full p-2 bg-slate-900 border border-slate-700 rounded focus:ring-2 outline-none focus:ring-emerald-500 text-slate-100 text-left placeholder:text-slate-500" 
                placeholder="https://..."
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">التخصصات (مفصولة بفاصلة)</label>
              <textarea 
                value={fieldsText} 
                onChange={(e) => setFieldsText(e.target.value)}
                className="mt-1 w-full p-2 bg-slate-900 border border-slate-700 rounded focus:ring-2 outline-none focus:ring-emerald-500 text-slate-100 text-right placeholder:text-slate-500" 
                rows={2} placeholder="الهندسة، الطب، التجارة..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">الوصف</label>
              <textarea 
                required value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="mt-1 w-full p-2 bg-slate-900 border border-slate-700 rounded focus:ring-2 outline-none focus:ring-emerald-500 text-slate-100 text-right placeholder:text-slate-500" 
                rows={4}
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <button disabled={loading} type="submit" className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg text-[14px] font-semibold hover:bg-emerald-700 transition">
                {isEditing ? 'حفظ التغييرات' : 'إنشاء'}
              </button>
              {isEditing && (
                <button type="button" onClick={() => { setIsEditing(null); setFormData({ category: 'university' }); }} className="px-4 border border-slate-700 rounded-lg text-slate-300 text-[14px] font-medium hover:bg-slate-800">
                  إلغاء
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Panel */}
        <div className="lg:col-span-2">
          <div className="bg-[#0B1120] rounded-xl border border-slate-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 bg-[#0B1120] flex justify-between items-center">
              <h2 className="font-bold text-slate-100 text-[16px]">المؤسسات ({institutions.length})</h2>
            </div>
            
            {loading && institutions.length === 0 ? (
              <div className="p-8 text-center text-[14px] text-slate-400">جاري تحميل البيانات...</div>
            ) : (
              <div className="divide-y divide-slate-800 max-h-[800px] overflow-y-auto">
                {institutions.map(inst => (
                  <div key={inst.id} className="p-4 hover:bg-slate-900 border-b border-transparent hover:border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition">
                    <div className="flex items-start sm:items-center gap-4 w-full">
                      <div className="w-12 h-12 rounded-lg bg-slate-900 flex-shrink-0 relative overflow-hidden flex items-center justify-center text-slate-500 border border-slate-700">
                        {inst.image_url ? (
                           <img src={inst.image_url} alt="" className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                        ) : (
                           <ImageIcon size={20} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[15px] text-slate-100 leading-tight truncate">
                          <Link href={`/institution/${inst.slug}`} className="hover:text-emerald-400 no-underline whitespace-normal break-words">{inst.name}</Link>
                        </h3>
                        <div className="text-[12px] text-slate-400 flex gap-2 mt-1 font-medium items-center flex-wrap">
                          <span className="capitalize">{CATEGORIES.find(c => c.id === inst.category)?.label || inst.category}</span>
                          <span className="opacity-50">•</span>
                          <span className="truncate">{inst.city}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 self-end sm:self-auto sm:mr-4 flex-shrink-0">
                      <button onClick={() => handleEdit(inst)} title="تعديل" className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded transition">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDeleteClick(inst.id)} title="حذف" className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {institutions.length === 0 && (
                  <div className="p-8 text-center text-[14px] text-slate-400">لم يتم العثور على مؤسسات. أنشئ واحدة.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-[#030712]/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#0B1120] rounded-xl shadow-xl max-w-sm w-full p-6 text-right border border-slate-800" dir="rtl">
            <h3 className="text-[18px] font-bold text-slate-100 mb-2">تأكيد الحذف</h3>
            <p className="text-[14px] text-slate-400 mb-6">
              هل أنت متأكد من أنك تريد حذف هذه المؤسسة؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 text-[14px] font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
              >
                إلغاء
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 text-[14px] font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
