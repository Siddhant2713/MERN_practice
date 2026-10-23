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
        const  user = req.user
        const {reportId} = req.params
        const {action} = req.body
        // Validate moderator role
        if(!['moderator', 'admin'].includes(user.role)){
            return res.status(403).json({success: false, message: "Not a admin"})
        }

        // Validate reportId
        if(!mongoose.Types.ObjectId.isValid(reportId)){
            return res.status(400).json({success: false, message: "Invalid report id"})
        }

        // Validate action
        if(!['dismiss', 'remove_post'].includes(action)){
            return res.status(400).json({success: false, message: "Action is not allowed"})
        }

        // Find report
        const report = await Report.findById(reportId)
        if(!report){
            return res.status(404).json({success: false, message: "Report not found"})
        }

        // Ensure report is pending
        if(report.status !== 'pending'){
            return res.status(400).json({success: false, message: "report is not pending"})
        }

        

        if (action === 'dismiss') {
            // Mark dismissed
            
            report.status = 'dismissed'


        } else {

            // Find post
            const post = await Post.findById(report.post)
            if(!post){
                return res.status(404).json({success: false, message: "Post not found"})
            }

            // Mark post removed
            post.isRemoved = true;

            // Save post
            await post.save()

            // Mark report resolved
            report.status = "resolved"
            

        }

        report.reviewedBy = req.user._id
        // Save report
        await report.save()

        // Return response
        res.status(200).json({success: true, message: "Report processed successfully", report: report})

    } catch (error) {
        console.error(error)
        return res.status(500).json({success: false, message: "Internal server error"})
    }
};
