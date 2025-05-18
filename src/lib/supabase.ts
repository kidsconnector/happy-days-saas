import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Children
export const getChildren = async () => {
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
};

export const createChild = async (childData: any) => {
  const { data, error } = await supabase
    .from('children')
    .insert({
      ...childData,
      tenant_id: (await supabase.auth.getUser()).data.user?.user_metadata.tenant_id
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Email Templates
export const getEmailTemplates = async () => {
  const { data, error } = await supabase
    .from('email_templates')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createEmailTemplate = async (templateData: {
  title: string;
  subject: string;
  html_content: string;
  event_type: string;
  scheduled_for: string;
  recipients: string[];
}) => {
  const { data: userData } = await supabase.auth.getUser();
  const tenantId = userData.user?.user_metadata.tenant_id;

  if (!tenantId) {
    throw new Error('No tenant ID found in user metadata');
  }

  const { data, error } = await supabase
    .from('email_templates')
    .insert({
      tenant_id: tenantId,
      title: templateData.title,
      subject: templateData.subject,
      html_content: templateData.html_content,
      event_type: templateData.event_type,
      scheduled_for: templateData.scheduled_for,
      recipients: templateData.recipients
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Events
export const createEvent = async (eventData: any) => {
  const { data: userData } = await supabase.auth.getUser();
  const tenantId = userData.user?.user_metadata.tenant_id;

  if (!tenantId) {
    throw new Error('No tenant ID found in user metadata');
  }

  const { data, error } = await supabase
    .from('events')
    .insert({
      ...eventData,
      tenant_id: tenantId
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: true });
  
  if (error) throw error;
  return data;
};

// Coupons
export const getCoupons = async () => {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createCoupon = async (couponData: any) => {
  const { data: userData } = await supabase.auth.getUser();
  const tenantId = userData.user?.user_metadata.tenant_id;

  if (!tenantId) {
    throw new Error('No tenant ID found in user metadata');
  }

  const { data, error } = await supabase
    .from('coupons')
    .insert({
      ...couponData,
      tenant_id: tenantId
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Campaigns
export const getCampaigns = async () => {
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      child:children(name, parent_name, parent_email),
      template:email_templates(title, subject)
    `)
    .order('scheduled_for', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const createCampaign = async (campaignData: {
  title: string;
  subject: string;
  html_content: string;
  scheduled_for: string;
  recipients: string[];
  type: string;
}) => {
  const { data: userData } = await supabase.auth.getUser();
  const tenantId = userData.user?.user_metadata.tenant_id;

  if (!tenantId) {
    throw new Error('No tenant ID found in user metadata');
  }

  const { data, error } = await supabase
    .from('campaigns')
    .insert({
      tenant_id: tenantId,
      title: campaignData.title,
      subject: campaignData.subject,
      html_content: campaignData.html_content,
      scheduled_for: campaignData.scheduled_for,
      recipients: campaignData.recipients,
      type: campaignData.type,
      status: 'scheduled'
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};