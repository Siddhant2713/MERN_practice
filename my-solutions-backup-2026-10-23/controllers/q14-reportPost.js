// Q14 — Report a Post                         POST /api/posts/:postId/report
// Problem:  ../EndTermPractice(11-20).md → Question 14
// Grade:    npm run q 14

import mongoose from "mongoose";

import Post from "../models/post.model.js";
import Report from "../models/report.model.js";

export const reportPost = async (
    req,
    res
) => {
    try {

        const { postId } = req.params;

        const {
            reason,
            details
        } = req.body;


        // Validate postId
        if (!mongoose.isValidObjectId(postId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid postId"
            })
        }


        // Validate reason
        const allowedReasons = ["spam", "harassment", "misinformation", "other"]
        if (!allowedReasons.includes(reason)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Reason"
            })
        }



        // Find post
        const user = req.user
        const post = await Post.findById(postId)
        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }


        // Check whether same user
        // already reported this post
        const existingReport = await Report.findOne({
            post: post._id,
            reportedBy: user._id
        })
        // const user = req.user
        if (existingReport) {
            return res.status(409).json({
                success: false,
                message: "Conflict"
            })
        }


        // If duplicate → 409


        // Create report
        const report = await Report.create({
            post: postId,
            reportedBy: user._id,
            reason: reason,
            details: details?.trim() || "",
            status: "pending",
            
        })


        // Return 201
        return res.status(201).json({
            success: true,
            message: "Report created",
            report
        })


    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Internal server Error",
            
        })
    }
};
