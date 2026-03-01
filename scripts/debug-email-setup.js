// scripts/debug-email-setup.js
// Run with: node scripts/debug-email-setup.js

const fs = require('fs');
const path = require('path');

// Simple colored logging helpers
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function logSection(title) {
  console.log(`\n${colors.cyan}=== ${title} ===${colors.reset}`);
}

function logOk(msg) {
  console.log(`${colors.green}✔${colors.reset} ${msg}`);
}

function logWarn(msg) {
  console.log(`${colors.yellow}⚠${colors.reset} ${msg}`);
}

function logError(msg) {
  console.log(`${colors.red}✖${colors.reset} ${msg}`);
}

// Read JSON safely
function readJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    logError(`Failed to read or parse JSON at ${filePath}: ${err.message}`);
    return null;
  }
}

// Basic .env parser (no dependencies)
function parseEnvFile(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) {
    return env;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    // Strip surrounding quotes if present
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

// Recursively collect files with given extensions
function collectFiles(dir, exts, collected = []) {
  if (!fs.existsSync(dir)) return collected;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip some typical noise dirs
      if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
      collectFiles(fullPath, exts, collected);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (exts.includes(ext)) {
        collected.push(fullPath);
      }
    }
  }

  return collected;
}

// --- Checks ---

function checkPackageJson(projectRoot) {
  logSection('package.json checks');

  const pkgPath = path.join(projectRoot, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    logError('package.json not found at project root.');
    return;
  }

  const pkg = readJson(pkgPath);
  if (!pkg) return;

  const deps = pkg.dependencies || {};
  const devDeps = pkg.devDependencies || {};

  // Required: resend
  if (deps.resend || devDeps.resend) {
    logOk(`"resend" is installed (found in ${deps.resend ? 'dependencies' : 'devDependencies'}).`);
  } else {
    logError(
      '"resend" dependency is missing. Install it with: npm install resend'
    );
  }

  // Sanity check for next / react
  if (deps.next) {
    logOk(`"next" is present: ${deps.next}`);
  } else {
    logWarn('"next" is missing from dependencies.');
  }

  if (deps.react && deps['react-dom']) {
    logOk(`"react" and "react-dom" are present: ${deps.react}, ${deps['react-dom']}`);
  } else {
    logWarn('"react" and/or "react-dom" missing from dependencies.');
  }
}

function checkEnvLocal(projectRoot) {
  logSection('.env.local checks');

  const envPath = path.join(projectRoot, '.env.local');
  const env = parseEnvFile(envPath);

  if (!fs.existsSync(envPath)) {
    logWarn('.env.local not found. Make sure your local environment variables are set elsewhere, or create this file based on your working config.');
  } else {
    logOk('.env.local found.');
  }

  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'RESEND_API_KEY',
    'RESEND_FROM_EMAIL',
    'CONTACT_NOTIFY_EMAIL',
    'QUOTE_NOTIFY_EMAIL',
    'SUPPORT_NOTIFY_EMAIL',
    'BILLING_NOTIFY_EMAIL',
    'DISABLE_LEAD_EMAILS',
  ];

  for (const key of requiredVars) {
    if (env[key]) {
      logOk(`${key} is set in .env.local`);
    } else {
      logWarn(`${key} is NOT set in .env.local`);
    }
  }

  const disable = env.DISABLE_LEAD_EMAILS;
  if (disable === '1') {
    logWarn(
      'DISABLE_LEAD_EMAILS=1 ➜ lead notification emails are DISABLED. Set to 0 to enable in this environment.'
    );
  } else if (disable === '0') {
    logOk('DISABLE_LEAD_EMAILS=0 ➜ lead notification emails are enabled in this environment.');
  } else {
    logWarn(
      'DISABLE_LEAD_EMAILS is not explicitly 0 or 1. Recommended: set to "0" (enabled) or "1" (disabled).'
    );
  }
}

