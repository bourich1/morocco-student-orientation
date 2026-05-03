import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type Category =
  | 'vocational'
  | 'military'
  | 'university'
  | 'institute'
  | 'school';

export interface Institution {
  id: string;
  name: string;
  slug: string;
  category: Category;
  description: string;
  fields: string[];
  city: string;
  image_url: string;
  apply_link: string;
  created_at: string;
}

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'vocational', label: 'التكوين المهني' },
  { id: 'military', label: 'المدارس العسكرية وشبه العسكرية' },
  { id: 'university', label: 'الجامعات (الكليات)' },
  { id: 'institute', label: 'المعاهد' },
  { id: 'school', label: 'المدارس' },
];
