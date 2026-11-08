import js from '@eslint/js';
import sonarjs from 'eslint-plugin-sonarjs';
import globals from 'globals';

export default [
  {
    ignores: [
      'coverage/**',
      'node_modules/**',
      'configs/jest.config.js',
      'build/**',
      'tmp/**',
      '**/*orig.js',
    ],
  },
  js.configs.recommended,
  sonarjs.configs.recommended,
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
      'sonarjs/class-name': 'off',
      'sonarjs/cognitive-complexity': ['warn', 17],
      'sonarjs/inverted-assertion-arguments': 'off',
      'sonarjs/no-dead-store': 'off',
      'sonarjs/no-empty-collection': 'warn',
      'sonarjs/no-ignored-exceptions': 'off',
      'sonarjs/no-nested-template-literals': 'off',
      'sonarjs/single-char-in-character-classes': 'off',
      'sonarjs/updated-loop-counter': 'off',
    },
  },
];
