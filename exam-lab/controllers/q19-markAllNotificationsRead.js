// Q19 — Mark All Notifications as Read        PATCH /api/notifications/read-all
// Problem:  ../EndTermPractice(11-20).md → Question 19
// Grade:    npm run q 19

import Notification
    from "../models/notification.model.js";

export const markAllNotificationsRead = async (
    req,
    res
) => {
    try {

        // Find all unread notifications
        // belonging to current user


        // Mark isRead = true
        // using one database operation


        // Return how many notifications
        // were changed


    } catch (error) {

    }
};
