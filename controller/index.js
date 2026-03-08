import { Task } from "../model/Task.js";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

export const FetchTask = async (req, res) => {
  try {
    const task = await Task.find();
    return res.status(200).json({
      message: "Task Fetched SucessFully",
      task,
    });
  } catch (err) {
    console.error("Error ==> CreateTask ", err.message);
  }
};

export const CreateTask = async (req, res) => {
  try {
    const { voiceText } = req.body || {};
    const promt = `
You are an AI assistant that converts voice commands into structured task operations.

Your task is to analyze the voice command and return a valid JSON object.

Rules:
1. Return ONLY a valid JSON object.
2. Do NOT include markdown, explanations, or extra text.
3. If the command is about creating a task, set "operation" to "create".
4. If the command is about viewing or listing tasks, set "operation" to "read".
5. Extract a short and clear task title.
6. Always generate a meaningful description explaining the task clearly.
7. If the user provides additional details (time, date, context), include them in the description.
8. If the description is not explicitly mentioned, intelligently generate one based on the task title.
9. If the command is asking to show tasks, return a description explaining that the user wants to view all tasks.

JSON format:
{
  "operation": "create" | "read",
  "title": "Task title",
  "description": "Clear explanation of the task"
}

Examples:

Voice Command: Create a task to buy groceries
{
  "operation": "create",
  "title": "Buy groceries",
  "description": "Purchase necessary grocery items from the store."
}

Voice Command: Create a task to finish the project report by tomorrow
{
  "operation": "create",
  "title": "Finish the project report",
  "description": "Complete and submit the project report before tomorrow."
}

Voice Command: Remind me to call John in the evening
{
  "operation": "create",
  "title": "Call John",
  "description": "Make a phone call to John in the evening."
}

Voice Command: Show me all my tasks
{
  "operation": "read",
  "title": "",
  "description": "Retrieve and display all existing tasks."
}

Voice Command: List my tasks
{
  "operation": "read",
  "title": "",
  "description": "Fetch and display the list of all tasks."
}

Now parse the following voice command and return ONLY valid JSON.

Voice Command: ${voiceText}
`;

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: promt,
    });

    const output = JSON.parse(response?.text);
    const { operation, title, description = "" } = output || {};
    if (operation === "create") {
      if (!title) {
        return res.status(400).json({
          Error: "title is required!",
        });
      }
      const task = await Task.create({
        title,
        description,
      });
      return res.status(201).json({
        message: "Task Created SucessFully",
        task,
      });
    } else if (operation === "read") {
      const tasks = await Task.find();
      return res.status(200).json({
        message: "Tasks fetched successfully",
      });
    }
  } catch (err) {
    console.error("Error ==> CreateTask ", err.message);
  }
};

export const DeleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const DeletedTask = await Task.findByIdAndDelete(id);

    if (!DeletedTask) {
      return res.status(404).json({ message: "Task Not Found" });
    }

    return res.status(200).json({ message: "Task Deleted Successfully" });
    
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      err,
    });
  }
};
