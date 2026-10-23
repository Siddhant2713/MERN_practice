import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { useLab, as, expectStatus } from "./helpers.js";
import Property from "../models/property.model.js";

useLab();

const search = (qs = "") => as(null).get(`/api/properties${qs}`);
const titles = (res) => (res.body.properties ?? []).map((p) => p.title);
const sorted = (arr) => [...arr].sort();

describe("Q2 — GET /api/properties", () => {
    beforeEach(async () => {
        await Property.create([
            { title: "Lake View Apartment", city: "Bengaluru", rent: 25000, bedrooms: 2, available: true },
            { title: "Lakeside Residency", city: "Mumbai", rent: 40000, bedrooms: 3, available: true },
            { title: "City Studio", city: "Bengaluru", rent: 12000, bedrooms: 1, available: true },
            { title: "LAKE HOUSE", city: "Bengaluru", rent: 18000, bedrooms: 2, available: false },
            { title: "Green Villa", city: "Pune", rent: 30000, bedrooms: 4, available: true }
        ]);
    });

    it("no filters → all AVAILABLE properties only (+ count)", async () => {
        const res = await search();
        expectStatus(res, 200);
        assert.deepEqual(sorted(titles(res)), sorted(["Lake View Apartment", "Lakeside Residency", "City Studio", "Green Villa"]));
        assert.equal(res.body.count, 4);
    });

    it("city=Bengaluru → only Bengaluru", async () => {
        const res = await search("?city=Bengaluru");
        assert.deepEqual(sorted(titles(res)), sorted(["Lake View Apartment", "City Studio"]));
    });

    it("minRent=20000 → rent >= 20000", async () => {
        const res = await search("?minRent=20000");
        assert.deepEqual(sorted(titles(res)), sorted(["Lake View Apartment", "Lakeside Residency", "Green Villa"]));
    });

    it("maxRent=30000 → rent <= 30000 (inclusive)", async () => {
        const res = await search("?maxRent=30000");
        assert.deepEqual(sorted(titles(res)), sorted(["Lake View Apartment", "City Studio", "Green Villa"]));
    });

    it("minRent=15000&maxRent=30000 → both ends of the range", async () => {
        const res = await search("?minRent=15000&maxRent=30000");
        assert.deepEqual(sorted(titles(res)), sorted(["Lake View Apartment", "Green Villa"]));
    });

    it("bedrooms=2 → AT LEAST 2 bedrooms", async () => {
        const res = await search("?bedrooms=2");
        assert.deepEqual(sorted(titles(res)), sorted(["Lake View Apartment", "Lakeside Residency", "Green Villa"]));
    });

    it("search=lake → case-insensitive title match (still only available)", async () => {
        const res = await search("?search=lake");
        assert.deepEqual(sorted(titles(res)), sorted(["Lake View Apartment", "Lakeside Residency"]));
    });

    it("sort=rent_low → cheapest first", async () => {
        const res = await search("?sort=rent_low");
        assert.deepEqual(titles(res), ["City Studio", "Lake View Apartment", "Green Villa", "Lakeside Residency"]);
    });

    it("sort=rent_high → most expensive first", async () => {
        const res = await search("?sort=rent_high");
        assert.deepEqual(titles(res), ["Lakeside Residency", "Green Villa", "Lake View Apartment", "City Studio"]);
    });

    it("combined: city=Bengaluru&bedrooms=2&maxRent=30000", async () => {
        const res = await search("?city=Bengaluru&bedrooms=2&maxRent=30000");
        assert.deepEqual(titles(res), ["Lake View Apartment"]);
    });

    for (const qs of ["?sort=random", "?minRent=hello", "?maxRent=-1", "?bedrooms=1.5", "?bedrooms=abc"]) {
        it(`${qs} → 400`, async () => {
            const res = await search(qs);
            expectStatus(res, 400);
            assert.equal(res.body.success, false);
        });
    }
});
