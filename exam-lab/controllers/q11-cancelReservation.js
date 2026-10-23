// Q11 — Cancel a Hotel Reservation            POST /api/reservations/:reservationId/cancel
// Problem:  ../EndTermPractice(11-20).md → Question 11
// Grade:    npm run q 11

import mongoose from "mongoose";

import Reservation from "../models/reservation.model.js";
import Room from "../models/room.model.js";

export const cancelReservation = async (
    req,
    res
) => {
    try {

        const { reservationId } = req.params;


        // STEP 1:
        // Validate reservationId


        // STEP 2:
        // Find reservation


        // STEP 3:
        // Handle reservation not found


        // STEP 4:
        // Check ownership


        // STEP 5:
        // Make sure reservation is confirmed


        // STEP 6:
        // Calculate how much time remains
        // before check-in


        // STEP 7:
        // Reject cancellation if less than
        // or equal to 24 hours remain


        // STEP 8:
        // Find the room


        // STEP 9:
        // Mark reservation cancelled


        // STEP 10:
        // Increase room availability


        // STEP 11:
        // Save both documents


        // STEP 12:
        // Return response


    } catch (error) {

    }
};
