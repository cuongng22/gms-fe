// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    files: ['src/app/crew-trip/**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended
    ],
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      indent: ['error', 2],
      'no-unused-vars': 'warn',
      'max-len': ['error', { code: 120 }],
      'no-console': 'error',
      // Vô hiệu hóa các quy tắc không liên quan đến định dạng
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@angular-eslint/no-empty-lifecycle-method': 'off',
      'no-prototype-builtins': 'off',
      'no-empty': 'off',
      'no-empty-function': 'off'
    }
  },
  {
    files: ['src/app/crew-trip/**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility
    ],
    rules: {
      indent: 'off',
      quotes: 'off',
      semi: 'off',
      // Tắt tất cả các quy tắc của Angular ESLint cho HTML
      '@angular-eslint/template/eqeqeq': 'off',
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
      '@angular-eslint/template/label-has-associated-control': 'off',
      '@angular-eslint/template/elements-content': 'off'
    }
  }
);
