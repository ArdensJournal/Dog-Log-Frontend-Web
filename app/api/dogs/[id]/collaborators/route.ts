import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { GraphQLClient } from 'graphql-request';
import { gql } from 'graphql-request';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper function to get auth token from cookies
async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

const ADD_COLLABORATOR_MUTATION = gql`
  mutation AddDogCollaborator($dogId: ID!, $email: String!, $role: DogCollaboratorRole!) {
    addDogCollaborator(addDogCollaboratorDto: {
      dogId: $dogId
      email: $email
      role: $role
    }) {
      _id
      name
      breeds
      birthday
      gender
      imageUrl
      collaborators {
        role
        user {
          _id
          email
          name
          profileImageUrl
        }
      }
    }
  }
`;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: dogId } = await params;
    console.log('🤝 Adding collaborator to dog:', dogId);
    
    const token = await getAuthToken();
    
    if (!token) {
      console.error('❌ No authentication token found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log('✅ Authentication token found');
    
    const body = await request.json();
    const { email, role } = body;
    
    console.log('📧 Collaborator email:', email);
    console.log('🔑 Collaborator role:', role);

    if (!email || !role) {
      console.error('❌ Missing email or role');
      return NextResponse.json(
        { error: 'Email and role are required' },
        { status: 400 }
      );
    }

    console.log('🚀 Sending GraphQL mutation to backend...');
    const client = new GraphQLClient(BACKEND_URL as string, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data: any = await client.request(ADD_COLLABORATOR_MUTATION, {
      dogId,
      email,
      role,
    });

    console.log('✅ Successfully added collaborator:', data);
    return NextResponse.json({
      data: data.addDogCollaborator,
      success: true,
    });
  } catch (error: any) {
    console.error('❌ Error adding collaborator:', error);
    console.error('Error message:', error.message);
    console.error('Error response:', error.response);
    console.error('GraphQL errors:', error.response?.errors);
    
    // Extract more detailed error information
    const errorMessage = error.response?.errors?.[0]?.message || error.message || 'Failed to add collaborator';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.response?.errors || [],
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
