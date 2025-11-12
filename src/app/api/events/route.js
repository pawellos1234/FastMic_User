import sql from "@/app/api/utils/sql";

// GET /api/events - List all events
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const code = searchParams.get("code");

    let query = "SELECT * FROM events WHERE 1=1";
    const params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (code) {
      paramCount++;
      query += ` AND code = $${paramCount}`;
      params.push(code);
    }

    query += " ORDER BY created_at DESC";

    const events = await sql(query, params);
    return Response.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return Response.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

// POST /api/events - Create new event
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      code,
      title,
      description,
      organizer_name,
      organizer_email,
      language = "en",
      max_participants = 100,
    } = body;

    if (!code || !title || !organizer_name || !organizer_email) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if event code already exists
    const existingEvent = await sql`SELECT id FROM events WHERE code = ${code}`;
    if (existingEvent.length > 0) {
      return Response.json(
        { error: "Event code already exists" },
        { status: 409 },
      );
    }

    const [event] = await sql`
      INSERT INTO events (code, title, description, organizer_name, organizer_email, language, max_participants)
      VALUES (${code}, ${title}, ${description}, ${organizer_name}, ${organizer_email}, ${language}, ${max_participants})
      RETURNING *
    `;

    return Response.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return Response.json({ error: "Failed to create event" }, { status: 500 });
  }
}
