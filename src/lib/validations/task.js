import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(50, "Title cannot exceed 50 characters"),

  description: z
    .string()
    .trim()
    .max(200, "Description cannot exceed 200 characters")
    .optional()
    .default(""),

  status: z
    .enum(["pending", "in_progress", "completed"])
    .optional()
    .default("pending"),
});

export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title cannot be empty")
      .max(50, "Title cannot exceed 50 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .max(200, "Description cannot exceed 200 characters")
      .optional(),

    status: z
      .enum(["pending", "in_progress", "completed"])
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });