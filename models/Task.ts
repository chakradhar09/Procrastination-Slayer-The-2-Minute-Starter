import { Schema, model, models } from "mongoose";

const TaskSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    starter: { type: String, required: true },
    steps: [{ type: String }],
    sprintLength: { type: Number, default: 10 },
    mode: { type: String, default: "Normal" },
    status: { type: String, default: "done" },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const Task = models.Task || model("Task", TaskSchema);
