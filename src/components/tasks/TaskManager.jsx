"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import CreateTask from "./CreateTask";
import TaskList from "./TaskList";
import DailySummary from "../summary/DailySummary";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summaryRefreshKey, setSummaryRefreshKey] = useState(0);

  async function fetchTasks() {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/tasks");

      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error(
        "Failed to fetch tasks:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  function handleTaskCreated(task) {
    setTasks((prev) => [task, ...prev]);
  }

  function handleTaskUpdated(updatedTask) {
    setTasks((prev) =>
      prev.map((task) =>
        task._id === updatedTask._id
          ? updatedTask
          : task
      )
    );
  }

  function handleTaskDeleted(taskId) {
    setTasks((prev) =>
      prev.filter((task) => task._id !== taskId)
    );
  }

  function handleTimerChange() {
    setSummaryRefreshKey((prev) => prev + 1);
  }

  return (
    <div className="space-y-6">
      <DailySummary
        refreshKey={summaryRefreshKey}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Tasks
        </h2>

        <CreateTask
          onTaskCreated={handleTaskCreated}
        />
      </div>

      <TaskList
        tasks={tasks}
        loading={loading}
        onUpdated={handleTaskUpdated}
        onDeleted={handleTaskDeleted}
        onTimerChange={handleTimerChange}
      />
    </div>
  );
}