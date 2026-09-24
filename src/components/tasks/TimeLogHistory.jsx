"use client";

import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Loader2 } from "lucide-react";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(seconds) {
  if (!seconds) {
    return "0m";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }

  return `${secs}s`;
}

export default function TimeLogHistory({ taskId }) {
  const [open, setOpen] = useState(false);
  const [timeLogs, setTimeLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchTimeLogs() {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `/api/time/${taskId}`
      );

      if (data.success) {
        setTimeLogs(data.timeLogs || []);
      }
    } catch (error) {
      console.error(
        "Failed to fetch time logs:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange(value) {
    setOpen(value);

    if (value) {
      fetchTimeLogs();
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger render={<Button variant="outline"
        size="sm"
        className="text-muted-foreground cursor-pointer" />}>

        View Time Logs
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Time Log History
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="py-6 text-center text-sm text-muted-foreground flex items-center gap-2">

  <Loader2 className="h-4 w-4 animate-spin" />
            Loading time logs...
          </p>
        ) : timeLogs.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No time logs yet.
          </p>
        ) : (
          <div className="max-h-[400px] space-y-3 overflow-y-auto">
            {timeLogs.map((log) => (
              <div
                key={log._id}
                className="rounded-lg border p-3"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">
                      {formatDate(log.startedAt)}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {formatTime(log.startedAt)}
                      {" → "}
                      {log.endedAt
                        ? formatTime(log.endedAt)
                        : "Running"}
                    </p>
                  </div>

                  <span className="text-sm font-medium">
                    {log.duration !== null
                      ? formatDuration(log.duration)
                      : "Running"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}