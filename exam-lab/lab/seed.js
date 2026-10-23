// LAB ONLY — sample data for `npm run dev`, with readable ids so you can
// copy-paste them into curl/Postman. Every doc id ends in <question><item>,
// e.g. ...0301 = Question 3, item 01.

import mongoose from "mongoose";
import bcrypt from "bcrypt";

import User from "../models/user.model.js";
import Expense from "../models/expense.model.js";
import Property from "../models/property.model.js";
import Order from "../models/order.model.js";
import Course from "../models/course.model.js";
import Article from "../models/article.model.js";
import Appointment from "../models/appointment.model.js";
import Book from "../models/book.model.js";
import Transaction from "../models/transaction.model.js";
import Product from "../models/product.model.js";
import Reservation from "../models/reservation.model.js";
import Room from "../models/room.model.js";
import Assignment from "../models/assignment.model.js";
import Invitation from "../models/invitation.model.js";
import Project from "../models/project.model.js";
import Post from "../models/post.model.js";
import Report from "../models/report.model.js";
import Coupon from "../models/coupon.model.js";
import Task from "../models/task.model.js";
import Notification from "../models/notification.model.js";

const oid = (hex) => new mongoose.Types.ObjectId(hex);
const doc = (q, i) => oid(`${"0".repeat(20)}${String(q).padStart(2, "0")}${String(i).padStart(2, "0")}`);

export const USERS = {
    alice: "aaaaaaaaaaaaaaaaaaaaaaa1", // regular user, owns most things
    bob:   "bbbbbbbbbbbbbbbbbbbbbbb1", // regular user, the "someone else"
    mo:    "ddddddddddddddddddddddd1", // moderator (Q15)
    wendy: "eeeeeeeeeeeeeeeeeeeeeee1", // warehouse (Q16)
    priya: "fffffffffffffffffffffff1", // premium subscriber (Q5)
    drx:   "ccccccccccccccccccccccc1"  // doctor (Q6)
};

const hours = (h) => new Date(Date.now() + h * 60 * 60 * 1000);

