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

const REMOVE_COLLABORATOR_MUTATION = gql`
  mutation RemoveDogCollaborator($dogId: ID!, $collaboratorId: ID!) {
    removeDogCollaborator(removeDogCollaboratorDto: {
      dogId: $dogId
      collaboratorId: $collaboratorId
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; collaboratorId: string }> }
) {
  try {
    const { id: dogId, collaboratorId } = await params;
    console.log('🗑️ Removing collaborator:', collaboratorId, 'from dog:', dogId);
    
    const token = await getAuthToken();
    
    if (!token) {
      console.error('❌ No authentication token found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log('✅ Authentication token found');

    if (!collaboratorId) {
      return NextResponse.json(
        { error: 'Collaborator ID is required' },
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
    
    const data: any = await client.request(REMOVE_COLLABORATOR_MUTATION, {
      dogId,
      collaboratorId,
    });

    console.log('✅ Successfully removed collaborator:', data);
    return NextResponse.json({
      data: data.removeDogCollaborator,
      success: true,
    });
  } catch (error: any) {
    console.error('❌ Error removing collaborator:', error);
    console.error('Error message:', error.message);
    console.error('Error response:', error.response);
    console.error('GraphQL errors:', error.response?.errors);
    
    // Extract more detailed error information
    const errorMessage = error.response?.errors?.[0]?.message || error.message || 'Failed to remove collaborator';
    
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
