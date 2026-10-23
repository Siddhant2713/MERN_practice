// Q4 — Enroll / Withdraw from a Course        POST /api/courses/:courseId/enrollment
// Problem:  ../EndTermPracticeSheet(1-5).md → Question 4
// Grade:    npm run q 4

import mongoose from "mongoose";

import Course from "../models/course.model.js";
import User from "../models/user.model.js";

export const toggleEnrollment = async (
    req,
    res
) => {
    try {

        const { courseId } = req.params;
        const studentId = req.user._id;


        // STEP 1:
        // Validate courseId
        if(!mongoose.Types.ObjectId.isValid(courseId)){
            return res.status(400).json({success: false, messaeg: "Invalid course id"})
        }


        // STEP 2:
        // Find course
        const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({success: false, message: "Course not found"})
        }


        // STEP 3:
        // Find student
        const student = await User.findById(studentId)
        if(!student){
            return res.status(404).json({success: false, message: "Student not found"})
        }


        // STEP 4:
        // Handle missing records


        // STEP 5:
        // Check whether student
        // is already enrolled
        let EnrolledStudent = course.students
        let StudentCourse = student.enrolledCourses



        if (EnrolledStudent.some(id => id.equals(studentId))) {

            // Remove student from course
            EnrolledStudent = EnrolledStudent.filter((stu)=>{
                return !stu.equals(studentId)
            })

            // Remove course from student
            StudentCourse = StudentCourse.filter((c)=>{
                return !c.equals(courseId)
            })

            // Save both
            course.students = EnrolledStudent
            student.enrolledCourses = StudentCourse
            await student.save()
            await course.save()
            // Return withdrawal response
            return res.status(200).json({success: true, enrolled: false })

        } else {

            // Check course capacity
            

            // Add student to course
            if(course.students.length < course.capacity){
                course.students.push(studentId)
                // course.capacity--
                student.enrolledCourses.push(courseId)

            }else{
                return res.status(400).json({success: false, message: "Course capacity is full"})
            }

            // Add course to student

            // Save both
            
            await student.save()
            await course.save()

            // Return enrollment response
            return res.status(200).json({success: true, enrolled: true})

        }


    } catch (error) {
        console.error(error)
        return res.status(500).json({success: false, message: "Internal Server Error"})
    }
};
