import mongoose from "mongoose";

// Q8
// createdAt is a normal field here (not `timestamps: true`) so the lab can
// seed transactions on specific past dates for the date-range tests.
const transactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: String,
    amount: Number,
    type: { type: String, enum: ["credit", "debit"] },
    category: String,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Transaction", transactionSchema);
