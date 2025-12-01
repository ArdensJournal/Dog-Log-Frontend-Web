import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper function to get auth token
async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

// POST /api/tips/chat - Ask questions about health insights
export async function POST(request: NextRequest) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { dogId, question, insights } = body;

    if (!dogId || !question) {
      return Response.json(
        { error: "Missing required fields: dogId and question" },
        { status: 400 }
      );
    }

    // For now, provide a simple contextual response based on the insights
    // TODO: Replace with actual AI chat endpoint when available in backend
    const contextualResponse = generateContextualResponse(question, insights);

    return Response.json({
      answer: contextualResponse,
      dogId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in /api/tips/chat POST:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Helper function to generate contextual responses
function generateContextualResponse(
  question: string,
  insights: string[]
): string {
  const lowerQuestion = question.toLowerCase();

  // Check for specific keywords and provide relevant responses
  if (
    lowerQuestion.includes("weight") ||
    lowerQuestion.includes("overweight") ||
    lowerQuestion.includes("diet")
  ) {
    const weightInsight = insights.find(
      (i) =>
        i.toLowerCase().includes("weight") || i.toLowerCase().includes("diet")
    );
    if (weightInsight) {
      return `Based on the health insights, here's what was recommended about weight management: "${weightInsight}". It's important to follow your vet's guidance and monitor your dog's weight regularly.`;
    }
    return "Weight management is crucial for your dog's health. Please consult with your veterinarian for a personalized diet plan and exercise routine.";
  }

  if (
    lowerQuestion.includes("exercise") ||
    lowerQuestion.includes("activity") ||
    lowerQuestion.includes("walk")
  ) {
    const exerciseInsight = insights.find(
      (i) =>
        i.toLowerCase().includes("exercise") ||
        i.toLowerCase().includes("activity") ||
        i.toLowerCase().includes("walk")
    );
    if (exerciseInsight) {
      return `Regarding exercise, the AI suggested: "${exerciseInsight}". Regular physical activity is essential for your dog's physical and mental wellbeing.`;
    }
    return "Regular exercise is important for your dog's health. The amount and type depend on breed, age, and health status. Consult your vet for specific recommendations.";
  }

  if (
    lowerQuestion.includes("food") ||
    lowerQuestion.includes("feed") ||
    lowerQuestion.includes("nutrition")
  ) {
    const nutritionInsight = insights.find(
      (i) =>
        i.toLowerCase().includes("food") ||
        i.toLowerCase().includes("nutrition") ||
        i.toLowerCase().includes("diet")
    );
    if (nutritionInsight) {
      return `About nutrition: "${nutritionInsight}". Always choose high-quality dog food appropriate for your dog's life stage and health needs.`;
    }
    return "Proper nutrition is fundamental to your dog's health. Choose high-quality food appropriate for your dog's age, size, and activity level.";
  }

  if (
    lowerQuestion.includes("vaccine") ||
    lowerQuestion.includes("vaccination") ||
    lowerQuestion.includes("shot")
  ) {
    return "Vaccinations protect your dog from serious diseases. Please follow your veterinarian's recommended vaccination schedule and keep records up to date.";
  }

  if (
    lowerQuestion.includes("vet") ||
    lowerQuestion.includes("doctor") ||
    lowerQuestion.includes("checkup")
  ) {
    return "Regular veterinary checkups are essential for preventive care. Annual exams help catch potential issues early. If you notice any concerning symptoms, schedule a visit promptly.";
  }

  if (lowerQuestion.includes("breed") || lowerQuestion.includes("specific")) {
    return "Breed-specific health considerations are important. Different breeds have different predispositions to certain conditions. Consult with your vet about breed-specific health screenings.";
  }

  // Generic response
  return `Thank you for your question. Based on the health insights generated for your dog, I recommend discussing specific concerns with your veterinarian. The insights provided are general recommendations, and your vet can provide personalized medical advice. ${
    insights.length > 0
      ? `Here's one of the key insights: "${insights[0]}"`
      : ""
  }`;
}
