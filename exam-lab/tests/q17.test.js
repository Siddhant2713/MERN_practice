import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { useLab, as, makeUser, expectStatus, hoursFromNow, reload } from "./helpers.js";
import Coupon from "../models/coupon.model.js";
import Product from "../models/product.model.js";

useLab();

const URL = "/api/cart/apply-coupon";

// Cart: 2 × ₹1000 + 2 × ₹1500 = ₹5000
async function setup(couponFields = {}, { emptyCart = false } = {}) {
    const keyboard = await Product.create({ name: "Keyboard", price: 1000 });
    const mouse = await Product.create({ name: "Mouse", price: 1500 });
    const alice = await makeUser({
        cart: emptyCart ? [] : [{ product: keyboard._id, quantity: 2 }, { product: mouse._id, quantity: 2 }]
    });
    const coupon = await Coupon.create({
        code: "SAVE20", discountPercent: 20, minimumCartValue: 3000,
        expiresAt: hoursFromNow(24 * 7), usageLimit: 100, usedBy: [],
        ...couponFields
    });
    return { alice, coupon };
}

describe("Q17 — POST /api/cart/apply-coupon", () => {
    it("SAVE20 on a ₹5000 cart → 200 with full pricing breakdown", async () => {
        const { alice } = await setup();
        const res = await as(alice).post(URL).send({ code: "SAVE20" });
        expectStatus(res, 200);
        assert.deepEqual(res.body.pricing, { cartTotal: 5000, discountPercent: 20, discount: 1000, finalAmount: 4000 });
    });

    for (const code of ["save20", "Save20", "  SAVE20  "]) {
        it(`code "${code}" works too (normalised)`, async () => {
            const { alice } = await setup();
            expectStatus(await as(alice).post(URL).send({ code }), 200);
        });
    }

    it("does NOT mark the coupon as used (that happens at order time)", async () => {
        const { alice, coupon } = await setup();
        expectStatus(await as(alice).post(URL).send({ code: "SAVE20" }), 200);
        assert.deepEqual((await reload(coupon)).usedBy, []);
    });

    for (const [name, body] of [["missing code", {}], ['code "   "', { code: "   " }]]) {
        it(`${name} → 400`, async () => {
            const { alice } = await setup();
            expectStatus(await as(alice).post(URL).send(body), 400);
        });
    }

    it("unknown code → 404", async () => {
        const { alice } = await setup();
        expectStatus(await as(alice).post(URL).send({ code: "NOPE99" }), 404);
    });

    it("expired coupon → 400", async () => {
        const { alice } = await setup({ expiresAt: hoursFromNow(-1) });
        expectStatus(await as(alice).post(URL).send({ code: "SAVE20" }), 400);
    });

    it("you already used it → 400", async () => {
        const alice = await makeUser();
        await setup({ usedBy: [alice._id] });
        expectStatus(await as(alice).post(URL).send({ code: "SAVE20" }), 400);
    });

    it("global usage limit reached → 400", async () => {
        const bob = await makeUser();
        const { alice } = await setup({ usageLimit: 1, usedBy: [bob._id] });
        expectStatus(await as(alice).post(URL).send({ code: "SAVE20" }), 400);
    });

    it("cart below minimum value → 400", async () => {
        const { alice } = await setup({ minimumCartValue: 10000 });
        expectStatus(await as(alice).post(URL).send({ code: "SAVE20" }), 400);
    });

    it("cart exactly AT minimum value → 200", async () => {
        const { alice } = await setup({ minimumCartValue: 5000 });
        expectStatus(await as(alice).post(URL).send({ code: "SAVE20" }), 200);
    });

    it("empty cart → 400", async () => {
        const { alice } = await setup({}, { emptyCart: true });
        expectStatus(await as(alice).post(URL).send({ code: "SAVE20" }), 400);
    });
});
