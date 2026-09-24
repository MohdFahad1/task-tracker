"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import CreateTask from "./CreateTask";
import TaskList from "./TaskList";

export default function TaskManager() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchTasks() {
        try {
            const { data } = await axios.get("/api/tasks");

            if (data.success) {
                setTasks(data.tasks);
            }
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        } finally {
            setLoading(false);
        }
    }

    function handleTaskUpdated(updatedTask) {
        setTasks((prev) =>
            prev.map((task) =>
                task._id === updatedTask._id ? updatedTask : task
            )
        );
    }

    function handleTaskDeleted(taskId) {
        setTasks((prev) =>
            prev.filter((task) => task._id !== taskId)
        );
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    function handleTaskCreated(task) {
        setTasks((prev) => [task, ...prev]);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Tasks</h2>

                <CreateTask onTaskCreated={handleTaskCreated} />
            </div>

            <TaskList
                tasks={tasks}
                loading={loading}
                onUpdated={handleTaskUpdated}
                onDeleted={handleTaskDeleted}
            />
        </div>
    );
}