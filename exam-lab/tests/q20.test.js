import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { useLab, as, makeUser, expectStatus, reload } from "./helpers.js";

useLab();

const URL = "/api/account/addresses";
const addr = (label, extra = {}) => ({ label, line1: "12 Residency Road", city: "Bengaluru", pincode: "560025", ...extra });
const defaults = (user) => user.addresses.filter((a) => a.isDefault).map((a) => a.label);

describe("Q20 — POST /api/account/addresses", () => {
    it("first address → 201, automatically default (even without makeDefault)", async () => {
        const alice = await makeUser();
        const res = await as(alice).post(URL).send(addr("Home"));
        expectStatus(res, 201);
        assert.equal(res.body.addresses?.length, 1);
        assert.deepEqual(defaults(await reload(alice)), ["Home"]);
    });

    it("second address without makeDefault → NOT default, first stays default", async () => {
        const alice = await makeUser();
        await as(alice).post(URL).send(addr("Home"));
        await as(alice).post(URL).send(addr("Office"));
        assert.deepEqual(defaults(await reload(alice)), ["Home"]);
    });

    it("makeDefault: true → new one is the ONLY default", async () => {
        const alice = await makeUser();
        await as(alice).post(URL).send(addr("Home"));
        await as(alice).post(URL).send(addr("Office"));
        await as(alice).post(URL).send(addr("Parents", { makeDefault: true }));
        assert.deepEqual(defaults(await reload(alice)), ["Parents"]);
    });

    it("values are trimmed", async () => {
        const alice = await makeUser();
        await as(alice).post(URL).send({ label: " Home ", line1: " 1 MG Rd ", city: " Pune ", pincode: " 411001 " });
        const a = (await reload(alice)).addresses[0];
        assert.deepEqual([a.label, a.line1, a.city, a.pincode], ["Home", "1 MG Rd", "Pune", "411001"]);
    });

    it("6th address → 400, still 5", async () => {
        const alice = await makeUser({
            addresses: [1, 2, 3, 4, 5].map((n) => ({ ...addr(`A${n}`), isDefault: n === 1 }))
        });
        expectStatus(await as(alice).post(URL).send(addr("Sixth")), 400);
        assert.equal((await reload(alice)).addresses.length, 5);
    });

    for (const field of ["label", "line1", "city", "pincode"]) {
        it(`missing ${field} → 400`, async () => {
            const alice = await makeUser();
            expectStatus(await as(alice).post(URL).send(addr("Home", { [field]: undefined })), 400);
        });
    }

    it('city "   " → 400', async () => {
        const alice = await makeUser();
        expectStatus(await as(alice).post(URL).send(addr("Home", { city: "   " })), 400);
    });
});
