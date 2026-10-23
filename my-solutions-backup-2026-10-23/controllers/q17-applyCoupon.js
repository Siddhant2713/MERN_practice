// Q17 — Apply a Coupon to a Cart              POST /api/cart/apply-coupon
// Problem:  ../EndTermPractice(11-20).md → Question 17
// Grade:    npm run q 17

import Coupon from "../models/coupon.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";

export const applyCoupon = async (
    req,
    res
) => {
    try {

        const { code } = req.body;


        // Validate code


        // Find coupon


        // Check expiry


        // Check user already used coupon


        // Check global usage limit


        // Load user cart


        // Calculate cart total


        // Check minimum cart value


        // Calculate discount


        // Calculate final amount


        // Return pricing breakdown


    } catch (error) {

    }
};
