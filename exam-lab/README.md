# exam-lab

Practice lab for 20 MERN backend controller questions (Express 5 + Mongoose 9).
**You write the controllers. The lab grades them automatically.**

Each question is a blank stub in `controllers/`. You fill it in, run one command, and a grader sends every test case from the problem sheet (400, 403, 404, 409, success path, security checks) and tells you what passed and what failed.

---

## Setup

### 1. What you need

| Tool | Version | Check with |
|---|---|---|
| Node.js | 20 or newer | `node -v` |
| npm | comes with Node | `npm -v` |
| Git | any | `git --version` |

You do **not** need to install MongoDB. The lab runs an in-memory database that starts and disappears with each run.

### 2. Get the code

```bash
git clone https://github.com/Siddhant2713/MERN_practice.git
cd MERN_practice/exam-lab
```

All commands below are run from inside `exam-lab/`.

### 3. Install dependencies

```bash
npm install
```

### 4. Check that it works

```bash
npm run q 1
```

On a fresh copy every question should **fail** (the stubs are blank). Seeing red `✖` lines with readable messages means the lab is working. Your job is to turn them green.

> **First run is slower.** The first time a test starts, `mongodb-memory-server` downloads a MongoDB binary (about 100 MB, once). It needs an internet connection. After that it is cached and runs in about a second.

---

## Commands

| Command | What it does |
|---|---|
| `npm run q 7` | Grade question 7 only |
| `npm run q 7 2>&1 \| grep -E "^\s+(✔\|✖)\|^ℹ (pass\|fail)"` | Same, but print only the ✔/✖ lines and the totals |
| `npm test` | Grade all 20 questions |
| `npm run dev` | Start the app on `http://localhost:5000` with sample data, for trying requests by hand (curl / Postman) |

---

## Folder map

| Folder / file | Who edits it |
|---|---|
| `controllers/q01-…js` → `q20-…js` | ✍️ **You**: one stub per question |
| `middleware/authenticate.js` | ✍️ **You** (Q5) |
| `routes/premium.routes.js` | ✍️ **You** (Q5) |
| `models/` | Given. Read them: they are the schemas used by the questions |
| `middleware/fakeAuth.js` | Given. Stand-in login for every question except Q5 |
| `routes/index.js` | Given. Shows which URL and method reach which controller |
| `lab/`, `tests/` | Lab machinery. No need to read |

The problem statements are in the three practice sheets (`EndTermPracticeSheet(1-5).md`, `EndTermPractice(6-10).txt`, `EndTermPractice(11-20).md`). Each stub's first lines say which question it is.

---

## Workflow for each question

1. Read the problem. **Don't look at the sheet's solution.**
2. Write the `catch` block first, so crashes are visible:
   ```js
   } catch (error) {
       console.error(error)
       return res.status(500).json({ success: false, message: "Internal server error" })
   }
   ```
3. Fill in the steps in the stub.
4. Run `npm run q N` and fix until everything is green.
5. Only then compare with the sheet's solution and note what differed.
6. A few days later, reset the question and redo it from scratch (see below).

### Check before you press run

1. Does every field name I used appear in the model?
2. Do my allowed-word lists match the problem statement, letter by letter?
3. For each `if`: does the sentence I'd say out loud match the code, including the `!`?
4. Are ids compared with `.equals` (never `===`)? Do `filter` / `some` callbacks either have no braces or a `return`?

### Reset one question to blank

```bash
git checkout controllers/q07-borrowBook.js
```

(This throws away your changes to that file.)

---

## Reading grader output

- `✔` passed, `✖` failed. Each failure shows **expected vs. got** and the response body.
- The line that matters is the one starting with an error name (`TypeError`, `ReferenceError`, `ValidationError`) plus the `controllers/qXX…js:LINE` that follows. Open that line first.
- `Cannot read properties of undefined (reading 'x')` means the thing **before** the dot is `undefined`. Check the spelling of the field name against the model.
- `LAB: … finished without sending any response`: something threw and your `catch` is empty, or a path never calls `res.status(...).json(...)`.
- `⚠️ DOUBLE RESPONSE`: you sent a response and kept running. **A `return` is missing.**
- `LAB: controllers/qXX… could not be loaded`: syntax error or a bad import. The error underneath says which line.
- Ignore lines starting with `at process…` / `at async…` and test-library internals like `generatedMessage`.

---

## Trying requests by hand (`npm run dev`)

`npm run dev` prints a cheat sheet of user ids and sample document ids. Log in by sending a header:

```bash
curl -X PATCH localhost:5000/api/orders/000000000000000000000301/address \
     -H "x-user-id: aaaaaaaaaaaaaaaaaaaaaaa1" \
     -H "Content-Type: application/json" \
     -d '{"address":{"line1":"221B MG Road","city":"Bengaluru","pincode":"560001"}}'
```

For Q5 (the real JWT cookie), first call `POST /lab/login/<userId>` to receive a `token` cookie. All lab users have the password `secret123`.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `Cannot find package 'express'` | You are in the wrong folder or skipped `npm install`. Run `pwd`, `cd` into `exam-lab/`, then `npm install` |
| First test hangs or errors while starting | The MongoDB binary is still downloading. Check your internet connection and retry |
| `EADDRINUSE: address already in use :::5000` | Another `npm run dev` is still running. Stop it, or free the port |
| Every test fails with `could not be loaded` | A syntax error in your controller. The line number is in the message |
| Node version error | Upgrade to Node 20 or newer |
