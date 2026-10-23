// Q10 — Deactivate Your Account Securely      POST /api/account/deactivate
// Problem:  ../EndTermPractice(6-10).txt → Question 10
// Grade:    npm run q 10
// Every lab user's password is: secret123

import bcrypt from "bcrypt";

import User from "../models/user.model.js";

export const deactivateAccount = async (
    req,
    res
) => {
    try {

        const {
            currentPassword,
            confirmation
        } = req.body;


        // STEP 1:
        // Validate required fields


        // STEP 2:
        // Validate confirmation text


        // STEP 3:
        // Load current user from database
        // Password is needed here


        // STEP 4:
        // Handle missing user


        // STEP 5:
        // Compare currentPassword
        // with stored hash


        // STEP 6:
        // Handle incorrect password


        // STEP 7:
        // Set isActive to false


        // STEP 8:
        // Save user


        // STEP 9:
        // Clear authentication cookie


        // STEP 10:
        // Return success response


    } catch (error) {

    }
};
