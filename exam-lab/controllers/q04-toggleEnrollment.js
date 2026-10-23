// Q4 — Enroll / Withdraw from a Course        POST /api/courses/:courseId/enrollment
// Problem:  ../EndTermPracticeSheet(1-5).md → Question 4
// Grade:    npm run q 4

import mongoose from "mongoose";

import Course from "../models/course.model.js";
import User from "../models/user.model.js";

export const toggleEnrollment = async (
    req,
    res
) => {
    try {

        const { courseId } = req.params;
        const studentId = req.user._id;


        // STEP 1:
        // Validate courseId


        // STEP 2:
        // Find course


        // STEP 3:
        // Find student


        // STEP 4:
        // Handle missing records


        // STEP 5:
        // Check whether student
        // is already enrolled


        if (false /* ← replace with: already enrolled */) {

            // Remove student from course

            // Remove course from student

            // Save both

            // Return withdrawal response

        } else {

            // Check course capacity

            // Add student to course

            // Add course to student

            // Save both

            // Return enrollment response

        }


    } catch (error) {

    }
};
