import js from '@eslint/js';
import stylexPlugin from '@stylexjs/eslint-plugin';
import next from 'eslint-config-next';
import eslintConfigPrettier from 'eslint-config-prettier';
import * as mdx from 'eslint-plugin-mdx';
import packageJsonPlugin from 'eslint-plugin-package-json';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

const config = [
  js.configs.recommended,
  ...next,
  {
    ...mdx.flat,
    // JSX embedded in .mdx (custom components, {expressions}) is linted
    // through the mdx parser's own JS handling — code fences are prose, not
    // lint targets, so leave `mdx.flatCodeBlocks` out.
    rules: {
      ...mdx.flat.rules,
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    ...packageJsonPlugin.configs.recommended,
    files: ['package.json'],
    rules: {
      'package-json/order-properties': 'error',
      'package-json/sort-collections': 'error',
      'package-json/no-empty-fields': 'error',
      'package-json/no-redundant-files': 'error',
      'package-json/no-redundant-publishConfig': 'error',
      'package-json/unique-dependencies': 'error',
      'package-json/specify-peers-locally': 'error',
      'package-json/require-name': 'error',
      'package-json/require-version': 'error',
      'package-json/valid-name': 'error',
      'package-json/valid-version': 'error',
      'package-json/valid-dependencies': 'error',
      'package-json/valid-devDependencies': 'error',
      'package-json/valid-engines': 'error',
      'package-json/valid-scripts': 'error',
    },
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    plugins: { '@stylexjs': stylexPlugin },
    rules: {
      '@stylexjs/valid-styles': 'error',
      '@stylexjs/no-unused': 'error',
      '@stylexjs/valid-shorthands': 'warn',
      '@stylexjs/sort-keys': 'warn',
    },
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  eslintConfigPrettier,
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'harness/**',
      'babel.config.js',
      'postcss.config.js',
    ],
  },
];

export default config;
