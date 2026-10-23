import mongoose from "mongoose";

// Q3
const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: {
            type: String,
            enum: ["pending", "shipped", "delivered", "cancelled"],
            default: "pending"
        },
        total: Number,
        deliveryAddress: {
            line1: String,
            city: String,
            pincode: String
        }
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
