import Task from "../../models/Task";

export async function createTask(userId, data) {
  const task = await Task.create({
    userId,
    title: data.title,
    description: data.description || "",
    status: data.status || "pending",
  });

  return task;
}

export async function getTasks(userId) {
  return Task.find({ userId }).sort({ createdAt: -1 });
}

export async function getTaskById(userId, taskId) {
  return Task.findOne({
    _id: taskId,
    userId,
  });
}

export async function updateTask(userId, taskId, data) {
  return Task.findOneAndUpdate(
    {
      _id: taskId,
      userId,
    },
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    }
  );
}

export async function deleteTask(userId, taskId) {
  return Task.findOneAndDelete({
    _id: taskId,
    userId,
  });
}