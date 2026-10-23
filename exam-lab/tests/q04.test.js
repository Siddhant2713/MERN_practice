import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { useLab, as, makeUser, expectStatus, fakeId, BAD_ID, reload, ids } from "./helpers.js";
import Course from "../models/course.model.js";

useLab();

const url = (id) => `/api/courses/${id}/enrollment`;

describe("Q4 — POST /api/courses/:courseId/enrollment", () => {
    it("not enrolled + space available → enrolled: true, BOTH documents updated", async () => {
        const alice = await makeUser();
        const course = await Course.create({ title: "Node", capacity: 2 });
        const res = await as(alice).post(url(course._id));
        expectStatus(res, 200);
        assert.equal(res.body.enrolled, true);
        assert.deepEqual(ids((await reload(course)).students), [String(alice._id)]);
        assert.deepEqual(ids((await reload(alice)).enrolledCourses), [String(course._id)]);
    });

    it("call again → withdrawn (enrolled: false), BOTH documents updated", async () => {
        const alice = await makeUser();
        const course = await Course.create({ title: "Node", capacity: 2 });
        await as(alice).post(url(course._id));
        const res = await as(alice).post(url(course._id));
        expectStatus(res, 200);
        assert.equal(res.body.enrolled, false);
        assert.deepEqual((await reload(course)).students, []);
        assert.deepEqual((await reload(alice)).enrolledCourses, []);
    });

    it("withdraw only removes YOU, other students stay", async () => {
        const alice = await makeUser();
        const bob = await makeUser({ });
        const course = await Course.create({ title: "Node", capacity: 5, students: [bob._id] });
        expectStatus(await as(alice).post(url(course._id)), 200);
        expectStatus(await as(alice).post(url(course._id)), 200);
        assert.deepEqual(ids((await reload(course)).students), [String(bob._id)]);
    });

    it("enroll → withdraw → enroll gives exactly one entry (no duplicates)", async () => {
        const alice = await makeUser();
        const course = await Course.create({ title: "Node", capacity: 2 });
        await as(alice).post(url(course._id));
        await as(alice).post(url(course._id));
        await as(alice).post(url(course._id));
        assert.equal((await reload(course)).students.length, 1);
        assert.equal((await reload(alice)).enrolledCourses.length, 1);
    });

    it("full course → 400, nothing changes", async () => {
        const alice = await makeUser();
        const bob = await makeUser();
        const course = await Course.create({ title: "Full", capacity: 1, students: [bob._id] });
        const res = await as(alice).post(url(course._id));
        expectStatus(res, 400);
        assert.equal((await reload(course)).students.length, 1);
        assert.deepEqual((await reload(alice)).enrolledCourses, []);
    });

    it("an enrolled student can still withdraw from a FULL course", async () => {
        const alice = await makeUser();
        const course = await Course.create({ title: "Full", capacity: 1, students: [] });
        await as(alice).post(url(course._id));        // now full
        const res = await as(alice).post(url(course._id));
        expectStatus(res, 200);
        assert.equal(res.body.enrolled, false);
    });

    it("invalid courseId → 400", async () => {
        const alice = await makeUser();
        expectStatus(await as(alice).post(url(BAD_ID)), 400);
    });

    it("missing course → 404", async () => {
        const alice = await makeUser();
        expectStatus(await as(alice).post(url(fakeId())), 404);
    });
});
