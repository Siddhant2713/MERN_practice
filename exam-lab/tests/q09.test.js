import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { useLab, as, makeUser, expectStatus, fakeId, BAD_ID } from "./helpers.js";
import Product from "../models/product.model.js";
import Review from "../models/review.model.js";

useLab();

const url = (id) => `/api/products/${id}/review`;

describe("Q9 — PUT /api/products/:productId/review", () => {
    it("first review → 201, created", async () => {
        const alice = await makeUser();
        const product = await Product.create({ name: "Headphones", price: 2500 });
        const res = await as(alice).put(url(product._id)).send({ rating: 4, comment: "Very good overall." });
        expectStatus(res, 201);
        assert.equal(res.body.review?.rating, 4);
        assert.equal(await Review.countDocuments(), 1);
    });

    it("second request same user/product → 200, SAME review updated (still 1 doc)", async () => {
        const alice = await makeUser();
        const product = await Product.create({ name: "Headphones", price: 2500 });
        await as(alice).put(url(product._id)).send({ rating: 4, comment: "Good" });
        const res = await as(alice).put(url(product._id)).send({ rating: 2, comment: "Broke after a week" });
        expectStatus(res, 200);
        assert.equal(await Review.countDocuments(), 1);
        const review = await Review.findOne().lean();
        assert.equal(review.rating, 2);
        assert.equal(review.comment, "Broke after a week");
    });

    it("different user reviewing same product → separate review (201)", async () => {
        const alice = await makeUser();
        const bob = await makeUser();
        const product = await Product.create({ name: "Headphones", price: 2500 });
        await as(alice).put(url(product._id)).send({ rating: 4 });
        expectStatus(await as(bob).put(url(product._id)).send({ rating: 5 }), 201);
        assert.equal(await Review.countDocuments(), 2);
    });

    it("comment is trimmed; missing comment saves as empty string", async () => {
        const alice = await makeUser();
        const bob = await makeUser();
        const product = await Product.create({ name: "Headphones", price: 2500 });
        await as(alice).put(url(product._id)).send({ rating: 4, comment: "   Nice   " });
        await as(bob).put(url(product._id)).send({ rating: 4 });
        assert.equal((await Review.findOne({ user: alice._id }).lean()).comment, "Nice");
        assert.equal((await Review.findOne({ user: bob._id }).lean()).comment, "");
    });

    for (const [name, rating] of [["0", 0], ["6", 6], ["4.5", 4.5], ["missing", undefined]]) {
        it(`rating = ${name} → 400`, async () => {
            const alice = await makeUser();
            const product = await Product.create({ name: "Headphones", price: 2500 });
            expectStatus(await as(alice).put(url(product._id)).send({ rating }), 400);
            assert.equal(await Review.countDocuments(), 0);
        });
    }

    it("invalid productId → 400", async () => {
        const alice = await makeUser();
        expectStatus(await as(alice).put(url(BAD_ID)).send({ rating: 4 }), 400);
    });

    it("missing product → 404", async () => {
        const alice = await makeUser();
        expectStatus(await as(alice).put(url(fakeId())).send({ rating: 4 }), 404);
    });
});
