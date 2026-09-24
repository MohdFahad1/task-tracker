import Task from "../../models/Task";
import TimeLog from "../../models/TimeLog";

export async function getDailySummary(userId) {
  const now = new Date();

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const [
    completedTasks,
    inProgressTasks,
    pendingTasks,
  ] = await Promise.all([
    Task.countDocuments({
      userId,
      status: "completed",
    }),

    Task.countDocuments({
      userId,
      status: "in_progress",
    }),

    Task.countDocuments({
      userId,
      status: "pending",
    }),
  ]);

  const timeLogs = await TimeLog.find({
    userId,
    startedAt: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  }).populate("taskId");

  const taskIds = new Set(
    timeLogs.map((log) =>
      String(log.taskId?._id || log.taskId)
    )
  );

  let totalTimeTracked = timeLogs.reduce(
    (total, log) => total + (log.duration || 0),
    0
  );

  const activeTimer = timeLogs.find(
    (log) => log.endedAt === null
  );

  if (activeTimer) {
    const activeDuration = Math.floor(
      (Date.now() -
        new Date(activeTimer.startedAt).getTime()) /
        1000
    );

    totalTimeTracked += Math.max(
      activeDuration,
      0
    );
  }

  return {
    date: startOfDay,
    tasksWorkedOn: taskIds.size,
    totalTimeTracked,
    completedTasks,
    inProgressTasks,
    pendingTasks,
  };
}