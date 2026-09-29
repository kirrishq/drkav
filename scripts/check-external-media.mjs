import fs from "node:fs";
import path from "node:path";

const roots = ["apps/web/src", "packages/ui/src"];
const ignoredPathParts = ["/design-system/"];
const mediaPattern = /https?:\/\/(?:drkav\.ru\/(?:images|videos)\/|cdn\.prod\.website-files\.com\/)/g;
const strict = process.argv.includes("--strict");

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(entryPath);
    return /\.(?:ts|tsx|js|mjs)$/.test(entry.name) ? [entryPath] : [];
  });
}

const findings = [];

for (const root of roots) {
  for (const filePath of walk(root)) {
    const normalizedPath = `/${filePath.replaceAll(path.sep, "/")}`;
    if (ignoredPathParts.some((part) => normalizedPath.includes(part))) continue;

    const source = fs.readFileSync(filePath, "utf8");
    for (const match of source.matchAll(mediaPattern)) {
      const line = source.slice(0, match.index).split("\n").length;
      findings.push(`${filePath}:${line}: ${match[0]}`);
    }
  }
}

if (findings.length === 0) {
  console.log("No legacy external media URLs found.");
  process.exit(0);
}

console.log("Legacy external media URLs found:");
console.log(findings.join("\n"));

if (strict) {
  process.exitCode = 1;
}
