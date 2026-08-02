import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const configDirectory = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: configDirectory });

const config = [
  {
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      "**/next-env.d.ts",
      "apps/cms/types/generated/**",
      "coverage/**",
      "dist/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  {
    // Strapi ships these configuration and example files in CommonJS format.
    files: ["apps/cms/config/**/*.js", "apps/cms/src/admin/*.example.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "import/no-anonymous-default-export": "off",
    },
  },
  {
    // These framework-neutral components cannot depend on Next.js Image.
    files: [
      "packages/ui/src/feature-link-card.tsx",
      "packages/ui/src/video-card.tsx",
    ],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;
