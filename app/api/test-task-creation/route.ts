import { NextRequest } from 'next/server';

// GET /api/test-task-creation - Test endpoint (development only)
export async function GET(request: NextRequest) {
  return Response.json({ 
    message: 'Test task creation endpoint - development only',
    status: 'available',
    timestamp: new Date().toISOString()
  });
}