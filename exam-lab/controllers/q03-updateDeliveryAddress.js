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


        // STEP 2:
        // Validate address object


        // STEP 3:
        // Find order


        // STEP 4:
        // Handle missing order


        // STEP 5:
        // Check ownership


        // STEP 6:
        // Ensure status is pending


        // STEP 7:
        // Update deliveryAddress


        // STEP 8:
        // Save order


        // STEP 9:
        // Return response


    } catch (error) {

    }
};
