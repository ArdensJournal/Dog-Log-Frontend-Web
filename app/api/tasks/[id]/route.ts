import { NextRequest } from 'next/server';

// PUT /api/tasks/[id] - Update a task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return Response.json({ 
    error: 'Task updates not yet supported by backend',
    message: 'The backend does not currently support task updates. Waiting for updateTask mutation implementation.'
  }, { status: 501 });
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return Response.json({ 
    error: 'Task deletion not yet supported by backend',
    message: 'The backend does not currently support task deletion. Waiting for deleteTask mutation implementation.'
  }, { status: 501 });
}