import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { useLab, as, makeUser, expectStatus } from "./helpers.js";
import Expense from "../models/expense.model.js";

useLab();

const valid = { title: "Dinner", amount: 850, category: "food", paymentMethod: "upi" };

describe("Q1 — POST /api/expenses", () => {
    it("valid expense → 201, saved, owner = logged-in user", async () => {
        const alice = await makeUser();
        const res = await as(alice).post("/api/expenses").send(valid);
        expectStatus(res, 201);
        assert.equal(res.body.success, true);
        assert.equal(res.body.expense?.title, "Dinner");
        assert.equal(String(res.body.expense?.owner), String(alice._id));
        assert.equal(await Expense.countDocuments(), 1);
    });

    it("title is trimmed before saving", async () => {
        const alice = await makeUser();
        await as(alice).post("/api/expenses").send({ ...valid, title: "   Dinner   " });
        const saved = await Expense.findOne().lean();
        assert.equal(saved?.title, "Dinner");
    });

    it("SECURITY: owner sent in the body is ignored — server decides", async () => {
        const alice = await makeUser();
        const bob = await makeUser();
        const res = await as(alice).post("/api/expenses").send({ ...valid, owner: String(bob._id) });
        expectStatus(res, 201);
        const saved = await Expense.findOne().lean();
        assert.equal(String(saved?.owner), String(alice._id), "owner must come from req.user, not req.body");
    });

    const bad = [
        ["missing title", { ...valid, title: undefined }],
        ["empty title", { ...valid, title: "" }],
        ['"     " title (only spaces)', { ...valid, title: "     " }],
        ["amount 0", { ...valid, amount: 0 }],
        ["negative amount", { ...valid, amount: -50 }],
        ['amount "500" (a string)', { ...valid, amount: "500" }],
        ["missing amount", { ...valid, amount: undefined }],
        ["invalid category", { ...valid, category: "cryptocurrency" }],
        ["invalid payment method", { ...valid, paymentMethod: "bitcoin" }]
    ];

    for (const [name, body] of bad) {
        it(`${name} → 400, nothing saved`, async () => {
            const alice = await makeUser();
            const res = await as(alice).post("/api/expenses").send(body);
            expectStatus(res, 400);
            assert.equal(res.body.success, false);
            assert.equal(await Expense.countDocuments(), 0);
        });
    }
});
