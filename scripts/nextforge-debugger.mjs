// scripts/nextforge-debugger.mjs
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import process from "node:process";

// Optional dotenv (many Next projects have it). If not installed, we continue with process.env.
try {
  const dotenv = await import("dotenv");
  const root = process.cwd();
  // Load in a reasonable order
  for (const f of [".env.local", ".env", ".env.production", ".env.development"]) {
    const p = path.join(root, f);
    if (fs.existsSync(p)) dotenv.config({ path: p });
  }
} catch {
  // ignore
}

// Supabase client (your project already uses @supabase/supabase-js)
let createClient;
try {
  ({ createClient } = await import("@supabase/supabase-js"));
} catch {
  console.error(
    "[debugger] Missing @supabase/supabase-js. Install it (it should already exist): npm i @supabase/supabase-js"
  );
  process.exit(1);
}

const args = new Set(process.argv.slice(2));
const getArgValue = (prefix, fallback = null) => {
  for (const a of process.argv.slice(2)) {
    if (a.startsWith(prefix)) return a.slice(prefix.length);
  }
  return fallback;
};

const ROOT = path.resolve(getArgValue("--root=", process.cwd()));
const FIX = args.has("--fix");
const ALL_DB = args.has("--all-db");
const LIMIT = Number(getArgValue("--limit=", "25"));
const VERBOSE = args.has("--verbose");

const reportLines = [];
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const reportPath = path.join(ROOT, `debug-report-${stamp}.md`);

const log = (...m) => console.log("[debugger]", ...m);
const warn = (...m) => console.warn("[debugger]", ...m);
const err = (...m) => console.error("[debugger]", ...m);

const redacted = (v) => {
  if (!v) return "(missing)";
  if (v.length <= 6) return "(set)";
  return `${v.slice(0, 2)}…${v.slice(-2)} (set)`;
};

function md(s = "") {
  reportLines.push(s);
}

function hashFile(contents) {
  return crypto.createHash("sha256").update(contents).digest("hex").slice(0, 10);
}

function walk(dir, files = []) {
  const skip = new Set(["node_modules", ".next", ".git", ".vercel", "dist", "build"]);
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function readFileSafe(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return null;
  }
}

function writeFileSafe(p, s) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s, "utf8");
}

function findApiRoutes(allFiles) {
  // Next App Router route handlers typically end in app/api/**/route.ts
  return allFiles.filter((p) => p.includes(`${path.sep}app${path.sep}api${path.sep}`) && p.endsWith(`${path.sep}route.ts`));
}

