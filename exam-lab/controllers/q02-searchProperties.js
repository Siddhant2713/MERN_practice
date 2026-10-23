// Q2 — Search Rental Properties               GET /api/properties
// Problem:  ../EndTermPracticeSheet(1-5).md → Question 2
// Grade:    npm run q 2
// Note:     no login needed for this one (public search)

import Property from "../models/property.model.js";

export const searchProperties = async (
    req,
    res
) => {
    try {

        const {
            city,
            minRent,
            maxRent,
            bedrooms,
            search,
            sort
        } = req.query;


        // STEP 1:
        // Start filter with available: true


        // STEP 2:
        // Add city


        // STEP 3:
        // Add rent range


        // STEP 4:
        // Validate and add minimum bedrooms


        // STEP 5:
        // Add case-insensitive title search


        // STEP 6:
        // Validate sort


        // STEP 7:
        // Create Mongoose query


        // STEP 8:
        // Apply sorting


        // STEP 9:
        // Execute and return results


    } catch (error) {

    }
};
