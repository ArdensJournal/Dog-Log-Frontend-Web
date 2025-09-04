import { NextRequest } from 'next/server';

// This file was used for testing - keeping minimal export to prevent build errors
export async function GET(request: NextRequest) {
  return Response.json({ 
    message: 'This endpoint is not implemented',
    status: 'placeholder'
  });
}