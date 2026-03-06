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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 });
    }

    const { query } = await req.json();

    if (!query) {
       return new Response(JSON.stringify({ error: 'Query is missing' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
    }

    if (!openAiApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key is missing' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
    }

    // Generate embedding using OpenAI
    const openAiResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: query,
        model: 'text-embedding-3-small', // Using newer efficient model
      }),
    });

    if (!openAiResponse.ok) {
       const err = await openAiResponse.text();
       throw new Error(`OpenAI error: ${err}`);
    }

    const embeddingData = await openAiResponse.json();
    const embedding = embeddingData.data[0].embedding;

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    
    // Create Supabase client that uses the user's JWT to enforce RLS
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get the user from the JWT to pass to the RPC
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
         throw new Error('Unauthorized');
    }

    const { data: matchedTasks, error: rpcError } = await supabase.rpc('match_tasks', {
        query_embedding: embedding,
        match_threshold: 0.7,
        match_count: 5,
        user_id_param: user.id
    });

    if (rpcError) {
        throw rpcError;
    }

    return new Response(JSON.stringify({ tasks: matchedTasks }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error generating search results:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
