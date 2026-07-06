import mongoose from "mongoose";
import { env } from "@/lib/env";

// Cached across hot reloads / serverless invocations so we reuse one connection.
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  memoryServer: unknown | null;
};

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache =
  global._mongooseCache ?? { conn: null, promise: null, memoryServer: null };
global._mongooseCache = cached;

async function resolveUri(): Promise<string> {
  if (env.mongodbUri) return env.mongodbUri;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "MONGODB_URI is not set. Configure a MongoDB Atlas connection string in your environment."
    );
  }

  // Dev/test fallback: spin up an ephemeral in-memory MongoDB so the app runs
  // with zero external accounts. Data is NOT persisted across restarts.
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  const server = await MongoMemoryServer.create();
  cached.memoryServer = server;
  console.warn(
    "[db] MONGODB_URI not set — using an in-memory MongoDB. Data will not persist. " +
      "Set MONGODB_URI (e.g. a free MongoDB Atlas cluster) for a real database."
  );
  return server.getUri();
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = (async () => {
      const uri = await resolveUri();
      mongoose.set("strictQuery", true);
      const conn = await mongoose.connect(uri, { dbName: env.mongodbDb });

      // Seed the throwaway in-memory DB so the catalog isn't empty in local dev.
      if (!env.mongodbUri) {
        try {
          const { ensureSeeded } = await import("@/lib/seed-data");
          await ensureSeeded();
        } catch (e) {
          console.warn("[db] auto-seed skipped:", e);
        }
      }
      return conn;
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}
