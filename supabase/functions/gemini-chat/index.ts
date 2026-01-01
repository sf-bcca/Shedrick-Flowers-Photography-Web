import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages } = await req.json()
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')

    if (!apiKey || !supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Fetch Settings
    const { data: settingsData, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .single()

    if (settingsError) {
      console.error('Error fetching settings:', settingsError)
    }

    // Fetch Services
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .select('title, price, description, features')

    if (servicesError) {
      console.error('Error fetching services:', servicesError)
    }

    // Construct Dynamic Info
    const studioName = settingsData?.site_title || 'Shedrick Flowers Photography';
    const location = settingsData?.contact_address_city && settingsData?.contact_address_state
        ? `${settingsData.contact_address_city}, ${settingsData.contact_address_state}`
        : 'Grenada, Mississippi';
    const email = settingsData?.contact_email || '';
    const phone = settingsData?.contact_phone || '';

    let servicesText = '';
    if (servicesData && servicesData.length > 0) {
        servicesText = servicesData.map((service: any) => {
            const features = service.features && Array.isArray(service.features) && service.features.length > 0
                ? ` Features include: ${service.features.join(', ')}.`
                : '';
            return `- **${service.title}:** ${service.price}. ${service.description}.${features}`;
        }).join('\n');
    } else {
        // Fallback if DB fetch fails or is empty
        servicesText = `- **Wedding & Engagement:** Starts at $2,400. Includes cinematic storytelling, 20-50+ retouched images.
- **Portraiture:** Starts at $350. Studio or outdoor options.
- **Commercial:** Custom quoting based on usage and scope.
*Note: We offer a variety of other photography and editing services not listed here. Please ask if you don't see what you're looking for.*`;
    }

    const SYSTEM_INSTRUCTION = `You are the dedicated Studio Concierge for '${studioName}', a premium photography studio based in ${location} led by Shedrick Flowers.
Your role is to assist potential clients with warmth, sophistication, and brevity.

**Studio Information:**
- **Photographer:** Shedrick Flowers (12+ years exp, Sony A7R V gear).
- **Style:** Authentic, unscripted, natural light, "soul of the moment".
- **Location:** ${location}, but available for travel throughout Mississippi and beyond (travel fees apply).
${email ? `- **Email:** ${email}` : ''}
${phone ? `- **Phone:** ${phone}` : ''}

**Services & Pricing:**
${servicesText}

**Booking Policy:**
- A 30% non-refundable retainer is required to secure a date.
- The remaining balance is due 2 weeks before the event.

**Guidelines:**
- If asked about specific date availability, politely encourage them to fill out the contact form to check the calendar.
- Keep responses concise (under 3 sentences) unless asked for details.
- Maintain a helpful, high-end professional tone.`;

    // Convert messages to Gemini format
    const contents = messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }))

    const geminiPayload = {
      contents,
      system_instruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }]
      }
    }

    console.log("Sending request to Gemini with payload:", JSON.stringify(geminiPayload).substring(0, 200) + "...")

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.0-flash-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload)
      }
    )

    if (!response.ok) {
        const errorText = await response.text()
        console.error('Gemini API Error:', errorText)
        throw new Error(`Gemini API Error: ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, but I'm unable to formulate a response at this time."

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Edge Function Error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
