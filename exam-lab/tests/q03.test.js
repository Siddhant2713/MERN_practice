import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { useLab, as, makeUser, expectStatus, fakeId, BAD_ID, reload } from "./helpers.js";
import Order from "../models/order.model.js";

useLab();

const address = { line1: "221B MG Road", city: "Bengaluru", pincode: "560001" };
const url = (id) => `/api/orders/${id}/address`;

async function setup(status = "pending") {
    const alice = await makeUser();
    const bob = await makeUser();
    const order = await Order.create({
        user: alice._id, status, total: 999,
        deliveryAddress: { line1: "Old line", city: "Old city", pincode: "000000" }
    });
    return { alice, bob, order };
}

describe("Q3 — PATCH /api/orders/:orderId/address", () => {
    it("own pending order + valid address → 200, address saved", async () => {
        const { alice, order } = await setup();
        const res = await as(alice).patch(url(order._id)).send({ address });
        expectStatus(res, 200);
        assert.equal(res.body.success, true);
        const saved = await reload(order);
        assert.equal(saved.deliveryAddress.line1, "221B MG Road");
        assert.equal(saved.deliveryAddress.city, "Bengaluru");
        assert.equal(saved.deliveryAddress.pincode, "560001");
    });

    it("address values are trimmed", async () => {
        const { alice, order } = await setup();
        await as(alice).patch(url(order._id)).send({ address: { line1: "  221B MG Road ", city: " Bengaluru ", pincode: " 560001 " } });
        const saved = await reload(order);
        assert.equal(saved.deliveryAddress.line1, "221B MG Road");
        assert.equal(saved.deliveryAddress.pincode, "560001");
    });

    it("SECURITY: extra fields like status are ignored (whitelisted update)", async () => {
        const { alice, order } = await setup();
        const res = await as(alice).patch(url(order._id)).send({ address, status: "delivered", total: 0 });
        expectStatus(res, 200);
        const saved = await reload(order);
        assert.equal(saved.status, "pending");
        assert.equal(saved.total, 999);
    });

    it("invalid orderId → 400", async () => {
        const { alice } = await setup();
        expectStatus(await as(alice).patch(url(BAD_ID)).send({ address }), 400);
    });

    it("missing address → 400", async () => {
        const { alice, order } = await setup();
        expectStatus(await as(alice).patch(url(order._id)).send({}), 400);
    });

    it("address missing city → 400", async () => {
        const { alice, order } = await setup();
        expectStatus(await as(alice).patch(url(order._id)).send({ address: { line1: "x", pincode: "1" } }), 400);
    });

    it('pincode "   " (only spaces) → 400', async () => {
        const { alice, order } = await setup();
        expectStatus(await as(alice).patch(url(order._id)).send({ address: { ...address, pincode: "   " } }), 400);
    });

    it("order doesn't exist → 404", async () => {
        const { alice } = await setup();
        expectStatus(await as(alice).patch(url(fakeId())).send({ address }), 404);
    });

    it("someone else's order → 403, unchanged", async () => {
        const { bob, order } = await setup();
        const res = await as(bob).patch(url(order._id)).send({ address });
        expectStatus(res, 403);
        assert.equal((await reload(order)).deliveryAddress.line1, "Old line");
    });

    for (const status of ["shipped", "delivered", "cancelled"]) {
        it(`own ${status} order → 400, unchanged`, async () => {
            const { alice, order } = await setup(status);
            expectStatus(await as(alice).patch(url(order._id)).send({ address }), 400);
            assert.equal((await reload(order)).deliveryAddress.line1, "Old line");
        });
    }
});
