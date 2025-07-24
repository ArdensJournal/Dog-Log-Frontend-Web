import { NextResponse } from 'next/server';
import { graphql } from '@/graphql/client';

export async function POST(request: Request) {
  const { query, variables } = await request.json();

  try {
    const response = await graphql.request(query, variables);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}