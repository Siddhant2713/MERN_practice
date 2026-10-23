import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { useLab, as, makeUser, expectStatus, fakeId, BAD_ID, reload } from "./helpers.js";
import Task from "../models/task.model.js";
import Project from "../models/project.model.js";

useLab();

const url = (id) => `/api/tasks/${id}/status`;

async function setup(status = "todo") {
    const alice = await makeUser();
    const outsider = await makeUser();
    const project = await Project.create({ name: "P", members: [alice._id] });
    const task = await Task.create({ title: "T", project: project._id, status });
    return { alice, outsider, task };
}

const allowed = [
    ["todo", "in_progress"],
    ["in_progress", "todo"],
    ["in_progress", "review"],
    ["review", "in_progress"],
    ["review", "done"],
    ["done", "review"]
];

const rejected = [
    ["todo", "done"],
    ["todo", "review"],
    ["in_progress", "done"],
    ["review", "todo"],
    ["done", "todo"],
    ["done", "in_progress"],
    ["todo", "todo"]
];

describe("Q18 — PATCH /api/tasks/:taskId/status", () => {
    for (const [from, to] of allowed) {
        it(`${from} → ${to}: allowed, 200, saved`, async () => {
            const { alice, task } = await setup(from);
            const res = await as(alice).patch(url(task._id)).send({ status: to });
            expectStatus(res, 200);
            assert.equal((await reload(task)).status, to);
        });
    }

    for (const [from, to] of rejected) {
        it(`${from} → ${to}: rejected, 400, unchanged`, async () => {
            const { alice, task } = await setup(from);
            expectStatus(await as(alice).patch(url(task._id)).send({ status: to }), 400);
            assert.equal((await reload(task)).status, from);
        });
    }

    it('status "finished" (not a real status) → 400', async () => {
        const { alice, task } = await setup();
        expectStatus(await as(alice).patch(url(task._id)).send({ status: "finished" }), 400);
    });

    it("not a project member → 403, unchanged", async () => {
        const { outsider, task } = await setup();
        expectStatus(await as(outsider).patch(url(task._id)).send({ status: "in_progress" }), 403);
        assert.equal((await reload(task)).status, "todo");
    });

    it("invalid taskId → 400", async () => {
        const { alice } = await setup();
        expectStatus(await as(alice).patch(url(BAD_ID)).send({ status: "in_progress" }), 400);
    });

    it("missing task → 404", async () => {
        const { alice } = await setup();
        expectStatus(await as(alice).patch(url(fakeId())).send({ status: "in_progress" }), 404);
    });
});
