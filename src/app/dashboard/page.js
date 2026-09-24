import DailySummary from "@/components/summary/DailySummary";
import TaskManager from "@/components/tasks/TaskManager";

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-5">
      <h1 className="text-2xl font-bold">
        Dashboard
      </h1>

      <TaskManager />
    </div>
  );
}