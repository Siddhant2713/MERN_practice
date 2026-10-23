// Q5 (part 2 of 3) — Premium Content Controller
//                                GET /api/articles/:articleId/premium
// Problem:  ../EndTermPracticeSheet(1-5).md → Question 5
// Grade:    npm run q 5
// Q5 has THREE files you write:
//   1. middleware/authenticate.js      (JWT from cookie → req.user)
//   2. controllers/q05-getPremiumArticle.js   ← this file
//   3. routes/premium.routes.js        (wire them together)

import Article from "../models/article.model.js";

export const getPremiumArticle = async (
    req,
    res
) => {
    try {

        // STEP 1:
        // Check user's subscription plan


        // STEP 2:
        // Check subscription expiry


        // STEP 3:
        // Find article


        // STEP 4:
        // Handle article not found


        // STEP 5:
        // Return article


    } catch (error) {

    }
};
