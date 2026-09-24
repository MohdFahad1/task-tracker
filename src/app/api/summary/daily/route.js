import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUserId } from "@/lib/auth";
import { getDailySummary } from "@/lib/services/summary.service";

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    await connectDB();

    const summary = await getDailySummary(userId);

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error(
      "Daily summary error:",
      error
    );

    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch daily summary",
      },
      { status: 500 }
    );
  }
}