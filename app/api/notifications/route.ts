import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GraphQLClient, gql } from "graphql-request";

const BACKEND_URL =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = new GraphQLClient(BACKEND_URL as string, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const query = gql`
      query GetUserNotifications {
        getUserNotifications {
          _id
          title
          message
          dog
          isRead
          createdAt
          user
        }
      }
    `;

    const data: any = await client.request(query);

    return NextResponse.json({
      success: true,
      notifications: data.getUserNotifications || [],
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
