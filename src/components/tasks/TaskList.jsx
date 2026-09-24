"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import TaskActions from "./TaskActions";
import TaskTimer from "./TaskTimer";

function getStatusBadgeClass(status) {
  switch (status) {
    case "pending":
      return "border-yellow-200 bg-yellow-50 text-yellow-700";

    case "in_progress":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "completed":
      return "border-green-200 bg-green-50 text-green-700";

    default:
      return "border-gray-200 bg-gray-50 text-gray-700";
  }
}

function formatStatus(status) {
  return status
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

export default function TaskList({
  tasks,
  loading,
  onUpdated,
  onDeleted,
}) {
  const [activeTimer, setActiveTimer] = useState(null);

  async function fetchActiveTimer() {
    try {
      const { data } = await axios.get(
        "/api/time/active"
      );

      if (data.success && data.timeLog) {
        setActiveTimer(data.timeLog);
      } else {
        setActiveTimer(null);
      }
    } catch (error) {
      console.error(
        "Failed to fetch active timer:",
        error
      );
    }
  }

  useEffect(() => {
    fetchActiveTimer();
  }, []);

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading tasks...
      </p>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            No tasks yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <Card key={task._id}>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div className="min-w-0">
              <CardTitle className="text-base">
                {task.title}
              </CardTitle>
            </div>

            <div className="flex items-center gap-3">
              <TaskTimer
                taskId={task._id}
                activeTimer={activeTimer}
                onTimerChange={fetchActiveTimer}
              />

              <Badge
                variant="outline"
                className={getStatusBadgeClass(
                  task.status
                )}
              >
                {formatStatus(task.status)}
              </Badge>

              <TaskActions
                task={task}
                onUpdated={onUpdated}
                onDeleted={onDeleted}
              />
            </div>
          </CardHeader>

          {task.description && (
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {task.description}
              </p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}