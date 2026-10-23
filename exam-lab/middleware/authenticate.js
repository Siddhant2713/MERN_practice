// Q5 (part 1 of 3) — Authentication Middleware
// Problem:  ../EndTermPracticeSheet(1-5).md → Question 5
// Grade:    npm run q 5
// The JWT was created at login like:  jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
// and stored in an HTTP-only cookie named "token".

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticate = async (
    req,
    res,
    next
) => {
    try {

        // STEP 1:
        // Read token from req.cookies


        // STEP 2:
        // Reject missing token


        // STEP 3:
        // Verify JWT


        // STEP 4:
        // Find user using decoded userId


        // STEP 5:
        // Exclude password


        // STEP 6:
        // Handle deleted/missing user


        // STEP 7:
        // Attach user to req.user


        // STEP 8:
        // Call next()


    } catch (error) {

        // Handle invalid or expired JWT

    }
};
