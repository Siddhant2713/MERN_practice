# exam-lab

Practice lab for the 20 end-term controller questions.
**You write the controllers. The lab grades them.**

## What's yours vs. what's the lab's

| Folder / file | Who edits it |
|---|---|
| `controllers/q01-…js` → `q20-…js` | ✍️ **You** — one stub per question, copied from the sheets |
| `middleware/authenticate.js` | ✍️ **You** (Q5) |
| `routes/premium.routes.js` | ✍️ **You** (Q5) |
| `models/` | Given (read them — they're the schemas from the sheets) |
| `middleware/fakeAuth.js` | Given — stand-in login for every question except Q5 |
| `routes/index.js` | Given — shows which URL hits which controller |
| `lab/`, `tests/` | Lab machinery — no need to read |

## Commands (run from inside `exam-lab/`)

```bash
npm run q 7      # grade Question 7
npm test         # grade all 20
npm run dev      # run the app on localhost:5000 with sample data (for curl/Postman)
```

The database is in memory: nothing to install, and it resets every run.

## Reading grader output

- `✔` passed, `✖` failed. Each failure shows **expected vs. got** and the response body.
- `LAB: … finished without sending any response`: some path in your controller never calls `res.status(...).json(...)`.
- `⚠️ DOUBLE RESPONSE`: you sent a response and kept going. **A `return` is missing.**
- `LAB: controllers/qXX… could not be loaded`: syntax error or a bad import. The error underneath says which line.

## Logging in while testing by hand (`npm run dev`)

Send the header `x-user-id: <id>`. `npm run dev` prints every user id and sample document id.
For Q5 (the real JWT cookie), first `POST /lab/login/<userId>` to get a token cookie.

## Workflow per question

1. Read the problem in the sheet. **Don't look at the solution.**
2. Write it in the stub.
3. `npm run q N`. Fix until everything is green.
4. Only then compare with the sheet's solution and note what differs.
5. A few days later: reset the stub with `git checkout controllers/qNN-….js` (once committed) and redo it from scratch.
