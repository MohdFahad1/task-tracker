import { NextResponse } from "next/server";

import { getCurrentUserId } from "../../../../lib/auth";
import { generateTaskFromPrompt } from "../../../../lib/services/ai-task.service";

export async function POST(request) {
  try {
    await getCurrentUserId();

    const body = await request.json();

    const task = await generateTaskFromPrompt(body.prompt);

    return NextResponse.json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("AI task generation error:", error);

    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    if (error.message === "PROMPT_REQUIRED") {
      return NextResponse.json(
        {
          success: false,
          message: "Prompt is required",
        },
        { status: 400 }
      );
    }

    if (error.message === "INVALID_AI_RESPONSE") {
      return NextResponse.json(
        {
          success: false,
          message: "AI returned an invalid response",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate task",
      },
      { status: 500 }
    );
  }
}