import sql from "@/app/api/utils/sql";

// GET /api/questions - List questions for an event
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const status = searchParams.get("status");

    if (!eventId) {
      return Response.json({ error: "Event ID is required" }, { status: 400 });
    }

    let query = "SELECT * FROM questions WHERE event_id = $1";
    const params = [eventId];
    let paramCount = 1;

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    query += " ORDER BY queue_position ASC, submitted_at ASC";

    const questions = await sql(query, params);
    return Response.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return Response.json(
      { error: "Failed to fetch questions" },
      { status: 500 },
    );
  }
}

// POST /api/questions - Submit new question
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      event_id,
      participant_name,
      participant_email, // optional now
      question_text,
      question_audio_url,
      language = "en",
    } = body;

    if (!event_id || !participant_name || !question_text) {
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

    // Get next queue position
    const [{ max_position }] = await sql`
      SELECT COALESCE(MAX(queue_position), 0) as max_position 
      FROM questions 
      WHERE event_id = ${event_id} AND status IN ('pending', 'approved')
    `;
    const nextPosition = (max_position || 0) + 1;

    const [question] = await sql`
      INSERT INTO questions (
        event_id, participant_name, participant_email, 
        question_text, question_audio_url, language, queue_position
      )
      VALUES (${event_id}, ${participant_name}, ${participant_email || null}, 
              ${question_text}, ${question_audio_url}, ${language}, ${nextPosition})
      RETURNING *
    `;

    return Response.json(question, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return Response.json(
      { error: "Failed to create question" },
      { status: 500 },
    );
  }
}
