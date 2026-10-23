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
        if (!title?.trim()) {
            return res.status(400).json({ success: false, message: "Title cannot be empty" })
        }


        // STEP 2:
        // Validate amount
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ success: false, message: "Amount cannot be empty or less than 0" })
        }




        // STEP 3:
        // Validate category
        const categories = ["food", "travel", "shopping", "bills", "subscription", "other"]
        // const ispresent = categories.some(str => str.includes(category))

        if (!categories.includes(category)) {
            return res.status(400).json({ success: false, message: "Category is invalid" })
        }



        // STEP 4:
        // Validate paymentMethod
        const payment = ["cash", "card", "upi"]
        // const isvalid = payment.some(methd => methd.includes(paymentMethod))
        if (!payment.includes(paymentMethod)) {
            return res.status(400).json({ success: false, message: "Invalid Paymment method" })
        }


        // STEP 5:
        // Create the expense.
        // owner must come from req.user._id

        const expense = await Expense.create({
            title: title.trim(),
            amount,
            category,
            paymentMethod,
            owner: req.user._id
        })

        


        // STEP 6:
        // Return 201 response

        res.status(201).json({
            success: true,
            message: "Expense created successfully",
            expense

        })


    } catch (error) {

        // Handle unexpected errors
        return res.status(500).json({message: "Internal server Error"})

    }
};
