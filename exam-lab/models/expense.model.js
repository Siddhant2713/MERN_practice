import mongoose from "mongoose";

// Q1
const expenseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        category: {
            type: String,
            enum: ["food", "travel", "shopping", "bills", "subscription", "other"],
            required: true
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "card", "upi"],
            required: true
        },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    },
    { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
