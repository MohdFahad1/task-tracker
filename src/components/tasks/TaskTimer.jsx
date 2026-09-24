"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    secs.toString().padStart(2, "0"),
  ].join(":");
}

export default function TaskTimer({
  taskId,
  activeTimer,
  onTimerChange,
}) {
  const [elapsed, setElapsed] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(false);

  const activeTaskId = activeTimer
    ? String(activeTimer.taskId?._id || activeTimer.taskId)
    : null;

  const currentTaskId = String(taskId);

  const isThisTaskActive =
    activeTaskId === currentTaskId;

  const isAnotherTaskActive =
    activeTimer && !isThisTaskActive;

  async function fetchTotalTime() {
    try {
      const { data } = await axios.get(
        `/api/time/${taskId}`
      );

      if (data.success && data.timeLogs) {
        const total = data.timeLogs.reduce(
          (sum, log) => sum + (log.duration || 0),
          0
        );

        setTotalTime(total);
      }
    } catch (error) {
      console.error(
        "Failed to fetch task time logs:",
        error
      );
    }
  }

  useEffect(() => {
    fetchTotalTime();
  }, [taskId]);

  useEffect(() => {
    if (!activeTimer) {
      setElapsed(0);
      return;
    }

    function updateElapsed() {
      const startedAt = new Date(
        activeTimer.startedAt
      ).getTime();

      const seconds = Math.floor(
        (Date.now() - startedAt) / 1000
      );

      setElapsed(Math.max(seconds, 0));
    }

    updateElapsed();

    const interval = setInterval(
      updateElapsed,
      1000
    );

    return () => clearInterval(interval);
  }, [activeTimer]);

  async function handleStart() {
    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/time/start",
        {
          taskId,
        }
      );

      if (data.success) {
        onTimerChange();
      }
    } catch (error) {
      if (error.response?.status === 409) {
        await onTimerChange();
      } else {
        console.error(
          "Failed to start timer:",
          error
        );
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleStop() {
    if (!activeTimer) {
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/time/stop",
        {
          timeLogId: activeTimer._id,
        }
      );

      if (data.success) {
        await fetchTotalTime();
        onTimerChange();
      }
    } catch (error) {
      console.error(
        "Failed to stop timer:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      {totalTime > 0 && (
        <span className="text-xs text-muted-foreground">
          Total: {formatTime(totalTime)}
        </span>
      )}

      {isThisTaskActive && (
        <>
          <span className="min-w-[80px] text-sm font-mono font-medium">
            {formatTime(elapsed)}
          </span>

          <Button
            size="sm"
            variant="destructive"
            onClick={handleStop}
            disabled={loading}
          >
            {loading ? "Stopping..." : "Stop"}
          </Button>
        </>
      )}

      {isAnotherTaskActive && (
        <span className="text-xs text-muted-foreground">
          Another task is running
        </span>
      )}

      {!activeTimer && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleStart}
          disabled={loading}
        >
          {loading ? "Starting..." : "Start"}
        </Button>
      )}
    </div>
  );
}