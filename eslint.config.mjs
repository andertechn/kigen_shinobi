import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.vercel/**',
      'supabase/.temp/**',
      '**/*.html'
    ]
  },
  js.configs.recommended,
  {
    files: ['shared/**/*.js', 'config.js', 'scripts/**/*.{js,mjs}', 'eslint.config.js', 'vite.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      'no-empty': ['error', { allowEmptyCatch: true }]
    }
  },
  {
    // IIFE browser scripts usam `window` / APIs DOM sem import
    files: ['shared/**/*.js', 'config.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        ...globals.browser,
        supabase: 'readonly'
      }
    }
  }
];
