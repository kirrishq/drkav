import { readdir } from "node:fs/promises";
import { resolve } from "node:path";

const ignoredDirectories = new Set([
  ".git",
  ".next",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "storybook-static",
]);
const prohibitedPattern = /\.module\.(css|scss|sass|less)$/;
const projectRoots = ["apps", "packages", "scripts"];
const violations = [];

async function visit(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve(directory, entry.name);

      if (entry.isDirectory()) {
        if (!ignoredDirectories.has(entry.name)) {
          await visit(entryPath);
        }
        return;
      }

      if (entry.isFile() && prohibitedPattern.test(entry.name)) {
        violations.push(entryPath);
      }
    }),
  );
}

await Promise.all(projectRoots.map((directory) => visit(resolve(directory))));

if (violations.length > 0) {
  console.error("CSS Modules are not allowed in project-owned code:");
  violations.forEach((file) => console.error(`- ${file}`));
  process.exitCode = 1;
} else {
  console.log("No CSS Modules found in project-owned code.");
}
