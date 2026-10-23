import mongoose from "mongoose";

// Q18
const taskSchema = new mongoose.Schema({
    title: String,
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    status: {
        type: String,
        enum: ["todo", "in_progress", "review", "done"],
        default: "todo"
    }
});

export default mongoose.model("Task", taskSchema);
