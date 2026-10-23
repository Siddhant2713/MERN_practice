// LAB ONLY — you don't need to edit or understand this file for the exam.
//
// Catches the "missing return" bug: a controller that calls
// res.status(...).json(...) and then keeps running, so it tries to send a
// SECOND response. The client already got the first one, so the status code
// looks right — this bug is otherwise invisible. The lab records it and the
// grader fails the test with a plain-English explanation.

export function labGuards(req, res, next) {
    const originalJson = res.json.bind(res);
    let firstStatus = null;
    let warned = false;

    res.json = (body) => {
        if (!res.headersSent) {
            firstStatus = res.statusCode;
        } else if (!warned) {
            warned = true;
            const warning =
                `DOUBLE RESPONSE on ${req.method} ${req.originalUrl}\n` +
                `   A ${firstStatus} response was already sent, then your code kept running\n` +
                `   and tried to send another one (status ${res.statusCode}).\n` +
                `   → You are missing a "return" before an earlier res.status(...).json(...)`;
            req.app.locals.labWarnings.push(warning);
            console.warn(`\n⚠️  ${warning}\n`);
        }
        return originalJson(body);
    };

    next();
}
