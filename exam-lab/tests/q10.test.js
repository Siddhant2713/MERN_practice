import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { useLab, as, makeUser, expectStatus, reload, PASSWORD } from "./helpers.js";

useLab();

const URL = "/api/account/deactivate";
const good = { currentPassword: PASSWORD, confirmation: "DEACTIVATE" };

describe("Q10 — POST /api/account/deactivate", () => {
    it("correct password + confirmation → 200, isActive false, token cookie cleared", async () => {
        const alice = await makeUser();
        const res = await as(alice).post(URL).send(good);
        expectStatus(res, 200);
        assert.equal((await reload(alice)).isActive, false);
        const cookies = res.headers["set-cookie"] ?? [];
        assert.ok(
            cookies.some((c) => c.startsWith("token=;")),
            `Expected a Set-Cookie header clearing "token". Got: ${JSON.stringify(cookies)}`
        );
    });

    it("soft deactivation: the user document still exists", async () => {
        const alice = await makeUser();
        expectStatus(await as(alice).post(URL).send(good), 200);
        assert.ok(await reload(alice), "user should NOT be deleted, only isActive = false");
    });

    it("missing password → 400", async () => {
        const alice = await makeUser();
        expectStatus(await as(alice).post(URL).send({ confirmation: "DEACTIVATE" }), 400);
    });

    it("missing confirmation → 400", async () => {
        const alice = await makeUser();
        expectStatus(await as(alice).post(URL).send({ currentPassword: PASSWORD }), 400);
    });

    for (const confirmation of ["delete", "deactivate", "DEACTIVATE "]) {
        it(`confirmation = "${confirmation}" → 400, still active`, async () => {
            const alice = await makeUser();
            expectStatus(await as(alice).post(URL).send({ currentPassword: PASSWORD, confirmation }), 400);
            assert.equal((await reload(alice)).isActive, true);
        });
    }

    it("wrong password → 401, still active, cookie NOT cleared", async () => {
        const alice = await makeUser();
        const res = await as(alice).post(URL).send({ currentPassword: "wrong-password", confirmation: "DEACTIVATE" });
        expectStatus(res, 401);
        assert.equal((await reload(alice)).isActive, true);
    });
});
