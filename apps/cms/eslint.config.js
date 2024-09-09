/**
 * This file is redundant, it just a temporary workaround to fix the angular-eslint plugin issue
 * ref: https://github.com/angular-eslint/angular-eslint/issues/1280#issuecomment-2048204187 TL;DR: angular-eslint can't resolve the root eslint.config.js file via `eslintConfig` option.
 *
 * With monorepo setup, it only needs just one eslint flat config file in the root (https://github.com/eslint/eslint/discussions/16960#discussioncomment-5212286).
 */

// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
);
