// Q12 — Submit or Resubmit an Assignment      PUT /api/assignments/:assignmentId/submission
// Problem:  ../EndTermPractice(11-20).md → Question 12
// Grade:    npm run q 12

import mongoose from "mongoose";

import Assignment from "../models/assignment.model.js";
import Submission from "../models/submission.model.js";

export const submitAssignment = async (
    req,
    res
) => {
    try {

        const { assignmentId } = req.params;
        const { submissionUrl } = req.body;


        // Validate assignmentId


        // Validate submissionUrl


        // Find assignment


        // Check deadline


        // Find an existing submission
        // for this student and assignment


        if (false /* ← replace with: submission exists */) {

            // Update URL

            // Update submittedAt

            // Save

            // Return 200

        } else {

            // Create submission

            // Return 201

        }


    } catch (error) {

    }
};
