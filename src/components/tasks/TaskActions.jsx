"use client";

import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { Loader2 } from "lucide-react";

export default function TaskActions({ task, onUpdated, onDeleted }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: task.title,
    description: task.description || "",
  });

  async function updateTask(updates) {
    try {
      setLoading(true);

      const { data } = await axios.patch(
        `/api/tasks/${task._id}`,
        updates
      );

      if (data.success) {
        onUpdated(data.task);
        setEditOpen(false);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    await updateTask({
      title: form.title.trim(),
      description: form.description.trim(),
    });
  }

  async function handleDelete() {
    try {
      setLoading(true);

      const { data } = await axios.delete(
        `/api/tasks/${task._id}`
      );

      if (data.success) {
        setDeleteOpen(false);
        onDeleted(task._id);
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer"
            />
          }
        >
          ⋮
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">

          <DropdownMenuItem
            onClick={() => setEditOpen(true)}
            className="cursor-pointer"
          >
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              updateTask({
                status: "pending",
              })
            }
            className="cursor-pointer"
          >
            Mark Pending
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              updateTask({
                status: "in_progress",
              })
            }
            className="cursor-pointer"
          >
            Mark In Progress
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              updateTask({
                status: "completed",
              })
            }
            className="cursor-pointer"
          >
            Mark Completed
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
            onClick={() => {
              setDeleteOpen(true);
            }}
          >
            Delete
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this task?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. This will permanently
              delete{" "}
              <span className="font-medium text-foreground">
                "{task.title}"
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive/80 text-white hover:bg-destructive/70"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={editOpen}
        onOpenChange={setEditOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Edit Task
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleEdit}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor={`title-${task._id}`}>
                Title
              </Label>

              <Input
                id={`title-${task._id}`}
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
                maxLength={100}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`description-${task._id}`}>
                Description
              </Label>

              <Textarea
                id={`description-${task._id}`}
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                maxLength={1000}
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}