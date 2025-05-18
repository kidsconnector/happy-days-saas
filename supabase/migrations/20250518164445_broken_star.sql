/*
  # Update email_templates table structure

  1. Changes
    - Change recipients column type from text[] to uuid[]
    - Add proper RLS policies for email_templates table
*/

-- Update recipients column type
ALTER TABLE email_templates 
ALTER COLUMN recipients TYPE uuid[] USING recipients::uuid[];

-- Add RLS policies for email_templates
CREATE POLICY "Email templates are insertable by authenticated users of the same tenant"
  ON email_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Email templates are updatable by authenticated users of the same tenant"
  ON email_templates
  FOR UPDATE
  TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

-- Add index for recipients array
CREATE INDEX IF NOT EXISTS idx_email_templates_recipients 
ON email_templates USING gin(recipients);