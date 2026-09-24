import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

export async function generateTaskFromPrompt(prompt) {
    if (!prompt || !prompt.trim()) {
        throw new Error("PROMPT_REQUIRED");
    }

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
    });

    const result = await model.generateContent(`
You are a task management assistant.

Convert the user's natural language task into a clear and actionable task.

Return ONLY valid JSON in this exact format:
{
  "title": "Short clear task title",
  "description": "Clear structured description of what needs to be done"
}

Do not include markdown.
Do not include code fences.
Do not add any other fields.

User input:
${prompt}
`);

    const response = result.response.text();

    let task;

    try {
        task = JSON.parse(response);
    } catch {
        throw new Error("INVALID_AI_RESPONSE");
    }

    if (!task.title || !task.description) {
        throw new Error("INVALID_AI_RESPONSE");
    }

    return {
        title: task.title.trim(),
        description: task.description.trim(),
    };
}