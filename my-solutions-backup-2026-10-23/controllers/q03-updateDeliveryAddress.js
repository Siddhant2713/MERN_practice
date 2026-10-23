// Q3 — Change Delivery Address of Your Order  PATCH /api/orders/:orderId/address
// Problem:  ../EndTermPracticeSheet(1-5).md → Question 3
// Grade:    npm run q 3

import mongoose from "mongoose";
import Order from "../models/order.model.js";

export const updateDeliveryAddress = async (
    req,
    res
) => {
    try {

        const { orderId } = req.params;
        const { address } = req.body;


        // STEP 1:
        // Validate orderId
        if(!mongoose.Types.ObjectId.isValid(orderId)){
            return res.status(400).json({success: false, message: "Invalid order id"})
        }


        // STEP 2:
        // Validate address object
        if(!address || !address.line1?.trim() || !address.city?.trim() || !address.pincode?.trim()){
            return res.status(400).json({success: false, message: "Address incomplete"})
        }


        // STEP 3:
        // Find order
        const order = await Order.findById(orderId)


        // STEP 4:
        // Handle missing order
        if(!order){
            return res.status(404).json({success: false, message: "Order not found"})
        }


        // STEP 5:
        // Check ownership
        const user = req.user
        if(!user.equals(order.user)){
            return res.status(403).json({success: false, message: "You are not allowed to update"})
        }



        // STEP 6:
        // Ensure status is pending
        if(order.status !== "pending"){
            return res.status(400).json({success: false, message: "The order must be pending"})
        }


        // STEP 7:
        // Update deliveryAddress
        order.deliveryAddress = {
            line1: address.line1.trim(),
            city: address.city.trim(),
            pincode: address.pincode.trim()
        }


        // STEP 8:
        // Save order
        await order.save()


        // STEP 9:
        // Return response
        res.status(200).json({success: true, message: "Address updated successfully"})



    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: "Internal server error"})
    }
};
