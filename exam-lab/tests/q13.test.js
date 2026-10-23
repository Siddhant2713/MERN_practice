import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { useLab, as, makeUser, expectStatus, fakeId, BAD_ID, reload, ids } from "./helpers.js";
import Invitation from "../models/invitation.model.js";
import Project from "../models/project.model.js";

useLab();

const url = (id) => `/api/invitations/${id}/respond`;

async function setup({ status = "pending", alreadyMember = false } = {}) {
    const owner = await makeUser();
    const alice = await makeUser();
    const bob = await makeUser();
    const project = await Project.create({ name: "Exam Prep", members: alreadyMember ? [owner._id, alice._id] : [owner._id] });
    const invitation = await Invitation.create({ project: project._id, invitedUser: alice._id, status });
    return { owner, alice, bob, project, invitation };
}

describe("Q13 — POST /api/invitations/:invitationId/respond", () => {
    it("accept → 200, invitation accepted, user added to project members", async () => {
        const { owner, alice, project, invitation } = await setup();
        const res = await as(alice).post(url(invitation._id)).send({ action: "accept" });
        expectStatus(res, 200);
        assert.equal(res.body.status, "accepted");
        assert.equal((await reload(invitation)).status, "accepted");
        assert.deepEqual(ids((await reload(project)).members), [String(owner._id), String(alice._id)]);
    });

    it("decline → 200, invitation declined, members unchanged", async () => {
        const { owner, alice, project, invitation } = await setup();
        const res = await as(alice).post(url(invitation._id)).send({ action: "decline" });
        expectStatus(res, 200);
        assert.equal((await reload(invitation)).status, "declined");
        assert.deepEqual(ids((await reload(project)).members), [String(owner._id)]);
    });

    it("accept when ALREADY a member → no duplicate in members", async () => {
        const { alice, project, invitation } = await setup({ alreadyMember: true });
        expectStatus(await as(alice).post(url(invitation._id)).send({ action: "accept" }), 200);
        assert.equal((await reload(project)).members.length, 2);
    });

    it("someone other than the invited user → 403, nothing changes", async () => {
        const { bob, project, invitation } = await setup();
        expectStatus(await as(bob).post(url(invitation._id)).send({ action: "accept" }), 403);
        assert.equal((await reload(invitation)).status, "pending");
        assert.equal((await reload(project)).members.length, 1);
    });

    for (const status of ["accepted", "declined"]) {
        it(`already ${status} → 400 (can't process twice)`, async () => {
            const { alice, invitation } = await setup({ status });
            expectStatus(await as(alice).post(url(invitation._id)).send({ action: "accept" }), 400);
            assert.equal((await reload(invitation)).status, status);
        });
    }

    for (const [name, body] of [['action "maybe"', { action: "maybe" }], ["missing action", {}]]) {
        it(`${name} → 400`, async () => {
            const { alice, invitation } = await setup();
            expectStatus(await as(alice).post(url(invitation._id)).send(body), 400);
        });
    }

    it("invalid invitationId → 400", async () => {
        const { alice } = await setup();
        expectStatus(await as(alice).post(url(BAD_ID)).send({ action: "accept" }), 400);
    });

    it("missing invitation → 404", async () => {
        const { alice } = await setup();
        expectStatus(await as(alice).post(url(fakeId())).send({ action: "accept" }), 404);
    });
});
