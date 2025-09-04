import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3456/graphql';

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

// GET /api/tasks - Get user tasks
export async function GET(request: NextRequest) {
  console.log('📋 GET /api/tasks');
  
  try {
    const token = await getAuthToken();
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dogId = searchParams.get('dogId');

    console.log(`📋 Fetching tasks - dogId: ${dogId || 'all dogs'}`);

    const query = `
      query GetUserTasks($getUserTasksDto: GetUserTasksDto!) {
        getUserTasks(getUserTasksDto: $getUserTasksDto) {
          _id
          name
          description
          date
          isCompleted
          createdAt
          updatedAt
          dog {
            _id
            name
          }
          vaccine {
            _id
            name
          }
          addedBy {
            _id
            name
          }
        }
      }
    `;

    const variables = {
      getUserTasksDto: dogId ? { dogId } : {}
    };

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    console.log('🌐 Tasks backend response status:', response.status);
    const responseText = await response.text();
    console.log('📄 Tasks backend response text:', responseText);

    if (!response.ok) {
      console.error('❌ Backend response not ok:', response.status);
      return Response.json({ 
        error: 'Backend error', 
        details: responseText 
      }, { status: response.status });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse tasks response as JSON:', parseError);
      return Response.json({ 
        error: 'Invalid JSON response from backend', 
        details: responseText 
      }, { status: 500 });
    }
    
    if (data.errors) {
      console.error('❌ GraphQL errors:', data.errors);
      return Response.json({ error: 'GraphQL errors', details: data.errors }, { status: 400 });
    }

    const tasks = data.data?.getUserTasks || [];

    console.log(`✅ Retrieved ${tasks.length} tasks`);
    return Response.json({ data: tasks, success: true });

  } catch (error) {
    console.error('❌ Error in GET /api/tasks:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  console.log('📋 POST /api/tasks - Creating task');
  
  try {
    const token = await getAuthToken();
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('📄 Request body:', JSON.stringify(body, null, 2));

    // Validate required fields according to GraphQL schema
    if (!body.name || !body.date || !body.dog) {
      console.error('❌ Missing required fields');
      return Response.json({ 
        error: 'Missing required fields: name, date, dog are required' 
      }, { status: 400 });
    }

    const mutation = `
      mutation CreateTask($createTaskDto: CreateTaskDto!) {
        createTask(createTaskDto: $createTaskDto) {
          _id
          name
          description
          date
          isCompleted
          createdAt
          updatedAt
          dog {
            _id
            name
          }
          vaccine {
            _id
            name
          }
          addedBy {
            _id
            name
          }
        }
      }
    `;

    // Build CreateTaskDto exactly as GraphQL expects
    const createTaskDto: any = {
      name: body.name,
      date: body.date,
      dog: body.dog
    };

    // Add optional fields only if provided
    if (body.description) {
      createTaskDto.description = body.description;
    }
    
    if (typeof body.isCompleted === 'boolean') {
      createTaskDto.isCompleted = body.isCompleted;
    }
    
    // Add vaccine ObjectId if provided (should be MongoDB ObjectId, not enum string)
    if (body.vaccine) {
      createTaskDto.vaccine = body.vaccine;
    }

    console.log('🚀 Sending createTaskDto:', JSON.stringify(createTaskDto, null, 2));

    const variables = { createTaskDto };

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    console.log('🌐 Create task backend response status:', response.status);
    const responseText = await response.text();
    console.log('📄 Create task backend response text:', responseText);

    if (!response.ok) {
      console.error('❌ Backend response not ok:', response.status);
      return Response.json({ 
        error: 'Backend error', 
        details: responseText 
      }, { status: response.status });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse create task response as JSON:', parseError);
      return Response.json({ 
        error: 'Invalid JSON response from backend', 
        details: responseText 
      }, { status: 500 });
    }
    console.log('📄 Backend response:', JSON.stringify(data, null, 2));
    
    if (data.errors) {
      console.error('❌ GraphQL errors:', data.errors);
      
      // Check if the task was actually created despite the error
      if (data.data?.createTask?._id) {
        console.log('✅ Task was created successfully despite GraphQL error, returning success');
        return Response.json({
          data: data.data.createTask,
          success: true,
          message: 'Task created successfully'
        });
      }
      
      return Response.json({ 
        error: 'GraphQL errors', 
        details: data.errors,
        message: data.errors?.[0]?.message || 'Unknown GraphQL error'
      }, { status: 400 });
    }

    console.log('✅ Task created successfully');
    return Response.json({
      data: data.data.createTask,
      success: true,
      message: 'Task created successfully'
    });

  } catch (error) {
    console.error('❌ Error in POST /api/tasks:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Note: PUT and DELETE routes are disabled until backend implements updateTask and deleteTask mutations
// 
// export async function PUT(request: NextRequest) {
//   return Response.json({ 
//     error: 'Task updates not yet supported by backend',
//     message: 'The backend does not currently support task updates. Waiting for updateTask mutation implementation.'
//   }, { status: 501 });
// }
// 
// export async function DELETE(request: NextRequest) {
//   return Response.json({ 
//     error: 'Task deletion not yet supported by backend',
//     message: 'The backend does not currently support task deletion. Waiting for deleteTask mutation implementation.'
//   }, { status: 501 });
// }
