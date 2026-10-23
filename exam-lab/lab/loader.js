// LAB ONLY — you don't need to edit or understand this file for the exam.
//
// Loads YOUR files (controllers/, middleware/authenticate.js,
// routes/premium.routes.js) fresh on each request, one at a time. That way a
// syntax error in q12 can't crash the lab for q1 — only q12's route breaks,
// with a message telling you which file and why.

import path from "node:path";
import { pathToFileURL } from "node:url";

// LEARNER_DIR lets the lab grade a different folder (used to self-test the lab).
const ROOT = process.env.LEARNER_DIR
    ? path.resolve(process.env.LEARNER_DIR)
    : path.resolve(import.meta.dirname, "..");

const load = (relativePath) =>
    import(pathToFileURL(path.join(ROOT, relativePath)).href);

function labFail(res, message, err) {
    console.error(`\n🧪 LAB: ${message}`);
    if (err) console.error(err);
    if (!res.headersSent) {
        res.status(500).json({
            success: false,
            lab: true,
            message: `LAB: ${message}`,
            error: err ? `${err.name}: ${err.message}` : undefined
        });
    }
}

function track(req, promise) {
    const inflight = req.app.locals.inflight;
    inflight.add(promise);
    promise.finally(() => inflight.delete(promise));
}

// Wraps one of your controller functions: yours("q01-createExpense.js", "createExpense")
export const yours = (file, exportName) => (req, res, next) => {
    const run = (async () => {
        let mod;
        try {
            mod = await load(path.join("controllers", file));
        } catch (err) {
            return labFail(res, `controllers/${file} could not be loaded (syntax error or bad import?)`, err);
        }

        const controller = mod[exportName];
        if (typeof controller !== "function") {
            return labFail(res, `controllers/${file} must export a function named "${exportName}"`);
        }

        try {
            await controller(req, res, next);
        } catch (err) {
            return labFail(res, `${exportName} threw an error that escaped its try/catch`, err);
        }

        if (!res.headersSent) {
            labFail(
                res,
                `${exportName} finished without sending any response. ` +
                `Does every path end in res.status(...).json(...)?`
            );
        }
    })();

    track(req, run);
};

// Mounts YOUR router file (Q5): yoursRouter("routes/premium.routes.js")
export const yoursRouter = (relativePath) => (req, res, next) => {
    load(relativePath).then(
        (mod) => {
            const router = mod.default;
            if (typeof router !== "function") {
                return labFail(res, `${relativePath} must "export default router"`);
            }
            router(req, res, next);
        },
        (err) => labFail(res, `${relativePath} could not be loaded`, err)
    );
};
