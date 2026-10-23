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
        if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
            return res.status(400).json({ success: false, message: "Invalid appointment id" })
        }


        // STEP 2:
        // Convert scheduledFor into a Date
        const scheduledForD = new Date(scheduledFor)



        // STEP 3:
        // Validate the date
        if (Number.isNaN(scheduledForD.getTime())) {
            return res.status(400).json({ success: false, message: "Invalid date" })
        }


        // STEP 4:
        // Make sure date is in the future
        if (Date.now() >= scheduledForD) {
            return res.status(400).json({ success: false, message: "Reschedule date cannot be in future" })
        }


        // STEP 5:
        // Find appointment
        const appointment = await Appointment.findById(appointmentId)
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" })
        }


        // STEP 6:
        // Check ownership
        if (!req.user._id.equals(appointment.patient)) {
            return res.status(403).json({ success: false, message: "Patient isn't authorized to reschedule" })
        }


        // STEP 7:
        // Check appointment status
        if (appointment.status !== 'scheduled') {
            return res.status(400).json({ success: false, message: "cancelled or completed appointments cannot be rescheduled" })
        }


        // STEP 8:
        // Check whether doctor already has
        // another appointment at this time
        const conflict = await Appointment.findOne({
            doctor: appointment.doctor,
            scheduledFor: scheduledForD,
            status: "scheduled",
            _id: { $ne: appointment._id }
        })

        if (conflict) {
            return res.status(409).json({ success: false, message: "Doctor is unavailable at this time" })
        }





        // STEP 9:
        // Update scheduledFor
        appointment.scheduledFor = scheduledForD


        // STEP 10:
        // Save appointment
        await appointment.save()


        // STEP 11:
        // Return response
        res.status(200).json({ success: true, message: "Appointment rescheduled" })


    } catch (error) {

        // Handle unexpected error
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })

    }
};
