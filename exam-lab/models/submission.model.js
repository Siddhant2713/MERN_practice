import mongoose from "mongoose";

// Q12
const submissionSchema = new mongoose.Schema({
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    submissionUrl: { type: String, required: true },
    submittedAt: Date
});

export default mongoose.model("Submission", submissionSchema);
