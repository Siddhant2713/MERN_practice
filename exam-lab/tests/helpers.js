// LAB ONLY — shared setup for every grader file.
// Each grader gets its own throwaway in-memory MongoDB, wiped before every test.

import { before, after, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { createApp } from "../lab/app.js";
import User from "../models/user.model.js";

export const PASSWORD = "secret123";

const lab = {};

export function useLab() {
    before(async () => {
        lab.mongo = await MongoMemoryServer.create();
        await mongoose.connect(lab.mongo.getUri());
        lab.app = createApp();
    });

    beforeEach(async () => {
        await mongoose.connection.db.dropDatabase();
        lab.app.locals.labWarnings = [];
    });

    // Wait for your controller to fully finish, then fail the test if it
    // tried to send two responses (= a missing `return`).
    afterEach(async () => {
        await Promise.allSettled([...lab.app.locals.inflight]);
        const warnings = lab.app.locals.labWarnings.splice(0);
        assert.equal(warnings.length, 0, `\n${warnings.join("\n")}`);
    });

    after(async () => {
        await mongoose.disconnect();
        await lab.mongo.stop();
    });
}

// as(alice).post("/api/x").send({...})  → request logged in as alice (fakeAuth header)
// as(null).get("/api/x")                → anonymous request
export function as(user) {
    const wrap = (method) => (url) => {
        let req = request(lab.app)[method](url).timeout(5000);
        if (user) req = req.set("x-user-id", String(user._id));
        return req;
    };
    return {
        get: wrap("get"),
        post: wrap("post"),
        put: wrap("put"),
        patch: wrap("patch")
    };
}

// Request carrying a real JWT cookie (Q5 only)
export function withCookie(method, url, token) {
    let req = request(lab.app)[method](url).timeout(5000);
    if (token) req = req.set("Cookie", `token=${token}`);
    return req;
}

export const tokenFor = (userId, payloadExtra = {}, secret = process.env.JWT_SECRET) =>
    jwt.sign({ userId, ...payloadExtra }, secret);

let userCount = 0;
export async function makeUser(fields = {}) {
    userCount += 1;
    return User.create({
        name: `User ${userCount}`,
        email: `user${userCount}@lab.test`,
        password: await bcrypt.hash(PASSWORD, 4),
        ...fields
    });
}

export const fakeId = () => new mongoose.Types.ObjectId().toString();
export const BAD_ID = "not-a-real-id";

export const hoursFromNow = (h) => new Date(Date.now() + h * 60 * 60 * 1000);

// Re-read a document from the DB (to check what was REALLY saved)
export const reload = (doc) => doc.constructor.findById(doc._id).lean();

export function expectStatus(res, status) {
    assert.equal(
        res.status,
        status,
        `Expected HTTP ${status}, got ${res.status}.\n   Response body: ${JSON.stringify(res.body)}`
    );
}

export const ids = (arr) => arr.map(String);
