import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { useLab, as, makeUser, expectStatus, fakeId, BAD_ID, reload, hoursFromNow } from "./helpers.js";
import Reservation from "../models/reservation.model.js";
import Room from "../models/room.model.js";

useLab();

const url = (id) => `/api/reservations/${id}/cancel`;

async function setup({ status = "confirmed", checkInHours = 72 } = {}) {
    const alice = await makeUser();
    const bob = await makeUser();
    const room = await Room.create({ name: "Deluxe", availableRooms: 2 });
    const reservation = await Reservation.create({ user: alice._id, room: room._id, checkIn: hoursFromNow(checkInHours), status });
    return { alice, bob, room, reservation };
}

describe("Q11 — POST /api/reservations/:reservationId/cancel", () => {
    it("valid cancellation → 200, status cancelled AND availableRooms + 1", async () => {
        const { alice, room, reservation } = await setup();
        const res = await as(alice).post(url(reservation._id));
        expectStatus(res, 200);
        assert.equal((await reload(reservation)).status, "cancelled");
        assert.equal((await reload(room)).availableRooms, 3);
    });

    it("invalid reservation ID → 400", async () => {
        const { alice } = await setup();
        expectStatus(await as(alice).post(url(BAD_ID)), 400);
    });

    it("reservation doesn't exist → 404", async () => {
        const { alice } = await setup();
        expectStatus(await as(alice).post(url(fakeId())), 404);
    });

    it("someone else's reservation → 403, nothing changes", async () => {
        const { bob, room, reservation } = await setup();
        expectStatus(await as(bob).post(url(reservation._id)), 403);
        assert.equal((await reload(reservation)).status, "confirmed");
        assert.equal((await reload(room)).availableRooms, 2);
    });

    for (const status of ["cancelled", "completed"]) {
        it(`already ${status} → 400, room count unchanged`, async () => {
            const { alice, room, reservation } = await setup({ status });
            expectStatus(await as(alice).post(url(reservation._id)), 400);
            assert.equal((await reload(room)).availableRooms, 2);
        });
    }

    it("check-in in 10 hours → 400, nothing changes", async () => {
        const { alice, room, reservation } = await setup({ checkInHours: 10 });
        expectStatus(await as(alice).post(url(reservation._id)), 400);
        assert.equal((await reload(reservation)).status, "confirmed");
        assert.equal((await reload(room)).availableRooms, 2);
    });

    it("check-in in 23.9 hours → 400 (must be MORE than 24h away)", async () => {
        const { alice, reservation } = await setup({ checkInHours: 23.9 });
        expectStatus(await as(alice).post(url(reservation._id)), 400);
    });

    it("check-in in 25 hours → 200", async () => {
        const { alice, reservation } = await setup({ checkInHours: 25 });
        expectStatus(await as(alice).post(url(reservation._id)), 200);
    });

    it("cancelling twice → second call is 400, room only +1 total", async () => {
        const { alice, room, reservation } = await setup();
        await as(alice).post(url(reservation._id));
        expectStatus(await as(alice).post(url(reservation._id)), 400);
        assert.equal((await reload(room)).availableRooms, 3);
    });
});
