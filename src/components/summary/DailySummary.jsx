"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatTime(seconds) {
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

export default function DailySummary({ refreshKey }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchSummary() {
    try {
      const { data } = await axios.get(
        "/api/summary/daily"
      );

      if (data.success) {
        setSummary(data.summary);
      }
    } catch (error) {
      console.error(
        "Failed to fetch daily summary:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSummary();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="py-6">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="mt-3 h-8 w-16 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!summary) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-sm text-muted-foreground">
            Unable to load today's summary.
          </p>
        </CardContent>
      </Card>
    );
  }

  const summaryItems = [
    {
      title: "Total Time",
      value: formatTime(summary.totalTimeTracked),
    },
    {
      title: "Tasks Worked",
      value: summary.tasksWorkedOn,
    },
    {
      title: "Completed",
      value: summary.completedTasks,
    },
    {
      title: "In Progress",
      value: summary.inProgressTasks,
    },
    {
      title: "Pending",
      value: summary.pendingTasks,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {summaryItems.map((item) => (
        <Card key={item.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">
              {item.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}