export async function seed() {
    await mongoose.connection.db.dropDatabase();

    const password = await bcrypt.hash("secret123", 10);
    const u = (key, extra = {}) => ({
        _id: oid(USERS[key]), name: key, email: `${key}@lab.test`, password, ...extra
    });

    await User.create([
        u("alice", {
            cart: [{ product: doc(17, 1), quantity: 2 }, { product: doc(17, 2), quantity: 2 }],
            addresses: [{ label: "Home", line1: "1 MG Road", city: "Bengaluru", pincode: "560001", isDefault: true }]
        }),
        u("bob"),
        u("mo", { role: "moderator" }),
        u("wendy", { role: "warehouse" }),
        u("priya", { subscription: { plan: "premium", expiresAt: hours(24 * 30) } }),
        u("drx")
    ]);

    await Expense.create({ title: "Seed coffee", amount: 120, category: "food", paymentMethod: "upi", owner: oid(USERS.alice) });

    await Property.create([
        { title: "Lake View Apartment", city: "Bengaluru", rent: 25000, bedrooms: 2, available: true },
        { title: "Lakeside Residency", city: "Mumbai", rent: 40000, bedrooms: 3, available: true },
        { title: "City Studio", city: "Bengaluru", rent: 12000, bedrooms: 1, available: true },
        { title: "LAKE HOUSE", city: "Bengaluru", rent: 18000, bedrooms: 2, available: false },
        { title: "Green Villa", city: "Pune", rent: 30000, bedrooms: 4, available: true }
    ]);

    await Order.create([
        { _id: doc(3, 1), user: oid(USERS.alice), status: "pending", total: 999 },
        { _id: doc(3, 2), user: oid(USERS.alice), status: "shipped", total: 499 },
        { _id: doc(3, 3), user: oid(USERS.bob), status: "pending", total: 299 }
    ]);

    await Course.create([
        { _id: doc(4, 1), title: "Node 101", capacity: 30 },
        { _id: doc(4, 2), title: "Full Course", capacity: 1, students: [oid(USERS.bob)] }
    ]);
    await User.updateOne({ _id: oid(USERS.bob) }, { $push: { enrolledCourses: doc(4, 2) } });

    await Article.create({ _id: doc(5, 1), title: "Premium deep dive", content: "Only for premium readers." });

    await Appointment.create([
        { _id: doc(6, 1), patient: oid(USERS.alice), doctor: oid(USERS.drx), scheduledFor: hours(48) },
        { _id: doc(6, 2), patient: oid(USERS.bob), doctor: oid(USERS.drx), scheduledFor: hours(72) }
    ]);

    await Book.create([
        { _id: doc(7, 1), title: "Eloquent JavaScript", availableCopies: 2 },
        { _id: doc(7, 2), title: "Out of stock book", availableCopies: 0 }
    ]);

    await Transaction.create([
        { user: oid(USERS.alice), title: "Groceries", amount: 600, type: "debit", category: "food", createdAt: new Date("2026-09-05T10:00:00Z") },
        { user: oid(USERS.alice), title: "Salary", amount: 50000, type: "credit", category: "salary", createdAt: new Date("2026-09-01T12:00:00Z") },
        { user: oid(USERS.alice), title: "Pizza", amount: 450, type: "debit", category: "food", createdAt: new Date("2026-09-20T19:00:00Z") },
        { user: oid(USERS.alice), title: "Flight", amount: 7000, type: "debit", category: "travel", createdAt: new Date("2026-08-15T08:00:00Z") },
        { user: oid(USERS.alice), title: "Refund", amount: 1200, type: "credit", category: "shopping", createdAt: new Date("2026-10-01T09:00:00Z") },
        { user: oid(USERS.bob), title: "Bob's lunch", amount: 300, type: "debit", category: "food", createdAt: new Date("2026-09-10T13:00:00Z") }
    ]);

    await Product.create([
        { _id: doc(9, 1), name: "Headphones", price: 2500, stock: 10 },
        { _id: doc(16, 1), name: "Warehouse Widget", price: 50, stock: 100 },
        { _id: doc(17, 1), name: "Keyboard", price: 1000, stock: 20 },
        { _id: doc(17, 2), name: "Mouse", price: 1500, stock: 20 }
    ]);

    await Room.create({ _id: doc(11, 9), name: "Deluxe", availableRooms: 2 });
    await Reservation.create([
        { _id: doc(11, 1), user: oid(USERS.alice), room: doc(11, 9), checkIn: hours(72) },
        { _id: doc(11, 2), user: oid(USERS.alice), room: doc(11, 9), checkIn: hours(10) }
    ]);

    await Assignment.create([
        { _id: doc(12, 1), title: "Build a REST API", deadline: hours(48) },
        { _id: doc(12, 2), title: "Old assignment", deadline: hours(-1) }
    ]);

    await Project.create([
        { _id: doc(13, 9), name: "Exam Prep", members: [oid(USERS.bob)] }
    ]);
    await Invitation.create({ _id: doc(13, 1), project: doc(13, 9), invitedUser: oid(USERS.alice) });

    await Post.create({ _id: doc(14, 1), author: oid(USERS.bob), content: "Buy cheap followers!!!" });
    await Report.create({ _id: doc(15, 1), post: doc(14, 1), reportedBy: oid(USERS.bob), reason: "spam" });

    await Coupon.create([
        { code: "SAVE20", discountPercent: 20, minimumCartValue: 3000, expiresAt: hours(24 * 7), usageLimit: 100 },
        { code: "OLD10", discountPercent: 10, minimumCartValue: 0, expiresAt: hours(-24), usageLimit: 100 }
    ]);

    await Task.create({ _id: doc(18, 1), title: "Write Q18", project: doc(13, 9), status: "todo" });

    await Notification.create([
        { user: oid(USERS.alice), message: "Welcome!" },
        { user: oid(USERS.alice), message: "Your order shipped" },
        { user: oid(USERS.alice), message: "Old news", isRead: true },
        { user: oid(USERS.bob), message: "Hi Bob" }
    ]);
}

export const CHEAT_SHEET = `
Log in (every question except Q5) by sending a header:
    x-user-id: <id>

  alice  ${USERS.alice}   regular user, owns most sample data
  bob    ${USERS.bob}   regular user ("someone else")
  mo     ${USERS.mo}   moderator  (Q15)
  wendy  ${USERS.wendy}   warehouse  (Q16)
  priya  ${USERS.priya}   premium    (Q5)
  All passwords: secret123

Sample ids end in <question><item>:
  Q3  order    000000000000000000000301 (alice, pending)  ...0302 (alice, shipped)  ...0303 (bob's)
  Q4  course   000000000000000000000401 (open)             ...0402 (full)
  Q5  article  000000000000000000000501   → first:  POST /lab/login/<priyaId>  (sets the token cookie)
  Q6  appt     000000000000000000000601 (alice)            ...0602 (bob)
  Q7  book     000000000000000000000701 (2 copies)         ...0702 (0 copies)
  Q9  product  000000000000000000000901
  Q11 reserv.  000000000000000000001101 (72h away)         ...1102 (10h away)
  Q12 assign.  000000000000000000001201 (open)             ...1202 (deadline passed)
  Q13 invite   000000000000000000001301 (for alice)
  Q14 post     000000000000000000001401
  Q15 report   000000000000000000001501
  Q16 product  000000000000000000001601
  Q17 coupons  SAVE20 (valid) · OLD10 (expired)
  Q18 task     000000000000000000001801 (project member: bob)

Example:
  curl -X PATCH localhost:5000/api/orders/000000000000000000000301/address \\
       -H "x-user-id: ${USERS.alice}" -H "Content-Type: application/json" \\
       -d '{"address":{"line1":"221B MG Road","city":"Bengaluru","pincode":"560001"}}'
`;
