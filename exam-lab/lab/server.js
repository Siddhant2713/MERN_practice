// LAB ONLY — `npm run dev` starts the app on http://localhost:5000 with a
// throwaway in-memory MongoDB full of sample data. Data resets on restart.

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import { createApp } from "./app.js";
import { seed, CHEAT_SHEET } from "./seed.js";

const PORT = 5000;

const mongo = await MongoMemoryServer.create();
await mongoose.connect(mongo.getUri());
await seed();

createApp().listen(PORT, () => {
    console.log(`\n🧪 exam-lab running on http://localhost:${PORT}  (in-memory DB, resets on restart)`);
    console.log(CHEAT_SHEET);
});

const shutdown = async () => {
    await mongoose.disconnect();
    await mongo.stop();
    process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
