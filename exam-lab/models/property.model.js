import mongoose from "mongoose";

// Q2
const propertySchema = new mongoose.Schema({
    title: String,
    city: String,
    rent: Number,
    bedrooms: Number,
    available: { type: Boolean, default: true }
});

export default mongoose.model("Property", propertySchema);
