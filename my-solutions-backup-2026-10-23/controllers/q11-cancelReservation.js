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
        if(!mongoose.Types.ObjectId.isValid(reservationId)){
            return res.status(400).json({success: false, message: "Invalid reservation id"})
        }


        // STEP 2:
        // Find reservation
        const reservation = await Reservation.findById(reservationId)


        // STEP 3:
        // Handle reservation not found
        if(!reservation){
            return res.status(404).json({success: false, message: "reservation not found"})
        }


        // STEP 4:
        // Check ownership
        const user = req.user._id

        if(!user.equals(reservation.user)){
            return res.status(403).json({success: false, message: "User not allowed to cancel"})
        }
        


        // STEP 5:
        // Make sure reservation is confirmed
        if(reservation.status !== 'confirmed'){
            return res.status(400).json({success: false, message: "Reservation is not confirmed"})
        }


        // STEP 6:
        // Calculate how much time remains
        // before check-in
        const diff = reservation.checkIn - Date.now()
        const hoursLeft = diff / (1000 * 60 * 60);


        // STEP 7:
        // Reject cancellation if less than
        // or equal to 24 hours remain
        if(hoursLeft <= 24){
            return res.status(400).json({success: false, message: "Cannot cancel booking in 24 hrs"})
        }


        // STEP 8:
        // Find the room
        const room = await Room.findById(reservation.room)
        if(!room){
            return res.status(404).json({success: false, message: "Room not found"})
        }


        // STEP 9:
        // Mark reservation cancelled
        reservation.status = 'cancelled'
        


        // STEP 10:
        // Increase room availability
        room.availableRooms++



        // STEP 11:
        // Save both documents
        await reservation.save()
        await room.save()


        // STEP 12:
        // Return response
        res.status(200).json({ success: true, message: "Successfully Cancelled"})


    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: "Internal server error"})
    }
};
