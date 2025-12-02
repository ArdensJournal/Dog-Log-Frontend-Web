import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GraphQLClient, gql } from "graphql-request";

const BACKEND_URL =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId, isRead } = body;

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    const client = new GraphQLClient(BACKEND_URL as string, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const mutation = gql`
      mutation UpdateNotification(
        $updateNotificationDto: UpdateNotificationDto!
      ) {
        updateNotification(updateNotificationDto: $updateNotificationDto) {
          _id
          title
          message
          isRead
        }
      }
    `;

    const variables = {
      updateNotificationDto: {
        notificationId,
        isRead,
      },
    };

    const data: any = await client.request(mutation, variables);

    return NextResponse.json({
      success: true,
      notification: data.updateNotification,
    });
  } catch (error: any) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update notification" },
      { status: 500 }
    );
  }
}