function analyzeRoutes(routeFiles) {
  const findings = [];

  for (const file of routeFiles) {
    const src = readFileSafe(file);
    if (!src) continue;

    const hasNotifyLead = src.includes("notifyLead");
    const hasVoidNotify =
      /void\s+notifyLead\s*\(\s*\{[\s\S]*?\}\s*\)\s*\.catch\s*\(/m.test(src);

    const hasAwaitNotify = /await\s+notifyLead\s*\(/m.test(src);

    findings.push({
      file,
      hasNotifyLead,
      hasVoidNotify,
      hasAwaitNotify,
    });
  }

  return findings;
}

function applyFixAwaitNotifyLead(routeFiles) {
  let changed = 0;
  const changedFiles = [];

  const re =
    /void\s+notifyLead\s*\(\s*\{([\s\S]*?)\}\s*\)\s*\.catch\s*\(\s*\(e\)\s*=>\s*console\.error\s*\(\s*`([\s\S]*?)`\s*,\s*e\s*\)\s*\)\s*;/m;

  for (const file of routeFiles) {
    const src = readFileSafe(file);
    if (!src) continue;

    if (!re.test(src)) continue;

    const next = src.replace(re, (_m, objBody, tmpl) => {
      return `try {\n  await notifyLead({${objBody}});\n} catch (e) {\n  console.error(\`${tmpl}\`, e);\n}`;
    });

    if (next !== src) {
      writeFileSafe(file, next);
      changed++;
      changedFiles.push(file);
    }
  }

  return { changed, changedFiles };
}

async function connectSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  md("## Environment (redacted)");
  md(`- SUPABASE_URL: ${supabaseUrl ? "(set)" : "(missing)"}`);
  md(`- SUPABASE_SERVICE_ROLE_KEY: ${redacted(serviceRole)}`);
  md(`- NEXTFORGEPRO_EMAIL_SMTP_HOST: ${process.env.NEXTFORGEPRO_EMAIL_SMTP_HOST ? "(set)" : "(missing)"}`);
  md(`- NEXTFORGEPRO_EMAIL_SMTP_PORT: ${process.env.NEXTFORGEPRO_EMAIL_SMTP_PORT ? "(set)" : "(missing)"}`);
  md(`- NEXTFORGEPRO_EMAIL_SMTP_USER: ${process.env.NEXTFORGEPRO_EMAIL_SMTP_USER ? "(set)" : "(missing)"}`);
  md(`- NEXTFORGEPRO_EMAIL_SMTP_PASS: ${redacted(process.env.NEXTFORGEPRO_EMAIL_SMTP_PASS)}`);
  md(`- TELNYX_API_KEY: ${redacted(process.env.TELNYX_API_KEY)}`);
  md(`- TELNYX_FROM_NUMBER: ${process.env.TELNYX_FROM_NUMBER ? "(set)" : "(missing)"}`);
  md(`- TELNYX_MESSAGING_PROFILE_ID: ${process.env.TELNYX_MESSAGING_PROFILE_ID ? "(set)" : "(missing)"}`);
  md(`- DISABLE_LEAD_EMAILS: ${process.env.DISABLE_LEAD_EMAILS ?? "(unset)"}`);
  md(`- DISABLE_LEAD_RECEIPT_EMAILS: ${process.env.DISABLE_LEAD_RECEIPT_EMAILS ?? "(unset)"}`);
  md(`- DISABLE_LEAD_SMS: ${process.env.DISABLE_LEAD_SMS ?? "(unset)"}`);
  md("");

  if (!supabaseUrl || !serviceRole) {
    warn("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in your local environment.");
    warn("Tip: If you use Vercel, you can pull envs locally via: vercel env pull .env.local");
    return null;
  }

  const supabase = createClient(supabaseUrl, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return supabase;
}

async function fetchDbDiagnostics(supabase) {
  md("## Database diagnostics");
  md(`Fetching ${ALL_DB ? "ALL rows" : `latest ${LIMIT} rows`} from key tables...`);
  md("");

  const tables = [
    { schema: "public", table: "leads" },
    { schema: "public", table: "billing_requests" },
    { schema: "public", table: "support_requests" },
  ];

  // Pull column nullability to catch NOT NULL vs code mismatches
  for (const t of tables) {
    try {
      const { data: cols, error: colsErr } = await supabase
        .schema("information_schema")
        .from("columns")
        .select("column_name,is_nullable,data_type")
        .eq("table_schema", t.schema)
        .eq("table_name", t.table)
        .order("ordinal_position", { ascending: true });

      if (colsErr) {
        md(`- ⚠️ Could not read column metadata for \`${t.schema}.${t.table}\`: ${colsErr.message}`);
      } else {
        const notNull = cols.filter((c) => c.is_nullable === "NO").map((c) => c.column_name);
        md(`### ${t.schema}.${t.table}`);
        md(`- NOT NULL columns: ${notNull.length ? notNull.join(", ") : "(none found)"}`);
      }
    } catch (e) {
      md(`- ⚠️ Column metadata exception for ${t.schema}.${t.table}: ${String(e)}`);
    }
    md("");
  }

  // Pull rows (bounded by default)
  for (const t of tables) {
    try {
      const q = supabase.schema(t.schema).from(t.table).select("*").order("created_at", { ascending: false });
      const { data, error } = ALL_DB ? await q : await q.limit(LIMIT);

      if (error) {
        md(`- ❌ Failed to fetch rows from \`${t.schema}.${t.table}\`: ${error.message}`);
      } else {
        md(`### Recent rows: ${t.schema}.${t.table} (${data.length})`);
        if (data.length === 0) {
          md(`- (no rows)`);
        } else {
          const sample = data.slice(0, Math.min(5, data.length));
          md(`- Sample (top ${sample.length}):`);
          for (const r of sample) {
            md(`  - id=${r.id ?? "(no id)"} type=${r.type ?? "(n/a)"} email=${r.email ?? "(n/a)"} phone=${r.phone ?? "(n/a)"} created_at=${r.created_at ?? "(n/a)"}`);
          }
        }
      }
    } catch (e) {
      md(`- ⚠️ Exception fetching ${t.schema}.${t.table}: ${String(e)}`);
    }
    md("");
  }
}

function analyzeProjectFiles(allFiles) {
  md("## Project file scan");
  const routeFiles = findApiRoutes(allFiles);

  md(`- Found ${routeFiles.length} route handlers under app/api/**/route.ts`);
  md("");

  const routeFindings = analyzeRoutes(routeFiles);

  const voidNotify = routeFindings.filter((f) => f.hasVoidNotify);
  const awaitNotify = routeFindings.filter((f) => f.hasAwaitNotify);

  if (voidNotify.length) {
    md("### ⚠️ Serverless cut-off risk detected");
    md("These routes use `void notifyLead(...).catch(...)` (fire-and-forget). On Vercel serverless, this commonly gets terminated after the HTTP response, causing SMTP/Telnyx work to never finish.");
    md("");
    for (const f of voidNotify) md(`- ${path.relative(ROOT, f.file)}`);
    md("");
    md("**Recommended fix:** await `notifyLead()` in the route handlers (the script can auto-fix with `--fix`).");
    md("");
  } else {
    md("### ✅ notifyLead awaiting");
    md("No fire-and-forget notifyLead patterns found in route handlers.");
    md("");
  }

  // Quick scan for disable flags usage in telnyx / leadNotifications
  const telnyxPath = allFiles.find((p) => p.endsWith(`${path.sep}lib${path.sep}telnyx.ts`));
  const leadNotifPath = allFiles.find((p) => p.endsWith(`${path.sep}lib${path.sep}leadNotifications.ts`));

  if (telnyxPath) {
    const src = readFileSafe(telnyxPath) ?? "";
    const hasDisable = src.includes("DISABLE_LEAD_SMS");
    md(`- lib/telnyx.ts: ${hasDisable ? "checks DISABLE_LEAD_SMS" : "no DISABLE_LEAD_SMS check found"}`);
  }
  if (leadNotifPath) {
    const src = readFileSafe(leadNotifPath) ?? "";
    const hasDisableEmails = src.includes("DISABLE_LEAD_EMAILS");
    const hasDisableReceipts = src.includes("DISABLE_LEAD_RECEIPT_EMAILS");
    md(`- lib/leadNotifications.ts: disableEmails=${hasDisableEmails}, disableReceipts=${hasDisableReceipts}`);
  }

  md("");
  md("### Route handler snapshot");
  for (const f of routeFindings) {
    md(`- ${path.relative(ROOT, f.file)}: notifyLead=${f.hasNotifyLead}, voidNotify=${f.hasVoidNotify}, awaitNotify=${f.hasAwaitNotify}`);
  }
  md("");

  return { routeFiles, routeFindings };
}

async function main() {
  log(`Project root: ${ROOT}`);
  log(`Mode: ${FIX ? "FIX" : "REPORT"} | DB: ${ALL_DB ? "ALL" : `limit=${LIMIT}`}`);

  md(`# NextForge Debugger Report`);
  md(`- Generated: ${new Date().toString()}`);
  md(`- Root: \`${ROOT}\``);
  md(`- Mode: ${FIX ? "**FIX**" : "**REPORT**"}`);
  md("");

  const allFiles = walk(ROOT);
  md(`## Inventory`);
  md(`- Total files scanned (excluding node_modules/.next/.git): ${allFiles.length}`);
  md("");

  const supabase = await connectSupabase();
  if (supabase) await fetchDbDiagnostics(supabase);

  const { routeFiles } = analyzeProjectFiles(allFiles);

  if (FIX) {
    md("## Auto-fix results");
    const before = routeFiles.map((p) => {
      const s = readFileSafe(p) ?? "";
      return { p, h: hashFile(s) };
    });

    const res = applyFixAwaitNotifyLead(routeFiles);

    const after = routeFiles.map((p) => {
      const s = readFileSafe(p) ?? "";
      return { p, h: hashFile(s) };
    });

    md(`- Files changed: ${res.changed}`);
    for (const f of res.changedFiles) md(`  - ${path.relative(ROOT, f)}`);
    md("");

    // Quick hash diff table for changed files
    for (const b of before) {
      const a = after.find((x) => x.p === b.p);
      if (!a) continue;
      if (a.h !== b.h) {
        md(`- Updated: ${path.relative(ROOT, b.p)} (${b.h} → ${a.h})`);
      }
    }
    md("");

    if (res.changed === 0) {
      md("No matching `void notifyLead(...).catch(...)` patterns found to auto-fix.");
      md("If your notifyLead calls differ, run with `--verbose` and paste the route tail; we can refine the matcher.");
      md("");
    }
  }

  writeFileSafe(reportPath, reportLines.join("\n"));
  log(`Wrote report: ${reportPath}`);

  // Print key conclusion to console
  if (VERBOSE) {
    log("---- REPORT PREVIEW ----");
    console.log(reportLines.slice(0, 120).join("\n"));
    log("---- END PREVIEW ----");
  }

  log("Done.");
  if (!supabase) {
    warn("DB section skipped because Supabase env vars are missing locally.");
    warn("If needed: `vercel env pull .env.local` then rerun.");
  }
}

main().catch((e) => {
  err("Fatal:", e);
  process.exit(1);
});
