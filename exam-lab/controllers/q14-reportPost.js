// Q14 — Report a Post                         POST /api/posts/:postId/report
// Problem:  ../EndTermPractice(11-20).md → Question 14
// Grade:    npm run q 14

import mongoose from "mongoose";

import Post from "../models/post.model.js";
import Report from "../models/report.model.js";

export const reportPost = async (
    req,
    res
) => {
    try {

        const { postId } = req.params;

        const {
            reason,
            details
        } = req.body;


        // Validate postId


        // Validate reason


        // Find post


        // Check whether same user
        // already reported this post


        // If duplicate → 409


        // Create report


        // Return 201


    } catch (error) {

    }
};
