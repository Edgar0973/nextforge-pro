// scripts/nav-introspect.ts
//
// Usage (from project root):
//   npx ts-node ./scripts/nav-introspect.ts > nav-report.txt
//
// This will:
//   - List every file in the project (except ignored dirs like node_modules, .next, etc.)
//   - Search for your nav labels (Next Forge Pro, About, Services, etc.)
//   - Print where they occur: file path + line/column

import fs from "fs";
import path from "path";

const ROOT = process.cwd();

// Directories we don't want to traverse (build artifacts, deps, etc.)
const IGNORED_DIRS = new Set<string>([
  "node_modules",
  ".next",
  ".git",
  ".turbo",
  ".vercel",
  ".vscode",
  ".github",
  "dist",
  "build",
  ".cache",
  ".idea",
  "coverage",
]);

// File extensions we consider "text" and safe to read/search
const TEXT_EXTENSIONS = new Set<string>([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".cjs",
  ".mjs",
  ".json",
  ".md",
  ".css",
  ".html",
  ".txt",
]);

// Labels we care about in your top nav / hero
const NAV_LABELS = [
  "Next Forge Pro",
  "Edgardo Lopez · Web & App Design",
  "About",
  "Services",
  "Portfolio",
  "Contact",
  "Get a quote",
  "Get a Quote",
  "Request a Quote",
];

// Just to avoid reading huge files
const MAX_FILE_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB

type FileEntry = {
  relPath: string;
  absPath: string;
  isDir: boolean;
  size: number;
};

type Match = {
  label: string;
  relPath: string;
  line: number;
  column: number;
};

async function statSafe(p: string): Promise<fs.Stats | null> {
  try {
    return await fs.promises.stat(p);
  } catch {
    return null;
  }
}

async function walk(dir: string, base: string): Promise<FileEntry[]> {
  const entries: FileEntry[] = [];
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });

  for (const dirent of dirents) {
    const name = dirent.name;
    const absPath = path.join(dir, name);
    const relPath = path.join(base, name);

    if (dirent.isDirectory()) {
      if (IGNORED_DIRS.has(name)) continue;

      entries.push({
        relPath,
        absPath,
        isDir: true,
        size: 0,
      });

      const childEntries = await walk(absPath, relPath);
      entries.push(...childEntries);
    } else if (dirent.isFile()) {
      const st = await statSafe(absPath);
      entries.push({
        relPath,
        absPath,
        isDir: false,
        size: st?.size ?? 0,
      });
    }
    // We ignore symlinks/etc. for now
  }

  return entries;
}

function isTextFile(file: FileEntry): boolean {
  if (file.isDir) return false;
  const ext = path.extname(file.relPath).toLowerCase();
  return TEXT_EXTENSIONS.has(ext);
}

// Find all occurrences of a label in a given string, returning line/column pairs
function findLabelMatches(
  content: string,
  label: string
): { line: number; column: number }[] {
  const matches: { line: number; column: number }[] = [];
  const lines = content.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    let idx = lines[i].indexOf(label);
    while (idx !== -1) {
      // line numbers 1-based, columns 1-based
      matches.push({ line: i + 1, column: idx + 1 });
      idx = lines[i].indexOf(label, idx + label.length);
    }
  }

  return matches;
}

async function main() {
  console.log("[nav-introspect] Scanning project at:", ROOT);
  const allEntries = await walk(ROOT, ".");

  // Sort entries by path for stable output
  allEntries.sort((a, b) => a.relPath.localeCompare(b.relPath));

  // Print a high-level project file list
  console.log("\n# Project File List (relative to root)\n");
  for (const entry of allEntries) {
    if (entry.isDir) {
      console.log(`DIR  ${entry.relPath}`);
    } else {
      console.log(`FILE ${entry.relPath}`);
    }
  }

  // Now search for nav labels
  console.log("\n# Nav Label Search Results\n");
  console.log(
    "Searching for these labels:",
    NAV_LABELS.map((l) => `"${l}"`).join(", ")
  );
  console.log("");

  const matches: Match[] = [];

  for (const entry of allEntries) {
    if (!isTextFile(entry)) continue;
    if (entry.size > MAX_FILE_SIZE_BYTES) {
      // Skip very large text files
      continue;
    }

    let content: string;
    try {
      content = await fs.promises.readFile(entry.absPath, "utf8");
    } catch (err) {
      console.error(
        `[nav-introspect] Failed to read file: ${entry.relPath}`,
        err
      );
      continue;
    }

    for (const label of NAV_LABELS) {
      if (!content.includes(label)) continue;

      const localMatches = findLabelMatches(content, label);
      for (const m of localMatches) {
        matches.push({
          label,
          relPath: entry.relPath,
          line: m.line,
          column: m.column,
        });
      }
    }
  }

  if (matches.length === 0) {
    console.log("No nav labels found in text files.");
  } else {
    for (const m of matches) {
      console.log(
        `MATCH "${m.label}" in ${m.relPath}:${m.line}:${m.column}`
      );
    }
  }

  console.log(
    "\n[nav-introspect] Done. If you send me this output, I can tell you exactly where your header/nav buttons live and whether they’re global (e.g. in app/layout.tsx or a shared header component)."
  );
}

main().catch((err) => {
  console.error("[nav-introspect] Fatal error:", err);
  process.exit(1);
});