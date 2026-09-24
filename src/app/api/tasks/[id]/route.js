import { connectDB } from "../../../../lib/mongodb";
import { getCurrentUserId } from "../../../../lib/auth";
import {
  getTaskById,
  updateTask,
  deleteTask,
} from "../../../../lib/services/task.service";
import { updateTaskSchema } from "../../../../lib/validations/task";

export async function GET(request, { params }) {    
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;

    await connectDB();

    const task = await getTaskById(userId, id);

    if (!task) {
      return Response.json(
        {
          success: false,
          message: "Task not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      task,
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
        message: "Failed to fetch task",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;

    const body = await request.json();

    const result = updateTaskSchema.safeParse(body);

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

    await connectDB();

    const task = await updateTask(userId, id, result.data);

    if (!task) {
      return Response.json(
        {
          success: false,
          message: "Task not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      task,
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
        message: "Failed to update task",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;

    await connectDB();

    const task = await deleteTask(userId, id);

    if (!task) {
      return Response.json(
        {
          success: false,
          message: "Task not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Task deleted successfully",
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
        message: "Failed to delete task",
      },
      { status: 500 }
    );
  }
}