import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { api_key, parent_name, email, phone, child_name, birthdate, source } = await req.json();

    if (!api_key) {
      throw new Error('API key is required');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Verify API key and get tenant
    const { data: apiKey, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('tenant_id')
      .eq('key', api_key)
      .eq('active', true)
      .single();

    if (apiKeyError || !apiKey) {
      return new Response(
        JSON.stringify({ error: 'Invalid API key' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create child record
    const { data: child, error: childError } = await supabase
      .from('children')
      .insert({
        tenant_id: apiKey.tenant_id,
        name: child_name,
        birthdate,
        parent_name,
        email,
        phone,
        gdpr_consent: true,
        gdpr_consent_date: new Date().toISOString(),
        gdpr_consent_ip: req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip'),
        tags: [source],
      })
      .select()
      .single();

    if (childError) throw childError;

    // Update API key last used timestamp
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('key', api_key);

    return new Response(
      JSON.stringify({ success: true, data: child }),
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