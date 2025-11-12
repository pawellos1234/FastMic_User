import sql from "@/app/api/utils/sql";

// GET /api/audio-sessions - List audio sessions for an event
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
    console.error("Error fetching audio sessions:", error);
    return Response.json(
      { error: "Failed to fetch audio sessions" },
      { status: 500 },
    );
  }
}

// POST /api/audio-sessions - Create new audio session
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      event_id,
      speaker_name,
      audio_url,
      transcription,
      translation_pl,
      translation_en,
    } = body;

    if (!event_id || !speaker_name) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if event exists
    const [event] = await sql`SELECT id FROM events WHERE id = ${event_id}`;
    if (!event) {
      return Response.json({ error: "Event not found" }, { status: 404 });
    }

    const [session] = await sql`
      INSERT INTO audio_sessions (
        event_id, speaker_name, audio_url, 
        transcription, translation_pl, translation_en
      )
      VALUES (${event_id}, ${speaker_name}, ${audio_url}, 
              ${transcription}, ${translation_pl}, ${translation_en})
      RETURNING *
    `;

    return Response.json(session, { status: 201 });
  } catch (error) {
    console.error("Error creating audio session:", error);
    return Response.json(
      { error: "Failed to create audio session" },
      { status: 500 },
    );
  }
}
