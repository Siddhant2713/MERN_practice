// Q18 — Move a Task Through Workflow States   PATCH /api/tasks/:taskId/status
// Problem:  ../EndTermPractice(11-20).md → Question 18
// Grade:    npm run q 18

import mongoose from "mongoose";

import Task from "../models/task.model.js";
import Project from "../models/project.model.js";

export const updateTaskStatus = async (
    req,
    res
) => {
    try {

        // Validate taskId


        // Validate requested status


        // Find task


        // Find task's project


        // Verify project membership


        // Define allowed transitions


        // Check whether requested transition
        // is allowed


        // Update task


        // Save


        // Return response

    } catch (error) {

    }
};
