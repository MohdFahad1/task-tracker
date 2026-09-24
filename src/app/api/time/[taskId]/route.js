import { connectDB } from "../../../../lib/mongodb";
import { getCurrentUserId } from "../../../../lib/auth";
import { getTaskTimeLogs } from "../../../../lib/services/time.service";

export async function GET(request, { params }) {
  try {
    const userId = await getCurrentUserId();
    const { taskId } = await params;

    await connectDB();

    const timeLogs = await getTaskTimeLogs(userId, taskId);

    return Response.json({
      success: true,
      timeLogs,
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
        message: "Failed to fetch time logs",
      },
      { status: 500 }
    );
  }
}