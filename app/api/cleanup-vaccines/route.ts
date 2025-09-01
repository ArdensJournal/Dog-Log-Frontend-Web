import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper function to get auth token
async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

export async function DELETE() {
  console.log('🧹 Cleaning up duplicate vaccines...');
  
  try {
    const token = await getAuthToken();
    
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First get all vaccines
    const query = `query { findAllVaccines { _id name } }`;
    const response = await fetch(BACKEND_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      return Response.json({ error: 'Failed to fetch vaccines' }, { status: response.status });
    }

    const data = await response.json();
    const vaccines = data.data?.findAllVaccines || [];
    
    console.log('📋 All vaccines:', vaccines);

    // Group vaccines by name and identify duplicates
    const vaccineGroups = vaccines.reduce((groups: any, vaccine: any) => {
      if (!groups[vaccine.name]) {
        groups[vaccine.name] = [];
      }
      groups[vaccine.name].push(vaccine);
      return groups;
    }, {});

    const deleteMutation = `
      mutation DeleteVaccine($id: ID!) {
        deleteVaccine(id: $id) {
          _id
        }
      }
    `;

    let deletedCount = 0;

    // For each group, keep the first one and delete the rest
    for (const [vaccineName, vaccineList] of Object.entries(vaccineGroups) as any) {
      if (vaccineList.length > 1) {
        console.log(`🔍 Found ${vaccineList.length} duplicates of "${vaccineName}"`);
        
        // Keep the first, delete the rest
        const toDelete = vaccineList.slice(1);
        
        for (const vaccine of toDelete) {
          try {
            console.log(`🗑️ Deleting duplicate vaccine: ${vaccineName} (ID: ${vaccine._id})`);
            
            const deleteResponse = await fetch(BACKEND_URL!, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                query: deleteMutation,
                variables: { id: vaccine._id }
              }),
            });

            if (deleteResponse.ok) {
              const deleteData = await deleteResponse.json();
              if (!deleteData.errors) {
                console.log(`✅ Deleted duplicate vaccine: ${vaccineName}`);
                deletedCount++;
              } else {
                console.error(`❌ GraphQL errors deleting vaccine ${vaccineName}:`, deleteData.errors);
              }
            } else {
              console.error(`❌ Failed to delete vaccine ${vaccineName}: ${deleteResponse.status}`);
            }
          } catch (error) {
            console.error(`❌ Error deleting vaccine ${vaccineName}:`, error);
          }
        }
      }
    }

    return NextResponse.json({ 
      message: `Cleanup completed. Deleted ${deletedCount} duplicate vaccines.`,
      deletedCount
    });

  } catch (error) {
    console.error('❌ Error in vaccine cleanup:', error);
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
