import { connectDB } from "../../../../lib/mongodb";
import { getCurrentUserId } from "../../../../lib/auth";
import { getActiveTimer } from "../../../../lib/services/time.service";

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    await connectDB();

    const timeLog = await getActiveTimer(userId);

    return Response.json({
      success: true,
      timeLog,
    });
  } catch (error) {
    console.error(error);

    if (error.message === "UNAUTHORIZED") {
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "Failed to fetch active timer",
      },
      { status: 500 }
    );
  }
}