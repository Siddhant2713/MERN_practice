import mongoose from "mongoose";

// Q5
const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

export default mongoose.model("Article", articleSchema);
