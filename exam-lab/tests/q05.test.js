import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { useLab, makeUser, withCookie, tokenFor, expectStatus, fakeId, BAD_ID, hoursFromNow } from "./helpers.js";
import Article from "../models/article.model.js";
import User from "../models/user.model.js";

useLab();

const url = (id) => `/api/articles/${id}/premium`;
const premium = () => makeUser({ subscription: { plan: "premium", expiresAt: hoursFromNow(24 * 30) } });

describe("Q5 — GET /api/articles/:articleId/premium  (authenticate + controller + route)", () => {
    it("no cookie → 401", async () => {
        const article = await Article.create({ title: "Deep dive" });
        expectStatus(await withCookie("get", url(article._id), null), 401);
    });

    it("garbage token → 401", async () => {
        const article = await Article.create({ title: "Deep dive" });
        expectStatus(await withCookie("get", url(article._id), "not.a.jwt"), 401);
    });

    it("token signed with the WRONG secret (forged) → 401", async () => {
        const user = await premium();
        const article = await Article.create({ title: "Deep dive" });
        const forged = tokenFor(String(user._id), {}, "hacker-secret");
        expectStatus(await withCookie("get", url(article._id), forged), 401);
    });

    it("expired JWT → 401", async () => {
        const user = await premium();
        const article = await Article.create({ title: "Deep dive" });
        const expired = tokenFor(String(user._id), { exp: Math.floor(Date.now() / 1000) - 60 });
        expectStatus(await withCookie("get", url(article._id), expired), 401);
    });

    it("JWT points to a deleted user → 401", async () => {
        const user = await premium();
        const article = await Article.create({ title: "Deep dive" });
        const token = tokenFor(String(user._id));
        await User.deleteOne({ _id: user._id });
        expectStatus(await withCookie("get", url(article._id), token), 401);
    });

    it("authenticated FREE user → 403 (not 401!)", async () => {
        const user = await makeUser();
        const article = await Article.create({ title: "Deep dive" });
        expectStatus(await withCookie("get", url(article._id), tokenFor(String(user._id))), 403);
    });

    it("premium user whose subscription expired → 403", async () => {
        const user = await makeUser({ subscription: { plan: "premium", expiresAt: hoursFromNow(-1) } });
        const article = await Article.create({ title: "Deep dive" });
        expectStatus(await withCookie("get", url(article._id), tokenFor(String(user._id))), 403);
    });

    it("active premium + invalid articleId → 400", async () => {
        const user = await premium();
        expectStatus(await withCookie("get", url(BAD_ID), tokenFor(String(user._id))), 400);
    });

    it("active premium + missing article → 404", async () => {
        const user = await premium();
        expectStatus(await withCookie("get", url(fakeId()), tokenFor(String(user._id))), 404);
    });

    it("active premium + valid article → 200 with the article", async () => {
        const user = await premium();
        const article = await Article.create({ title: "Deep dive" });
        const res = await withCookie("get", url(article._id), tokenFor(String(user._id)));
        expectStatus(res, 200);
        assert.equal(res.body.success, true);
        assert.equal(res.body.article?.title, "Deep dive");
    });
});
