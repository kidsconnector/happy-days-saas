import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { format } from 'npm:date-fns@3.3.1';
import { send } from 'npm:@sendgrid/mail@8.1.1';

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

    // Get campaigns that need to be sent
    const { data: campaigns, error: campaignsError } = await supabaseClient
      .from('campaigns')
      .select(`
        *,
        child:children(name, parent_name, email),
        template:email_templates(subject, html_content),
        tenant:tenants(business_name, email_from_name, email_reply_to, logo_url)
      `)
      .eq('status', 'scheduled')
      .lte('scheduled_for', new Date().toISOString());

    if (campaignsError) throw campaignsError;

    // Configure SendGrid
    send.setApiKey(Deno.env.get('SENDGRID_API_KEY') ?? '');

    // Process each campaign
    for (const campaign of campaigns) {
      try {
        const { child, template, tenant } = campaign;
        
        // Replace template variables
        let htmlContent = template.html_content;
        const variables = {
          child_name: child.name,
          parent_name: child.parent_name,
          business_name: tenant.business_name,
          logo_url: tenant.logo_url,
        };

        Object.entries(variables).forEach(([key, value]) => {
          htmlContent = htmlContent.replace(
            new RegExp(`\\[${key}\\]`, 'g'),
            value || ''
          );
        });

        // Send email
        await send({
          to: child.email,
          from: {
            email: tenant.email_reply_to || 'noreply@kiddoconnect.com',
            name: tenant.email_from_name || tenant.business_name,
          },
          subject: template.subject,
          html: htmlContent,
        });

        // Update campaign status
        await supabaseClient
          .from('campaigns')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
          })
          .eq('id', campaign.id);

      } catch (error) {
        // Log error and update campaign status
        await supabaseClient
          .from('campaigns')
          .update({
            status: 'failed',
            error: error.message,
          })
          .eq('id', campaign.id);
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