import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    dueDate: Date,
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    priority: { type: String, enum: ["low", "medium", "high"] },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
