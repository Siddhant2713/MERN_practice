import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { useLab, as, makeUser, expectStatus, fakeId, BAD_ID } from "./helpers.js";
import Post from "../models/post.model.js";
import Report from "../models/report.model.js";

useLab();

const url = (id) => `/api/posts/${id}/report`;

describe("Q14 — POST /api/posts/:postId/report", () => {
    it("valid report → 201, saved as pending by you", async () => {
        const alice = await makeUser();
        const post = await Post.create({ content: "spammy" });
        const res = await as(alice).post(url(post._id)).send({ reason: "spam", details: "  Selling followers  " });
        expectStatus(res, 201);
        const report = await Report.findOne().lean();
        assert.equal(report.status, "pending");
        assert.equal(report.reason, "spam");
        assert.equal(report.details, "Selling followers");
        assert.equal(String(report.reportedBy), String(alice._id));
    });

    it("details missing → saved as empty string", async () => {
        const alice = await makeUser();
        const post = await Post.create({ content: "x" });
        await as(alice).post(url(post._id)).send({ reason: "other" });
        assert.equal((await Report.findOne().lean()).details, "");
    });

    it("same user reports same post again → 409, still only 1 report", async () => {
        const alice = await makeUser();
        const post = await Post.create({ content: "x" });
        await as(alice).post(url(post._id)).send({ reason: "spam" });
        expectStatus(await as(alice).post(url(post._id)).send({ reason: "harassment" }), 409);
        assert.equal(await Report.countDocuments(), 1);
    });

    it("different user can report the same post → 201", async () => {
        const alice = await makeUser();
        const bob = await makeUser();
        const post = await Post.create({ content: "x" });
        await as(alice).post(url(post._id)).send({ reason: "spam" });
        expectStatus(await as(bob).post(url(post._id)).send({ reason: "spam" }), 201);
    });

    for (const [name, body] of [['reason "boring"', { reason: "boring" }], ["missing reason", {}]]) {
        it(`${name} → 400`, async () => {
            const alice = await makeUser();
            const post = await Post.create({ content: "x" });
            expectStatus(await as(alice).post(url(post._id)).send(body), 400);
            assert.equal(await Report.countDocuments(), 0);
        });
    }

    it("invalid postId → 400", async () => {
        const alice = await makeUser();
        expectStatus(await as(alice).post(url(BAD_ID)).send({ reason: "spam" }), 400);
    });

    it("missing post → 404", async () => {
        const alice = await makeUser();
        expectStatus(await as(alice).post(url(fakeId())).send({ reason: "spam" }), 404);
    });
});
