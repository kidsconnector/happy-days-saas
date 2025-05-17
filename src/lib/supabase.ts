import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const getUpcomingBirthdays = async (daysAhead = 90) => {
  const { data, error } = await supabase
    .rpc('get_upcoming_birthdays', { p_days_ahead: daysAhead });
  
  if (error) throw error;
  return data;
};

export const createChild = async (childData: any) => {
  const { data, error } = await supabase
    .from('children')
    .insert(childData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateChild = async (id: string, childData: any) => {
  const { data, error } = await supabase
    .from('children')
    .update(childData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteChild = async (id: string) => {
  const { error } = await supabase
    .from('children')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const getEmailTemplates = async () => {
  const { data, error } = await supabase
    .from('email_templates')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createEmailTemplate = async (templateData: any) => {
  const { data, error } = await supabase
    .from('email_templates')
    .insert(templateData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateEmailTemplate = async (id: string, templateData: any) => {
  const { data, error } = await supabase
    .from('email_templates')
    .update(templateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getCampaigns = async () => {
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      child:children(name, parent_name, email),
      template:email_templates(title, subject)
    `)
    .order('scheduled_for', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const getEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('datetime', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const createEvent = async (eventData: any) => {
  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateEvent = async (id: string, eventData: any) => {
  const { data, error } = await supabase
    .from('events')
    .update(eventData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteEvent = async (id: string) => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};