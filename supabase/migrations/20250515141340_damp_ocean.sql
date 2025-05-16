/*
  # Initial Schema Setup for KiddoConnect

  1. New Tables
    - `tenants`: Stores business information
    - `users`: User accounts with role-based access
    - `children`: Child records with parent contact info
    - `email_templates`: Customizable email templates
    - `campaigns`: Email campaign tracking
    - `api_keys`: API access keys for external integrations

  2. Security
    - Enable RLS on all tables
    - Add policies for tenant isolation
    - Set up authentication policies
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  slug text UNIQUE NOT NULL,
  contact_email text NOT NULL,
  plan text NOT NULL DEFAULT 'basic',
  logo_url text,
  primary_color text,
  email_from_name text,
  email_reply_to text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenants are viewable by authenticated users of the same tenant"
  ON tenants
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'tenant_id' = id::text);

-- Users table (managed by Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  tenant_id uuid REFERENCES tenants(id),
  role text NOT NULL DEFAULT 'staff',
  name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_role CHECK (role IN ('admin', 'owner', 'staff'))
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own tenant's users"
  ON users
  FOR SELECT
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

-- Children table
CREATE TABLE IF NOT EXISTS children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  name text NOT NULL,
  birthdate date NOT NULL,
  parent_name text NOT NULL,
  email text NOT NULL,
  phone text,
  notes text,
  tags text[] DEFAULT '{}',
  custom_fields jsonb DEFAULT '{}',
  email_opt_out boolean DEFAULT false,
  gdpr_consent boolean DEFAULT false,
  gdpr_consent_date timestamptz,
  gdpr_consent_ip text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Children are viewable by authenticated users of the same tenant"
  ON children
  FOR SELECT
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Children are insertable by authenticated users of the same tenant"
  ON children
  FOR INSERT
  TO authenticated
  WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Children are updatable by authenticated users of the same tenant"
  ON children
  FOR UPDATE
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

-- Email Templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  title text NOT NULL,
  subject text NOT NULL,
  html_content text NOT NULL,
  event_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_event_type CHECK (event_type IN ('birthday', 'holiday', 'promotion'))
);

ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are viewable by authenticated users of the same tenant"
  ON email_templates
  FOR SELECT
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  child_id uuid REFERENCES children(id),
  template_id uuid REFERENCES email_templates(id),
  status text NOT NULL DEFAULT 'scheduled',
  type text NOT NULL,
  scheduled_for timestamptz NOT NULL,
  sent_at timestamptz,
  error text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('scheduled', 'sent', 'failed')),
  CONSTRAINT valid_type CHECK (type IN ('birthday', 'holiday', 'promotion'))
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campaigns are viewable by authenticated users of the same tenant"
  ON campaigns
  FOR SELECT
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  name text NOT NULL,
  key text NOT NULL UNIQUE,
  active boolean DEFAULT true,
  last_used_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "API keys are viewable by authenticated users of the same tenant"
  ON api_keys
  FOR SELECT
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_children_tenant_id ON children(tenant_id);
CREATE INDEX IF NOT EXISTS idx_children_birthdate ON children(birthdate);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_scheduled_for ON campaigns(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);

-- Functions for automation
CREATE OR REPLACE FUNCTION get_upcoming_birthdays(
  p_tenant_id uuid,
  p_days_ahead integer DEFAULT 90
)
RETURNS TABLE (
  child_id uuid,
  child_name text,
  birthdate date,
  days_until integer,
  parent_name text,
  email text
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH birthday_calc AS (
    SELECT
      id,
      name,
      birthdate,
      parent_name,
      email,
      (
        date_trunc('day', 
          make_date(
            CASE 
              WHEN (birthdate + ((extract(year from current_date) - extract(year from birthdate))::integer || ' years')::interval) < current_date
              THEN extract(year from current_date)::integer + 1
              ELSE extract(year from current_date)::integer
            END,
            extract(month from birthdate)::integer,
            extract(day from birthdate)::integer
          )
        ) - date_trunc('day', current_date)
      )::integer as days_until
    FROM children
    WHERE tenant_id = p_tenant_id
      AND NOT email_opt_out
  )
  SELECT
    id as child_id,
    name as child_name,
    birthdate,
    days_until,
    parent_name,
    email
  FROM birthday_calc
  WHERE days_until <= p_days_ahead
  ORDER BY days_until;
END;
$$;