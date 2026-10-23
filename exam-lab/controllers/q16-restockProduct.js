// Q16 — Restock Inventory                     POST /api/inventory/:productId/restock
// Problem:  ../EndTermPractice(11-20).md → Question 16
// Grade:    npm run q 16

import mongoose from "mongoose";

import Product from "../models/product.model.js";
import InventoryLog from "../models/inventoryLog.model.js";

export const restockProduct = async (
    req,
    res
) => {
    try {

        // Validate role

        // Validate productId

        // Validate quantity


        // Increase stock using $inc


        // Handle missing product


        // Create inventory log


        // Return updated product

    } catch (error) {

    }
};
