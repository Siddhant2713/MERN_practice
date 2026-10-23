import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { useLab, as, makeUser, expectStatus } from "./helpers.js";
import Notification from "../models/notification.model.js";

useLab();

const URL = "/api/notifications/read-all";

describe("Q19 — PATCH /api/notifications/read-all", () => {
    it("marks only MY unread ones → updatedCount 3, other users untouched", async () => {
        const alice = await makeUser();
        const bob = await makeUser();
        await Notification.create([
            { user: alice._id, message: "1" },
            { user: alice._id, message: "2" },
            { user: alice._id, message: "3" },
            { user: alice._id, message: "old", isRead: true },
            { user: bob._id, message: "b1" },
            { user: bob._id, message: "b2" }
        ]);
        const res = await as(alice).patch(URL);
        expectStatus(res, 200);
        assert.equal(res.body.updatedCount, 3);
        assert.equal(await Notification.countDocuments({ user: alice._id, isRead: false }), 0);
        assert.equal(await Notification.countDocuments({ user: bob._id, isRead: false }), 2, "bob's notifications must not change");
    });

    it("calling it again → updatedCount 0", async () => {
        const alice = await makeUser();
        await Notification.create([{ user: alice._id, message: "1" }]);
        await as(alice).patch(URL);
        const res = await as(alice).patch(URL);
        expectStatus(res, 200);
        assert.equal(res.body.updatedCount, 0);
    });

    it("user with no notifications → 200, updatedCount 0", async () => {
        const alice = await makeUser();
        const res = await as(alice).patch(URL);
        expectStatus(res, 200);
        assert.equal(res.body.updatedCount, 0);
    });
});
