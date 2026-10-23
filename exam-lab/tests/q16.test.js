import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { useLab, as, makeUser, expectStatus, fakeId, BAD_ID, reload } from "./helpers.js";
import Product from "../models/product.model.js";
import InventoryLog from "../models/inventoryLog.model.js";

useLab();

const url = (id) => `/api/inventory/${id}/restock`;

async function setup() {
    const wendy = await makeUser({ role: "warehouse" });
    const alice = await makeUser();
    const product = await Product.create({ name: "Widget", price: 50, stock: 100 });
    return { wendy, alice, product };
}

describe("Q16 — POST /api/inventory/:productId/restock", () => {
    it("warehouse user → 200, stock +25, updated product returned, log created", async () => {
        const { wendy, product } = await setup();
        const res = await as(wendy).post(url(product._id)).send({ quantity: 25 });
        expectStatus(res, 200);
        assert.equal(res.body.product?.stock, 125, "return the UPDATED product (hint: { new: true })");
        assert.equal((await reload(product)).stock, 125);
        const log = await InventoryLog.findOne().lean();
        assert.ok(log, "an InventoryLog should be created");
        assert.equal(log.quantity, 25);
        assert.equal(log.type, "restock");
        assert.equal(String(log.performedBy), String(wendy._id));
        assert.equal(String(log.product), String(product._id));
    });

    it("admin is allowed too → 200", async () => {
        const { product } = await setup();
        const admin = await makeUser({ role: "admin" });
        expectStatus(await as(admin).post(url(product._id)).send({ quantity: 5 }), 200);
    });

    it("regular user → 403, stock unchanged", async () => {
        const { alice, product } = await setup();
        expectStatus(await as(alice).post(url(product._id)).send({ quantity: 25 }), 403);
        assert.equal((await reload(product)).stock, 100);
    });

    for (const [name, quantity] of [["0", 0], ["-5", -5], ["2.5", 2.5], ['"25" (string)', "25"], ["missing", undefined]]) {
        it(`quantity ${name} → 400, nothing changes`, async () => {
            const { wendy, product } = await setup();
            expectStatus(await as(wendy).post(url(product._id)).send({ quantity }), 400);
            assert.equal((await reload(product)).stock, 100);
            assert.equal(await InventoryLog.countDocuments(), 0);
        });
    }

    it("invalid productId → 400", async () => {
        const { wendy } = await setup();
        expectStatus(await as(wendy).post(url(BAD_ID)).send({ quantity: 5 }), 400);
    });

    it("missing product → 404, no log created", async () => {
        const { wendy } = await setup();
        expectStatus(await as(wendy).post(url(fakeId())).send({ quantity: 5 }), 404);
        assert.equal(await InventoryLog.countDocuments(), 0);
    });

    it("10 restocks of 1 at the SAME time → stock 110 (this is why $inc beats read-add-save)", async () => {
        const { wendy, product } = await setup();
        await Promise.all(
            Array.from({ length: 10 }, () => as(wendy).post(url(product._id)).send({ quantity: 1 }))
        );
        assert.equal((await reload(product)).stock, 110, "some restocks were lost — did you read stock, add, then save?");
    });
});