function checkLeadNotificationsFile(projectRoot) {
  logSection('lib/leadNotifications.ts checks');

  const leadNotificationsPath = path.join(projectRoot, 'lib', 'leadNotifications.ts');

  if (fs.existsSync(leadNotificationsPath)) {
    logOk('lib/leadNotifications.ts exists.');
    const content = fs.readFileSync(leadNotificationsPath, 'utf8');

    if (content.includes('sendLeadNotification')) {
      logOk('sendLeadNotification function appears to be defined in lib/leadNotifications.ts.');
    } else {
      logWarn('lib/leadNotifications.ts exists but does NOT appear to define sendLeadNotification.');
    }

    if (content.includes('new Resend(')) {
      logOk('Resend client is instantiated in lib/leadNotifications.ts.');
    } else {
      logWarn('Resend client instantiation not found in lib/leadNotifications.ts.');
    }

  } else {
    logError('lib/leadNotifications.ts does NOT exist. Create this file to handle lead notification emails.');
  }
}

function checkApiRoutes(projectRoot) {
  logSection('API routes checks (contact & quote)');

  const apiContactPath = path.join(projectRoot, 'app', 'api', 'contact', 'route.ts');
  const apiQuotePath = path.join(projectRoot, 'app', 'api', 'quote', 'route.ts');

  function checkRoute(routePath, expectedType) {
    const routeName = routePath.includes('contact') ? 'contact' : 'quote';

    if (!fs.existsSync(routePath)) {
      logWarn(`Route file not found: ${routePath} (${routeName})`);
      return;
    }

    logOk(`Found ${routeName} route: ${routePath}`);
    const content = fs.readFileSync(routePath, 'utf8');

    // Check import
    if (content.includes("from '@/lib/leadNotifications'") ||
        content.includes("from \"@/lib/leadNotifications\"") ||
        content.includes("from '@/lib/leadNotifications.ts'") ||
        content.includes('from \'@/lib/leadNotifications\'')) {
      logOk(`Route "${routeName}" imports from "@/lib/leadNotifications".`);
    } else {
      logWarn(`Route "${routeName}" does NOT import from "@/lib/leadNotifications". Add: import { sendLeadNotification } from '@/lib/leadNotifications';`);
    }

    // Check function usage
    if (content.includes('sendLeadNotification(')) {
      logOk(`Route "${routeName}" calls sendLeadNotification (good).`);
    } else {
      logWarn(`Route "${routeName}" does NOT call sendLeadNotification. Add a call after successful Supabase insert.`);
    }

    // Check lead type usage
    if (expectedType) {
      const pattern = `type: '${expectedType}'`;
      if (content.includes(pattern) || content.includes(`type: "${expectedType}"`)) {
        logOk(`Route "${routeName}" appears to set lead.type="${expectedType}".`);
      } else {
        logWarn(
          `Route "${routeName}" does not clearly set lead.type="${expectedType}". Ensure the inserted row has type="${expectedType}" so routing works.`
        );
      }
    }
  }

  checkRoute(apiContactPath, 'contact');
  checkRoute(apiQuotePath, 'quote');
}

function scanProjectForSendLeadNotificationUsage(projectRoot) {
  logSection('Project-wide scan for sendLeadNotification usage');

  const srcRoot = projectRoot; // can narrow to 'app' or 'src' if desired
  const files = collectFiles(srcRoot, ['.ts', '.tsx']);

  const hits = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('sendLeadNotification(')) {
      hits.push(file);
    }
  }

  if (hits.length === 0) {
    logWarn('No usage of sendLeadNotification found in .ts/.tsx files. It may not be wired into any routes.');
  } else {
    logOk(`sendLeadNotification is used in the following files:`);
    for (const hit of hits) {
      console.log(`  - ${path.relative(projectRoot, hit)}`);
    }
  }
}

// Main
function main() {
  const projectRoot = process.cwd();
  console.log(`${colors.cyan}NextForge Pro – Email/Resend Debug Script${colors.reset}`);
  console.log(`Project root: ${projectRoot}`);

  checkPackageJson(projectRoot);
  checkEnvLocal(projectRoot);
  checkLeadNotificationsFile(projectRoot);
  checkApiRoutes(projectRoot);
  scanProjectForSendLeadNotificationUsage(projectRoot);

  console.log(`\n${colors.cyan}Debugging complete.${colors.reset}`);
  console.log('Review any ⚠ warnings and ✖ errors above to fix email-related issues.');
}

main();
