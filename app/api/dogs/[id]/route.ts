import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  console.error(
    "❌ BACKEND_URL is not defined. Please set BACKEND_URL or NEXT_PUBLIC_BACKEND_URL environment variable"
  );
}

// Helper function to get auth token
async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

// GET /api/dogs/[id] - Fetch specific dog
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const token = await getAuthToken();

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Since there's no specific getDogById query, we'll get all user dogs
    // and filter on the frontend, or return the specific dog from userDogs
    const query = `
      query GetUserDogs {
        userDogs {
          _id
          name
          birthday
          breeds
          gender
          imageUrl
          houseCoordinates {
            latitude
            longitude
          }
          collaborators {
            role
            user {
              _id
              name
              email
            }
          }
        }
      }
    `;

    const response = await fetch(BACKEND_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      return Response.json(
        { error: "Failed to fetch dogs from backend" },
        { status: response.status }
      );
    }

    const dogData = await response.json();
    console.log({ dogData });
    if (dogData.errors) {
      return Response.json(
        { error: "GraphQL query failed", details: dogData.errors },
        { status: 400 }
      );
    }

    // Filter to find the specific dog
    const dogs = dogData.data.userDogs || [];
    const specificDog = dogs.find((dog: any) => dog._id === id);

    if (!specificDog) {
      return Response.json({ error: "Dog not found" }, { status: 404 });
    }

    // Return in the same format as the other endpoints
    return Response.json({
      data: {
        dog: specificDog,
      },
    });

    if (!response.ok) {
      return Response.json(
        { error: "Failed to fetch dog from backend" },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.errors) {
      return Response.json(
        { error: "GraphQL query failed", details: data.errors },
        { status: 400 }
      );
    }

    return Response.json(data);
  } catch (error) {
    console.error("Error in /api/dogs/[id] GET:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/dogs/[id] - Update specific dog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log("🔧 PUT handler called for dog ID:", id);

  try {
    const token = await getAuthToken();

    if (!token) {
      console.log("❌ No authentication token found");
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("✅ Authentication token found");

    // Check if request is multipart (contains file)
    const contentType = request.headers.get("content-type");
    console.log("📝 Content-Type:", contentType);

    if (contentType?.includes("multipart/form-data")) {
      // Handle file upload
      console.log("🔧 Processing multipart request...");
      const formData = await request.formData();

      const operations = formData.get("operations") as string;
      const map = formData.get("map") as string;
      const file = formData.get("0") as File;

      console.log("📄 Operations:", operations);
      console.log("🗺️ Map:", map);
      console.log(
        "📁 File:",
        file ? `${file.name} (${file.size} bytes)` : "No file"
      );

      if (!operations || !map) {
        console.error("❌ Missing operations or map in multipart request");
        return Response.json(
          { error: "Invalid multipart request format" },
          { status: 400 }
        );
      }

      // Create new FormData for backend
      const backendFormData = new FormData();
      backendFormData.append("operations", operations);
      backendFormData.append("map", map);
      if (file) {
        backendFormData.append("0", file);
      }

      console.log("🚀 Sending multipart request to backend...");
      const response = await fetch(BACKEND_URL!, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-apollo-operation-name": "UpdateDog", // Add CSRF protection header
          "apollo-require-preflight": "true", // Additional CSRF header
        },
        body: backendFormData,
      });

      console.log("📡 Backend response status:", response.status);
      const responseText = await response.text();
      console.log("📄 Backend response text:", responseText);

      if (!response.ok) {
        console.error(
          "❌ Backend request failed:",
          response.status,
          responseText
        );
        return Response.json(
          { error: "Failed to update dog with file", details: responseText },
          { status: response.status }
        );
      }

      try {
        const data = JSON.parse(responseText);
        return Response.json(data);
      } catch (parseError) {
        console.error("❌ Failed to parse response as JSON:", parseError);
        return Response.json(
          { error: "Invalid response from backend", details: responseText },
          { status: 500 }
        );
      }
    } else {
      // Handle regular JSON update
      console.log("🔧 Processing regular JSON update...");
      const body = await request.json();
      const { name, breeds, birthday, gender } = body;

      console.log("📝 Update data received:", {
        name,
        breeds,
        birthday,
        gender,
      });

      // Ensure breeds is an array
      const breedArray = Array.isArray(breeds)
        ? breeds
        : breeds
        ? [breeds]
        : [];

      const mutation = `
        mutation UpdateDog($updateDogDto: UpdateDogDto!) {
          updateDog(updateDogDto: $updateDogDto) {
            _id
            name
            breeds
            birthday
            gender
            imageUrl
          }
        }
      `;

      const response = await fetch(BACKEND_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: mutation,
          variables: {
            updateDogDto: {
              dogId: id,
              name,
              breeds: breedArray,
              birthday,
              gender,
            },
          },
        }),
      });

      if (!response.ok) {
        return Response.json(
          { error: "Failed to update dog" },
          { status: response.status }
        );
      }

      const updateData = await response.json();

      if (updateData.errors) {
        return Response.json(
          { error: "GraphQL mutation failed", details: updateData.errors },
          { status: 400 }
        );
      }

      return Response.json(updateData);
    }
  } catch (error) {
    console.error("Error in /api/dogs/[id] PUT:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/dogs/[id] - Delete specific dog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log("🗑️ DELETE handler called for dog ID:", id);

  try {
    const token = await getAuthToken();

    if (!token) {
      console.log("❌ No authentication token found for DELETE");
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("✅ Authentication token found for DELETE");

    const mutation = `
      mutation DeleteDog($findByDogIdDto: FindByDogIdDto!) {
        deleteDog(findByDogIdDto: $findByDogIdDto) {
          _id
          name
        }
      }
    `;

    console.log("🚀 Sending DELETE request to backend...");
    const response = await fetch(BACKEND_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          findByDogIdDto: { dogId: id },
        },
      }),
    });

    console.log("📡 Backend DELETE response status:", response.status);
    const responseText = await response.text();
    console.log("📄 Backend DELETE response text:", responseText);

    if (!response.ok) {
      console.error(
        "❌ Backend DELETE request failed:",
        response.status,
        responseText
      );
      return Response.json(
        { error: "Failed to delete dog", details: responseText },
        { status: response.status }
      );
    }

    let deleteData;
    try {
      deleteData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("❌ Failed to parse DELETE response as JSON:", parseError);
      return Response.json(
        { error: "Invalid response from backend", details: responseText },
        { status: 500 }
      );
    }

    if (deleteData.errors) {
      console.error("❌ GraphQL errors in DELETE:", deleteData.errors);
      return Response.json(
        { error: "GraphQL mutation failed", details: deleteData.errors },
        { status: 400 }
      );
    }

    console.log("✅ Dog deleted successfully:", deleteData);
    // Return success response
    return Response.json({
      success: true,
      message: "Dog deleted successfully",
    });
  } catch (error) {
    console.error("Error in /api/dogs/[id] DELETE:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
