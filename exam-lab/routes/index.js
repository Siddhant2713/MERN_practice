// LAB ONLY — wires every question's URL to your controller.
// Read it to see which URL + method hits which file. Don't edit it.
// (Q5 is different: there YOU write the route, in routes/premium.routes.js.)

import { Router } from "express";

import { fakeAuth } from "../middleware/fakeAuth.js";
import { yours, yoursRouter } from "../lab/loader.js";

const router = Router();

// Batch 1
router.post("/api/expenses", fakeAuth, yours("q01-createExpense.js", "createExpense"));
router.get("/api/properties", yours("q02-searchProperties.js", "searchProperties"));
router.patch("/api/orders/:orderId/address", fakeAuth, yours("q03-updateDeliveryAddress.js", "updateDeliveryAddress"));
router.post("/api/courses/:courseId/enrollment", fakeAuth, yours("q04-toggleEnrollment.js", "toggleEnrollment"));
router.use("/api/articles", yoursRouter("routes/premium.routes.js")); // Q5 — real JWT auth, no fakeAuth

// Batch 2
router.patch("/api/appointments/:appointmentId/reschedule", fakeAuth, yours("q06-rescheduleAppointment.js", "rescheduleAppointment"));
router.post("/api/books/:bookId/borrow", fakeAuth, yours("q07-borrowBook.js", "borrowBook"));
router.get("/api/transactions", fakeAuth, yours("q08-getTransactions.js", "getTransactions"));
router.put("/api/products/:productId/review", fakeAuth, yours("q09-createOrUpdateReview.js", "createOrUpdateReview"));
router.post("/api/account/deactivate", fakeAuth, yours("q10-deactivateAccount.js", "deactivateAccount"));

// Batch 3
router.post("/api/reservations/:reservationId/cancel", fakeAuth, yours("q11-cancelReservation.js", "cancelReservation"));
router.put("/api/assignments/:assignmentId/submission", fakeAuth, yours("q12-submitAssignment.js", "submitAssignment"));
router.post("/api/invitations/:invitationId/respond", fakeAuth, yours("q13-respondToInvitation.js", "respondToInvitation"));
router.post("/api/posts/:postId/report", fakeAuth, yours("q14-reportPost.js", "reportPost"));
router.patch("/api/reports/:reportId/moderate", fakeAuth, yours("q15-moderateReport.js", "moderateReport"));
router.post("/api/inventory/:productId/restock", fakeAuth, yours("q16-restockProduct.js", "restockProduct"));
router.post("/api/cart/apply-coupon", fakeAuth, yours("q17-applyCoupon.js", "applyCoupon"));
router.patch("/api/tasks/:taskId/status", fakeAuth, yours("q18-updateTaskStatus.js", "updateTaskStatus"));
router.patch("/api/notifications/read-all", fakeAuth, yours("q19-markAllNotificationsRead.js", "markAllNotificationsRead"));
router.post("/api/account/addresses", fakeAuth, yours("q20-addAddress.js", "addAddress"));

export default router;
