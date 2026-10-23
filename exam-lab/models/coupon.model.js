import mongoose from "mongoose";

// Q17 — codes are stored in UPPERCASE
const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, uppercase: true },
    discountPercent: Number,
    minimumCartValue: { type: Number, default: 0 },
    expiresAt: Date,
    usageLimit: Number,
    usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

export default mongoose.model("Coupon", couponSchema);
