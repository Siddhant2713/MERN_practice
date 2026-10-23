// Q13 — Accept or Decline a Project Invitation  POST /api/invitations/:invitationId/respond
// Problem:  ../EndTermPractice(11-20).md → Question 13
// Grade:    npm run q 13

import mongoose from "mongoose";

import Invitation from "../models/invitation.model.js";
import Project from "../models/project.model.js";

export const respondToInvitation = async (
    req,
    res
) => {
    try {

        const { invitationId } = req.params;
        const { action } = req.body;


        // Validate invitationId


        // Validate action


        // Find invitation


        // Check invited user


        // Ensure status is still pending


        if (action === "accept") {

            // Find project

            // Add user only if not already a member

            // Save project

            // Mark invitation accepted

        } else {

            // Mark invitation declined

        }


        // Save invitation

        // Return response


    } catch (error) {

    }
};
