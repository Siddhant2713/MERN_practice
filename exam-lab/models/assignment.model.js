import mongoose from "mongoose";

// Q12
const assignmentSchema = new mongoose.Schema({
    title: String,
    deadline: { type: Date, required: true }
});

export default mongoose.model("Assignment", assignmentSchema);
