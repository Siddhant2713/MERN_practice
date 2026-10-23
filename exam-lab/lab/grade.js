// LAB ONLY — `npm run q 7` runs the grader for Question 7.

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const n = Number(process.argv[2]);

if (!Number.isInteger(n) || n < 1 || n > 20) {
    console.log("Usage:  npm run q <1-20>     e.g.  npm run q 7");
    console.log("All:    npm test");
    process.exit(1);
}

const file = `tests/q${String(n).padStart(2, "0")}.test.js`;

if (!existsSync(file)) {
    console.log(`No grader yet for Q${n} (${file}).`);
    process.exit(1);
}

const result = spawnSync(
    process.execPath,
    ["--test", "--test-reporter=spec", file],
    { stdio: "inherit" }
);

process.exit(result.status ?? 1);
