import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { useLab, as, makeUser, expectStatus, fakeId, BAD_ID, reload, hoursFromNow } from "./helpers.js";
import Appointment from "../models/appointment.model.js";

useLab();

const url = (id) => `/api/appointments/${id}/reschedule`;

async function setup(status = "scheduled") {
    const alice = await makeUser();
    const bob = await makeUser();
    const doctor = await makeUser();
    const original = hoursFromNow(48);
    const appt = await Appointment.create({ patient: alice._id, doctor: doctor._id, scheduledFor: original, status });
    const target = hoursFromNow(120);
    return { alice, bob, doctor, appt, original, target };
}

describe("Q6 — PATCH /api/appointments/:appointmentId/reschedule", () => {
    it("valid future time → 200, saved", async () => {
        const { alice, appt, target } = await setup();
        const res = await as(alice).patch(url(appt._id)).send({ scheduledFor: target.toISOString() });
        expectStatus(res, 200);
        assert.equal(res.body.success, true);
        assert.equal((await reload(appt)).scheduledFor.getTime(), target.getTime());
    });

    it("invalid appointment ID → 400", async () => {
        const { alice, target } = await setup();
        expectStatus(await as(alice).patch(url(BAD_ID)).send({ scheduledFor: target.toISOString() }), 400);
    });

    it('invalid date ("banana") → 400', async () => {
        const { alice, appt } = await setup();
        expectStatus(await as(alice).patch(url(appt._id)).send({ scheduledFor: "banana" }), 400);
    });

    it("missing date → 400", async () => {
        const { alice, appt } = await setup();
        expectStatus(await as(alice).patch(url(appt._id)).send({}), 400);
    });

    it("past date → 400", async () => {
        const { alice, appt } = await setup();
        expectStatus(await as(alice).patch(url(appt._id)).send({ scheduledFor: hoursFromNow(-2).toISOString() }), 400);
    });

    it("appointment doesn't exist → 404", async () => {
        const { alice, target } = await setup();
        expectStatus(await as(alice).patch(url(fakeId())).send({ scheduledFor: target.toISOString() }), 404);
    });

    it("someone else's appointment → 403, unchanged", async () => {
        const { bob, appt, original, target } = await setup();
        expectStatus(await as(bob).patch(url(appt._id)).send({ scheduledFor: target.toISOString() }), 403);
        assert.equal((await reload(appt)).scheduledFor.getTime(), original.getTime());
    });

    for (const status of ["completed", "cancelled"]) {
        it(`${status} appointment → 400`, async () => {
            const { alice, appt, target } = await setup(status);
            expectStatus(await as(alice).patch(url(appt._id)).send({ scheduledFor: target.toISOString() }), 400);
        });
    }

    it("doctor already booked at that time → 409, unchanged", async () => {
        const { alice, bob, doctor, appt, original, target } = await setup();
        await Appointment.create({ patient: bob._id, doctor: doctor._id, scheduledFor: target });
        expectStatus(await as(alice).patch(url(appt._id)).send({ scheduledFor: target.toISOString() }), 409);
        assert.equal((await reload(appt)).scheduledFor.getTime(), original.getTime());
    });

    it("doctor has a CANCELLED appointment at that time → no conflict, 200", async () => {
        const { alice, bob, doctor, appt, target } = await setup();
        await Appointment.create({ patient: bob._id, doctor: doctor._id, scheduledFor: target, status: "cancelled" });
        expectStatus(await as(alice).patch(url(appt._id)).send({ scheduledFor: target.toISOString() }), 200);
    });

    it("a DIFFERENT doctor booked at that time → no conflict, 200", async () => {
        const { alice, bob, appt, target } = await setup();
        const otherDoctor = await makeUser();
        await Appointment.create({ patient: bob._id, doctor: otherDoctor._id, scheduledFor: target });
        expectStatus(await as(alice).patch(url(appt._id)).send({ scheduledFor: target.toISOString() }), 200);
    });

    it("rescheduling to its OWN current time → 200 (it can't conflict with itself: $ne)", async () => {
        const { alice, appt, original } = await setup();
        expectStatus(await as(alice).patch(url(appt._id)).send({ scheduledFor: original.toISOString() }), 200);
    });
});
