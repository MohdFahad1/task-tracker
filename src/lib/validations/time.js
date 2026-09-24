import { z } from "zod";

export const startTimerSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
});

export const stopTimerSchema = z.object({
  timeLogId: z.string().min(1, "Time log ID is required"),
});