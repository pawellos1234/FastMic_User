import sql from "@/app/api/utils/sql";

// GET /api/questions/[id] - Get single question
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const [question] = await sql`SELECT * FROM questions WHERE id = ${id}`;

    if (!question) {
      return Response.json({ error: "Question not found" }, { status: 404 });
    }

    return Response.json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    return Response.json(
      { error: "Failed to fetch question" },
      { status: 500 },
    );
  }
}

// PUT /api/questions/[id] - Update question (approve/decline/answer)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramCount = 0;

    const allowedFields = ["status", "queue_position"];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        paramCount++;
        updateFields.push(`${field} = $${paramCount}`);
        values.push(body[field]);
      }
    }

    // Handle answered_at timestamp
    if (body.status === "answered") {
      paramCount++;
      updateFields.push(`answered_at = $${paramCount}`);
      values.push(new Date().toISOString());
    }

    if (updateFields.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    // Add id for WHERE clause
    paramCount++;
    values.push(id);

    const query = `
      UPDATE questions 
      SET ${updateFields.join(", ")} 
      WHERE id = $${paramCount} 
      RETURNING *
    `;

    const [question] = await sql(query, values);

    if (!question) {
      return Response.json({ error: "Question not found" }, { status: 404 });
    }

    return Response.json(question);
  } catch (error) {
    console.error("Error updating question:", error);
    return Response.json(
      { error: "Failed to update question" },
      { status: 500 },
    );
  }
}

// DELETE /api/questions/[id] - Delete question
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const [question] =
      await sql`DELETE FROM questions WHERE id = ${id} RETURNING *`;

    if (!question) {
      return Response.json({ error: "Question not found" }, { status: 404 });
    }

    return Response.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    return Response.json(
      { error: "Failed to delete question" },
      { status: 500 },
    );
  }
}
