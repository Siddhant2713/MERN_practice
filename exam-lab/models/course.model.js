import mongoose from "mongoose";

// Q4
const courseSchema = new mongoose.Schema({
    title: String,
    capacity: { type: Number, required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

export default mongoose.model("Course", courseSchema);
