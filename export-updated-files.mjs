import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const timestamp = new Date()
  .toISOString()
  .replace(/[:.]/g, "-")
  .replace("T", "_")
  .replace("Z", "");
const outFile = path.join(projectRoot, `updated-files-dump-${timestamp}.txt`);

const files = [
  "lib/leadNotifications.ts",
  "lib/telnyx.ts",
  "lib/supabaseAdmin.ts",
  "lib/notifyLead.ts",
  "app/api/contact/route.ts",
  "app/api/quotes/route.ts",
  "app/api/billing/route.ts",
  "app/api/support/route.ts",
];

const sep = "=".repeat(80);

let out = `NextForgePro file dump - ${timestamp}\nProject root: ${projectRoot}\n\n`;

for (const rel of files) {
  const full = path.join(projectRoot, rel);
  out += `${sep}\nFILE: ${rel}\nFULLPATH: ${full}\n${sep}\n`;

  if (fs.existsSync(full)) {
    out += fs.readFileSync(full, "utf8");
  } else {
    out += "!! MISSING FILE !!";
  }
  out += "\n\n";
}

fs.writeFileSync(outFile, out, "utf8");
console.log(`Wrote dump to: ${outFile}`);
