import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  // Next.js recommended config
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
  }),
  // JavaScript recommended config
  js.configs.recommended,
  // TypeScript recommended config
  ...tseslint.configs.recommended,
  // Custom rules
  {
    rules: {
      "no-undef": "warn",
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "no-extra-boolean-cast": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "no-constant-binary-expression": "warn",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  // Global ignores
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "dist/**", "build/**"],
  },
];

export default eslintConfig;
