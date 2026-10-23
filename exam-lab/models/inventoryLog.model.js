import mongoose from "mongoose";

// Q16
const inventoryLogSchema = new mongoose.Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: Number,
        type: { type: String, enum: ["restock", "sale", "adjustment"] },
        performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    },
    { timestamps: true }
);

export default mongoose.model("InventoryLog", inventoryLogSchema);
