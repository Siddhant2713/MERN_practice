import mongoose from "mongoose";

// Q13, Q18
const projectSchema = new mongoose.Schema({
    name: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

export default mongoose.model("Project", projectSchema);
