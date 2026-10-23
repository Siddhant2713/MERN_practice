import mongoose from "mongoose";

// Q14, Q15
const reportSchema = new mongoose.Schema(
    {
        post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
        reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        reason: {
            type: String,
            enum: ["spam", "harassment", "misinformation", "other"],
            required: true
        },
        details: { type: String, default: "" },
        status: {
            type: String,
            enum: ["pending", "dismissed", "resolved"],
            default: "pending"
        },
        reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    },
    { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
