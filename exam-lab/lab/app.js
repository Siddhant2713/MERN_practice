// LAB ONLY — builds the Express app. Same setup you'd write in a real server.js.

import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import { labGuards } from "./guards.js";
import routes from "../routes/index.js";

process.env.JWT_SECRET ||= "exam-lab-secret";

export function createApp() {
    const app = express();

    app.locals.labWarnings = [];
    app.locals.inflight = new Set();

    app.use(express.json());   // fills req.body from JSON requests
    app.use(cookieParser());   // fills req.cookies (needed for Q5)
    app.use(labGuards);        // catches missing-return double responses

    // Dev helper for Q5: sets a real JWT "token" cookie for any user id.
    app.post("/lab/login/:userId", (req, res) => {
        const token = jwt.sign(
            { userId: req.params.userId },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.cookie("token", token, { httpOnly: true });
        res.json({ success: true, message: "LAB: token cookie set" });
    });

    app.use(routes);

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: `LAB: no route for ${req.method} ${req.originalUrl}`
        });
    });

    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
        if (err.type === "entity.parse.failed") {
            return res.status(400).json({ success: false, message: "LAB: request body is not valid JSON" });
        }
        console.error(err);
        res.status(500).json({ success: false, message: `LAB: ${err.message}` });
    });

    return app;
}
