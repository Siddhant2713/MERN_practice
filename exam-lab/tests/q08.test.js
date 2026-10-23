import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { useLab, as, makeUser, expectStatus } from "./helpers.js";
import Transaction from "../models/transaction.model.js";

useLab();

let alice, bob;
const titles = (res) => (res.body.transactions ?? []).map((t) => t.title);
const sorted = (arr) => [...arr].sort();
const get = (user, qs = "") => as(user).get(`/api/transactions${qs}`);

describe("Q8 — GET /api/transactions", () => {
    beforeEach(async () => {
        alice = await makeUser();
        bob = await makeUser();
        await Transaction.create([
            { user: alice._id, title: "Groceries", amount: 600, type: "debit", category: "food", createdAt: new Date("2026-09-05T10:00:00Z") },
            { user: alice._id, title: "Salary", amount: 50000, type: "credit", category: "salary", createdAt: new Date("2026-09-01T12:00:00Z") },
            { user: alice._id, title: "Pizza", amount: 450, type: "debit", category: "food", createdAt: new Date("2026-09-20T19:00:00Z") },
            { user: alice._id, title: "Flight", amount: 7000, type: "debit", category: "travel", createdAt: new Date("2026-08-15T08:00:00Z") },
            { user: alice._id, title: "Refund", amount: 1200, type: "credit", category: "shopping", createdAt: new Date("2026-10-01T09:00:00Z") },
            { user: bob._id, title: "Bob's lunch", amount: 300, type: "debit", category: "food", createdAt: new Date("2026-09-10T13:00:00Z") }
        ]);
    });

    it("no filters → only MY transactions, newest first, with pagination info", async () => {
        const res = await get(alice);
        expectStatus(res, 200);
        assert.deepEqual(titles(res), ["Refund", "Pizza", "Groceries", "Salary", "Flight"]);
        assert.equal(res.body.pagination?.page, 1);
        assert.equal(res.body.pagination?.limit, 10);
        assert.equal(res.body.pagination?.total, 5);
        assert.equal(res.body.pagination?.totalPages, 1);
    });

    it("SECURITY: ?user=<someone else> is ignored — you only ever see your own", async () => {
        const res = await get(bob, `?user=${alice._id}`);
        assert.deepEqual(titles(res), ["Bob's lunch"]);
    });

    it("type=debit → debit only", async () => {
        assert.deepEqual(sorted(titles(await get(alice, "?type=debit"))), sorted(["Groceries", "Pizza", "Flight"]));
    });

    it("category=food", async () => {
        assert.deepEqual(sorted(titles(await get(alice, "?category=food"))), sorted(["Groceries", "Pizza"]));
    });

    it("minAmount=500 → amount >= 500", async () => {
        assert.deepEqual(sorted(titles(await get(alice, "?minAmount=500"))), sorted(["Groceries", "Salary", "Flight", "Refund"]));
    });

    it("minAmount=500&maxAmount=5000", async () => {
        assert.deepEqual(sorted(titles(await get(alice, "?minAmount=500&maxAmount=5000"))), sorted(["Groceries", "Refund"]));
    });

    it("from=2026-09-01&to=2026-09-30 → September only", async () => {
        assert.deepEqual(sorted(titles(await get(alice, "?from=2026-09-01&to=2026-09-30"))), sorted(["Groceries", "Salary", "Pizza"]));
    });

    it("sort=oldest", async () => {
        assert.deepEqual(titles(await get(alice, "?sort=oldest")), ["Flight", "Salary", "Groceries", "Pizza", "Refund"]);
    });

    it("sort=amount_desc → highest amount first", async () => {
        assert.deepEqual(titles(await get(alice, "?sort=amount_desc")), ["Salary", "Flight", "Refund", "Groceries", "Pizza"]);
    });

    it("sort=amount_asc", async () => {
        assert.deepEqual(titles(await get(alice, "?sort=amount_asc")), ["Pizza", "Groceries", "Refund", "Flight", "Salary"]);
    });

    it("page=2&limit=2 → second page", async () => {
        const res = await get(alice, "?page=2&limit=2");
        assert.deepEqual(titles(res), ["Groceries", "Salary"]);
        assert.deepEqual(res.body.pagination, { page: 2, limit: 2, total: 5, totalPages: 3 });
    });

    it("filters + pagination: total counts ALL matches, not just this page", async () => {
        const res = await get(alice, "?type=debit&limit=1");
        assert.equal(res.body.transactions.length, 1);
        assert.equal(res.body.pagination?.total, 3);
        assert.equal(res.body.pagination?.totalPages, 3);
    });

    it("limit=500 → capped at 50", async () => {
        assert.equal((await get(alice, "?limit=500")).body.pagination?.limit, 50);
    });

    it("page=0 or page=-3 → treated as page 1", async () => {
        assert.equal((await get(alice, "?page=0")).body.pagination?.page, 1);
        assert.equal((await get(alice, "?page=-3")).body.pagination?.page, 1);
    });

    for (const qs of ["?type=crypto", "?minAmount=abc", "?maxAmount=-5", "?from=banana", "?to=notadate", "?sort=random"]) {
        it(`${qs} → 400`, async () => {
            const res = await get(alice, qs);
            expectStatus(res, 400);
            assert.equal(res.body.success, false);
        });
    }
});
