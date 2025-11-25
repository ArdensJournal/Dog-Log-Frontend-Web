import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GraphQLClient, gql } from "graphql-request";

const BACKEND_URL =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dogId: string }> }
) {
  try {
    const { dogId } = await params;
    console.log("📚 Fetching tips for dog:", dogId);
    console.log("📚 Dog ID type:", typeof dogId);
    console.log("📚 Dog ID length:", dogId?.length);
    console.log("📚 Dog ID hex check:", /^[0-9a-fA-F]{24}$/.test(dogId));

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.error("No authentication token found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Authentication token found");

    const client = new GraphQLClient(BACKEND_URL as string, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const query = gql`
      query FindTipsByDogId($findByDogIdDto: FindByDogIdDto!) {
        findTipsByDogId(findByDogIdDto: $findByDogIdDto) {
          _id
          content
          createdAt
          isRead
          language
          source
          updatedAt
        }
      }
    `;

    const variables = {
      findByDogIdDto: {
        dogId,
      },
    };

    console.log("🚀 Executing findTipsByDogId query...");
    console.log("🚀 Variables:", JSON.stringify(variables, null, 2));
    console.log("🚀 Exact match with Postman format:", {
      findByDogIdDto: { dogId },
    });
    console.log("🚀 GraphQL endpoint:", BACKEND_URL);
    console.log("🚀 Has auth token:", !!token);

    const data: any = await client.request(query, variables);

    console.log("Tips fetched successfully");
    console.log("Full Response:", JSON.stringify(data, null, 2));
    console.log("Tips Array:", data.findTipsByDogId);
    console.log("Tips Count:", data.findTipsByDogId?.length || 0);

    return NextResponse.json({
      success: true,
      data,
      tipsCount: data.findTipsByDogId?.length || 0,
    });
  } catch (error: any) {
    console.error("Error fetching tips:", error);
    console.error("Error message:", error.message);

    if (error.response?.errors) {
      console.error(
        "GraphQL errors:",
        JSON.stringify(error.response.errors, null, 2)
      );
    }

    return NextResponse.json(
      {
        error: error.message || "Failed to fetch tips",
        details: error.response?.errors || null,
      },
      { status: 500 }
    );
  }
}
