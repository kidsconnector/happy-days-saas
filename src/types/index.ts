export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'owner' | 'staff';
  tenantId: string | null;
  createdAt: string;
}

export interface Tenant {
  id: string;
  businessName: string;
  slug: string;
  contactEmail: string;
  plan: 'free' | 'basic' | 'pro';
  logo?: string;
  primaryColor?: string;
  createdAt: string;
}

export interface Child {
  id: string;
  tenantId: string;
  name: string;
  birthdate: string;
  parentName: string;
  email: string;
  phone?: string;
  notes?: string;
  tags: string[];
  customFields?: Record<string, string>;
  createdAt: string;
}

export interface Event {
  id: string;
  tenantId: string;
  name: string;
  date: string;
  recurrence: 'yearly' | 'monthly' | 'once';
  templateId: string;
  createdAt: string;
}

export interface EmailTemplate {
  id: string;
  tenantId: string;
  title: string;
  htmlContent: string;
  subject: string;
  eventType: 'birthday' | 'holiday' | 'promotion';
  createdAt: string;
}

export interface Campaign {
  id: string;
  childId: string;
  eventId: string;
  sentAt: string | null;
  status: 'scheduled' | 'sent' | 'failed';
  type: 'birthday' | 'promotion';
  createdAt: string;
}

export interface ApiKey {
  id: string;
  tenantId: string;
  key: string;
  active: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}