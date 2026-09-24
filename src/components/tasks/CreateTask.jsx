"use client";

import { useState } from "react";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function CreateTask({ onTaskCreated }) {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [prompt, setPrompt] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleGenerateAI() {
    if (!prompt.trim()) {
      return;
    }

    try {
      setAiLoading(true);

      const { data } = await axios.post("/api/tasks/generate", {
        prompt,
      });

      if (data.success) {
        setForm({
          title: data.task.title,
          description: data.task.description,
        });
      }
    } catch (error) {
      console.error("Failed to generate task with AI:", error);
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post("/api/tasks", {
        title: form.title,
        description: form.description,
        status: "pending",
      });

      if (data.success) {
        setForm({
          title: "",
          description: "",
        });

        setPrompt("");
        setOpen(false);

        onTaskCreated?.(data.task);
      }
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleDialogChange(value) {
    setOpen(value);

    if (!value) {
      setPrompt("");
      setForm({
        title: "",
        description: "",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger render={<Button className="cursor-pointer" />}>
        Create Task
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* AI Task Generation */}
          <div className="space-y-2">
            <Label htmlFor="ai-prompt">
              Describe your task
            </Label>

            <Textarea
              id="ai-prompt"
              placeholder="e.g. I need to finish the login page and test it before tomorrow"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              maxLength={1000}
            />

            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer"
              onClick={handleGenerateAI}
              disabled={aiLoading || !prompt.trim()}
            >
              {aiLoading ? "Generating..." : "✨ Generate with AI"}
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>

            <Input
              id="title"
              name="title"
              placeholder="e.g. Complete project documentation"
              value={form.title}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description
            </Label>

            <Textarea
              id="description"
              name="description"
              placeholder="Add a description..."
              value={form.description}
              onChange={handleChange}
              maxLength={1000}
            />
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}