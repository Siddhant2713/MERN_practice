import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { useLab, as, makeUser, expectStatus, fakeId, BAD_ID, reload } from "./helpers.js";
import Post from "../models/post.model.js";
import Report from "../models/report.model.js";

useLab();

const url = (id) => `/api/reports/${id}/moderate`;

async function setup(status = "pending") {
    const mo = await makeUser({ role: "moderator" });
    const alice = await makeUser();
    const post = await Post.create({ content: "spammy" });
    const report = await Report.create({ post: post._id, reportedBy: alice._id, reason: "spam", status });
    return { mo, alice, post, report };
}

describe("Q15 — PATCH /api/reports/:reportId/moderate", () => {
    it("regular user → 403, nothing changes", async () => {
        const { alice, report } = await setup();
        expectStatus(await as(alice).patch(url(report._id)).send({ action: "dismiss" }), 403);
        assert.equal((await reload(report)).status, "pending");
    });

    it("admin is allowed too → 200", async () => {
        const { report } = await setup();
        const admin = await makeUser({ role: "admin" });
        expectStatus(await as(admin).patch(url(report._id)).send({ action: "dismiss" }), 200);
    });

    it("dismiss → 200, report dismissed, post NOT removed, reviewedBy = moderator", async () => {
        const { mo, post, report } = await setup();
        expectStatus(await as(mo).patch(url(report._id)).send({ action: "dismiss" }), 200);
        const saved = await reload(report);
        assert.equal(saved.status, "dismissed");
        assert.equal(String(saved.reviewedBy), String(mo._id));
        assert.equal((await reload(post)).isRemoved, false);
    });

    it("remove_post → 200, post.isRemoved true, report resolved, reviewedBy set", async () => {
        const { mo, post, report } = await setup();
        expectStatus(await as(mo).patch(url(report._id)).send({ action: "remove_post" }), 200);
        assert.equal((await reload(post)).isRemoved, true);
        const saved = await reload(report);
        assert.equal(saved.status, "resolved");
        assert.equal(String(saved.reviewedBy), String(mo._id));
    });

    it("SECURITY: reviewedBy in the body is ignored — comes from req.user", async () => {
        const { mo, alice, report } = await setup();
        await as(mo).patch(url(report._id)).send({ action: "dismiss", reviewedBy: String(alice._id) });
        assert.equal(String((await reload(report)).reviewedBy), String(mo._id));
    });

    for (const status of ["dismissed", "resolved"]) {
        it(`report already ${status} → 400`, async () => {
            const { mo, report } = await setup(status);
            expectStatus(await as(mo).patch(url(report._id)).send({ action: "dismiss" }), 400);
        });
    }

    it('action "ban_user" → 400', async () => {
        const { mo, report } = await setup();
        expectStatus(await as(mo).patch(url(report._id)).send({ action: "ban_user" }), 400);
    });

    it("invalid reportId → 400", async () => {
        const { mo } = await setup();
        expectStatus(await as(mo).patch(url(BAD_ID)).send({ action: "dismiss" }), 400);
    });

    it("missing report → 404", async () => {
        const { mo } = await setup();
        expectStatus(await as(mo).patch(url(fakeId())).send({ action: "dismiss" }), 404);
    });
});
