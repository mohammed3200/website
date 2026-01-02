import { defineConfig } from 'eslint/config';
import tseslintPlugin from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import unusedImports from 'eslint-plugin-unused-imports';
import nextPlugin from '@next/eslint-plugin-next';

const { configs: tsConfigs } = tseslintPlugin;

export default defineConfig([
  // Base configuration for JS/TS files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  // Specific configuration for TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        project: ['./tsconfig.json'],
      },
    },
    plugins: {
      '@typescript-eslint': tseslintPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      ...tsConfigs.recommended.rules,

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
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // ✅ Next.js specific tweaks if needed
      '@next/next/no-html-link-for-pages': 'off', // Example tweak
    },
  },
]);