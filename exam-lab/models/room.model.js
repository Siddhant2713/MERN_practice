import mongoose from "mongoose";

// Q11
const roomSchema = new mongoose.Schema({
    name: String,
    availableRooms: { type: Number, default: 0 }
});

export default mongoose.model("Room", roomSchema);
