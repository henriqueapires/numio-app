import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  { ignores: [".next/**", "node_modules/**", "src/generated/**"] },

  {
    files: ["src/types/**/*.d.ts"],
    rules: { "@typescript-eslint/no-unused-vars": "off" },
  },

  {
    files: ["src/generated/**"],
    rules: {
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];

export default config;
