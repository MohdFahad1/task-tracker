import mongoose from "mongoose";

const timeLogSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },

    startedAt: {
      type: Date,
      required: true,
    },

    endedAt: {
      type: Date,
      default: null,
    },

    duration: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const TimeLog =
  mongoose.models.TimeLog || mongoose.model("TimeLog", timeLogSchema);

export default TimeLog;