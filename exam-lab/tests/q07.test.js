import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { useLab, as, makeUser, expectStatus, fakeId, BAD_ID, reload, ids } from "./helpers.js";
import Book from "../models/book.model.js";

useLab();

const url = (id) => `/api/books/${id}/borrow`;

describe("Q7 — POST /api/books/:bookId/borrow", () => {
    it("valid borrow → 200, book added to user AND copies decrease", async () => {
        const alice = await makeUser();
        const book = await Book.create({ title: "Eloquent JS", availableCopies: 5 });
        const res = await as(alice).post(url(book._id));
        expectStatus(res, 200);
        assert.equal(res.body.availableCopies, 4);
        assert.equal((await reload(book)).availableCopies, 4);
        assert.deepEqual(ids((await reload(alice)).borrowedBooks), [String(book._id)]);
    });

    it("invalid book ID → 400", async () => {
        const alice = await makeUser();
        expectStatus(await as(alice).post(url(BAD_ID)), 400);
    });

    it("book doesn't exist → 404", async () => {
        const alice = await makeUser();
        expectStatus(await as(alice).post(url(fakeId())), 404);
    });

    it("already borrowed same book → 400, copies unchanged", async () => {
        const book = await Book.create({ title: "Eloquent JS", availableCopies: 5 });
        const alice = await makeUser({ borrowedBooks: [book._id] });
        expectStatus(await as(alice).post(url(book._id)), 400);
        assert.equal((await reload(book)).availableCopies, 5);
        assert.equal((await reload(alice)).borrowedBooks.length, 1);
    });

    it("already borrowing 3 books → 400, nothing changes", async () => {
        const others = await Book.create([{ title: "A" }, { title: "B" }, { title: "C" }]);
        const alice = await makeUser({ borrowedBooks: others.map((b) => b._id) });
        const book = await Book.create({ title: "D", availableCopies: 5 });
        expectStatus(await as(alice).post(url(book._id)), 400);
        assert.equal((await reload(book)).availableCopies, 5);
        assert.equal((await reload(alice)).borrowedBooks.length, 3);
    });

    it("2 books borrowed → a 3rd is still allowed", async () => {
        const others = await Book.create([{ title: "A" }, { title: "B" }]);
        const alice = await makeUser({ borrowedBooks: others.map((b) => b._id) });
        const book = await Book.create({ title: "C", availableCopies: 1 });
        expectStatus(await as(alice).post(url(book._id)), 200);
    });

    it("availableCopies = 0 → 400, user unchanged", async () => {
        const alice = await makeUser();
        const book = await Book.create({ title: "Gone", availableCopies: 0 });
        expectStatus(await as(alice).post(url(book._id)), 400);
        assert.deepEqual((await reload(alice)).borrowedBooks, []);
        assert.equal((await reload(book)).availableCopies, 0);
    });
});
