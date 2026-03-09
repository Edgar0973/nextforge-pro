// scripts/check-messaging-setup.js
// Run with: node scripts/check-messaging-setup.js

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();

function logSection(title) {
  console.log('\n====================================');
  console.log(title);
  console.log('====================================');
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(PROJECT_ROOT, relativePath));
}

function readText(relativePath) {
  const full = path.join(PROJECT_ROOT, relativePath);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : null;
}

function readPackageJson() {
  const pkgPath = path.join(PROJECT_ROOT, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    console.log('❌ package.json not found in project root');
    return null;
  }
  try {
    const raw = fs.readFileSync(pkgPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('❌ Failed to parse package.json:', err.message);
    return null;
  }
}

function parseEnvFile(filename) {
  const envPath = path.join(PROJECT_ROOT, filename);
  if (!fs.existsSync(envPath)) return null;
  const content = fs.readFileSync(envPath, 'utf8');

  const env = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    const key = match[1];
    let value = match[2];

    // Strip surrounding quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }
  return env;
}

function checkDependencies() {
  logSection('1. Package dependencies');

  const pkg = readPackageJson();
  if (!pkg) return;

  const deps = Object.assign({}, pkg.dependencies || {}, pkg.devDependencies || {});

  const toCheck = [
    { name: 'next', required: true, description: 'Next.js' },
    { name: 'react', required: true, description: 'React' },
    { name: 'react-dom', required: true, description: 'React DOM' },
    { name: '@supabase/supabase-js', required: false, description: 'Supabase client' },
    { name: 'drizzle-orm', required: false, description: 'Drizzle ORM' },
    { name: 'resend', required: false, description: 'Resend (email API)' },
    { name: 'telnyx', required: false, description: 'Telnyx (SMS API)' },
  ];

  for (const dep of toCheck) {
    const version = deps[dep.name];
    const status = version ? '✅ FOUND' : dep.required ? '❌ MISSING (REQUIRED)' : '⚠️  MISSING (optional)';
    console.log(`${status} - ${dep.name}${dep.description ? ' – ' + dep.description : ''}${version ? ' @ ' + version : ''}`);
  }
}

function checkEnvVars() {
  logSection('2. Environment variables (.env.local / .env)');

  const envLocal = parseEnvFile('.env.local') || {};
  const envFile = parseEnvFile('.env') || {};
  const mergedEnv = Object.assign({}, envFile, envLocal);

  const toCheck = [
    // Resend / email
    'RESEND_API_KEY',
    'RESEND_FROM_EMAIL',

    // Telnyx / SMS
    'TELNYX_API_KEY',
    'TELNYX_FROM_NUMBER',
    'TELNYX_MESSAGING_PROFILE_ID',

    // Flags / toggles
    'DISABLE_LEAD_EMAILS',
    'DISABLE_LEAD_RECEIPT_EMAILS',
    'DISABLE_LEAD_SMS',

    // Internal routing emails (optional)
    'CONTACT_NOTIFY_EMAIL',
    'QUOTE_NOTIFY_EMAIL',
    'SUPPORT_NOTIFY_EMAIL',
    'BILLING_NOTIFY_EMAIL',
  ];

  if (!Object.keys(mergedEnv).length) {
    console.log('⚠️  No .env.local or .env found, or they are empty.');
  }

  for (const key of toCheck) {
    const value = mergedEnv[key];
    if (value) {
      console.log(`✅ ${key} = ${value ? '[set]' : '[empty]'}`);
    } else {
      console.log(`⚠️  ${key} is NOT set`);
    }
  }
}

function checkFilesAndFunctions() {
  logSection('3. Key files');

  const files = [
    { path: 'lib/leadNotifications.ts', description: 'Lead email notifications (internal + receipts)' },
    { path: 'lib/telnyx.ts', description: 'Telnyx SMS helper' },
    { path: 'app/api/contact/route.ts', description: 'Contact form API route' },
    { path: 'app/api/quotes/route.ts', description: 'Quote form API route' },
    { path: 'app/api/support/route.ts', description: 'Support form API route' },
    { path: 'app/api/billing/route.ts', description: 'Billing form API route' },
  ];

  for (const file of files) {
    const exists = fileExists(file.path);
    const status = exists ? '✅ FOUND' : '⚠️  NOT FOUND';
    console.log(`${status} - ${file.path}${file.description ? ' – ' + file.description : ''}`);
  }

  logSection('4. Email & SMS integration hints');

  // Check for specific functions in leadNotifications.ts
  const leadNotificationsText = readText('lib/leadNotifications.ts');
  if (!leadNotificationsText) {
    console.log('⚠️  lib/leadNotifications.ts not found, skipping function checks.');
  } else {
    const checks = [
      { label: 'sendLeadNotification (internal email)', pattern: 'sendLeadNotification' },
      { label: 'sendLeadReceipt (customer no-reply email)', pattern: 'sendLeadReceipt' },
    ];

    for (const check of checks) {
      const has = leadNotificationsText.includes(check.pattern);
      console.log(`${has ? '✅' : '⚠️ '} ${check.label} ${has ? 'present' : 'NOT found'} in lib/leadNotifications.ts`);
    }
  }

  // Check for Telnyx SMS helper function
  const telnyxText = readText('lib/telnyx.ts');
  if (!telnyxText) {
    console.log('⚠️  lib/telnyx.ts not found, skipping SMS function checks.');
  } else {
    const hasSendLeadSmsReceipt = telnyxText.includes('sendLeadSmsReceipt');
    console.log(`${hasSendLeadSmsReceipt ? '✅' : '⚠️ '} sendLeadSmsReceipt (SMS confirmation) ${hasSendLeadSmsReceipt ? 'present' : 'NOT found'} in lib/telnyx.ts`);
  }

  // Check each API route for usage of email/SMS helpers
  const apiRoutes = [
    { path: 'app/api/contact/route.ts', label: 'Contact API' },
    { path: 'app/api/quotes/route.ts', label: 'Quotes API' },
    { path: 'app/api/support/route.ts', label: 'Support API' },
    { path: 'app/api/billing/route.ts', label: 'Billing API' },
  ];

  for (const route of apiRoutes) {
    const text = readText(route.path);
    if (!text) continue;

    const usesNotification = text.includes('sendLeadNotification');
    const usesReceipt = text.includes('sendLeadReceipt');
    const usesSms = text.includes('sendLeadSmsReceipt');

    console.log(`\n--- ${route.label} (${route.path}) ---`);
    console.log(`${usesNotification ? '✅' : '⚠️ '} uses sendLeadNotification (internal email)`);
    console.log(`${usesReceipt ? '✅' : '⚠️ '} uses sendLeadReceipt (no-reply email)`);
    console.log(`${usesSms ? '✅' : '⚠️ '} uses sendLeadSmsReceipt (SMS confirmation)`);
  }
}

function main() {
  console.log('🔍 Checking messaging & notification setup for this Next.js app...');
  checkDependencies();
  checkEnvVars();
  checkFilesAndFunctions();
  console.log('\n✅ Check complete. Use the above to decide what to add or install next.\n');
}

main();