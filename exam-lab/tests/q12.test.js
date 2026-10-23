import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { useLab, as, makeUser, expectStatus, fakeId, BAD_ID, hoursFromNow } from "./helpers.js";
import Assignment from "../models/assignment.model.js";
import Submission from "../models/submission.model.js";

useLab();

const url = (id) => `/api/assignments/${id}/submission`;
const URL1 = "https://github.com/student/project";
const URL2 = "https://github.com/student/project-v2";

describe("Q12 — PUT /api/assignments/:assignmentId/submission", () => {
    it("first submission → 201, one Submission created", async () => {
        const alice = await makeUser();
        const a = await Assignment.create({ title: "API", deadline: hoursFromNow(48) });
        const res = await as(alice).put(url(a._id)).send({ submissionUrl: URL1 });
        expectStatus(res, 201);
        const subs = await Submission.find().lean();
        assert.equal(subs.length, 1);
        assert.equal(subs[0].submissionUrl, URL1);
        assert.equal(String(subs[0].student), String(alice._id));
        assert.ok(subs[0].submittedAt instanceof Date, "submittedAt should be set");
    });

    it("resubmit before deadline → 200, SAME document updated (still 1)", async () => {
        const alice = await makeUser();
        const a = await Assignment.create({ title: "API", deadline: hoursFromNow(48) });
        await as(alice).put(url(a._id)).send({ submissionUrl: URL1 });
        const res = await as(alice).put(url(a._id)).send({ submissionUrl: URL2 });
        expectStatus(res, 200);
        const subs = await Submission.find().lean();
        assert.equal(subs.length, 1, "one student must never have two submissions for the same assignment");
        assert.equal(subs[0].submissionUrl, URL2);
    });

    it("two different students → two submissions", async () => {
        const alice = await makeUser();
        const bob = await makeUser();
        const a = await Assignment.create({ title: "API", deadline: hoursFromNow(48) });
        await as(alice).put(url(a._id)).send({ submissionUrl: URL1 });
        expectStatus(await as(bob).put(url(a._id)).send({ submissionUrl: URL2 }), 201);
        assert.equal(await Submission.countDocuments(), 2);
    });

    it("URL is trimmed", async () => {
        const alice = await makeUser();
        const a = await Assignment.create({ title: "API", deadline: hoursFromNow(48) });
        await as(alice).put(url(a._id)).send({ submissionUrl: `   ${URL1}  ` });
        assert.equal((await Submission.findOne().lean()).submissionUrl, URL1);
    });

    it("deadline passed → 400, nothing saved", async () => {
        const alice = await makeUser();
        const a = await Assignment.create({ title: "Old", deadline: hoursFromNow(-1) });
        expectStatus(await as(alice).put(url(a._id)).send({ submissionUrl: URL1 }), 400);
        assert.equal(await Submission.countDocuments(), 0);
    });

    for (const [name, body] of [["missing URL", {}], ['URL "   "', { submissionUrl: "   " }]]) {
        it(`${name} → 400`, async () => {
            const alice = await makeUser();
            const a = await Assignment.create({ title: "API", deadline: hoursFromNow(48) });
            expectStatus(await as(alice).put(url(a._id)).send(body), 400);
        });
    }

    it("invalid assignmentId → 400", async () => {
        const alice = await makeUser();
        expectStatus(await as(alice).put(url(BAD_ID)).send({ submissionUrl: URL1 }), 400);
    });

    it("missing assignment → 404", async () => {
        const alice = await makeUser();
        expectStatus(await as(alice).put(url(fakeId())).send({ submissionUrl: URL1 }), 404);
    });
});
