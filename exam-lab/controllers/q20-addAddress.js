// Q20 — Add a New Saved Address               POST /api/account/addresses
// Problem:  ../EndTermPractice(11-20).md → Question 20
// Grade:    npm run q 20

import User from "../models/user.model.js";

export const addAddress = async (
    req,
    res
) => {
    try {

        const {
            label,
            line1,
            city,
            pincode,
            makeDefault
        } = req.body;


        // Validate fields


        // Find logged-in user


        // Check 5-address limit


        // Determine whether new address
        // should become default


        // If new default:
        // remove default flag from existing ones


        // Push address


        // Save user


        // Return addresses

    } catch (error) {

    }
};
