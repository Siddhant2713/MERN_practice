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

        const {taskId} = req.params
        const {status} = req.body

        // Validate taskId

        if(!mongoose.Types.ObjectId.isValid(taskId)){
            return res.status(400).json({success: false, message: "Invalid task id"})
        }



        // Validate requested status
        const statuses = ["todo", "in_progress", "review", "done"]
        if(!statuses.includes(status)){
            return res.status(400).json({success: false, message: "Status not possible"})
        }


        // Find task
        const task = await Task.findById(taskId)
        if(!task){
            return res.status(404).json({success: false, message: "Task not found"})
        }


        // Find task's project
        const project = await Project.findById(task.project)
        if(!project){
            return res.status(404).json({success: false, message: "Project Not found"})
        }


        // Verify project membership
        const user = req.user._id
        const members = project.members
        if(!members.includes(user)){
            return res.status(403).json({success: false, message: "User is not the project memeber"})
        }


        // Define allowed transitions
        const allowed ={
            "todo": ['in_progress'],
            "in_progress": ['todo', 'review'],
            "review": ['in_progress', 'done'],
            "done": ['review']
        }


        // Check whether requested transition
        // is allowed
        if(!allowed[task.status].includes(status)){
            return res.status(400).json({success: false, message: "Action not allowed"})
        }


        // Update task
        task.status = status



        // Save
        await task.save()


        // Return response
        res.status(200).json({success: true, message: "Status updated"})

    } catch (error) {
        console.error(error)
        return res.status(500).json({success: false, message: "Internal Server Error"})
    }
};
