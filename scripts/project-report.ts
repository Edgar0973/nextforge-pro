// scripts/project-report.ts
// Node/TypeScript project crawler & compact report generator

import * as fs from "fs/promises";
import * as path from "path";
import { Stats } from "fs";

type FileEntry = {
  path: string;         // relative from project root
  absPath: string;      // absolute path
  sizeBytes: number;
  ext: string;
  lines: number | null; // null for binary / skipped line counting
};

const IGNORED_DIRS = new Set<string>([
  "node_modules",
  ".git",
  ".next",
  ".turbo",
  ".vercel",
  "dist",
  "build",
  "out",
]);

// Extensions we consider "text" for line counting
const TEXT_EXTENSIONS = new Set<string>([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".css",
  ".scss",
  ".sass",
  ".less",
  ".md",
  ".mdx",
  ".html",
  ".env",
  ".txt",
  ".yml",
  ".yaml",
]);

async function isDirectory(p: string): Promise<boolean> {
  try {
    const stats = await fs.stat(p);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

async function readDirSafe(dir: string): Promise<string[]> {
  try {
    return await fs.readdir(dir);
  } catch {
    return [];
  }
}

async function getFileStats(p: string): Promise<Stats | null> {
  try {
    return await fs.stat(p);
  } catch {
    return null;
  }
}

async function countLinesIfText(filePath: string, ext: string): Promise<number | null> {
  if (!TEXT_EXTENSIONS.has(ext.toLowerCase())) {
    return null;
  }
  try {
    const content = await fs.readFile(filePath, "utf8");
    // Simple line count: split on \n
    return content.split("\n").length;
  } catch {
    return null;
  }
}

async function crawlDirectory(rootDir: string): Promise<FileEntry[]> {
  const results: FileEntry[] = [];

  async function walk(currentDir: string) {
    const entries = await readDirSafe(currentDir);
    for (const entry of entries) {
      const abs = path.join(currentDir, entry);
      const rel = path.relative(rootDir, abs);
      const stats = await getFileStats(abs);
      if (!stats) continue;

      if (stats.isDirectory()) {
        const dirName = path.basename(abs);
        if (IGNORED_DIRS.has(dirName)) {
          continue;
        }
        // Skip hidden directories like .cache, .vscode etc., except .next already in IGNORED_DIRS
        if (dirName.startsWith(".") && ![".vscode"].includes(dirName)) {
          continue;
        }
        await walk(abs);
      } else if (stats.isFile()) {
        const ext = path.extname(entry);
        const lines = await countLinesIfText(abs, ext);
        results.push({
          path: rel.replace(/\\/g, "/"),
          absPath: abs,
          sizeBytes: stats.size,
          ext: ext || "<no-ext>",
          lines,
        });
      }
    }
  }

  await walk(rootDir);
  return results;
}

function formatBytes(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

function summarizeByExtension(files: FileEntry[]) {
  const map = new Map<
    string,
    { count: number; totalBytes: number; totalLines: number }
  >();

  for (const f of files) {
    const key = f.ext;
    const current = map.get(key) || { count: 0, totalBytes: 0, totalLines: 0 };
    current.count += 1;
    current.totalBytes += f.sizeBytes;
    if (typeof f.lines === "number") {
      current.totalLines += f.lines;
    }
    map.set(key, current);
  }

  const result = Array.from(map.entries())
    .map(([ext, stats]) => ({ ext, ...stats }))
    .sort((a, b) => b.count - a.count);

  return result;
}

function findNextRoutes(files: FileEntry[]) {
  const appRoutes: FileEntry[] = [];
  const apiRoutes: FileEntry[] = [];

  for (const f of files) {
    if (f.path.startsWith("app/")) {
      appRoutes.push(f);
      if (/^app\/api\/.*\/route\.(ts|tsx|js|jsx|mjs|cjs)$/.test(f.path)) {
        apiRoutes.push(f);
      }
    }
  }

  return { appRoutes, apiRoutes };
}

function topLargestFiles(files: FileEntry[], limit = 15): FileEntry[] {
  return [...files]
    .sort((a, b) => b.sizeBytes - a.sizeBytes)
    .slice(0, limit);
}

function totalStats(files: FileEntry[]) {
  const totalFiles = files.length;
  const totalBytes = files.reduce((sum, f) => sum + f.sizeBytes, 0);
  const totalLines = files.reduce(
    (sum, f) => (typeof f.lines === "number" ? sum + f.lines : sum),
    0
  );
  return { totalFiles, totalBytes, totalLines };
}

function makeMarkdownReport(rootDir: string, files: FileEntry[]): string {
  const { totalFiles, totalBytes, totalLines } = totalStats(files);
  const byExt = summarizeByExtension(files);
  const { appRoutes, apiRoutes } = findNextRoutes(files);
  const largest = topLargestFiles(files);

  const lines: string[] = [];

  lines.push(`# Project Report`);
  lines.push("");
  lines.push(`Root: \`${rootDir}\``);
  lines.push("");
  lines.push(`## Overview`);
  lines.push("");
  lines.push(`- Total files (scanned): **${totalFiles}**`);
  lines.push(`- Total size: **${formatBytes(totalBytes)}**`);
  lines.push(
    `- Total lines (text files): **${totalLines.toLocaleString()}**`
  );
  lines.push("");

  lines.push(`## By Extension`);
  lines.push("");
  lines.push(`| Extension | Files | Lines | Size |`);
  lines.push(`|----------:|------:|------:|------|`);

  for (const extStat of byExt) {
    lines.push(
      `| \`${extStat.ext}\` | ${extStat.count} | ${extStat.totalLines.toLocaleString()} | ${formatBytes(
        extStat.totalBytes
      )} |`
    );
  }

  lines.push("");
  lines.push(`## Next.js App Router`);
  lines.push("");

  lines.push(`### App Routes (files under \`app/\`)`);
  lines.push("");
  lines.push(
    appRoutes.length === 0
      ? "_None detected_"
      : appRoutes
          .slice(0, 50) // cap output
          .map((f) => `- \`${f.path}\``)
          .join("\n")
  );
  if (appRoutes.length > 50) {
    lines.push(`- ...and ${appRoutes.length - 50} more`);
  }

  lines.push("");
  lines.push(`### API Route Handlers (e.g., \`app/api/**/route.ts\`)`);
  lines.push("");
  lines.push(
    apiRoutes.length === 0
      ? "_None detected_"
      : apiRoutes
          .map((f) => `- \`${f.path}\``)
          .join("\n")
  );

  lines.push("");
  lines.push(`## Largest Files`);
  lines.push("");
  lines.push(`Top ${largest.length} by size:`);
  lines.push("");

  for (const f of largest) {
    lines.push(
      `- \`${f.path}\` — ${formatBytes(f.sizeBytes)}${
        typeof f.lines === "number" ? `, ${f.lines} lines` : ""
      }`
    );
  }

  lines.push("");
  lines.push(`_Generated by scripts/project-report.ts_`);

  return lines.join("\n");
}

async function main() {
  const rootArg = process.argv[2];
  const rootDir = rootArg
    ? path.resolve(rootArg)
    : process.cwd();

  console.log(
    `[project-report] Scanning project at: ${rootDir} (this may take a moment)...`
  );

  const isDir = await isDirectory(rootDir);
  if (!isDir) {
    console.error(
      `[project-report] Provided path is not a directory: ${rootDir}`
    );
    process.exit(1);
  }

  const files = await crawlDirectory(rootDir);
  const report = makeMarkdownReport(rootDir, files);

  // Print to stdout so you can redirect to a file if you want
  console.log(report);
}

main().catch((err) => {
  console.error("[project-report] Unhandled error:", err);
  process.exit(1);
});