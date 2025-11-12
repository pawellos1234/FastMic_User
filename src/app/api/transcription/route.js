import sql from "@/app/api/utils/sql";

// POST /api/transcription - Process audio transcription and translation
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      audio_url,
      event_id,
      speaker_name,
      target_languages = ["pl", "en"],
    } = body;

    if (!audio_url || !event_id || !speaker_name) {
      return Response.json(
        { error: "Missing required fields: audio_url, event_id, speaker_name" },
        { status: 400 },
      );
    }

    // In a real implementation, you would:
    // 1. Download audio from audio_url
    // 2. Send to OpenAI Whisper API for transcription
    // 3. Send transcription to OpenAI GPT for translation
    // 4. Store results in database

    // For demo purposes, simulate AI processing
    const demoTranscriptions = {
      en: [
        "Welcome everyone to today's presentation. We'll be discussing the future of artificial intelligence in business applications.",
        "Today we're going to cover three main topics: machine learning integration, automation benefits, and implementation strategies.",
        "Let's start with the first question from our audience. Please feel free to submit your questions through the platform.",
        "That's an excellent question about data privacy. Security is indeed our top priority when implementing AI solutions.",
        "Thank you all for participating. We hope this session was informative and helpful for your business needs.",
      ],
      pl: [
        "Witajcie wszystkich na dzisiejszej prezentacji. Będziemy omawiać przyszłość sztucznej inteligencji w aplikacjach biznesowych.",
        "Dzisiaj omówimy trzy główne tematy: integrację uczenia maszynowego, korzyści z automatyzacji i strategie wdrażania.",
        "Zacznijmy od pierwszego pytania z naszej publiczności. Prosimy o swobodne zadawanie pytań poprzez platformę.",
        "To doskonałe pytanie o prywatność danych. Bezpieczeństwo jest rzeczywiście naszym najwyższym priorytetem przy wdrażaniu rozwiązań AI.",
        "Dziękujemy wszystkim za udział. Mamy nadzieję, że ta sesja była informatywna i pomocna dla Waszych potrzeb biznesowych.",
      ],
    };

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Get random demo transcription
    const randomIndex = Math.floor(
      Math.random() * demoTranscriptions.en.length,
    );
    const transcription = demoTranscriptions.en[randomIndex];
    const translation_pl = demoTranscriptions.pl[randomIndex];
    const translation_en = transcription; // Already in English

    // For real implementation, you would call OpenAI APIs like this:
    /*
    // Transcription with Whisper
    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'multipart/form-data'
      },
      body: formData // Contains the audio file
    });
    
    const transcription = await transcriptionResponse.json();
    
    // Translation with GPT
    const translationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional translator. Translate the following text accurately while preserving the meaning and tone.'
          },
          {
            role: 'user',
            content: `Translate this text to Polish: ${transcription.text}`
          }
        ]
      })
    });
    */

    // Save to database
    const [session] = await sql`
      INSERT INTO audio_sessions (
        event_id, speaker_name, audio_url, 
        transcription, translation_pl, translation_en
      )
      VALUES (${event_id}, ${speaker_name}, ${audio_url}, 
              ${transcription}, ${translation_pl}, ${translation_en})
      RETURNING *
    `;

    return Response.json(
      {
        session,
        transcription: transcription,
        translations: {
          pl: translation_pl,
          en: translation_en,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error processing transcription:", error);
    return Response.json(
      { error: "Failed to process transcription" },
      { status: 500 },
    );
  }
}

// GET /api/transcription - Get latest transcriptions for an event
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const latest = searchParams.get("latest");

    if (!eventId) {
      return Response.json({ error: "Event ID is required" }, { status: 400 });
    }

    let query = "SELECT * FROM audio_sessions WHERE event_id = $1";
    const params = [eventId];

    if (latest === "true") {
      query += " ORDER BY started_at DESC LIMIT 1";
    } else {
      query += " ORDER BY started_at DESC";
    }

    const sessions = await sql(query, params);
    return Response.json(sessions);
  } catch (error) {
    console.error("Error fetching transcriptions:", error);
    return Response.json(
      { error: "Failed to fetch transcriptions" },
      { status: 500 },
    );
  }
}
