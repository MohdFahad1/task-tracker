import { connectDB } from "../../../../lib/mongodb";
import { getCurrentUserId } from "../../../../lib/auth";
import { startTimer } from "../../../../lib/services/time.service";
import { startTimerSchema } from "../../../../lib/validations/time";

export async function POST(request) {
  try {
    const userId = await getCurrentUserId();

    const body = await request.json();

    const result = startTimerSchema.safeParse(body);

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

    const { taskId } = result.data;

    await connectDB();

    const timeLog = await startTimer(userId, taskId);

    return Response.json(
      {
        success: true,
        timeLog,
      },
      { status: 201 }
    );
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

    if (error.message === "ACTIVE_TIMER_EXISTS") {
      return Response.json(
        {
          success: false,
          message: "You already have an active timer",
        },
        { status: 409 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "Failed to start timer",
      },
      { status: 500 }
    );
  }
}