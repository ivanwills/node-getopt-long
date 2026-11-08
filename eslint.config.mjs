import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: [
      'coverage/**',
      'node_modules/**',
      'lib/**',
      'build/**',
      'tmp/**',
      '**/*orig.js',
      '**/*.ts',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      indent: ['error', 2],
      'no-tabs': 0,
      'no-prototype-builtins': 0,
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-unassigned-vars': 'off',
      'no-unused-vars': ['error', { caughtErrors: 'none' }],
      semi: [2, 'always'],
      'handle-callback-err': 0,
    },
  },
];
