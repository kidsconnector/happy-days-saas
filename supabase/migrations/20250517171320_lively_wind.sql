/*
  # Add campaign recipients

  1. Changes
    - Add recipients array to campaigns table to store multiple recipient IDs
    - Add index on recipients array for better query performance
*/

ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS recipients uuid[] DEFAULT '{}';

-- Index for recipient lookups
CREATE INDEX IF NOT EXISTS idx_campaigns_recipients 
ON campaigns USING gin(recipients);