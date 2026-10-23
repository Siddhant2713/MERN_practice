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
        if (!mongoose.Types.ObjectId.isValid(invitationId)) {
            return res.status(400).json({ success: false, message: "Invalid invitation id" })
        }


        // Validate action
        if (!["accept", "decline"].includes(action)) {
    return res.status(400).json({ success: false, message: "Invalid action" })
}


        // Find invitation
        const invitation = await Invitation.findById(invitationId)
        if (!invitation) {
            return res.status(404).json({ success: false, message: "Invitation not found" })
        }


        // Check invited user
        if (!invitation.invitedUser.equals(req.user._id)) {
            return res.status(403).json({ success: false, message: "Cannot accept the invitation" })
        }



        // Ensure status is still pending
        if (invitation.status !== 'pending') {
            return res.status(400).json({ success: false, message: "Invitation already decliened or accepted" })
        }


        if (action === "accept") {

            // Find project
            const project = await Project.findById(invitation.project)
            if (!project) {
                return res.status(404).json({ success: false, message: "Project not found" })
            }
            // Add user only if not already a member
            const alreadyMember = project.members.some(id => id.equals(req.user._id))

            if (!alreadyMember) {
                project.members.push(req.user._id)
                await project.save()
            }

            // Save project
           

            // Mark invitation accepted
            invitation.status = 'accepted'

        } else {

            // Mark invitation declined
            invitation.status = 'declined'

        }


        // Save invitation
        await invitation.save()

        // Return response
        res.status(200).json({ success: true, status: invitation.status, message: `Invitation ${invitation.status}` })


    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
};
