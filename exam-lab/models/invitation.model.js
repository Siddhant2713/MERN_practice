import mongoose from "mongoose";

// Q13
const invitationSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    invitedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
        type: String,
        enum: ["pending", "accepted", "declined"],
        default: "pending"
    }
});

export default mongoose.model("Invitation", invitationSchema);
