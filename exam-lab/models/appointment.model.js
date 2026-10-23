import mongoose from "mongoose";

// Q6
const appointmentSchema = new mongoose.Schema(
    {
        patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        scheduledFor: { type: Date, required: true },
        status: {
            type: String,
            enum: ["scheduled", "completed", "cancelled"],
            default: "scheduled"
        }
    },
    { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
