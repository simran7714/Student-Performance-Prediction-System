import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_LG28WeOAznfDaWl3ratCgQ_kQz4Fq9m';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseUrl.startsWith('http'));

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Auth Helpers
export async function signUpUser(email, password) {
  if (!supabase) throw new Error('Supabase URL not configured yet. Please provide your Supabase Project URL.');
  return await supabase.auth.signUp({ email, password });
}

export async function signInUser(email, password) {
  if (!supabase) throw new Error('Supabase URL not configured yet. Please provide your Supabase Project URL.');
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signOutUser() {
  if (!supabase) return;
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Data Sync Helpers
export async function savePredictionToCloud(predictionData) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('student_predictions')
    .insert([predictionData]);
  if (error) console.warn('Supabase save error:', error.message);
  return data;
}

export async function fetchCloudPredictions() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('student_predictions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('Supabase fetch error:', error.message);
    return [];
  }
  return data;
}
