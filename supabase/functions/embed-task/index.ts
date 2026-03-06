import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

const openAiApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload = await req.json();

    // Validate payload is from Supabase Database Webhooks
    const type = payload.type; // INSERT or UPDATE
    const record = payload.record;

    if (!record || !record.id || (!record.title && !record.priority)) {
        return new Response('Missing record data', { status: 400 });
    }

    if (!openAiApiKey) {
      throw new Error('OpenAI API key is missing');
    }

    const taskText = `${record.title} - Priority: ${record.priority || 'N/A'}`;

    // Generate embedding using OpenAI
    const openAiResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: taskText,
        model: 'text-embedding-3-small',
      }),
    });

    if (!openAiResponse.ok) {
       const err = await openAiResponse.text();
       throw new Error(`OpenAI error: ${err}`);
    }

    const embeddingData = await openAiResponse.json();
    const embedding = embeddingData.data[0].embedding;

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    // Create Supabase client with SERVICE_ROLE key to bypass RLS for this update
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update the task with the new embedding
    const { error: updateError } = await supabase
        .from('tasks')
        .update({ embedding })
        .eq('id', record.id);

    if (updateError) {
        throw updateError;
    }

    return new Response(JSON.stringify({ success: true, taskId: record.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
