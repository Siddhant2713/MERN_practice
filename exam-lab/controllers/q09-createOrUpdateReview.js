// Q9 — Create or Update Your Review           PUT /api/products/:productId/review
// Problem:  ../EndTermPractice(6-10).txt → Question 9
// Grade:    npm run q 9

import mongoose from "mongoose";

import Product from "../models/product.model.js";
import Review from "../models/review.model.js";

export const createOrUpdateReview = async (
    req,
    res
) => {
    try {

        const { productId } = req.params;

        const {
            rating,
            comment
        } = req.body;


        // STEP 1:
        // Validate productId


        // STEP 2:
        // Validate rating


        // STEP 3:
        // Find product


        // STEP 4:
        // Handle missing product


        // STEP 5:
        // Find existing review using
        // product + logged-in user


        if (false /* ← replace with: review exists */) {

            // Update rating

            // Update comment

            // Save

            // Return 200

        } else {

            // Create review

            // Return 201

        }


    } catch (error) {

    }
};
