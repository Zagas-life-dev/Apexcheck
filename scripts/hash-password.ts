import bcrypt from "bcryptjs";

async function main() {
  const password = process.argv[2];
  if (!password) {
    console.error('Usage: npm run hash-password -- "your-password"');
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 10);
  const escaped = hash.replace(/\$/g, "\\$");
  console.log("\nSet this in your .env.local as ADMIN_PASSWORD_HASH:\n");
  console.log(escaped + "\n");
  console.log(
    "(every $ is escaped as \\$ — Next.js expands $VAR in .env* files, which\n" +
      "would otherwise silently mangle the hash)\n",
  );
  process.exit(0);
}

main();
