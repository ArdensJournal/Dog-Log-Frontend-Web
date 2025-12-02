import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GraphQLClient, gql } from "graphql-request";

const BACKEND_URL =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fcmToken } = body;

    if (!fcmToken) {
      return NextResponse.json(
        { error: "FCM token is required" },
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
      mutation RegisterNotification(
        $registerNotificationDto: RegisterNotificationDto!
      ) {
        registerNotification(
          registerNotificationDto: $registerNotificationDto
        ) {
          _id
          email
          name
        }
      }
    `;

    const variables = {
      registerNotificationDto: {
        fcmToken,
      },
    };

    const data: any = await client.request(mutation, variables);

    return NextResponse.json({
      success: true,
      data: data.registerNotification,
      message: "FCM token registered successfully",
    });
  } catch (error: any) {
    console.error("Error registering FCM token:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register FCM token" },
      { status: 500 }
    );
  }
}
