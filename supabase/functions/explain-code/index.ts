import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { code, language, lineNumber, mode = 'simple' } = await req.json();
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found');
    }

    const prompt = mode === 'detailed' 
      ? `Explain this ${language} code in detail, including:
         1. What each line does
         2. The algorithm/logic being used
         3. Time and space complexity
         4. Potential improvements
         5. Common pitfalls to avoid
         
         Code:
         ${code}
         
         ${lineNumber ? `Focus specifically on line ${lineNumber}:` : ''}`
      : `Explain this ${language} code in simple terms:
         ${code}
         
         ${lineNumber ? `Focus on line ${lineNumber}:` : ''}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      }),
    });

    const data = await response.json();
    const explanation = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate explanation';
    
    // Calculate confidence based on code complexity and response length
    const confidence = Math.min(95, Math.max(60, 85 - (code.split('\n').length * 2) + (explanation.length / 20)));

    return new Response(
      JSON.stringify({ 
        explanation,
        confidence: Math.round(confidence),
        provenance: 'AI Generated'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});