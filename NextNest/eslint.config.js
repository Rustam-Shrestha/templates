import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/.next/**",
      "**/node_modules/**",
      "**/coverage/**",
      "**/.turbo/**",
      "**/drizzle/**"
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    rules: {
      "@typescript-eslint/no-extraneous-class": [
        "error",
        {
          allowWithDecorator: true
        }
      ]
    }
  },
  {
    files: ["apps/backend/src/modules/**/domain/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@nestjs/*",
                "drizzle-orm*",
                "fastify*",
                "ioredis*",
                "bullmq*",
                "../application/*",
                "../infrastructure/*",
                "../presentation/*"
              ],
              message:
                "HEXAGONAL VIOLATION: Domain may import only @workspace/contracts, node:crypto, and zod."
            }
          ]
        }
      ]
    }
  },
  {
    files: [
      "apps/frontend/src/shared/**/*.ts",
      "apps/frontend/src/shared/**/*.tsx"
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*", "@/app/*"],
              message:
                "FSD VIOLATION: Shared layer cannot import from Features or App layers."
            }
          ]
        }
      ]
    }
  },
  {
    files: ["apps/frontend/src/**/*.{ts,tsx}"],
    ignores: ["apps/frontend/src/shared/api/http-client.ts"],
    rules: {
      "no-restricted-globals": [
        "error",
        {
          name: "fetch",
          message:
            "Raw fetch() is forbidden. Use fetchWithContract from '@/shared/api/http-client'."
        }
      ]
    }
  }
);

