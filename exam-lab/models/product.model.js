import mongoose from "mongoose";

// Q9, Q16, Q17
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    stock: { type: Number, default: 0, min: 0 }
});

export default mongoose.model("Product", productSchema);
