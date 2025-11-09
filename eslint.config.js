import tseslintPlugin from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import unusedImports from 'eslint-plugin-unused-imports';

const { configs } = tseslintPlugin;

export default [
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
      ...configs.recommended.rules,

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
        'warn', // Changed from 'error' to 'warn'
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          // Allow variables that are only used as types
          ignoreRestSiblings: true,
          // Allow unused catch bindings
          caughtErrors: 'none',
        },
      ],

      // ✅ Disallow `any` - WARN instead of ERROR for flexibility
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
