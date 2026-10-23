// Q8 — Search Your Transactions               GET /api/transactions
// Problem:  ../EndTermPractice(6-10).txt → Question 8
// Grade:    npm run q 8

import Transaction from "../models/transaction.model.js";

export const getTransactions = async (
    req,
    res
) => {
    try {

        const {
            type,
            category,
            minAmount,
            maxAmount,
            from,
            to,
            sort
        } = req.query;


        // STEP 1:
        // Start filter with logged-in user


        // STEP 2:
        // Add type and category


        // STEP 3:
        // Build amount range


        // STEP 4:
        // Build date range


        // STEP 5:
        // Validate sort


        // STEP 6:
        // Parse page and limit


        // STEP 7:
        // Calculate skip


        // STEP 8:
        // Build sort object


        // STEP 9:
        // Query transactions


        // STEP 10:
        // Count matching transactions


        // STEP 11:
        // Return pagination information


    } catch (error) {

    }
};
