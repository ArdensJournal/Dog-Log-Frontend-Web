import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  console.error('❌ BACKEND_URL is not defined. Please set BACKEND_URL or NEXT_PUBLIC_BACKEND_URL environment variable');
}

// Helper function to get auth token
async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

// GET /api/recent-activity - Fetch user dogs first, then recent activity for each
export async function GET() {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First, get all user dogs
    const dogsQuery = `
      query GetUserDogs {
        userDogs {
          _id
          name
          breed
          gender
          imageUrl
        }
      }
    `;

    console.log('🐕 Fetching user dogs for recent activity...');
    
    const dogsResponse = await fetch(BACKEND_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query: dogsQuery }),
    });

    if (!dogsResponse.ok) {
      console.error('Backend dogs response not OK:', dogsResponse.status);
      return Response.json(
        { error: 'Failed to fetch dogs from backend' }, 
        { status: dogsResponse.status }
      );
    }

    const dogsData = await dogsResponse.json();

    if (dogsData.errors) {
      console.error('GraphQL errors fetching dogs:', dogsData.errors);
      return Response.json(
        { error: 'GraphQL query failed', details: dogsData.errors }, 
        { status: 400 }
      );
    }

    const dogs = dogsData.data?.userDogs || [];
    console.log(`✅ Found ${dogs.length} dogs`);

    if (dogs.length === 0) {
      return Response.json({
        data: {
          dogs: [],
          activities: []
        }
      });
    }

    // For each dog, fetch recent activity
    const allActivities = [];
    
    for (const dog of dogs) {
      try {
        console.log(`📋 Fetching recent activity for dog: ${dog.name} (${dog._id})`);
        
        const activityQuery = `
          query RecentActivity($dogId: ID!) {
            recentActivity(findByDogIdDto: { dogId: $dogId }) {
              type
              potty {
                _id
                addedBy {
                  _id
                  name
                  email
                }
                coordinates {
                  latitude
                  longitude
                }
                createdAt
                date
                environment
                healthFlags
                note
                type
              }
              task {
                _id
                addedBy {
                  _id
                  name
                  email
                }
                createdAt
                date
                description
                isCompleted
                name
                updatedAt
                vaccine {
                  _id
                  name
                }
              }
              vaccineRecord {
                _id
                addedBy {
                  _id
                  name
                  email
                }
                createdAt
                date
                note
                updatedAt
                vaccine {
                  _id
                  name
                  type
                }
                validFor {
                  unit
                  value
                }
              }
              weight {
                _id
                addedBy {
                  _id
                  name
                  email
                }
                createdAt
                date
                dog
                value
              }
            }
          }
        `;

        const activityResponse = await fetch(BACKEND_URL!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: activityQuery,
            variables: { dogId: dog._id }
          }),
        });

        if (activityResponse.ok) {
          const activityData = await activityResponse.json();
          
          if (!activityData.errors && activityData.data?.recentActivity) {
            // Add dog info to each activity
            const dogActivities = activityData.data.recentActivity.map((activity: any) => ({
              ...activity,
              dogId: dog._id,
              dogName: dog.name,
              dogImageUrl: dog.imageUrl
            }));
            
            allActivities.push(...dogActivities);
            console.log(`✅ Added ${dogActivities.length} activities for ${dog.name}`);
          } else if (activityData.errors) {
            console.error(`GraphQL errors for dog ${dog.name}:`, activityData.errors);
          }
        } else {
          console.error(`Failed to fetch activity for dog ${dog.name}:`, activityResponse.status);
        }
      } catch (err) {
        console.error(`Error fetching activity for dog ${dog.name}:`, err);
      }
    }

    // Sort all activities by date (most recent first)
    allActivities.sort((a, b) => {
      const aDate = a.potty?.createdAt || a.task?.createdAt || a.vaccineRecord?.createdAt || a.weight?.createdAt || '';
      const bDate = b.potty?.createdAt || b.task?.createdAt || b.vaccineRecord?.createdAt || b.weight?.createdAt || '';
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

    console.log(`🎉 Successfully fetched ${allActivities.length} total activities`);

    return Response.json({
      data: {
        dogs: dogs,
        activities: allActivities
      }
    });

  } catch (error) {
    console.error('Error in /api/recent-activity GET:', error);
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// POST /api/recent-activity?dogId=123 - Fetch recent activity for specific dog
export async function POST(request: NextRequest) {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dogId = searchParams.get('dogId');

    if (!dogId) {
      return Response.json({ error: 'Dog ID is required' }, { status: 400 });
    }

    console.log(`📋 Fetching recent activity for specific dog: ${dogId}`);
    
    const activityQuery = `
      query RecentActivity($dogId: ID!) {
        recentActivity(findByDogIdDto: { dogId: $dogId }) {
          type
          potty {
            _id
            addedBy {
              _id
              name
              email
            }
            coordinates {
              latitude
              longitude
            }
            createdAt
            date
            environment
            healthFlags
            note
            type
          }
          task {
            _id
            addedBy {
              _id
              name
              email
            }
            createdAt
            date
            description
            isCompleted
            name
            updatedAt
            vaccine {
              _id
              name
            }
          }
          vaccineRecord {
            _id
            addedBy {
              _id
              name
              email
            }
            createdAt
            date
            note
            updatedAt
            vaccine {
              _id
              name
              type
            }
            validFor {
              unit
              value
            }
          }
          weight {
            _id
            addedBy {
              _id
              name
              email
            }
            createdAt
            date
            dog
            value
          }
        }
      }
    `;

    const response = await fetch(BACKEND_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: activityQuery,
        variables: { dogId }
      }),
    });

    if (!response.ok) {
      console.error('Backend activity response not OK:', response.status);
      return Response.json(
        { error: 'Failed to fetch recent activity from backend' }, 
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return Response.json(
        { error: 'GraphQL query failed', details: data.errors }, 
        { status: 400 }
      );
    }

    console.log(`✅ Successfully fetched activity for dog ${dogId}`);
    return Response.json(data);

  } catch (error) {
    console.error('Error in /api/recent-activity POST:', error);
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
