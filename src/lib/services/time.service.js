import TimeLog from "../../models/TimeLog";

export async function startTimer(userId, taskId) {
  const activeTimer = await TimeLog.findOne({
    userId,
    endedAt: null,
  });

  if (activeTimer) {
    throw new Error("ACTIVE_TIMER_EXISTS");
  }

  const timeLog = await TimeLog.create({
    userId,
    taskId,
    startedAt: new Date(),
  });

  return timeLog;
}

export async function stopTimer(userId, timeLogId) {
  const timeLog = await TimeLog.findOne({
    _id: timeLogId,
    userId,
    endedAt: null,
  });

  if (!timeLog) {
    throw new Error("ACTIVE_TIMER_NOT_FOUND");
  }

  const endedAt = new Date();

  const duration = Math.floor(
    (endedAt.getTime() - timeLog.startedAt.getTime()) / 1000
  );

  timeLog.endedAt = endedAt;
  timeLog.duration = duration;

  await timeLog.save();

  return timeLog;
}

export async function getActiveTimer(userId) {
  return TimeLog.findOne({
    userId,
    endedAt: null,
  }).populate("taskId");
}

export async function getTaskTimeLogs(userId, taskId) {
  return TimeLog.find({
    userId,
    taskId,
  }).sort({ startedAt: -1 });
}