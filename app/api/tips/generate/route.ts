import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GraphQLClient, gql } from "graphql-request";

const BACKEND_URL =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(request: NextRequest) {
  try {
    console.log("Generating AI tips with createGeminiTip...");

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.error("No authentication token found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Authentication token found");

    const body = await request.json();
    const { dogId, language = "HEBREW" } = body;

    console.log("🤖 Request params:", { dogId, language });
    console.log("🤖 Dog ID type:", typeof dogId);
    console.log("🤖 Dog ID length:", dogId?.length);
    console.log("🤖 Dog ID hex check:", /^[0-9a-fA-F]{24}$/.test(dogId));

    if (!dogId) {
      console.error("Missing dogId");
      return NextResponse.json(
        { error: "Dog ID is required" },
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
      mutation CreateGeminiTip($createTipDto: GeminiTipDto!) {
        createGeminiTip(createTipDto: $createTipDto)
      }
    `;

    const variables = {
      createTipDto: {
        dogId,
        language,
      },
    };

    console.log("🚀 Executing createGeminiTip mutation...");
    console.log("🚀 Variables:", JSON.stringify(variables, null, 2));
    console.log("🚀 Exact match with Postman format:", {
      createTipDto: { dogId, language },
    });
    console.log("🚀 Postman working example:", {
      createTipDto: { dogId: "6925f7750d11be7566b5f32a", language: "HEBREW" },
    });
    console.log("🚀 GraphQL endpoint:", BACKEND_URL);
    console.log("🚀 Has auth token:", !!token);

    const data: any = await client.request(mutation, variables);

    console.log("Tips generation successful");
    console.log("Response:", JSON.stringify(data, null, 2));
    console.log("createGeminiTip returned:", data.createGeminiTip);

    return NextResponse.json({
      success: true,
      data,
      message: data.createGeminiTip
        ? "Tips generation started successfully! The AI is processing... This may take 10-30 seconds."
        : "Tips generation request sent, but backend returned false. Check if the dog has enough data for tips.",
    });
  } catch (error: any) {
    console.error("Error generating tips:", error);
    console.error("Error message:", error.message);

    if (error.response?.errors) {
      console.error(
        "GraphQL errors:",
        JSON.stringify(error.response.errors, null, 2)
      );
    }

    return NextResponse.json(
      {
        error: error.message || "Failed to generate tips",
        details: error.response?.errors || null,
      },
      { status: 500 }
    );
  }
}
