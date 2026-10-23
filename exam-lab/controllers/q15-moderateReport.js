// Q15 — Moderate a Report                     PATCH /api/reports/:reportId/moderate
// Problem:  ../EndTermPractice(11-20).md → Question 15
// Grade:    npm run q 15

import mongoose from "mongoose";

import Report from "../models/report.model.js";
import Post from "../models/post.model.js";

export const moderateReport = async (
    req,
    res
) => {
    try {

        // Validate moderator role

        // Validate reportId

        // Validate action

        // Find report

        // Ensure report is pending


        if (false /* ← replace with: dismiss */) {

            // Mark dismissed

        } else {

            // Find post

            // Mark post removed

            // Save post

            // Mark report resolved

        }


        // Save report

        // Return response

    } catch (error) {

    }
};
