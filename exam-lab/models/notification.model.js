import mongoose from "mongoose";

// Q19
const notificationSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        message: String,
        isRead: { type: Boolean, default: false }
    },
    { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
