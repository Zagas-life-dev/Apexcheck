import "./load-env";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { seedDatabase } from "@/lib/seed-data";

async function main() {
  const reset = process.argv.includes("--reset");
  if (!process.env.MONGODB_URI) {
    console.warn(
      "MONGODB_URI is not set. Seeding an in-memory database from a script has no effect " +
        "on the running app. Set MONGODB_URI (e.g. MongoDB Atlas) to persist seed data."
    );
  }
  await connectToDatabase();
  const inserted = await seedDatabase({ reset });
  console.log(
    inserted > 0
      ? `Seeded ${inserted} items.`
      : "Items already present. Re-run with --reset to replace them."
  );
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
