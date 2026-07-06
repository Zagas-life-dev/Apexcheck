// Loads .env.local (preferred) or .env for standalone scripts, BEFORE any other
// module reads process.env. Import this first in a script entrypoint.
import { existsSync } from "node:fs";

for (const file of [".env.local", ".env"]) {
  if (existsSync(file)) {
    try {
      // Node 20.12+/22 built-in — no dotenv dependency needed.
      process.loadEnvFile(file);
    } catch {
      /* ignore */
    }
    break;
  }
}
