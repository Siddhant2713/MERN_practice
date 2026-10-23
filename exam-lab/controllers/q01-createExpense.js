// Q1 — Create an Expense Entry                POST /api/expenses
// Problem:  ../EndTermPracticeSheet(1-5).md → Question 1
// Grade:    npm run q 1

import Expense from "../models/expense.model.js";

export const createExpense = async (req, res) => {
    try {

        const {
            title,
            amount,
            category,
            paymentMethod
        } = req.body;


        // STEP 1:
        // Validate title


        // STEP 2:
        // Validate amount


        // STEP 3:
        // Validate category


        // STEP 4:
        // Validate paymentMethod


        // STEP 5:
        // Create the expense.
        // owner must come from req.user._id


        // STEP 6:
        // Return 201 response


    } catch (error) {

        // Handle unexpected errors

    }
};
