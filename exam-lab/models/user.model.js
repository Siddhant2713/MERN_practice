import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

// Embedded sub-document for Q20 (saved addresses)
const addressSchema = new mongoose.Schema({
    label: String,
    line1: String,
    city: String,
    pincode: String,
    isDefault: { type: Boolean, default: false }
});

// One User model shared by every question.
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }, // bcrypt hash, never plain text

        role: {
            type: String,
            enum: ["user", "moderator", "admin", "warehouse"],
            default: "user"
        },

        isActive: { type: Boolean, default: true }, // Q10

        subscription: {                              // Q5
            plan: { type: String, enum: ["free", "premium"], default: "free" },
            expiresAt: Date
        },

        borrowedBooks: [{ type: ObjectId, ref: "Book" }],     // Q7
        enrolledCourses: [{ type: ObjectId, ref: "Course" }], // Q4

        cart: [                                               // Q17
            {
                product: { type: ObjectId, ref: "Product" },
                quantity: Number
            }
        ],

        addresses: [addressSchema]                            // Q20
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
