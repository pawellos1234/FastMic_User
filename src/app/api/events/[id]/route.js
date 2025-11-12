import sql from "@/app/api/utils/sql";

// GET /api/events/[id] - Get single event
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const [event] = await sql`SELECT * FROM events WHERE id = ${id}`;

    if (!event) {
      return Response.json({ error: "Event not found" }, { status: 404 });
    }

    return Response.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return Response.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}

// PUT /api/events/[id] - Update event
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramCount = 0;

    const allowedFields = [
      "title",
      "description",
      "status",
      "language",
      "max_participants",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        paramCount++;
        updateFields.push(`${field} = $${paramCount}`);
        values.push(body[field]);
      }
    }

    if (updateFields.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    // Add updated_at
    paramCount++;
    updateFields.push(`updated_at = $${paramCount}`);
    values.push(new Date().toISOString());

    // Add id for WHERE clause
    paramCount++;
    values.push(id);

    const query = `
      UPDATE events 
      SET ${updateFields.join(", ")} 
      WHERE id = $${paramCount} 
      RETURNING *
    `;

    const [event] = await sql(query, values);

    if (!event) {
      return Response.json({ error: "Event not found" }, { status: 404 });
    }

    return Response.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    return Response.json({ error: "Failed to update event" }, { status: 500 });
  }
}

// DELETE /api/events/[id] - Delete event
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const [event] = await sql`DELETE FROM events WHERE id = ${id} RETURNING *`;

    if (!event) {
      return Response.json({ error: "Event not found" }, { status: 404 });
    }

    return Response.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return Response.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
