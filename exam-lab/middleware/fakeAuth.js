// LAB ONLY — stands in for the real login system on every question except Q5,
// so you can focus on controllers.
//
// "Log in" by sending a header with a user's _id:
//     x-user-id: aaaaaaaaaaaaaaaaaaaaaaa1
//
// It does the same job as the real authenticate middleware you'll write in
// Q5: find the user, drop the password, put them on req.user, call next().

import mongoose from "mongoose";
import User from "../models/user.model.js";

export const fakeAuth = async (req, res, next) => {
    const id = req.get("x-user-id");

    if (!id || !mongoose.isValidObjectId(id)) {
        return res.status(401).json({
            success: false,
            message: "LAB fakeAuth: send an x-user-id header containing a user's _id"
        });
    }

    const user = await User.findById(id).select("-password");

    if (!user || !user.isActive) {
        return res.status(401).json({
            success: false,
            message: "LAB fakeAuth: no active user with that id"
        });
    }

    req.user = user;
    next();
};
