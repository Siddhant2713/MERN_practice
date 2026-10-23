import mongoose from "mongoose";

// Q11
const reservationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    checkIn: { type: Date, required: true },
    status: {
        type: String,
        enum: ["confirmed", "cancelled", "completed"],
        default: "confirmed"
    }
});

export default mongoose.model("Reservation", reservationSchema);
