import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { addDays, format } from 'npm:date-fns@3.3.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Get all tenants
    const { data: tenants, error: tenantsError } = await supabaseClient
      .from('tenants')
      .select('id');

    if (tenantsError) throw tenantsError;

    const reminderDays = [90, 60, 30, 15];
    const today = new Date();

    for (const tenant of tenants) {
      // Get upcoming birthdays for this tenant
      const { data: birthdays, error: birthdaysError } = await supabaseClient
        .rpc('get_upcoming_birthdays', {
          p_tenant_id: tenant.id,
          p_days_ahead: Math.max(...reminderDays),
        });

      if (birthdaysError) throw birthdaysError;

      // Get birthday template
      const { data: template, error: templateError } = await supabaseClient
        .from('email_templates')
        .select()
        .eq('tenant_id', tenant.id)
        .eq('event_type', 'birthday')
        .single();

      if (templateError && templateError.code !== 'PGRST116') {
        throw templateError;
      }

      // Skip if no template is found
      if (!template) continue;

      // Process each birthday
      for (const birthday of birthdays) {
        const daysUntil = birthday.days_until;

        // Check if we should create a campaign for this interval
        if (reminderDays.includes(daysUntil)) {
          // Check if campaign already exists
          const { data: existing, error: existingError } = await supabaseClient
            .from('campaigns')
            .select()
            .eq('child_id', birthday.child_id)
            .eq('template_id', template.id)
            .eq('type', 'birthday')
            .gte('created_at', format(addDays(today, -7), 'yyyy-MM-dd'))
            .maybeSingle();

          if (existingError) throw existingError;

          // Create campaign if none exists
          if (!existing) {
            await supabaseClient
              .from('campaigns')
              .insert({
                tenant_id: tenant.id,
                child_id: birthday.child_id,
                template_id: template.id,
                type: 'birthday',
                scheduled_for: format(addDays(today, 1), 'yyyy-MM-dd'),
              });
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});