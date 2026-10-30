import globals from 'globals';
import react from 'eslint-plugin-react';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.expo/**',
      'output/**',
      'tmp/**',
      'docs/**',
      'web/public/**',
    ],
  },
  {
    files: [
      'web/**/*.{js,jsx}',
      'mobile/**/*.{js,cjs}',
      'backend/**/*.js',
      'packages/**/*.js',
      'eslint.config.mjs',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.node, ...globals.browser, __DEV__: 'readonly' },
    },
    plugins: { react },
    rules: {
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      'no-undef': 'error',
      'no-duplicate-imports': ['error', { allowSeparateTypeImports: true }],
      'no-unreachable': 'error',
      'no-constant-condition': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'error',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
    },
  },
];
