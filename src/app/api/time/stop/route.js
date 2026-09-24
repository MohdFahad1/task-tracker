import { connectDB } from "../../../../lib/mongodb";
import { getCurrentUserId } from "../../../../lib/auth";
import { stopTimer } from "../../../../lib/services/time.service";
import { stopTimerSchema } from "../../../../lib/validations/time";

export async function POST(request) {
  try {
    const userId = await getCurrentUserId();

    const body = await request.json();

    const result = stopTimerSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { timeLogId } = result.data;

    await connectDB();

    const timeLog = await stopTimer(userId, timeLogId);

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

    if (error.message === "ACTIVE_TIMER_NOT_FOUND") {
      return Response.json(
        {
          success: false,
          message: "Active timer not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "Failed to stop timer",
      },
      { status: 500 }
    );
  }
}