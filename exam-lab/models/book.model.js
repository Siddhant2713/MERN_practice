import mongoose from "mongoose";

// Q7
const bookSchema = new mongoose.Schema({
    title: String,
    availableCopies: { type: Number, default: 0 }
});

export default mongoose.model("Book", bookSchema);
