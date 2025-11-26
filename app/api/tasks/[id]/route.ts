import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:3456/graphql";

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

// PUT /api/tasks/[id] - Update a task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("📋 PUT /api/tasks/[id] - Updating task");

  try {
    const token = await getAuthToken();
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = await params;
    const body = await request.json();

    console.log(
      `📄 Updating task ${taskId} with:`,
      JSON.stringify(body, null, 2)
    );

    const mutation = `
      mutation EditTask($editTaskDto: EditTaskDto!) {
        editTask(editTaskDto: $editTaskDto) {
          _id
          name
          description
          date
          isCompleted
          createdAt
          updatedAt
        }
      }
    `;

    // Build EditTaskDto
    const editTaskDto: any = {
      taskId,
    };

    // Add only provided fields (all are optional except taskId)
    if (body.name !== undefined) editTaskDto.name = body.name;
    if (body.description !== undefined)
      editTaskDto.description = body.description;
    if (body.date !== undefined) editTaskDto.date = body.date;
    if (body.isCompleted !== undefined)
      editTaskDto.isCompleted = body.isCompleted;
    if (body.vaccine !== undefined) editTaskDto.vaccine = body.vaccine;

    console.log(
      "🚀 Sending editTaskDto:",
      JSON.stringify(editTaskDto, null, 2)
    );

    const variables = { editTaskDto };

    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    console.log("🌐 Edit task backend response status:", response.status);
    const responseText = await response.text();
    console.log("📄 Edit task backend response text:", responseText);

    if (!response.ok) {
      console.error("❌ Backend response not ok:", response.status);
      return Response.json(
        {
          error: "Backend error",
          details: responseText,
        },
        { status: response.status }
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error(
        "❌ Failed to parse edit task response as JSON:",
        parseError
      );
      return Response.json(
        {
          error: "Invalid JSON response from backend",
          details: responseText,
        },
        { status: 500 }
      );
    }

    if (data.errors) {
      console.error("❌ GraphQL errors:", data.errors);
      // Log each error in detail
      data.errors.forEach((err: any, index: number) => {
        console.error(`   Error ${index + 1}:`, err.message);
        if (err.extensions) {
          console.error(`   Extensions:`, err.extensions);
        }
      });

      return Response.json(
        {
          error: "GraphQL errors",
          details: data.errors,
          message: data.errors?.[0]?.message || "Unknown GraphQL error",
        },
        { status: 400 }
      );
    }

    console.log("✅ Task updated successfully");
    return Response.json({
      data: data.data.editTask,
      success: true,
      message: "Task updated successfully",
    });
  } catch (error) {
    console.error("❌ Error in PUT /api/tasks/[id]:", error);
    return Response.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("📋 DELETE /api/tasks/[id] - Deleting task");

  try {
    const token = await getAuthToken();
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = await params;

    console.log(`🗑️  Deleting task ${taskId}`);

    const mutation = `
      mutation DeleteTaskById($deleteTaskByIdDto: DeleteTaskByIdDto!) {
        deleteTaskById(deleteTaskByIdDto: $deleteTaskByIdDto)
      }
    `;

    const variables = {
      deleteTaskByIdDto: { taskId },
    };

    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    console.log("🌐 Delete task backend response status:", response.status);
    const responseText = await response.text();
    console.log("📄 Delete task backend response text:", responseText);

    if (!response.ok) {
      console.error("❌ Backend response not ok:", response.status);
      return Response.json(
        {
          error: "Backend error",
          details: responseText,
        },
        { status: response.status }
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error(
        "❌ Failed to parse delete task response as JSON:",
        parseError
      );
      return Response.json(
        {
          error: "Invalid JSON response from backend",
          details: responseText,
        },
        { status: 500 }
      );
    }

    if (data.errors) {
      console.error("❌ GraphQL errors:", data.errors);
      return Response.json(
        {
          error: "GraphQL errors",
          details: data.errors,
          message: data.errors?.[0]?.message || "Unknown GraphQL error",
        },
        { status: 400 }
      );
    }

    console.log("✅ Task deleted successfully");
    return Response.json({
      data: data.data.deleteTaskById,
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error in DELETE /api/tasks/[id]:", error);
    return Response.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
