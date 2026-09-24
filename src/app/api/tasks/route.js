import { connectDB } from "../../../lib/mongodb";
import { getCurrentUserId } from "../../../lib/auth";
import {
  createTask,
  getTasks,
} from "../../../lib/services/task.service";
import { createTaskSchema } from "../../../lib/validations/task";

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    await connectDB();

    const tasks = await getTasks(userId);

    return Response.json({
      success: true,
      tasks,
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
        message: "Failed to fetch tasks",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const userId = await getCurrentUserId();

    const body = await request.json();

    await connectDB();

    const task = await createTask(userId, body);

    return Response.json(
      {
        success: true,
        task,
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

    return Response.json(
      {
        success: false,
        message: "Failed to create task",
      },
      { status: 500 }
    );
  }
}