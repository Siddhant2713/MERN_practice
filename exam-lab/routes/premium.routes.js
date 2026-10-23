// Q5 (part 3 of 3) — Student Route
// This router is mounted at /api/articles, so the full URL is
//     GET /api/articles/:articleId/premium
// Grade:    npm run q 5

import { Router } from "express";

// Import your middleware and controller here


const router = Router();

router.get(
    "/:articleId/premium",

    // Add middleware

    // Add controller
);

export default router;
