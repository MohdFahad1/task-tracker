import DailySummary from "@/components/summary/DailySummary";
import TaskManager from "@/components/tasks/TaskManager";
import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Dashboard
        </h1>
        <UserButton />
      </div>

      <TaskManager />
    </div>
  );
}