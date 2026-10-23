// Q6 — Reschedule a Doctor Appointment        PATCH /api/appointments/:appointmentId/reschedule
// Problem:  ../EndTermPractice(6-10).txt → Question 6
// Grade:    npm run q 6

import mongoose from "mongoose";
import Appointment from "../models/appointment.model.js";

export const rescheduleAppointment = async (
    req,
    res
) => {
    try {

        const { appointmentId } = req.params;
        const { scheduledFor } = req.body;


        // STEP 1:
        // Validate appointmentId


        // STEP 2:
        // Convert scheduledFor into a Date


        // STEP 3:
        // Validate the date


        // STEP 4:
        // Make sure date is in the future


        // STEP 5:
        // Find appointment


        // STEP 6:
        // Check ownership


        // STEP 7:
        // Check appointment status


        // STEP 8:
        // Check whether doctor already has
        // another appointment at this time


        // STEP 9:
        // Update scheduledFor


        // STEP 10:
        // Save appointment


        // STEP 11:
        // Return response


    } catch (error) {

        // Handle unexpected error

    }
};
