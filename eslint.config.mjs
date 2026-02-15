import tseslintPlugin from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import unusedImports from 'eslint-plugin-unused-imports';
import nextPlugin from '@next/eslint-plugin-next';

export default [
  // Global ignores
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      'out/**',
      'next-env.d.ts',
      'public/**',
      'scripts/**', // Ignore scripts if not in tsconfig
      'tests/**',    // Ignore tests if not in tsconfig or handle separately
    ],
  },
  // Base configuration for JS/TS files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
      '@typescript-eslint': tseslintPlugin,
      'unused-imports': unusedImports,
    },
    languageOptions: {
      parser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        project: ['./tsconfig.json'],
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...tseslintPlugin.configs.recommended.rules,

      // ✅ Unused imports (warn instead of error)
      'unused-imports/no-unused-imports': 'warn',

      // ✅ Unused variables - more relaxed configuration
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // Disable the default ESLint rule to avoid duplication
      'no-unused-vars': 'off',

      // ✅ TypeScript unused vars - WARN instead of ERROR
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          caughtErrors: 'none',
        },
      ],

      // ✅ Disallow `any` - WARN instead of ERROR for flexibility
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      // ✅ Next.js specific tweaks
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-assign-module-variable': 'error', // Keep it but ignore artifacts via glob
    },
  },
];
