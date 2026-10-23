// Q7 — Borrow a Library Book                  POST /api/books/:bookId/borrow
// Problem:  ../EndTermPractice(6-10).txt → Question 7
// Grade:    npm run q 7

import mongoose from "mongoose";

import Book from "../models/book.model.js";
import User from "../models/user.model.js";

export const borrowBook = async (
    req,
    res
) => {
    try {

        const { bookId } = req.params;
        const userId = req.user._id;


        // STEP 1:
        // Validate bookId


        // STEP 2:
        // Find user


        // STEP 3:
        // Find book


        // STEP 4:
        // Handle missing resources


        // STEP 5:
        // Check whether user already
        // borrowed this book


        // STEP 6:
        // Enforce maximum 3 borrowed books


        // STEP 7:
        // Check availableCopies


        // STEP 8:
        // Add book to borrowedBooks


        // STEP 9:
        // Decrease availableCopies


        // STEP 10:
        // Save both documents


        // STEP 11:
        // Return response


    } catch (error) {

    }
};
