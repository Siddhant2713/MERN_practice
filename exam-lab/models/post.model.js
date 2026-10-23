import mongoose from "mongoose";

// Q14, Q15
const postSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
    isRemoved: { type: Boolean, default: false }
});

export default mongoose.model("Post", postSchema);
